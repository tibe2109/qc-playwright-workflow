---
name: ai-testcase-generator
description: "Skill chuyên biệt sinh bộ Testcase Markdown từ QC Spec. Bóc tách 100% quy tắc nghiệp vụ, luồng trạng thái, điều kiện biên và rủi ro theo Ma trận 8 Trụ cột Chất lượng thành bộ testcase chuẩn mực. Áp dụng cho mọi dự án. Hỗ trợ multi-agent concurrent không conflict."
---

# 🧪 AI Testcase Generator — Universal Test Case Architect (v2.0)

Skill này tạo ra bộ testcase chuyên sâu từ QC Spec, phủ trọn 8 trụ cột chất lượng. Áp dụng cho mọi dự án, mọi domain nghiệp vụ.

---

## 🔄 BƯỚC 0: NHẬN SESSION & CẤU HÌNH

### Nhận SESSION_ID:
- **Từ Orchestrator**: Dùng SESSION_ID được truyền vào.
- **Standalone**: Tự sinh `SES_<YYYYMMDD>_<HHmmss>_TC_GEN`, tạo thư mục session.

### Đọc `pipeline.config.json` — CHỈ ĐỌC:
- Lấy: `paths.qcVaultDir`, `paths.testcaseOutputDir`, `paths.sessionRegistryDir`
- **TUYỆT ĐỐI KHÔNG GHI trạng thái session vào config chung.**
- In: `⚙️ [TESTCASE GEN] Session: <SESSION_ID> | Input: <qcVaultDir> | Output: <testcaseOutputDir>`

### Hỏi người dùng nếu chưa rõ:
```
🎯 [XÁC ĐỊNH MỤC TIÊU] Tôi cần xác nhận tính năng cần viết testcase:

Tôi đã quét thư mục QC Spec và tìm thấy:
1. [Feature 1] — QC_SPEC_<FEATURE1>_vX.Y.md
2. [Feature 2] — QC_SPEC_<FEATURE2>_vX.Y.md
3. [Feature 3] — QC_SPEC_<FEATURE3>_vX.Y.md
4. Tất cả các tính năng trên

👉 Bạn muốn viết testcase cho tính năng nào? (Nhập số hoặc tên)
```

---

## 🌐 MA TRẬN 8 TRỤ CỘT — HƯỚNG DẪN BÓC TÁCH TESTCASE

| Trụ cột | Nhóm Testcase | Ví dụ mẫu |
|---|---|---|
| 1. Functional Flow | UI Elements, Load Data, Happy Path E2E | Tạo đơn hàng thành công từ đầu đến cuối |
| 2. Negative Inputs | Validation, Error Messages | Gửi form với email sai định dạng |
| 3. Boundary Values | Min/Max/Null/Special chars | Nhập tên sản phẩm 0 ký tự, 500 ký tự |
| 4. RBAC & Security | Role check, IDOR | Manager không thể xóa Admin |
| 5. Concurrency | Race condition, Double click | Click "Đặt hàng" 2 lần cùng lúc |
| 6. Data Integrity | Transaction, Rollback | Lỗi giữa chừng khi tạo đơn hàng |
| 7. External Integration | Timeout, 500 error | Cổng thanh toán trả về lỗi |
| 8. Implicit Rules | Audit trail, Auto-numbering | Mã đơn hàng được sinh tự động và duy nhất |

**Quy tắc bắt buộc:**
- Mỗi testcase phải là **Chuỗi E2E liên hoàn** (không viết happy case đơn giản)
- Phải chứa: Tạo → Thao tác → Xác minh DB/State → Kiểm tra side effects
- Nhúng các kịch bản Boundary/IDOR/Race vào giữa luồng chức năng chính

---

## 📋 TEMPLATE TESTCASE CHUẨN

```markdown
# Danh Sách Testcase: [Tên Tính năng]

## 1. Danh sách Testcase

### TC_[PREFIX].[STT]: [Tên Testcase mô tả rõ ràng hành vi kiểm thử]
- **Mức Độ Ưu Tiên:** [High | Medium | Low]
- **Điều Kiện/ Dữ Liệu Test:**
  [Role đăng nhập, điều kiện tiền đề, dữ liệu test mẫu]
- **Các Bước Thực Hiện:**
  1. [Bước 1...]
  2. [Bước 2...]
- **Kết Quả Mong Đợi:**
  [UI/UX, popup, trạng thái DB, API response, phân quyền]

---
```

---

## 💾 OUTPUT (SESSION-SCOPED)

- **Chính**: `<SESSION_ID>/02_testcase.md`
- **Backup**: `<paths.testcaseOutputDir>/v<VERSION>/<FeatureName>/testcase.md`

### Cập nhật SESSION_CONTEXT.json:
```json
{
  "step": "testcase-generator",
  "status": "COMPLETED",
  "outputFile": "<SESSION_ID>/02_testcase.md",
  "completedAt": "<ISO timestamp>"
}
```
Ghi `lastCompletedStep: "testcase-generator"`. Cập nhật `outputs.testcaseFile`. Cập nhật REGISTRY.json. **KHÔNG ghi vào config chung.**
