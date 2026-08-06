---
name: ai-feature-requirements-analyzer
description: "Skill Phân Tích Yêu Cầu Kiểm Thử TỔNG QUAN & Quản Lý Tiến Trình (v3.0). Tự động hỏi Tạo mới / Tiếp tục tiến trình cũ (liệt kê 5 session gần nhất), làm rõ yêu cầu tổng quan và xuất file 01_FEATURE_REQUIREMENTS_SPEC.md 8 mục ĐẦU TIÊN trong folder session. Tích hợp giao thức /grill-me khi có thắc mắc."
---

# 📋 AI Feature Requirements Analyzer & Session Manager (v3.0)

Skill này chịu trách nhiệm **Quản lý Khởi tạo/Tiếp tục Session** và **Phân tích Yêu cầu Kiểm thử TỔNG QUAN (High-Level Requirements)**, xuất bản file đặc tả định hướng kiểm thử ban đầu ĐẦU TIÊN tại:
📂 `docs/qc-sessions/<SESSION_ID>/01_FEATURE_REQUIREMENTS_SPEC.md`

---

## ⚡ I. BƯỚC 1: KHỞI TẠO VÀ XÁC NHẬN TIẾN TRÌNH (SESSION RESUME PROTOCOL)

Ngay khi kích hoạt, AI **BẮT BUỘC** dừng lại và hỏi người dùng bằng giao thức tương tác:
1. **TẠO TIẾN TRÌNH MỚI (New Session)**
2. **TIẾP TỤC TIẾN TRÌNH CŨ (Resume Existing Session)** ➔ Liệt kê 5 tiến trình gần nhất từ `REGISTRY.json` / `docs/qc-sessions/`.

---

## 📑 II. BƯỚC 2: TẠO FILE `01_FEATURE_REQUIREMENTS_SPEC.MD` (8 MỤC TỔNG QUAN)

AI xuất bản file ĐẦU TIÊN với 8 mục tổng quan:
1. **Bối cảnh & Mục tiêu Chức năng (Feature Context & Goals)**
2. **Phạm vi Kiểm thử Tổng quan (In-Scope & Out-of-Scope)**
3. **Luồng Thao tác Chính (High-Level Business Flow)**
4. **Luồng Ngoại lệ & Trải nghiệm Lỗi Tổng quan (General Edge Cases)**
5. **UI/UX & Trình duyệt Hỗ trợ (UI & Target Platforms)**
6. **Tổng quan Kỹ thuật & Tích hợp (High-Level Technical Context)**
7. **Phân tích Tác động Vùng Ảnh Hưởng Tổng quan (High-Level Impact)**
8. **Môi trường & Tài khoản Test Mồi (Environment & Pre-requisites)**

---

## 💬 III. GIAO THỨC CHỎI VẤN `/grill-me` KHI CÓ THẮC MẮC

Khi có thông tin chưa rõ ràng hoặc mâu thuẫn ➔ Tích hợp lệnh `/grill-me` phỏng vấn người dùng kèm câu trả lời khuyến nghị.
