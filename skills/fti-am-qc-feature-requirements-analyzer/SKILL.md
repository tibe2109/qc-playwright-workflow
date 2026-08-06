---
name: fti-am-qc-feature-requirements-analyzer
description: "Skill Phân Tích Yêu Cầu Kiểm Thử TỔNG QUAN & Quản Lý Tiến Trình (v3.1). Quản lý session (liệt kê 5 session gần nhất), BẮT BUỘC HỎI NGUỒN TÀI LIỆU VERIFIED TRƯỚC KHI TỰ ĐỌC (Word, Excel, PDF, KB, NotebookLM), tự bóc tách và xuất file 01_FEATURE_REQUIREMENTS_SPEC.md 8 mục ĐẦU TIÊN trong folder session."
---

# 📋 FTI-AM QC Feature Requirements Analyzer & Session Manager (v3.1)

Skill này chịu trách nhiệm **Quản lý Khởi tạo/Tiếp tục Session**, **Xác nhận Nguồn Tài liệu URD được Thẩm định (Verified Source Gate)** và **Tự động Bóc tách Yêu cầu Kiểm thử TỔNG QUAN (High-Level Requirements)** xuất bản file ĐẦU TIÊN tại:
📂 `am-docs/QC_SESSIONS/<SESSION_ID>/01_FEATURE_REQUIREMENTS_SPEC.md`

---

## ⚡ I. BƯỚC 1: KHỞI TẠO VÀ XÁC NHẬN TIẾN TRÌNH (SESSION RESUME PROTOCOL)

Ngay khi kích hoạt, AI **BẮT BUỘC** dừng lại và hỏi người dùng bằng giao thức tương tác:

```
================================================================================
📌 KHỞI TẠO VÀ XÁC NHẬN TIẾN TRÌNH KIỂM THỬ (SESSION PROTOCOL)
================================================================================
Bạn muốn:
  1️⃣  TẠO TIẾN TRÌNH MỚI (New Session)
  2️⃣  TIẾP TỤC TIẾN TRÌNH CŨ (Resume Existing Session)
================================================================================
```

- **Nếu chọn "TẠO TIẾN TRÌNH MỚI"**: AI sinh mã `SES_<YYYYMMDD_HHMMSS>_<SLUG>`, tạo folder cô lập `am-docs/QC_SESSIONS/<SESSION_ID>/` và đăng ký vào `REGISTRY.json`.
- **Nếu chọn "TIẾP TỤC TIẾN TRÌNH CŨ"**: AI tự động đọc `am-docs/QC_SESSIONS/REGISTRY.json` và **LIỆT KÊ 5 TIẾN TRÌNH (`SES_*`) GẦN NHẤT** cho người dùng chọn.

---

## 🛡️ II. BƯỚC 2: HỎI VÀ XÁC NHẬN NGUỒN TÀI LIỆU (MANDATORY VERIFIED SOURCE GATE)

> [!CAUTION]
> **LUẬT THÉP BẢO MẬT VÀ CHỐNG NHAU THÔNG TIN (ZERO-UNVERIFIED SOURCE):**
> AI **TUYỆT ĐỐI KHÔNG TỰ ĐỌC BẤT KỲ FILE NÀO TRONG HỆ THỐNG** khi chưa được người dùng xác nhận nguồn. Thông tin ở nhiều nơi chưa đồng nhất có thể gây sai lệch nghiệp vụ nghiêm trọng.

AI **BẮT BUỘC** dừng lại hỏi người dùng chỉ định nguồn tài liệu URD / Spec để học:

```
================================================================================
📚 XÁC NHẬN NGUỒN TÀI LIỆU NGHIỆP VỤ (VERIFIED SOURCE GATE)
================================================================================
Vui lòng chỉ định nguồn tài liệu nghiệp vụ bạn muốn AI tự đọc & bóc tách:

  1️⃣  HỎI NOTEBOOKLM: Sử dụng tri thức Google NotebookLM (fti-am-notebooklm-query).
  2️⃣  FILE NGUỒN CỤ THỂ: Cung cấp đường dẫn file Word (.docx), Excel (.xlsx), PDF (.pdf), Markdown (.md) bạn đã xác nhận.
  3️⃣  LIVING KB DỰ ÁN: Sử dụng bộ tài liệu Living KB đã thẩm định tại fti-agreement-management-knowledge-base/docs/features/.
  4️⃣  CHAT / PHỎNG VẤN TRỰC TIẾP: Trả lời qua chat trực tiếp với AI.

👉 [Vui lòng chọn 1..4 hoặc paste đường dẫn file tài liệu URD của bạn]
================================================================================
```

