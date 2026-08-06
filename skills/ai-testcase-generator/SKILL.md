---
name: ai-testcase-generator
description: "Skill chuyên biệt sinh bộ Testcase Markdown từ QC Spec (v2.9). TỰ ĐỘNG ĐỌC VÀ ĐỐI CHIẾU FILE TESTCASE HIỆN TẠI ĐỂ KHAI THÁC NGÓC NGÁCH NGHIỆP VỤ (Deep Penetration Edge Cases), CHỐNG TRÙNG LẶP VÀ CHỐNG XUNG ĐỘT KẾT QUẢ MONG ĐỢI 100%."
---

# 🧪 AI Testcase Generator — Continuous Deep Expansion & Deduplication Engine (v2.9)

Skill này bóc tách và mở rộng bộ testcase chuyên sâu từ bản QC Spec. **CAM KẾT ĐỌC TỰ ĐỘNG QC SPEC THEO SESSION, TỰ ĐỘNG ĐỐI CHIẾU DỮ LIỆU ĐÃ CÓ ĐỂ KHAI THÁC MỌI NGÓC NGÁCH NGHIỆP VỤ, CHỐNG TRÙNG LẶP VÀ CHỐNG XUNG ĐỘT KẾT QUẢ MONG ĐỢI 100%.**

---

## 🔍 GIAO THỨC BỔ SUNG NGÓC NGÁCH NGHIỆP VỤ & CHỐNG TRÙNG LẶP (DEEP EXPANSION & DEDUPLICATION PROTOCOL)

Khi được yêu cầu tạo mới hoặc bổ sung testcase cho một Session (`SESSION_ID`), AI Agent **BẮT BUỘC** thực thi 4 bước kiểm soát nghiêm ngặt sau:

```mermaid
graph TD
    SPEC["📄 1. Đọc QC Spec của Session:<br/>01_QC_SPEC_*.md"] --> MAP["🗺️ Trích xuất State Machine, Boundary Matrix,<br/>RBAC Matrix, Risk Matrix"]
    READ_TC["📋 2. Đọc file 02_testcase.md hiện tại"] --> EXIST["Fingerprint Registry:<br/>Lập danh sách các (Payload + Action + Expected) đã có"]
    MAP & EXIST --> DIFF["🔍 3. So sánh khoảng trống (Gap Analysis):<br/>Tìm các ngóc ngách nghiệp vụ chưa được kiểm thử"]
    DIFF --> GEN["✍️ 4. Sinh Testcase Mới:<br/>- Khai thác sâu ngóc ngách<br/>- CHỐNG TRÙNG LẶP 100%<br/>- CHỐNG XUNG ĐỘT EXPECTED RESULT 100%"]
```

---

### 1. 📖 Tự Động Đọc Và Nạp Tri Thức QC Spec Theo Session (`01_QC_SPEC_*.md`):
- AI Agent tự động đọc file `<SESSION_ID>/01_QC_SPEC_*.md`.
- Nạp State Machine, Field Validation, RBAC Matrix, Risk Matrix.

---

### 2. 📋 Đọc File Testcase Hiện Tại (`02_testcase.md`) & Lập Fingerprint Registry:
- Trích xuất danh sách `(Mã TC | Role | Action Input Payload | Expected Result State)` của tất cả testcase đã tồn tại để tránh trùng lặp.

---

### 3. 🔍 Khai Thác Sâu Các Ngóc Ngách Nghiệp Vụ Chưa Phủ (Deep Penetration Edge Cases):
- **Tổ hợp chéo rủi ro cao**: Phụ lục + Docx lỗi font + KH CM ngưng hoạt động + Nhóm dịch vụ không hỗ trợ template + Account bị lock...
- **Thao tác dị biệt (Adversarial Actions)**: Double click 50ms, IDOR URL modification, Max payload 100MB, Network disconnect...

---

### 4. 🛡️ CHỐNG TRÙNG LẶP & CHỐNG XUNG ĐỘT KẾT QUẢ MONG ĐỢI 100%:
- **Zero Duplication**: Không trùng lặp cặp `(Input Payload + Action Steps)`.
- **Expected State Harmony**: Tuân thủ 100% State Machine trong QC Spec. Không có xung đột giữa TC mới và TC cũ.

---

## 🚫 CẤU TRÚC 100% CHI TIẾT ĐẦY ĐỦ 4 PHẦN (STRICT NO-COMPRESSION v2.9)
Tất cả các testcase bổ sung **BẮT BUỘC** giữ nguyên độ chi tiết 4 phần như ban đầu (Ưu tiên, Điều kiện/Data payload, Các bước 1..N chi tiết, Expected Result DB/API).
