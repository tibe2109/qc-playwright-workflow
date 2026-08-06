---
name: fti-am-qc-req-analyzer
description: "Skill Phân Tích Yêu Cầu Kiểm Thử TỔNG QUAN & Quản Lý Tiến Trình (Short Alias v3.0). Tự động hỏi Tạo mới / Tiếp tục tiến trình cũ (liệt kê 5 session gần nhất), làm rõ yêu cầu tổng quan và xuất file 01_FEATURE_REQUIREMENTS_SPEC.md 8 mục ĐẦU TIÊN trong folder session."
---

# 📋 FTI-AM QC Feature Requirements Analyzer (Short Alias v3.0)

*(Skill này là alias ngắn gọn của `fti-am-qc-feature-requirements-analyzer` giúp gõ nhanh trên ô Chat)*

Skill này chịu trách nhiệm **Quản lý Khởi tạo/Tiếp tục Session** và **Phân tích Yêu cầu Kiểm thử TỔNG QUAN (High-Level Requirements)**, xuất bản file đặc tả định hướng kiểm thử ban đầu ĐẦU TIÊN tại:
📂 `am-docs/QC_SESSIONS/<SESSION_ID>/01_FEATURE_REQUIREMENTS_SPEC.md`

---

## ⚡ I. BƯỚC 1: KHỞI TẠO VÀ XÁC NHẬN TIẾN TRÌNH (SESSION RESUME PROTOCOL)

1. Hỏi Chọn **TẠO TIẾN TRÌNH MỚI** hoặc **TIẾP TỤC TIẾN TRÌNH CŨ** (liệt kê 5 session gần nhất).
2. Tạo thư mục cô lập `am-docs/QC_SESSIONS/<SESSION_ID>/` và cập nhật `REGISTRY.json`.

---

## 📑 II. BƯỚC 2: TẠO FILE `01_FEATURE_REQUIREMENTS_SPEC.MD` (8 MỤC TỔNG QUAN)

Tạo file ĐẦU TIÊN trong folder session với 8 mục tổng quan:
1. **Bối cảnh & Mục tiêu Chức năng (Feature Context & Goals)**
2. **Phạm vi Kiểm thử Tổng quan (In-Scope & Out-of-Scope)**
3. **Luồng Thao tác Chính (High-Level Business Flow)**
4. **Luồng Ngoại lệ & Trải nghiệm Lỗi Tổng quan (General Edge Cases)**
5. **UI/UX & Trình duyệt Hỗ trợ (UI & Target Platforms)**
6. **Tổng quan Kỹ thuật & Tích hợp (High-Level Technical Context)**
7. **Phân tích Tác động Vùng Ảnh Hưởng Tổng quan (High-Level Impact)**
8. **Môi trường & Tài khoản Test Mồi (Environment & Pre-requisites)**
