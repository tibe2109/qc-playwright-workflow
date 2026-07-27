---
name: ai-testcase-generator
description: "Skill chuyên biệt sinh bộ Testcase Markdown từ QC Spec. Bóc tách 100% quy tắc nghiệp vụ theo Ma trận 8 Trụ cột Chất lượng. Không tự bịa thông tin khi mơ hồ (Zero Hallucination), in Team Progress Dashboard trực quan và hướng dẫn bước tiếp theo cho team."
---

# 🧪 AI Testcase Generator — Universal Test Case Architect (v2.1)

Skill này bóc tách bộ testcase chuyên sâu từ bản QC Spec, phủ trọn 8 trụ cột chất lượng. Tập trung duy nhất vào nhiệm vụ sinh file `02_testcase.md`.

> [!IMPORTANT]
> **LUẬT THÉP VẬN HÀNH:**
> 1. **NHIỆM VỤ ĐƠN LẺ**: Chỉ bóc tách QC Spec → `02_testcase.md`. Xong 100% nhiệm vụ thì in Dashboard báo cáo và dừng lại, không làm tràn sang việc của skill khác.
> 2. **ZERO HALLUCINATION**: Đảm bảo bộ testcase đầy đủ, không bỏ sót. Nếu QC Spec chưa rõ ràng hoặc mâu thuẫn, **BẮT BUỘC DỪNG LẠI HỎI USER KHI MƠ HỒ**, không tự bịa ra kịch bản sai thực tế.
> 3. **TEAM PROGRESS DASHBOARD**: Kết thúc bước, **BẮT BUỘC** in bản tin Dashboard trực quan cho toàn team biết: *Đã xong gì? File ở đâu? Bước tiếp theo làm gì?*

---

## 🔄 BƯỚC 0: NHẬN SESSION & CẤU HÌNH

### Nhận SESSION_ID:
- **Từ Orchestrator**: Dùng SESSION_ID được truyền vào.
- **Standalone**: Tự sinh `SES_<YYYYMMDD>_<HHmmss>_TC_GEN`, tạo thư mục session.

### Đọc `pipeline.config.json` — CHỈ ĐỌC:
- Lấy: `paths.qcVaultDir`, `paths.testcaseOutputDir`, `paths.sessionRegistryDir`

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

---

## 📋 QUY TRÌNH THỰC THI 3 BƯỚC

### Bước 1: Đọc QC Spec (`01_QC_SPEC_*.md`)
- Đọc file `<SESSION_ID>/01_QC_SPEC_*.md`.
- Nếu chưa có file QC Spec: Dừng lại và báo user chạy skill `ai-qa-lead` trước.
- Nếu gặp luồng mâu thuẫn: Dừng lại hỏi user xác nhận.

### Bước 2: Sinh bộ Testcase Markdown chuẩn
- Đưa vào file `<SESSION_ID>/02_testcase.md`.
- Mỗi testcase là một **Chuỗi E2E liên hoàn**: Tiền đề → Các bước → Kết quả mong đợi (UI + DB + API).

### Bước 3: In TEAM PROGRESS DASHBOARD & Hướng dẫn Bước Tiếp Theo
Cập nhật `SESSION_CONTEXT.json` và **in ngay bản tin Dashboard**:

```markdown
================================================================================
📊 BÁO CÁO TIẾN ĐỘ THỰC THI (TEAM PROGRESS DASHBOARD)
================================================================================
📌 Session ID      : <SESSION_ID>
📌 Feature         : <FeatureName>
📌 Skill vừa chạy  : [ai-testcase-generator] (Bước 2/4)
📌 Trạng thái bước : ✅ HOÀN THÀNH 100%
--------------------------------------------------------------------------------
✅ ĐÃ HOÀN THÀNH Ở BƯỚC NÀY:
   1. Bóc tách 100% quy tắc nghiệp vụ từ QC Spec thành bộ testcase Markdown.
   2. Phủ trọn Ma trận 8 Trụ cột Chất lượng (gồm <N> testcases).
   3. Đảm bảo đầy đủ các kịch bản Happy Path, Boundary, Security RBAC & Race Condition.

📁 TẢI NGUYÊN & FILE ĐÃ PHÁT SINH:
   📄 Testcase File : <SESSION_ID>/02_testcase.md
   📋 Session State : <SESSION_ID>/SESSION_CONTEXT.json

👉 BƯỚC TIẾP THEO CẦN LÀM:
   Chạy Bước 3 — Skill [ai-playwright-spec-builder] để sinh code Playwright (POM + *.spec.ts).
   💬 Lệnh kích hoạt tiếp theo:
   "Hãy chạy skill ai-playwright-spec-builder cho session <SESSION_ID>"
================================================================================
```
