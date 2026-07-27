---
name: ai-playwright-spec-builder
description: "Skill chuyên biệt sinh code Playwright từ Testcase Markdown. Đọc testcase.md + auth configs, sinh 100% mã Playwright Spec (*.spec.ts) và POM classes. Không tự bịa selector/endpoint khi mơ hồ (Zero Hallucination), in Team Progress Dashboard trực quan và hướng dẫn bước tiếp theo cho team."
---

# 🏗️ AI Playwright Spec Builder — Universal Code Generator (v2.1)

Skill này chuyển thể Testcase Markdown thành mã nguồn Playwright E2E với POM pattern và luồng chuyển đổi vai trò (User Switching). Tập trung duy nhất vào nhiệm vụ sinh code Playwright.

> [!IMPORTANT]
> **LUẬT THÉP VẬN HÀNH:**
> 1. **NHIỆM VỤ ĐƠN LẺ**: Chỉ chuyển thể `02_testcase.md` → Code Playwright. Xong 100% nhiệm vụ thì in Dashboard báo cáo và dừng lại, không làm tràn sang việc của skill khác.
> 2. **ZERO HALLUCINATION**: Không tự bịa ra selector UI hay API endpoint nếu chưa đối chiếu DOM / POM / Spec. Nếu thiếu thông tin auth hoặc route URL, **BẮT BUỘC DỪNG LẠI HỎI USER KHI MƠ HỒ**.
> 3. **TEAM PROGRESS DASHBOARD**: Kết thúc bước, **BẮT BUỘC** in bản tin Dashboard trực quan cho toàn team biết: *Đã xong gì? File ở đâu? Bước tiếp theo làm gì?*

---

## 🔄 BƯỚC 0: NHẬN SESSION & CẤU HÌNH

### Nhận SESSION_ID:
- **Từ Orchestrator**: Dùng SESSION_ID được truyền vào.
- **Standalone**: Tự sinh `SES_<YYYYMMDD>_<HHmmss>_SPEC_BUILD`.

### Đọc `pipeline.config.json` — CHỈ ĐỌC:
- Lấy: `paths.e2eRootDir`, `paths.e2ePagesDir`, `paths.e2eFeaturesDir`, `paths.authRolesConfig`

---

## 🛠️ QUY TRÌNH THỰC THI 3 BƯỚC

### Bước 1: Đọc Testcase & Xác nhận Cấu hình Auth
- Đọc file `<SESSION_ID>/02_testcase.md`.
- Kiểm tra file user config (`users.real.json` / `auth-roles.json`).
- Nếu thiếu file auth config hoặc chưa rõ Base URL:
  👉 **DỪNG LẠI HỎI USER XÁC NHẬN TRƯỚC KHU SINH CODE**.

### Bước 2: Sinh Mã Nguồn Playwright (POM + Spec)
- Sinh Page Object Model class vào `<SESSION_ID>/03_playwright/pages/<FeatureName>Page.ts`.
- Sinh Playwright Spec file vào `<SESSION_ID>/03_playwright/<FeatureName>.spec.ts`.
- Copy đồng bộ ra `<paths.e2ePagesDir>` và `<paths.e2eFeaturesDir>`.

### Bước 3: In TEAM PROGRESS DASHBOARD & Hướng dẫn Bước Tiếp Theo
Cập nhật `SESSION_CONTEXT.json` và **in ngay bản tin Dashboard**:

```markdown
================================================================================
📊 BÁO CÁO TIẾN ĐỘ THỰC THI (TEAM PROGRESS DASHBOARD)
================================================================================
📌 Session ID      : <SESSION_ID>
📌 Feature         : <FeatureName>
📌 Skill vừa chạy  : [ai-playwright-spec-builder] (Bước 3/4)
📌 Trạng thái bước : ✅ HOÀN THÀNH 100%
--------------------------------------------------------------------------------
✅ ĐÃ HOÀN THÀNH Ở BƯỚC NÀY:
   1. Chuyển thể 100% testcase thành code Playwright E2E chuẩn mực.
   2. Tạo Page Object Model (POM) class cô lập và dễ bảo trì.
   3. Cấu hình luồng xác thực và chuyển đổi tài khoản (User Switching).

📁 TẢI NGUYÊN & FILE ĐÃ PHÁT SINH:
   📄 POM File      : <SESSION_ID>/03_playwright/pages/<FeatureName>Page.ts
   ✍️ Spec File     : <SESSION_ID>/03_playwright/<FeatureName>.spec.ts
   📂 Target E2E    : <paths.e2eFeaturesDir>/<FEATURE_ID>/<FeatureName>.spec.ts

👉 BƯỚC TIẾP THEO CẦN LÀM:
   Chạy Bước 4 — Skill [ai-playwright-test-runner] để thực thi test ở REAL Mode.
   💬 Lệnh kích hoạt tiếp theo:
   "Hãy chạy skill ai-playwright-test-runner cho session <SESSION_ID>"
================================================================================
```
