# 📖 Hướng dẫn Sử dụng Chi tiết — AI QC Playwright Pipeline

## Mục lục
1. [Thiết lập lần đầu (First-time Setup)](#1-thiết-lập-lần-đầu)
2. [Prompt mẫu cho từng tình huống](#2-prompt-mẫu-cho-từng-tình-huống)
3. [Chạy pipeline đầy đủ (Full Pipeline)](#3-chạy-pipeline-đầy-đủ)
4. [Chạy từng skill riêng lẻ](#4-chạy-từng-skill-riêng-lẻ)
5. [Chạy nhiều AI Agent song song](#5-chạy-nhiều-ai-agent-song-song)
6. [Tiếp nối session bị gián đoạn](#6-tiếp-nối-session-bị-gián-đoạn)
7. [Cấu hình dự án mới (New Project Setup)](#7-cấu-hình-dự-án-mới)
8. [Xem kết quả & Bug Reports](#8-xem-kết-quả--bug-reports)
9. [Cấu hình Luồng Đăng nhập & Chuyển đổi tài khoản FTMS (auth.setup.ts & users.real.json)](#9-cấu-hình-luồng-đăng-nhập--chuyển-đổi-tài-khoản-ftms-authsetupts--usersrealjson)

---

## 1. Thiết lập lần đầu

### Bước 1.1 — Copy skill vào dự án
```bash
# Copy toàn bộ skill và templates vào dự án của bạn
cp -r ai-qc-playwright-pipeline/skills/* /path/to/your-project/.agents/skills/
cp ai-qc-playwright-pipeline/config/pipeline.config.json /path/to/your-project/.agents/skills/
cp ai-qc-playwright-pipeline/config/users.real.json /path/to/your-project/e2e/config/users.real.json
cp ai-qc-playwright-pipeline/templates/auth.setup.ts /path/to/your-project/e2e/auth.setup.ts
```

### Bước 1.2 — Cấu hình tài khoản test
```bash
# Mở e2e/config/users.real.json và kiểm tra/chỉnh sửa thông tin tài khoản cho phù hợp với dự án
```

### Bước 1.3 — Thêm vào .gitignore
```
# Thêm vào .gitignore của dự án
e2e/.auth/
playwright/.auth/
config/auth-roles.json
config/sso-config.json
docs/qc-sessions/
```

---

## 2. Prompt mẫu cho từng tình huống

### 🟢 Tình huống 1: Kiểm thử tính năng mới từ đầu

**Prompt cơ bản:**
```
Hãy dùng skill qc-pipeline-orchestrator để kiểm thử tính năng "Tạo đơn hàng mới" của dự án.
Tài liệu yêu cầu nằm ở docs/requirements/order-management.md
```

---

### 🟡 Tình huống 2: Kiểm thử luồng FTMS nhiều vai trò (User Switching)

```
Hãy dùng qc-pipeline-orchestrator để kiểm thử luồng FTMS "Phê duyệt phiếu yêu cầu hợp đồng":
- Luồng bao gồm các vai trò: Salesman (tạo phiếu) -> Legal Assignor (gán chuyên viên) -> Legal Reviewer (thẩm định) -> Deputy Signer (ký duyệt)
- Sử dụng cấu hình người dùng tại e2e/config/users.real.json và auth setup e2e/auth.setup.ts
- Sinh code Playwright sử dụng browser.newContext({ storageState }) để chuyển đổi vai trò trực tiếp trong kịch bản test
```

---

### 🔵 Tình huống 3: Chỉ chạy test (đã có code sẵn)

```
Dùng skill ai-playwright-test-runner để chạy file test:
e2e/features/payment/payment.real.spec.ts
Môi trường: http://localhost:3000
Browser: chromium
Tự động sửa lỗi script và báo cáo bug nếu có lỗi nghiệp vụ thực sự.
```

---

### 🔴 Tình huống 4: Phân tích nghiệp vụ trước khi viết test

```
Dùng skill ai-qa-lead để phân tích tài liệu yêu cầu tại docs/requirements/checkout-flow.pdf
Tôi là Product Owner và sẽ trả lời các câu hỏi làm rõ nghiệp vụ.
Sau khi phỏng vấn xong, hãy tạo QC Master Spec theo Ma trận 8 Trụ cột Chất lượng.
```

---

## 3. Chạy pipeline đầy đủ

### Prompt đầy đủ nhất để pipeline hỏi bạn từng bước:
```
Hãy khởi chạy qc-pipeline-orchestrator.
Tôi muốn kiểm thử tính năng [TÊN TÍNH NĂNG] của dự án.
Trước tiên hãy xác nhận lại cấu hình pipeline và hỏi tôi nếu cần thêm thông tin.
```

---

## 4. Chạy từng skill riêng lẻ

### Skill 1: QA Lead (Phân tích nghiệp vụ)
```
Hãy dùng skill ai-qa-lead để phân tích tài liệu yêu cầu.
Đường dẫn: [ĐƯỜNG DẪN TÀI LIỆU]
Tôi sẽ trả lời các câu hỏi làm rõ.
```

### Skill 2: Testcase Generator
```
Hãy dùng skill ai-testcase-generator để sinh testcase.
QC Spec có sẵn tại: [ĐƯỜNG DẪN QC SPEC]
Tập trung vào tính năng: [TÊN TÍNH NĂNG]
```

### Skill 3: Playwright Spec Builder
```
Hãy dùng skill ai-playwright-spec-builder để sinh code test.
File testcase: [ĐƯỜNG DẪN testcase.md]
Cấu hình users: e2e/config/users.real.json
Output vào: e2e/features/[FEATURE_ID]/
```

### Skill 4: Test Runner
```
Hãy dùng skill ai-playwright-test-runner để chạy test.
File spec: [ĐƯỜNG DẪN *.spec.ts]
Nếu có lỗi script, tự động sửa và chạy lại.
Nếu là bug thực tế, ghi Bug Report.
```

---

## 5. Chạy nhiều AI Agent song song

### Cách thiết lập:
```
# Mở nhiều cửa sổ terminal hoặc nhiều tab Antigravity

# Terminal 1 — Agent A
Dùng qc-pipeline-orchestrator để kiểm thử tính năng "Đăng ký tài khoản"

# Terminal 2 — Agent B
Dùng qc-pipeline-orchestrator để kiểm thử tính năng "Thanh toán"

# Terminal 3 — Agent C
Dùng qc-pipeline-orchestrator để kiểm thử tính năng "Quản lý sản phẩm"
```

---

## 6. Tiếp nối session bị gián đoạn

```
# Đọc REGISTRY để tìm session ID
Đọc file docs/qc-sessions/REGISTRY.json và cho tôi biết session nào đang dang dở

# Resume session cụ thể
Dùng qc-pipeline-orchestrator --resume SES_20260727_143000_REGISTER để tiếp tục kiểm thử
```

---

## 7. Cấu hình dự án mới

### Bước 1: Hỏi AI sinh config
```
Tôi muốn cấu hình bộ QC automation cho dự án mới:
- Tên dự án: [TÊN]
- Framework: [React/Vue/Angular/Next.js/...]
- Backend: [NestJS/Laravel/Django/Spring Boot/...]
- Auth: [FTMS / FPT SSO / Form login / Azure AD / Keycloak]
- Đường dẫn dự án: [/path/to/project]

Hãy giúp tôi:
1. Tạo pipeline.config.json phù hợp
2. Tạo users.real.json với danh sách roles
3. Tích hợp e2e/auth.setup.ts vào playwright.config.ts
```

---

## 8. Xem kết quả & Bug Reports

### Cấu trúc output sau khi chạy:
```
docs/qc-sessions/SES_20260727_143000_PAYMENT/
├── SESSION_CONTEXT.json          ← Trạng thái pipeline
├── 01_QC_SPEC_PAYMENT_v1.0.md   ← Phân tích nghiệp vụ QC
├── 02_testcase.md                ← Bộ testcase chi tiết
├── 03_playwright/
│   ├── pages/PaymentPage.ts      ← POM class
│   └── payment.real.spec.ts      ← Playwright test file
└── 04_test_results/
    ├── QC_REPORT_R1.md           ← Kết quả chạy test
    ├── BUG-PAY-001.md            ← Bug report (nếu có)
    └── traces/
        ├── payment-trace.zip     ← Playwright trace
        └── screenshot-fail.png   ← Screenshot khi fail
```

---

## 9. Cấu hình Luồng Đăng nhập & Chuyển đổi tài khoản FTMS (auth.setup.ts & users.real.json)

### Bước 9.1: Khái niệm cốt lõi
Hệ thống kiểm thử E2E của FTMS / FTI-AM sử dụng **kịch bản xác thực 4 Tầng** trong `e2e/auth.setup.ts` để nạp tự động token và lưu file `playwright/.auth/<roleKey>.json` cho tất cả người dùng trong `users.real.json`.

Các Tầng xác thực bao gồm:
1. **Tầng 1 (MOCK Mode)**: `IS_MOCK=true` → Ghi cookie giả lập `mock-token-<username>` trực tiếp vào file JSON.
2. **Tầng 2 (REAL TOKEN)**: `E2E_REAL_TOKEN=<token>` → Dùng token thật từ biến môi trường.
3. **Tầng 3 (API Test Auth)**: Calls `POST /api/am/auth/test` với email trong `users.real.json` để lấy JWT token mà không cần giao diện UI.
4. **Tầng 4 (Fallback FPT SSO & OTP)**: Tự động điền email, bấm chọn OTP tĩnh (`ISC22QC`) trên trang SSO `fpt.net`.

### Bước 9.2: Tích hợp vào `playwright.config.ts`

Trong `playwright.config.ts`, khai báo setup project:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  projects: [
    // 1. Project chạy auth.setup.ts đầu tiên để sinh storage state cho các roles
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // 2. Project chạy E2E tests chính, phụ thuộc vào project 'setup'
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Mặc định nạp user.json
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

### Bước 9.3: Chuyển đổi vai trò trong kịch bản test Playwright

Khi kiểm thử các Use Case liên phòng ban (Cross-department Workflow), sử dụng `browser.newContext()` với `storageState`:

```typescript
import { test, expect } from "@playwright/test";

test("Luồng duyệt hợp đồng 3 bước", async ({ browser }) => {
  // Bước 1: Salesman tạo hợp đồng
  const salesCtx = await browser.newContext({ storageState: "playwright/.auth/salesman.json" });
  const salesPage = await salesCtx.newPage();
  await salesPage.goto("/am/review-request/create");
  // Thao tác tạo...
  await salesCtx.close();

  // Bước 2: Trưởng BP Pháp chế gán review
  const legalCtx = await browser.newContext({ storageState: "playwright/.auth/legal_assignor.json" });
  const legalPage = await legalCtx.newPage();
  await legalPage.goto("/am/review-request/list");
  // Thao tác gán...
  await legalCtx.close();
});
```
