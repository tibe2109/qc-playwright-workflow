# 📎 Tham Chiếu Đầy Đủ các AI Skills (Skill Reference Guide v2.4)

Tài liệu này mô tả chi tiết 5 AI Skills chuyên biệt trong **AI QC Playwright Pipeline**, các tham số đầu vào/đầu ra, và cách kích hoạt từng skill riêng lẻ hoặc qua Master Orchestrator.

---

## 🗂️ Danh sách 5 Skills Chuyên biệt

| Stt | Tên Skill | Tên thư mục | Nhiệm vụ chính | Trạng thái Multi-Agent |
|---|---|---|---|---|
| **Step 0** | **`ai-playwright-environment-engineer`** | `skills/ai-playwright-environment-engineer/` | Auto-Diagnostics Node, Proxy/VPN, Packages, Browsers, WebServer & Tối ưu `playwright.config.ts` | 🟢 Isolation Read/Check |
| **Step 1** | **`ai-qa-lead`** | `skills/ai-qa-lead/` | Phân tích URD, Phỏng vấn PO (Zero Hallucination), Tạo QC Master Spec | 🔒 KB Lock khi Merge |
| **Step 2** | **`ai-testcase-generator`** | `skills/ai-testcase-generator/` | Bóc tách QC Spec thành bộ Testcase Markdown 8 Trụ cột | 🟢 Session Output Only |
| **Step 3** | **`ai-playwright-spec-builder`** | `skills/ai-playwright-spec-builder/` | Chuyển thể Testcase thành POM classes & Playwright Spec files (User Switching) | 🟢 Session Output Only |
| **Step 4** | **`ai-playwright-test-runner`** | `skills/ai-playwright-test-runner/` | Run Test, Self-Healing, Báo cáo `QC_REPORT_R<N>.md`, Tự cập nhật Testcase, Lệnh `--ui` Replay & Dev-QC Bug Lifecycle | 🟢 Session Output Only |
| **Master** | **`qc-pipeline-orchestrator`** | `skills/qc-pipeline-orchestrator/` | Master Pipeline Orchestrator — Điều phối 5 bước độc lập & xuất Team Progress Dashboard | 📊 Registry APPEND-Only |

---

## 🎭 Step 0: `ai-playwright-environment-engineer` (Kỹ sư Môi trường)

### Mô tả
Tự động chẩn đoán môi trường máy trạm, mạng, Proxy/VPN, Node.js runtime, npm packages, browser binaries, và tự cài đặt/tối ưu cấu hình Playwright không phá vỡ dự án.

### Inputs
- Thư mục gốc dự án (`projectRoot`)
- File `package.json`, `vite.config.ts`, `next.config.js`, `.env`

### Outputs
- `playwright.config.ts` (đã được tối ưu hoặc khởi tạo mới)
- Thư mục `e2e/`, `e2e/pages/`, `e2e/features/`, `playwright/.auth/`
- Browser binaries (Chromium/Firefox) đã được cài đặt sẵn sàng

### Cách gọi độc lập
```
Dùng skill ai-playwright-environment-engineer để kiểm tra môi trường và cài đặt Playwright cho dự án tại /path/to/project
```

---

## 👑 Step 1: `ai-qa-lead` (QA Lead Analyst)

### Mô tả
Đọc URD/BRD, phỏng vấn PO làm rõ các điểm mơ hồ (Zero Hallucination Protocol), lập Bảng Gap và tạo bản QC Master Spec phủ 8 Trụ cột Chất lượng.

### Inputs
- Tài liệu yêu cầu trong `paths.urdSourceDir`
- QC Knowledge Base cũ (nếu có)

### Outputs
- `<SESSION_ID>/01_QC_SPEC_<FEATURE>_vX.Y.md`
- File KB Log: `<paths.kbLogsDir>/LOG_<FEATURE>_<SESSION_ID>.md`

