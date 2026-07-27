---
name: ai-playwright-spec-builder
description: "Skill chuyên biệt sinh code Playwright từ Testcase Markdown. Đọc testcase.md + auth-roles.json hoặc users.real.json, sinh 100% mã Playwright Spec (*.spec.ts) và Page Object Model (POM) classes chuẩn mực. Áp dụng cho mọi dự án. Hỗ trợ tất cả loại xác thực (FTMS 4-tier auth, FPT SSO OTP, form, SSO, OAuth, Azure AD, Keycloak, custom JWT) và Chuyển đổi tài khoản (User Switching)."
---

# 🏗️ AI Playwright Spec Builder — Universal Code Generator (v2.0)

Skill này chuyển thể Testcase Markdown thành mã nguồn Playwright hoàn chỉnh với POM pattern. Hỗ trợ mọi loại xác thực, mọi framework frontend và luồng chuyển đổi nhiều vai trò (User Switching).

---

## 🔄 BƯỚC 0: NHẬN SESSION, CẤU HÌNH & XÁC NHẬN AUTH

### Nhận SESSION_ID:
- **Từ Orchestrator**: Dùng SESSION_ID được truyền vào.
- **Standalone**: Tự sinh `SES_<YYYYMMDD>_<HHmmss>_SPEC_BUILD`.

### Đọc `pipeline.config.json` — CHỈ ĐỌC:
- Lấy: `paths.e2eRootDir`, `paths.e2ePagesDir`, `paths.e2eFeaturesDir`, `paths.authRolesConfig`, `paths.sessionRegistryDir`

### Hỏi xác nhận nếu cần:

```
🔐 [AUTH CONFIRMATION] Để sinh code Playwright đúng, tôi cần xác nhận:

1. File cấu hình tài khoản test có sẵn tại:
   → A) e2e/config/users.real.json (Chuẩn FTMS / Enterprise Multi-role)
   → B) e2e/config/auth-roles.json
   → C) Chưa có — Tôi muốn AI sinh file mẫu để tôi điền

2. Ứng dụng dùng loại đăng nhập gì?
   → A) FTMS 4-Tier Auth (Mock / E2E_REAL_TOKEN / API Test / FPT SSO OTP)
   → B) Form login (username + password input)
   → C) Azure AD / Microsoft SSO
   → D) Keycloak / SAML
   → E) Custom JWT API
   → F) Không cần đăng nhập (public app)

3. URL base của ứng dụng khi chạy test: ___
   (Ví dụ: http://localhost:8082 hoặc http://localhost:3000 hoặc https://staging.myapp.com)

4. Thư mục e2e output (nơi sẽ tạo file .spec.ts): ___
```

### Xác nhận users.real.json / auth-roles.json:
- Nếu tồn tại → In: `✅ User config: <path> | Roles: <danh sách roleKey>`
- Nếu không tồn tại → Sinh file template + hỏi user điền credentials

---

## 📖 NẠP TỪ ĐIỂN NGHIỆP VỤ (READ-ONLY)

Đọc `paths.qcBusinessDictionary` để:
- Dùng đúng thuật ngữ trong locators: `getByLabel('Tên sản phẩm')` thay vì `getByLabel('product_name')`
- Đặt tên class/method theo chuẩn hóa của dự án

---

## 🛠️ QUY TẮC SINH CODE

### 1. Page Object Model (POM) — Bắt buộc:
```typescript
// e2e/pages/<FeatureName>Page.ts
import { Page, Locator } from '@playwright/test';

export class <FeatureName>Page {
  readonly page: Page;
  // Locators — ưu tiên Accessibility selectors
  readonly <fieldName>: Locator;

  constructor(page: Page) {
    this.page = page;
    // Thứ tự ưu tiên locator:
    // 1. getByRole()       — semantic HTML roles
    // 2. getByLabel()      — form labels
    // 3. getByPlaceholder() — input placeholders
    // 4. getByText()       — visible text
    // 5. getByTestId()     — data-testid attribute
    // ❌ Tránh: CSS class, XPath, nth-child
    this.<fieldName> = page.getByLabel('<tên trường>');
  }

  async <actionName>(<params>) {
    // Đóng gói hành vi, không viết logic trong test file
  }
}
```

### 2. Playwright Spec File — Cấu trúc bắt buộc:
```typescript
// === TRACEABILITY CHAIN ===
// Session:      <SESSION_ID>
// QC Spec:      <SESSION_ID>/01_QC_SPEC_<FEATURE>_vX.Y.md
// Testcase:     <SESSION_ID>/02_testcase.md (TC_X.1 -> TC_X.N)
// Generated:    <ISO timestamp>
// ========================
import { test, expect } from '@playwright/test';
import { <FeatureName>Page } from '../../pages/<FeatureName>Page';

// Chọn role phù hợp từ users.real.json / auth-roles.json
test.use({ storageState: 'playwright/.auth/<roleKey>.json' });

test.describe('<Tên tính năng> — Role <ROLE_ID>', () => {
  test('TC_X.1: <Mô tả test case> @<priority>', async ({ page }) => {
    const featurePage = new <FeatureName>Page(page);
    await page.goto('<route>');
    // Web-First Assertions — KHÔNG dùng các assertion cũ
    await expect(<locator>).toBeVisible();
    await expect(<locator>).toHaveText('<expected text>');
  });
});
```

### 3. Quy tắc Chuyển đổi Tài khoản (User Switching Multi-Role Spec):

Khi testcase yêu cầu tương tác giữa nhiều vai trò khác nhau (ví dụ: Salesman tạo -> Leader duyệt -> Legal Reviewer phê duyệt):

```typescript
test('TC_E2E_MULTI_ROLE: Luồng tạo và phê duyệt qua 3 vai trò', async ({ browser }) => {
  // 1. Salesman tạo yêu cầu
  const salesContext = await browser.newContext({
    storageState: 'playwright/.auth/salesman.json'
  });
  const salesPage = await salesContext.newPage();
  await salesPage.goto('/am/review-request/create');
  // thao tác...
  await salesContext.close();

  // 2. Legal Assignor phân công
  const assignorContext = await browser.newContext({
    storageState: 'playwright/.auth/legal_assignor.json'
  });
  const assignorPage = await assignorContext.newPage();
  await assignorPage.goto('/am/review-request/list');
  // thao tác...
  await assignorContext.close();
});
```

---

## 💾 OUTPUT (SESSION-SCOPED)

### Trong thư mục session (nguồn sự thật):
1. `<SESSION_ID>/03_playwright/pages/<FeatureName>Page.ts`
2. `<SESSION_ID>/03_playwright/<FeatureName>.spec.ts`

### Copy ra thư mục e2e để Playwright runner thực thi:
3. `<paths.e2ePagesDir>/<FeatureName>Page.ts`
4. `<paths.e2eFeaturesDir>/<FEATURE_ID>/<FeatureName>.spec.ts`

### Cập nhật SESSION_CONTEXT.json:
```json
{
  "step": "playwright-spec-builder",
  "status": "COMPLETED",
  "outputFiles": ["<SESSION_ID>/03_playwright/pages/<FeatureName>Page.ts", "<SESSION_ID>/03_playwright/<FeatureName>.spec.ts"],
  "completedAt": "<ISO timestamp>"
}
```
Ghi `lastCompletedStep: "playwright-spec-builder"`. Cập nhật `outputs.specFiles`, `outputs.pomFiles`. Cập nhật REGISTRY.json. **KHÔNG ghi vào config chung.**
