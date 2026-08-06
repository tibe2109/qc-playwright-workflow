---
name: ai-testcase-generator
description: "Skill chuyên biệt sinh bộ Testcase Markdown từ QC Spec (v2.7). Tối ưu ĐĂNG NHẬP 1 LẦN (Global Auth Reuse via Storage State), bóc tách 100% quy tắc nghiệp vụ theo Ma trận 8 Trụ cột (P1->P8), hỗ trợ CHẾ ĐỘ MỞ RỘNG BIẾN THỂ CHUYÊN SÂU (Deep Expansion Mode) và BỔ SUNG NỐI TIẾP FILE TESTCASE (Append Mode)."
---

# 🧪 AI Testcase Generator — One-Time Auth & Deep Test Architect (v2.7)

Skill này bóc tách bộ testcase chuyên sâu từ bản QC Spec. Tối ưu hóa **Đăng nhập 1 LẦN duy nhất (Global Storage State)**, tuyệt đối không lặp lại các bước login trong từng testcase nhỏ.

---

## 🔐 QUY TẮC TỐI ƯU ĐĂNG NHẬP 1 LẦN (ONE-TIME GLOBAL AUTH REUSE RULE)

> [!IMPORTANT]
> **ĐĂNG NHẬP 1 LẦN BẰNG GLOBAL AUTH STORAGE STATE:**
> Luồng đăng nhập SSO OTP (dùng email test `longht17@fpt.com` và mã OTP `ISC22QC` hoặc API test auth) được thực thi **DUY NHẤT 1 LẦN** ở bước `auth.setup.ts` và lưu vào `playwright/.auth/<role>.json`.

### Quy tắc khi sinh Testcase Markdown (`02_testcase.md`):
1. **TUYỆT ĐỐI KHÔNG viết các bước "Mở trang login -> Nhập email -> Nhập OTP -> Bấm Đăng nhập" vào phần Các Bước Thực Hiện** của từng testcase.
2. **Khai báo Đăng nhập dưới dạng Điều Kiện Tiền Đề (Pre-condition)**:
   ```markdown
   - **Điều Kiện/ Dữ Liệu Test:** User đã đăng nhập hệ thống với vai trò System Admin (longht17@fpt.com) / Salesman / Legal (sử dụng Storage State sẵn có tại playwright/.auth/<role>.json).
   ```
3. **Trực tiếp đi thẳng vào thao tác nghiệp vụ**:
   - `1. Truy cập trực tiếp trang tạo mới hợp đồng /am/ticket/create`
   - `2. Điền thông tin form và bấm Submit...`

---

## ⚙️ CÁC CHẾ ĐỘ THỰC THI (MODES OF OPERATION)

1. **Chế độ Tạo Mới (Fresh Generation Mode)**: Bóc tách QC Spec và sinh file `02_testcase.md` mới từ đầu.
2. **Chế độ Mở Rộng & Bổ Sung Nối Tiếp (Append & Expand Mode)**: Đọc file `02_testcase.md` hiện tại, giữ nguyên các testcase đã có và bổ sung thêm các biến thể dị biệt theo các Tiêu chí/Pillars được chỉ định.

---

## 🎯 BƯỚC 1: PHỎNG VẤN CHỌN TIÊU CHÍ VÀ MẬT ĐỘ KIỂM THỬ (CRITERIA & DENSITY GATE)
## 📋 CHI TIẾT QUY TRÌNH 5 BƯỚC THỰC THI (STEP-BY-STEP)
