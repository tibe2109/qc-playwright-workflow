---
name: fti-am-qc-req-analyzer
description: "Skill Phân Tích Yêu Cầu Kiểm Thử TỔNG QUAN & Quản Lý Tiến Trình (Short Alias v3.1). Quản lý session (liệt kê 5 session gần nhất), BẮT BUỘC HỎI NGUỒN TÀI LIỆU VERIFIED TRƯỚC KHI TỰ ĐỌC (Word, Excel, PDF, KB, NotebookLM), tự bóc tách và xuất file 01_FEATURE_REQUIREMENTS_SPEC.md 8 mục ĐẦU TIÊN trong folder session."
---

# 📋 FTI-AM QC Feature Requirements Analyzer (Short Alias v3.1)

Skill này chịu trách nhiệm **Quản lý Khởi tạo/Tiếp tục Session**, **Xác nhận Nguồn Tài liệu URD được Thẩm định (Verified Source Gate)** và **Tự động Bóc tách Yêu cầu Kiểm thử TỔNG QUAN (High-Level Requirements)** xuất bản file ĐẦU TIÊN tại:
📂 `am-docs/QC_SESSIONS/<SESSION_ID>/01_FEATURE_REQUIREMENTS_SPEC.md`

---

## ⚡ I. BƯỚC 1: KHỞI TẠO VÀ XÁC NHẬN TIẾN TRÌNH (SESSION RESUME PROTOCOL)

Hỏi chọn **TẠO TIẾN TRÌNH MỚI** hoặc **TIẾP TỤC TIẾN TRÌNH CŨ** (liệt kê 5 session gần nhất).

---

## 🛡️ II. BƯỚC 2: HỎI VÀ XÁC NHẬN NGUỒN TÀI LIỆU (MANDATORY VERIFIED SOURCE GATE)

AI **BẮT BUỘC** dừng lại hỏi người dùng chỉ định nguồn tài liệu URD / Spec để học trước khi đọc (Hỏi NotebookLM / Đường dẫn File Word, Excel, PDF / Living KB / Chat trực tiếp).
**DỪNG LẠI CHỜ NGƯỜI DÙNG XÁC NHẬN NGUỒN.**

---

## 📑 III. BƯỚC 3: TỰ ĐỘNG BÓC TÁCH & TẠO FILE `01_FEATURE_REQUIREMENTS_SPEC.MD` (8 MỤC)

Tạo file ĐẦU TIÊN với 8 mục tổng quan:
1. **Bối cảnh & Mục tiêu Chức năng (Feature Context & Goals)**
2. **Phạm vi Kiểm thử Tổng quan (In-Scope & Out-of-Scope)**
3. **Luồng Thao tác Chính (High-Level Business Flow)**
4. **Luồng Ngoại lệ & Trải nghiệm Lỗi Tổng quan (General Edge Cases)**
5. **UI/UX & Trình duyệt Hỗ trợ (UI & Target Platforms)**
6. **Tổng quan Kỹ thuật & Tích hợp (High-Level Technical Context)**
7. **Phân tích Tác động Vùng Ảnh Hưởng Tổng quan (High-Level Impact)**
8. **Môi trường & Tài khoản Test Mồi (Environment & Pre-requisites)**
