---
name: ai-business-analyst
description: "Chuyên gia Phân tích Nghiệp vụ Chi tiết 360° (v3.0). Xác nhận Session (liệt kê 5 session gần nhất), đọc 01_FEATURE_REQUIREMENTS_SPEC.md, phỏng vấn NotebookLM đa vòng (≥5-10+ rounds, 5-7 câu/round từ tổng quan tới ngóc ngách) và CẬP NHẬT NGAY THỜI GIAN THỰC vào 01b_DEEP_BUSINESS_ANALYSIS.md sau mỗi round."
---

# 👔 AI Business Analyst — Deep Business Logic Skill (v3.0)

Skill này chịu trách nhiệm **Phân tích Nghiệp vụ Chuyên sâu 360°** thông qua **Động Cơ Phỏng Vấn NotebookLM Đa Vòng & Cập Nhật Tăng Cường (Multi-Round Iterative Ingestion Engine v3.0)**, xuất bản file:
📂 `docs/qc-sessions/<SESSION_ID>/01b_DEEP_BUSINESS_ANALYSIS.md`

---

## ⚡ I. BƯỚC 1: XÁC NHẬN SESSION & ĐỌC FILE BASELINE

1. Hỏi & Liệt kê Session (5 Session gần nhất).
2. Đọc file `01_FEATURE_REQUIREMENTS_SPEC.md`.
3. Khởi tạo file `01b_DEEP_BUSINESS_ANALYSIS.md`.

---

## 🧠 II. ĐỘNG CƠ PHỎNG VẤN NOTEBOOKLM ĐA VÒNG & CẬP NHẬT TĂNG CƯỜNG (MULTI-ROUND STREAMING ENGINE)

- Tối thiểu 5 - 10+ Rounds phỏng vấn NotebookLM (`fti-am-notebooklm-query`).
- Mỗi Round: **5 - 7 câu hỏi chuyên sâu** theo lộ trình Top-Down (Tổng quan ➔ Validations ➔ DB & State ➔ RBAC & External ➔ Edge Cases & Risk).
- **FLUSH GHI FILE NGAY SAU MỖI ROUND**: Cập nhật ngay vào `01b_DEEP_BUSINESS_ANALYSIS.md` sau từng Round phỏng vấn!
