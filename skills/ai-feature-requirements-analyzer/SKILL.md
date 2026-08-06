---
name: ai-feature-requirements-analyzer
description: "Skill Phân Tích Yêu Cầu Kiểm Thử TỔNG QUAN (High-Level Requirements). Quản lý khởi tạo/tiếp tục tiến trình session (liệt kê 5 session gần nhất), hỏi & tra cứu để tạo file 01_FEATURE_REQUIREMENTS_SPEC.md tổng quan. CHƯA đi sâu phân tích nghiệp vụ chi tiết (Deep Analysis do skill ai-business-analyst đảm nhận)."
---

# 📋 AI Feature Requirements Analyzer — High-Level Requirements Skill (v2.0)

Skill này chịu trách nhiệm **Thu thập & Phân tích Yêu cầu Kiểm thử TỔNG QUAN (High-Level)** và xuất bản file đặc tả định hướng kiểm thử ban đầu tại:
`docs/qc-sessions/<SESSION_ID>/01_FEATURE_REQUIREMENTS_SPEC.md`

---

## 🧭 I. QUY TRÌNH QUẢN LÝ TIẾN TRÌNH SESSION

1. **Khởi Tạo / Chọn Session**: Hỏi người dùng Chọn Session mới HOẶC Tiếp tục từ 5 Session gần nhất.
2. **Xuất Bản File 01_FEATURE_REQUIREMENTS_SPEC.md Tổng Quan**: 8 mục tổng quan (Context, Scope, High-level Flow, Error handling summary, UI/Target platforms, Technical summary, High-level Impact, Environment/Roles).
