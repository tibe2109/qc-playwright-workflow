---
name: ai-testcase-generator
description: "Skill chuyên biệt sinh bộ Testcase Markdown từ QC Spec. Bóc tách 100% quy tắc nghiệp vụ theo Ma trận 8 Trụ cột (P1->P8), hỗ trợ CHẾ ĐỘ MỞ RỘNG BIẾN THỂ CHUYÊN SÂU (Deep Expansion Mode) và BỔ SUNG NỐI TIẾP FILE TESTCASE (Append Mode). Hỗ trợ phỏng vấn chọn tiêu chí kiểm thử mong muốn và mật độ testcase."
---

# 🧪 AI Testcase Generator — Universal Deep Test Architect (v2.5)

Skill này bóc tách bộ testcase chuyên sâu từ bản QC Spec, phủ trọn 8 trụ cột chất lượng. Hỗ trợ tạo mới hoặc bổ sung nhiều biến thể testcase chuyên sâu theo các tiêu chí (P1 -> P8) mà người dùng yêu cầu.

---

## ⚙️ CÁC CHẾ ĐỘ THỰC THI (MODES OF OPERATION)

Skill hỗ trợ 2 chế độ sinh testcase:

1. **Chế độ Tạo Mới (Fresh Generation Mode)**: Bóc tách QC Spec và sinh file `02_testcase.md` mới từ đầu.
2. **Chế độ Mở Rộng & Bổ Sung Nối Tiếp (Append & Expand Mode)**: Đọc file `02_testcase.md` hiện tại, giữ nguyên các testcase đã có và bổ sung thêm các biến thể dị biệt theo các Tiêu chí/Pillars được chỉ định.

---

## 🎯 BƯỚC 1: PHỎNG VẤN CHỌN TIÊU CHÍ VÀ MẬT ĐỘ KIỂM THỬ (CRITERIA & DENSITY GATE)

Khi chạy skill (hoặc khi user muốn bổ sung biến thể), AI Agent **in ngay bảng phỏng vấn chọn tiêu chí**:

```markdown
🎯 [TESTCASE GENERATOR — PHỎNG VẤN CHỌN TIÊU CHÍ KIỂM THỬ]

Bạn muốn thiết kế / bổ sung bộ testcase theo các tiêu chí nào dưới đây?

1. 📌 **Mật độ Testcase (Test Density)**:
   - A) STANDARD (~15-20 testcases) — Bao phủ cơ bản các luồng chính.
   - B) DEEP COVERAGE (~30-50 testcases) — Bao phủ sâu các trường hợp biên và validation.
   - C) ADVERSARIAL (~50-80+ testcases) — Tấn công phá hoại, race condition, IDOR, SQLi/XSS, stress limits.

2. 🛡️ **Tập trung vào Trụ cột Chất lượng nào (P1 -> P8)?** (Có thể chọn nhiều):
   - [P1] Primary Functional Flow (Luồng nghiệp vụ chính & đa vai trò)
   - [P2] Negative & Malformed Inputs (Form validation, payload dị biệt, XSS/SQLi)
   - [P3] Extreme Boundaries & Edge Limits (Overflow min/max, file size bomb, threshold limits)
   - [P4] Security, Access Control & RBAC (IDOR, leo thang đặc quyền, JWT expiry)
   - [P5] Concurrency, Race & State Locks (Double click, race condition, IdempotencyKey)
   - [P6] Data Integrity & Transactions (ACID rollback, cascading delete, FKs)
   - [P7] External Integration Resilience (Integration timeout, 503 error, Storage fail)
   - [P8] Implicit System Rules & Compliance (Audit trail, auto-numbering, sort injection, export leak)

3. 🔄 **Chế độ Ghi file**:
   - A) Tạo mới hoàn toàn file 02_testcase.md
   - B) Bổ sung thêm biến thể nối tiếp vào file 02_testcase.md hiện tại (Append Mode)

👉 Bạn vui lòng chọn tùy chọn (ví dụ: "1B, P2+P4+P5, 3B" hoặc nhập yêu cầu tự do).
```

---

## 🌐 MA TRẬN 8 TRỤ CỘT CẢI TIẾN & BẢNG KỊCH BẢN MỞ RỘNG (P1 -> P8)

| Trụ cột (Pillar) | Tên Trụ cột | Các kịch bản biến thể chuyên sâu cần bổ sung |
| --- | --- | --- |
| **P1** | Primary Functional Flow | Luồng cross-department, tổ hợp luồng chính x vai trò x loại tài liệu. |
| **P2** | Negative & Malformed Inputs | Input trống, payload > 10MB, inject script `<script>alert(1)</script>`, SQLi `' OR '1'='1`, file giả mạo extension. |
| **P3** | Extreme Boundaries & Edge Limits | Chuỗi 255/256/1000 ký tự, số âm, số 0, Max Int 2147483647, upload file max limit, timezone edge. |
| **P4** | Security & RBAC | IDOR (User A đổi URL ID của User B), User thường cố gọi API Admin, JWT payload modification, Session timeout. |
| **P5** | Concurrency & Race | Double-click nút Submit trong 50ms, 2 users submit cùng giây, trùng IdempotencyKey, DB deadlock. |
| **P6** | Data Integrity | Transaction Rollback khi API lỗi 500, cascading operations, orphaned records check. |
| **P7** | External Integration | External service timeout 30s, service 503 unavailable, cloud storage disconnect, retry logic. |
| **P8** | Implicit Rules | Audit trail log đúng username/IP, Auto-numbering sequence không bị trùng/nhảy số, Soft delete, Sort injection bypass. |

---

## 📋 CHI TIẾT QUY TRÌNH 5 BƯỚC THỰC THI

### Bước 0: Nhận Session ID + Đọc Cấu hình (CHỈ ĐỌC)
### Bước 1: Phỏng vấn Chọn Tiêu chí & Mật độ (Criteria & Density Gate)
### Bước 2: Nạp Tri thức QC Master Specs & File Testcase Hiện tại
### Bước 3: Sinh các Biến thể Testcase Chuyên sâu theo Template
```markdown
### TC_[PREFIX].[STT]: [Tên Testcase chi tiết và rõ ràng]
- **Mức Độ Ưu Tiên:** [High | Medium | Low]
- **Trụ cột Quality Matrix:** [P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8]
- **Điều Kiện/ Dữ Liệu Test:** [Role, Tiền đề, Data payload]
- **Các Bước Thực Hiện:**
  1. [Bước 1...]
  2. [Bước 2...]
- **Kết Quả Mong Đợi:** [UI response, HTTP status, DB State, Side-effects]
```
### Bước 4: Lưu file `<SESSION_ID>/02_testcase.md` & Cập nhật Context
### Bước 5: In TEAM PROGRESS DASHBOARD
