# 🔐 Hướng dẫn Kỹ thuật: Luồng SSO & Xác thực Playwright

## Mục lục
1. [Tại sao Playwright dùng Storage State?](#1-tại-sao-playwright-dùng-storage-state)
2. [Cơ chế hoạt động: Global Setup](#2-cơ-chế-hoạt-động-global-setup)
3. [Các loại xác thực được hỗ trợ](#3-các-loại-xác-thực-được-hỗ-trợ)
4. [Cấu hình cho từng loại SSO](#4-cấu-hình-cho-từng-loại-sso)
5. [Sử dụng trong Playwright Spec](#5-sử-dụng-trong-playwright-spec)
6. [Xử lý lỗi thường gặp](#6-xử-lý-lỗi-thường-gặp)
7. [Best Practices cho CI/CD](#7-best-practices-cho-cicd)
8. [Luồng Đăng nhập & Chuyển đổi tài khoản FTMS (auth.setup.ts & users.real.json)](#8-luồng-đăng-nhập--chuyển-đổi-tài-khoản-ftms-authsetupts--usersrealjson)

---

## 1. Tại sao Playwright dùng Storage State?

### Vấn đề của cách đăng nhập thông thường:
```
❌ Cách cũ: Mỗi test case đều phải đăng nhập lại
   → 50 test cases × 3 giây đăng nhập = 150 giây lãng phí
   → SSO redirect thật mất 5-10 giây → 500 giây lãng phí
```

### Giải pháp Storage State:
```
✅ Cách mới: Đăng nhập 1 lần duy nhất trong Global Setup
   → Lưu cookies + localStorage vào file .auth/<role>.json
   → Mỗi test load file đó → bắt đầu ngay ở trạng thái đã đăng nhập
   → 50 test cases chỉ cần ~0.2 giây mỗi test để load auth state
```

### Cơ chế lưu trữ:
```json
// File e2e/.auth/admin.json (tự động tạo bởi Playwright)
{
  "cookies": [
    { "name": "session_id", "value": "abc123...", "domain": "localhost", "path": "/" }
  ],
  "origins": [
    {
      "origin": "http://localhost:3000",
      "localStorage": [
        { "name": "auth_token", "value": "eyJhbGciOiJSUzI1NiJ9..." },
        { "name": "user_role", "value": "ADMIN" }
      ]
    }
  ]
}
```

---

## 2. Cơ chế hoạt động: Global Setup

### Luồng hoạt động:

```
npx playwright test
    │
    ▼
playwright.config.ts → globalSetup: './e2e/global-setup.ts' (hoặc auth.setup.ts)
    │
    ▼
auth.setup.ts chạy TRƯỚC tất cả test:
    ├── Đọc config/users.real.json (Danh sách roles & usernames)
    ├── Với mỗi role trong users.real.json:
    │   ├── Kiểm tra IS_MOCK / E2E_REAL_TOKEN / API Auth Test / Fallback SSO+OTP
    │   ├── Lưu storage state → e2e/.auth/<roleKey>.json
    └── Bắt đầu chạy test suite
    │
    ▼
Mỗi test file: test.use({ storageState: 'e2e/.auth/<roleKey>.json' })
    │
    ├── Playwright tự động nạp cookies + localStorage cho role tương ứng
    └── Test bắt đầu ngay ở trạng thái đã đăng nhập ✅
```

---

## 3. Các loại xác thực được hỗ trợ

| Loại | Mô tả | Phù hợp với |
|---|---|---|
| **FTMS / FPT SSO + API Auth** | 4 Tầng fallback: Mock -> Real Token -> Backend API Test -> SSO OTP | Các ứng dụng FPT / Enterprise có SSO OTP & API Test endpoint |
| **Form Login** | Điền username/password vào form HTML | Hệ thống nội bộ, simple web apps |
| **OAuth2 PKCE** | Redirect qua provider (Google, GitHub...) | Social login, modern SPAs |
| **Azure AD / MSAL** | Microsoft Entra ID với ROPC flow | Doanh nghiệp dùng Microsoft 365 |
| **Keycloak** | Open-source IAM với Direct Grant | Doanh nghiệp tự host IAM |
| **Custom JWT** | API endpoint trả về JWT trực tiếp | Custom backend auth |

---

## 4. Cấu hình cho từng loại SSO

### 4.1 Form Login (phổ biến nhất)

```json
// config/sso-config.json
{
  "loginType": "form",
  "formLogin": {
    "loginUrl": "/login",
    "usernameField": { "selector": "input[name='username']" },
    "passwordField": { "selector": "input[name='password']" },
    "submitButton": { "selector": "button[type='submit']" },
    "successIndicators": ["text=Dashboard", "url:contains('/dashboard')"]
  }
}
```

---

## 5. Sử dụng trong Playwright Spec

```typescript
// Cách 1: File-level auth (tất cả test trong file dùng cùng 1 role)
import { test, expect } from '@playwright/test';
test.use({ storageState: 'e2e/.auth/salesman.json' });

test('Salesman có thể tạo yêu cầu mới', async ({ page }) => {
  await page.goto('/am/review-request/create');
  // ...
});
```

---

## 6. Xử lý lỗi thường gặp

### Lỗi 1: `storageState file not found`
```
✅ Nguyên nhân: Auth setup chưa chạy hoặc file .auth/<role>.json chưa sinh.
✅ Giải pháp: Chạy `npx playwright test e2e/auth.setup.ts` hoặc xóa thư mục e2e/.auth/ và chạy lại.
```

---

## 7. Best Practices cho CI/CD

```yaml
- name: Cache Playwright auth states
  uses: actions/cache@v3
  with:
    path: e2e/.auth/
    key: playwright-auth-${{ hashFiles('config/users.real.json') }}
```

---

## 8. Luồng Đăng nhập & Chuyển đổi tài khoản FTMS (auth.setup.ts & users.real.json)

### 8.1 Cấu trúc file `config/users.real.json`

File `config/users.real.json` định nghĩa danh sách tài khoản thật theo Ma trận Phân quyền hệ thống FTMS / FTI-AM:

```json
{
  "description": "Cấu hình tài khoản test theo đúng Mã vai trò (Role Code) trong hệ thống FTMS.",
  "users": {
    "salesman": {
      "username": "TuanHP3",
      "email": "tuanhp3@fpt.com",
      "matran_role_code": "FTI-SAL SALESMAN",
      "matran_role_name": "Nhân viên kinh doanh FTI"
    },
    "sales_leader": {
      "username": "salcenterman2am",
      "email": "salcenterman2am@fpt.com",
      "matran_role_code": "FTI-SAL CENTER MANAGER",
      "matran_role_name": "Giám đốc TTKD"
    },
    "legal_assignor": {
      "username": "binhnd31",
      "email": "binhnd31@fpt.com",
      "matran_role_code": "FTI.LEGAL.MAN",
      "matran_role_name": "Trưởng BP Pháp chế"
    },
    "legal_reviewer": {
      "username": "TrangLTH52",
      "email": "tranglth52@fpt.com",
      "matran_role_code": "FTI.LEGAL",
      "matran_role_name": "Pháp chế"
    },
    "deputy_signer": {
      "username": "thonghm7",
      "email": "thonghm7@fpt.com",
      "matran_role_code": "FTI-CMG PRESIDENT",
      "matran_role_name": "Ban điều hành"
    },
    "system_admin": {
      "username": "longht17",
      "email": "longht17@fpt.com",
      "matran_role_code": "FTIAM.ADMIN",
      "matran_role_name": "Nhóm quyền Admin"
    }
  }
}
```

---

### 8.2 Luồng 4 Tầng Xác thực trong `auth.setup.ts`

Playwright thực thi `auth.setup.ts` theo cơ chế 4 Tầng tự động fallback để đảm bảo test luôn chạy thành công trong mọi môi trường (Mock, Local Dev, Staging, CI/CD):

```
                       ┌───────────────────────────────┐
                       │  npx playwright test          │
                       └──────────────┬────────────────┘
                                      │
                                      ▼
                      ┌─────────────────────────────────┐
                      │ IS_MOCK === true ?              │
                      └───────────────┬─────────────────┘
                             │                 │
                            YES                NO
                             │                 │
                             ▼                 ▼
             ┌─────────────────────────┐  ┌────────────────────────────────┐
             │ TẦNG 1: MOCK Mode       │  │ E2E_REAL_TOKEN present ?       │
             │ Ghi mock cookie &       │  └───────────────┬────────────────┘
             │ fake token vào          │         │                 │
             │ .auth/<role>.json       │        YES                NO
             └─────────────────────────┘         │                 │
                                                 ▼                 ▼
                                 ┌───────────────────────┐  ┌───────────────────────────────┐
                                 │ TẦNG 2: REAL TOKEN    │  │ TẦNG 3: Backend API Test Auth │
                                 │ Ghi E2E_REAL_TOKEN    │  │ POST /api/am/auth/test        │
                                 │ vào .auth/user.json   │  │ với { email: role.email }     │
                                 └───────────────────────┘  └───────────────┬───────────────┘
                                                                   │                 │
                                                                 SUCCESS           FAIL
                                                                   │                 │
                                                                   ▼                 ▼
                                                   ┌───────────────────────┐ ┌────────────────────────────────┐
                                                   │ Ghi JWT accessToken   │ │ TẦNG 4: Fallback FPT SSO+OTP   │
                                                   │ thu được vào file     │ │ 1. Navigate /am/.../create     │
                                                   │ .auth/<roleKey>.json  │ │ 2. Chọn "Sử dụng OTP"          │
                                                   └───────────────────────┘ │ 3. Nhập Email                  │
                                                                             │ 4. Nhập OTP tĩnh (ISC22QC)    │
                                                                             │ 5. Lưu storageState           │
                                                                             └────────────────────────────────┘
```

---

### 8.3 Kỹ thuật Chuyển đổi Tài khoản (User Switching) trong Playwright Test

Trong các luồng nghiệp vụ phức tạp (ví dụ: **Salesman tạo phiếu → Leader duyệt → Legal Assignor gán người → Legal Reviewer phê duyệt → Signer ký**), Playwright sử dụng `browser.newContext()` để chuyển đổi vai trò ngay trong một testcase duy nhất:

```typescript
import { test, expect } from "@playwright/test";

test("Luồng End-to-End đầy đủ: Tạo phiếu, Review, Phê duyệt", async ({ browser }) => {

  // ==========================================
  // BƯỚC 1: SALESMAN TẠO PHIẾU YÊU CẦU
  // ==========================================
  const salesContext = await browser.newContext({
    storageState: "playwright/.auth/salesman.json"
  });
  const salesPage = await salesContext.newPage();
  
  await salesPage.goto("/am/review-request/create");
  await salesPage.getByLabel("Tên hợp đồng").fill("Hợp đồng Test Chuyển Đổi Role");
  await salesPage.getByRole("button", { name: "GỬI DUYỆT" }).click();
  
  // Lấy mã phiếu vừa tạo từ UI
  const requestIdText = await salesPage.locator(".request-code").innerText();
  console.log(`[Test] Đã tạo phiếu yêu cầu: ${requestIdText}`);
  await salesContext.close();

  // ==========================================
  // BƯỚC 2: LEGAL ASSIGNOR GÁN ĐƠN VỊ CHUYÊN MÔN
  // ==========================================
  const assignorContext = await browser.newContext({
    storageState: "playwright/.auth/legal_assignor.json"
  });
  const assignorPage = await assignorContext.newPage();

  await assignorPage.goto(`/am/review-request/detail/${requestIdText}`);
  await assignorPage.getByRole("button", { name: "GÁN PHÁP CHẾ" }).click();
  await assignorPage.getByLabel("Chọn Pháp chế review").selectOption("TrangLTH52");
  await assignorPage.getByRole("button", { name: "XÁC NHẬN GÁN" }).click();
  
  await expect(assignorPage.getByText("Đã gán chuyên viên thành công")).toBeVisible();
  await assignorContext.close();

  // ==========================================
  // BƯỚC 3: LEGAL REVIEWER THỰC HIỆN REVIEW
  // ==========================================
  const reviewerContext = await browser.newContext({
    storageState: "playwright/.auth/legal_reviewer.json"
  });
  const reviewerPage = await reviewerContext.newPage();

  await reviewerPage.goto(`/am/review-request/detail/${requestIdText}`);
  await reviewerPage.getByRole("button", { name: "HOÀN TẤT REVIEW" }).click();
  await expect(reviewerPage.getByText("Trạng thái: Đã hoàn tất review")).toBeVisible();
  await reviewerContext.close();
});
```

> 💡 **Lợi ích**:
> - Mỗi vai trò có 1 session cô lập hoàn toàn (`salesman.json`, `legal_assignor.json`, `legal_reviewer.json`).
> - Không cần logout/login lại giữa chừng, tiết kiệm 90% thời gian thực thi test.
