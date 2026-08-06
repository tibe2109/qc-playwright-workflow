---
name: ai-testcase-generator
description: "Skill chuyên biệt sinh bộ Testcase Markdown từ QC Spec (v2.8). NGHIÊM CẤM RÚT GỌN NÉN CHUỖI, ĐẢM BẢO 100% TESTCASE ĐẦY ĐỦ 4 PHẦN CHI TIẾT (Data Payload, Bước 1..N chi tiết, Expected DB/UI) NHƯ BAN ĐẦU."
---

# 🧪 AI Testcase Generator — Strict Full-Detail Quality Contract (v2.8)

Skill này bóc tách bộ testcase chuyên sâu từ bản QC Spec. **CAM KẾT 100% TẤT CẢ TESTCASE (TỪ TC 1 ĐẾN TC N) ĐỀU GIỮ NGUYÊN ĐỘ CHI TIẾT ĐẦY ĐỦ 4 PHẦN, TUYỆT ĐỐI KHÔNG NÉN THÀNH 1 DÒNG HAY BỎ BỚT MỤC.**

---

## 🚫 QUY TẮC THÉP NGUYÊN TẮC CHẤT LƯỢNG (STRICT NO-COMPRESSION CONTRACT)

> [!CAUTION]
> **CẤM TỰ Ý RÚT GỌN HOẶC NÉN NỘI DUNG TESTCASE:**
> Khi sinh số lượng lớn testcases (20 - 80+ testcases), AI Agent **TUYỆT ĐỐI KHÔNG DÙNG CƠ CHẾ NÉN NỘI DUNG** (như gộp bước thành `Tab 1: KH, Tab 2: Tìm KH...` hoặc bỏ mục `Điều Kiện/ Dữ Liệu Test`).

### ❌ CÁC HÀNH VI VI PHẠM (STRICTLY FORBIDDEN):
1. ❌ Gộp các bước thực hiện thành 1 dòng duy nhất.
2. ❌ Bỏ qua mục `Mức Độ Ưu Tiên` hoặc `Điều Kiện/ Dữ Liệu Test`.
3. ❌ Viết `Kết Quả Mong Đợi` chung chung 1 câu không có HTTP Code hay DB Table.

### ✅ CẤU TRÚC BẮT BUỘC 100% CHI TIẾT CHO MỌI TESTCASE:

Tất cả các testcase (dù ở vị trí nào) **BẮT BUỘC** tuân thủ cấu trúc 4 phần đầy đủ sau:

```markdown
### TC_P1.1: Tạo Yêu Cầu Hợp Đồng Khách Hàng — KH Tồn Tại Trên CM — Review Theo Template KH

- **Mức Độ Ưu Tiên:** High
- **Trụ cột Quality Matrix:** P1 (Primary Functional Flow)
- **Điều Kiện/ Dữ Liệu Test:**
  * Account đăng nhập: Role Sale / Người tạo (`longht17@fpt.com`).
  * Đường dẫn màn hình: `/am/review-request/create` (Tab 1 & Tab 2).
  * Dữ liệu test mẫu:
    - Loại đối tác: `Khách hàng` (PartnerType = 1).
    - Loại văn bản: `Hợp đồng` (DocType = 1).
    - Khách hàng CM: `FTI124414` (WINCOMMERCE).
    - Nhóm dịch vụ: `1000` (Kênh thuê riêng & Internet).
    - Loại dịch vụ: `1001` (Dịch vụ SSL).
    - Giá trị hợp đồng: `50,000,000` VNĐ.
    - File Template chọn: `FileEntryId = 11668`.

- **Các Bước Thực Hiện:**
  1. Đăng nhập hệ thống FTI-AM qua SSO OTP Test mode (`longht17@fpt.com` / `ISC22QC`).
  2. Truy cập màn hình Tạo yêu cầu review tại link `/am/review-request/create`.
  3. Tại Tab 1: Chọn Loại đối tác = "Khách hàng", Loại văn bản = "Hợp đồng". Nhấn nút "Tiếp tục".
  4. Tại Tab 2: Nhập Tên yêu cầu = "Yêu cầu review HĐ Dịch vụ SSL WinCommerce 2026".
  5. Nhập keyword tìm kiếm KH = "FTI124414" và chọn khách hàng từ danh sách gợi ý CM.
  6. Nhập Giá trị hợp đồng = "50000000". Chọn Nhóm dịch vụ = "Kênh thuê riêng & Internet", Loại dịch vụ = "Dịch vụ SSL".
  7. Chọn Loại yêu cầu review = "Theo template". Click chọn Template = "Biểu mẫu HĐ Khách hàng SSL" (FileEntryId = 11668).
  8. Thêm 1 tài liệu đính kèm tham khảo (file `.pdf` max 5MB).
  9. Click nút "Tạo mới". Hệ thống hiển thị popup xác nhận -> Click "Xác nhận".

- **Kết Quả Mong Đợi:**
  * Tạo mới phiếu yêu cầu thành công, API trả về `HTTP 200 OK` với Ticket ID > 0.
  * Hệ thống tự động chuyển hướng sang màn hình Chi tiết yêu cầu vừa tạo.
  * Trạng thái phiếu hiển thị: `Tạo mới`.
  * Toàn bộ thông tin Tab 1, Tab 2, Nhóm/Loại dịch vụ, Khách hàng CM và File Template `11668` lưu chính xác trong DB `CTI.CTRTICKET`.
```

---

## ⚡ CƠ CHẾ SINH NỐI TIẾP THEO BATCH DÀNH CHO TESTCASE SỐ LƯỢNG LỚN (AUTO BATCH GENERATION)

1. AI Agent sinh theo đợt **10 - 15 Testcases / Batch**.
2. Nối tiếp dữ liệu đầy đủ vào file `<SESSION_ID>/02_testcase.md`.
3. Giữ độ chi tiết 100% từ TC 1 đến TC N.