**DỪNG LẠI CHỜ NGƯỜI DÙNG XÁC NHẬN NGUỒN.**  
Sau khi người dùng chốt nguồn ➔ AI mới bắt đầu tự đọc, tự phân tích và tự trả lời các câu hỏi!

---

## 📑 III. BƯỚC 3: TỰ ĐỘNG BÓC TÁCH & TẠO FILE `01_FEATURE_REQUIREMENTS_SPEC.MD` (8 MỤC)

AI tự động đọc từ nguồn tài liệu đã được xác nhận (Word, Excel, PDF, KB hoặc hỏi NotebookLM) và tự động ghi chú xuất bản file ĐẦU TIÊN tại:
📂 `am-docs/QC_SESSIONS/<SESSION_ID>/01_FEATURE_REQUIREMENTS_SPEC.md`

```markdown
# 📋 ĐẶC TẢ YÊU CẦU KIỂM THỬ TỔNG QUAN (HIGH-LEVEL REQUIREMENTS)

- **Mã Session**: `<SESSION_ID>`
- **Tên Tính Năng**: `<TÊN_TÍNH_NĂNG>`
- **Ngày Tạo**: `<YYYY-MM-DD HH:mm:ss>`
- **Trạng Thái**: `[HIGH_LEVEL_REQUIREMENTS_VERIFIED]`

---

## 1. Bối cảnh & Mục tiêu Chức năng (Feature Context & Goals)
- **User Story / Tóm tắt**: Ai sử dụng? Làm gì? Mục tiêu đạt được gì?
- **Loại thay đổi**: `[New Feature / Enhancement / Bug Fix]`
- **Mức độ ưu tiên**: `[P0 - Critical / P1 - High / P2 - Medium]`

## 2. Phạm vi Kiểm thử Tổng quan (In-Scope & Out-of-Scope)
- **In-Scope (CÓ Test)**: Tóm tắt kịch bản / luồng chính cần test đợt này.
- **Out-of-Scope (KHÔNG Test)**: Kịch bản cố tình chưa làm / chưa test đợt này.

## 3. Luồng Thao tác Chính (High-Level Business Flow)
- **Happy Path Tóm tắt**: Các bước chính từ đầu đến cuối.
- **Đối tượng dữ liệu chính**: Tên loại đối tác, loại tài liệu chính.

## 4. Luồng Ngoại lệ & Trải nghiệm Lỗi Tổng quan (General Edge Cases)
- **Sự cố người dùng**: Nhập sai, submit nhiều lần, back/refresh giữa chừng.
- **Sự cố hệ thống**: Toast/Modal thông báo lỗi cơ bản.

## 5. UI/UX & Trình duyệt Hỗ trợ (UI & Target Platforms)
- **Link Figma**: (Nếu có).
- **Trạng thái UI cơ bản**: Default, Loading, Error.
- **Nền tảng**: Desktop / Mobile (Chrome/Edge).

## 6. Tổng quan Kỹ thuật & Tích hợp (High-Level Technical Context)
- **Tên API Endpoints chính**: (GET/POST /api/am/...).
- **Tên hệ thống tích hợp**: (BMS / eSign / CM).

## 7. Phân tích Tác động Vùng Ảnh Hưởng Tổng quan (High-Level Impact)
- **Side-effects**: Các module xung quanh có nguy cơ ảnh hưởng.

## 8. Môi trường & Tài khoản Test Mồi (Environment & Pre-requisites)
- **Môi trường**: STG / QC / DEV (URL).
- **Quyền tài khoản**: Role Sale / Legal / Manager.
```

---

## 💬 IV. BƯỚC 4: GIAO THỨC CHỎI VẤN `/grill-me` KHI CÓ THẮC MẮC

Nếu trong quá trình tự đọc tài liệu có điểm chưa rõ ràng, mâu thuẫn hoặc cần chốt rẽ nhánh thiết kế, AI **BẮT BUỘC KÍCH HOẠT LỆNH `/grill-me`**:
- Ask từng câu hỏi một (one question at a time).
- Luôn cung cấp **Câu trả lời Khuyến nghị (Recommended Answer)** tối ưu nhất.
- Chờ người dùng xác nhận trước khi chốt file Spec.