### Cách gọi độc lập
```
Dùng skill ai-qa-lead để phân tích tài liệu URD tại docs/requirements/order-spec.md
```

---

## 🧪 Step 2: `ai-testcase-generator` (Testcase Architect)

### Mô tả
Bóc tách 100% quy tắc nghiệp vụ từ QC Spec thành bộ testcase Markdown chuẩn 8 Trụ cột (Happy Path, Boundary, Security RBAC, Race Condition, Integrity, Integration, Implicit Rules).

### Inputs
- `<SESSION_ID>/01_QC_SPEC_*.md`

### Outputs
- `<SESSION_ID>/02_testcase.md`
- Backup: `<paths.testcaseOutputDir>/v<VERSION>/<FeatureName>/testcase.md`

### Cách gọi độc lập
```
Dùng skill ai-testcase-generator để bóc tách testcase cho session SES_20260727_164500_ORDER
```

---

## 🏗️ Step 3: `ai-playwright-spec-builder` (Playwright Code Generator)

### Mô tả
Chuyển thể `02_testcase.md` thành Page Object Model (POM) classes và Playwright Spec files (`*.spec.ts`). Hỗ trợ cấu hình `users.real.json` cho luồng Chuyển đổi vai trò (User Switching).

### Inputs
- `<SESSION_ID>/02_testcase.md`
- Cấu hình user: `e2e/config/users.real.json` / `config/auth-roles.json`

### Outputs
- `<SESSION_ID>/03_playwright/pages/<FeatureName>Page.ts`
- `<SESSION_ID>/03_playwright/<FeatureName>.spec.ts`
- Đồng bộ ra `<paths.e2ePagesDir>` và `<paths.e2eFeaturesDir>`

### Cách gọi độc lập
```
Dùng skill ai-playwright-spec-builder để sinh code Playwright từ file testcase docs/qc-sessions/SES_.../02_testcase.md
```

---

## 🚀 Step 4: `ai-playwright-test-runner` (Self-Healing & Visual Replay Engine)

### Mô tả
Thực thi Playwright test ở REAL Mode, tự sửa lỗi script (Self-Healing), xuất file báo cáo `QC_REPORT_R<N>.md` sau mỗi round test, tự động cập nhật file `02_testcase.md` (chứng nhận PASS 100%), cung cấp lệnh Terminal xem `--ui` replay, và quản lý vòng đời Bug hai chiều với AI Dev (`BUG-*.md`).

### Inputs
- `<paths.e2eFeaturesDir>/<FEATURE_ID>/<FeatureName>.spec.ts`
- Hoặc chế độ `--recheck-bugs` với các file `BUG-*.md` có status `[RESOLVED_BY_DEV]`

### Outputs
- Báo cáo round test: `<SESSION_ID>/04_test_results/QC_REPORT_R<N>.md`
- File testcase đã chứng nhận: `<SESSION_ID>/02_testcase.md`
- File Bug Report hai chiều: `<SESSION_ID>/04_test_results/BUG-*.md`
- Traces & Screenshots: `<SESSION_ID>/04_test_results/traces/`

### Cách gọi độc lập
```
# Chạy Full Test Suite:
Dùng skill ai-playwright-test-runner để chạy file e2e/features/order/order.spec.ts

# Chạy Chế độ Recheck Bugs (sau khi Dev fix):
Dùng skill ai-playwright-test-runner --recheck-bugs cho session SES_20260727_164500_ORDER
```

---

## 🤖 Master: `qc-pipeline-orchestrator` (Master Orchestrator)

### Mô tả
Skill điều phối trung tâm. Điều phối 5 bước độc lập theo luồng tuần tự, kiểm tra điều kiện tiên quyết, xuất bản tin **Team Progress Dashboard** trực quan sau mỗi bước và hỏi ý kiến user trước khi chuyển bước.

### Cách gọi
```
Dùng skill qc-pipeline-orchestrator để kiểm thử tính năng "Thanh toán online" của dự án.
```
