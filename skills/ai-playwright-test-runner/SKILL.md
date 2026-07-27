---
name: ai-playwright-test-runner
description: "Skill chuyên biệt chạy test Playwright và tự động sửa lỗi (Self-Healing). Thực thi *.spec.ts ở REAL Mode, tự đọc trace/stacktrace khi fail, phân loại lỗi script vs lỗi bug sản phẩm, tự sửa code và re-run tự động cho đến 100% PASS hoặc xuất Bug Report. Áp dụng mọi dự án."
---

# 🚀 AI Playwright Test Runner — Self-Healing Execution Engine (v2.0)

Skill này thực thi Playwright test, tự sửa lỗi script và báo cáo bug sản phẩm thực sự. Multi-Agent Safe — mỗi session lưu kết quả riêng biệt.

---

## 🔄 BƯỚC 0: NHẬN SESSION & XÁC NHẬN THÔNG TIN

### Nhận SESSION_ID:
- **Từ Orchestrator**: Dùng SESSION_ID được truyền vào.
- **Standalone**: Tự sinh `SES_<YYYYMMDD>_<HHmmss>_TEST_RUN`.

### Đọc `pipeline.config.json` — CHỈ ĐỌC:
- Lấy: `paths.e2eFeaturesDir`, `paths.bugReportDir`, `paths.sessionRegistryDir`
- Lấy: `testRunner.maxSuiteReruns`, `testRunner.maxSelfHealPerFile`, `testRunner.browser`, `testRunner.baseUrl`

### Hỏi xác nhận nếu cần:
```
🚀 [TEST RUNNER CONFIRMATION]

1. File test cần chạy:
   → A) Lấy từ session hiện tại: <SESSION_ID>/03_playwright/*.spec.ts
   → B) Chỉ định file cụ thể: ___

2. Môi trường chạy test:
   → A) Local: http://localhost:<port>
   → B) Staging: https://staging.yourapp.com
   → C) Khác: ___

3. Browser:
   → A) chromium (mặc định)
   → B) firefox
   → C) webkit (Safari)

4. Chế độ:
   → A) Headless (không hiện browser — nhanh hơn)
   → B) Headed (hiện browser — dễ debug)
```

---

## ⚡ QUY TRÌNH THỰC THI & SELF-HEALING

### Bước 1: Chạy Playwright Suite
```bash
# Lệnh chạy chuẩn
PLAYWRIGHT_BASE_URL=<baseUrl> npx playwright test \
  <e2eFeaturesDir>/<FEATURE_ID>/<FeatureName>.spec.ts \
  --project=<browser> \
  --reporter=html,list
```
- Khởi tạo `suiteRerunCount = 0` (trong bộ nhớ — KHÔNG ghi vào config)

### Bước 2: Phân loại lỗi (Self-Diagnosis)

```
Khi có test fail, AI đọc:
├── Stacktrace: Xác định dòng code lỗi
├── Error message: Phân loại lỗi
├── Screenshot: Xem trạng thái UI tại thời điểm fail
└── Trace file (.zip): Xem từng bước thực hiện

Phân loại:
┌─────────────────────────────────────────────────────┐
│ LOẠI 1 — Lỗi Mã Test (Script Defect)                 │
│ → Selector sai/lỗi thời               → SELF-HEAL   │
│ → Timeout (element chưa xuất hiện)    → SELF-HEAL   │
│ → Modal/Overlay chặn click            → SELF-HEAL   │
│ → Auth token hết hạn                  → SELF-HEAL   │
│ → Missing await                       → SELF-HEAL   │
├─────────────────────────────────────────────────────┤
│ LOẠI 2 — Lỗi Sản phẩm (Real Product Bug)            │
│ → API trả về 500/503                  → BUG REPORT  │
│ → UI hiển thị sai với tài liệu        → BUG REPORT  │
│ → Dữ liệu không được lưu vào DB       → BUG REPORT  │
│ → Logic nghiệp vụ sai                 → BUG REPORT  │
└─────────────────────────────────────────────────────┘
```

### Bước 3: Self-Healing Loop

> [!CAUTION]
> **HARD CAP — Giới hạn an toàn tuyệt đối:**
> - Tối đa `maxSelfHealPerFile` lần sửa/file (mặc định: 3)
> - Tối đa `maxSuiteReruns` lần Re-Run suite (mặc định: 5)
> - Khi đạt giới hạn: DỪNG và báo cáo danh sách test vẫn fail

**LOẠI 1 → Self-Heal:**
1. AI tự sửa trực tiếp file `.spec.ts` hoặc POM file
2. Chạy lại suite
3. `suiteRerunCount += 1`

**LOẠI 2 → Bug Report:**
```markdown
# 🐛 BUG-[MODULE]-[ID]: [Mô tả ngắn]

## Traceability
| Tầng | Tham chiếu |
|---|---|
| Session | <SESSION_ID> |
| QC Spec | <SESSION_ID>/01_QC_SPEC_*.md |
| Testcase | <SESSION_ID>/02_testcase.md#TC_<ID> |
| Playwright Spec | <SESSION_ID>/03_playwright/*.spec.ts:L<line> |

## Chi tiết
- **Mức độ:** [Critical | High | Medium | Low]
- **Loại lỗi:** [UI Bug | API Bug | Logic Bug | Data Bug]
- **Steps to Reproduce:** ...
- **Expected:** ...
- **Actual:** ...
- **Screenshot:** <SESSION_ID>/04_test_results/traces/screenshot-*.png
- **Trace:** <SESSION_ID>/04_test_results/traces/*.zip
```

### Bước 4: Xuất kết quả & Lệnh Playwright UI
```bash
# AI cung cấp lệnh này để xem trace bằng mắt
npx playwright test <specFile> --ui
# hoặc
npx playwright show-report
```

---

## 💾 OUTPUT (SESSION-SCOPED)

1. `<SESSION_ID>/04_test_results/QC_REPORT_R<N>.md` — Test report
2. `<SESSION_ID>/04_test_results/BUG-<MODULE>-<ID>.md` — Bug reports
3. `<SESSION_ID>/04_test_results/traces/` — Playwright traces & screenshots

### Cập nhật SESSION_CONTEXT.json:
```json
{
  "step": "playwright-test-runner",
  "status": "COMPLETED",
  "result": "PASS_100% | PARTIAL_FAIL_HARD_CAP",
  "totalTests": N,
  "passedTests": M,
  "failedTests": K,
  "suiteRerunCount": X,
  "bugReports": ["<SESSION_ID>/04_test_results/BUG-*.md"],
  "completedAt": "<ISO timestamp>"
}
```
Cập nhật REGISTRY.json: Di chuyển session `activeSessions` → `completedSessions`. **KHÔNG ghi vào config chung.**
