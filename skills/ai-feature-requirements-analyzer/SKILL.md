---
name: ai-feature-requirements-analyzer
description: "Skill Phân Tích Yêu Cầu Kiểm Thử Tổng Quan (v1.0). Quản lý khởi tạo/tiếp tục tiến trình session (liệt kê 5 session gần nhất), hỏi & tra cứu URD/NotebookLM để tạo file 01_FEATURE_REQUIREMENTS_SPEC.md đầy đủ 8 mục chuẩn BA/QC trong folder session."
---

# 📋 AI Feature Requirements Analyzer (v1.0)

Skill này chịu trách nhiệm **Làm rõ Yêu cầu Kiểm thử Tổng quan** và xuất bản file đặc tả nghiệp vụ kiểm thử chuẩn 8 mục tại:
`docs/qc-sessions/<SESSION_ID>/01_FEATURE_REQUIREMENTS_SPEC.md`

---

## 🧭 I. QUY TRÌNH QUẢN LÝ TIẾN TRÌNH (SESSION RESUME / INITIALIZATION PROTOCOL)

Ngay khi được kích hoạt, AI **BẮT BUỘC** hỏi người dùng chọn 1 trong 2 chế độ:
1. **TẠO TIẾN TRÌNH MỚI (New Session)**
2. **TIẾP TỤC TIẾN TRÌNH CŨ (Resume Existing Session)** ➔ Liệt kê 5 tiến trình gần nhất từ `REGISTRY.json` / `docs/qc-sessions/`.

---

## 📑 II. KHÂU PHÂN TÍCH & TẠO FILE `01_FEATURE_REQUIREMENTS_SPEC.MD` (8 MỤC BẮT BUỘC)

AI **BẮT BUỘC** hoàn thành file này **ĐẦU TIÊN** và lưu tại:
📂 `docs/qc-sessions/<SESSION_ID>/01_FEATURE_REQUIREMENTS_SPEC.md`

### Cấu Trúc File 8 Mục Bắt Buộc:
1. **Bối cảnh & Mục tiêu Chức năng (Feature Context & Goals)**
2. **Phạm vi Kiểm thử (In-Scope & Out-of-Scope)**
3. **Luồng Thao tác & Logic Nghiệp vụ (Business Logic & Flow)**
4. **Luồng Ngoại lệ & Xử lý Lỗi (Exception Paths & Edge Cases)**
5. **Thiết kế UI/UX & Trải nghiệm Người dùng**
6. **Thông tin Kỹ thuật & Tích hợp (Technical & Integrations)**
7. **Phân tích Tác động Lan truyền (Impact Analysis)**
8. **Môi trường & Dữ liệu Test Mồi (Environment & Test Data)**
