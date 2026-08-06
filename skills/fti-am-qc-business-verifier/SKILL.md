---
name: fti-am-qc-business-verifier
description: "Skill Chuyên gia Thẩm định & Kiểm chứng Nghiệp vụ ĐA LUỒNG AGENT ĐỘNG (v3.0). Phân tích file & đánh giá độ phức tạp để TỰ ĐỘNG PHÂN BỔ ĐỘNG SỐ LƯỢNG SUBAGENTS (Tối thiểu 4 Subagents, tăng lên 5-8+ Subagents nếu phức tạp). Phỏng vấn NotebookLM đối chiếu 1-1 song song, loại bỏ 100% quy tắc AI tự bịa/chênh lệch."
---

# 🔍 FTI-AM QC Business Verifier — Dynamic Multi-Agent Verification Engine (v3.0)

Skill này chịu trách nhiệm **Thẩm định & Kiểm chứng Nghiệp vụ 100% Không Hallucination Ở Quy Mô Đa Luồng Động (Dynamic Context-Aware Verification)**. Master Agent ban đầu đọc file `01b_DEEP_BUSINESS_ANALYSIS.md`, phân tích khối lượng quy tắc và **TỰ ĐỘNG PHÂN BỔ ĐỘNG SỐ LƯỢNG SUBAGENTS (Tối thiểu 4 Subagents, tự động tăng lên 5, 6, 8+ Subagents nếu file chứa nhiều section/quy tắc phức tạp)**, khởi chạy song song qua `invoke_subagent` đối chiếu 1-1 với Google NotebookLM (`fti-am-notebooklm-query`) loại bỏ 100% quy tắc tự bịa.

---

## 🚀 I. ĐỘNG CƠ PHÂN BỔ SUBAGENTS THẨM ĐỊNH ĐỘNG

> [!IMPORTANT]
> **PHÂN BỔ ĐỘNG THEO KHỐI LƯỢNG RULES TRONG FILE:**
> Master Agent bóc tách danh sách các Section & Quy tắc trong file `01b_DEEP_BUSINESS_ANALYSIS.md`. Dựa vào số lượng section và mức độ phức tạp, AI tự phân bổ:
> - **Tối thiểu**: **4 Subagents song song** cho các file đặc tả tiêu chuẩn.
> - **Mở rộng**: **5, 6, 8+ Subagents song song** nếu file chứa hàng trăm quy tắc phức tạp ở nhiều mảng khác nhau.

```mermaid
graph TD
    AUDIT["🔍 Step 1: Đọc & Bóc Tách Rules Trong File 01b_DEEP_BUSINESS_ANALYSIS.md"] --> SCHEDULER["⚡ DYNAMIC VERIFICATION SCHEDULER<br/>Tự động phân bổ N Subagents (Min = 4, Max = 8+)"]

    SCHEDULER --> SUB1["🤖 Subagent 1: Thẩm định Section Track 1 (NotebookLM 1-1)"]
    SCHEDULER --> SUB2["🤖 Subagent 2: Thẩm định Section Track 2 (NotebookLM 1-1)"]
    SCHEDULER --> SUB3["🤖 Subagent 3: Thẩm định Section Track 3 (NotebookLM 1-1)"]
    SCHEDULER --> SUB4["🤖 Subagent 4: Thẩm định Section Track 4 (NotebookLM 1-1)"]
    SCHEDULER --> SUB5["🤖 Subagent N...: Thẩm định Section Track N... (NotebookLM 1-1)"]

    SUB1 --> MERGE["💾 Master Agent Lọc Cắt Tỉa & Flush Cập Nhật Thời Gian Thực"]
    SUB2 --> MERGE
    SUB3 --> MERGE
    SUB4 --> MERGE
    SUB5 --> MERGE
    MERGE --> OUT["📂 am-docs/QC_SESSIONS/<SESSION_ID>/01b_DEEP_BUSINESS_ANALYSIS.md<br/>Status: [VERIFIED_STRICT_BASELINE_DYNAMIC]"]
```

---

## ⚡ II. QUY TRÌNH THỰC THI ĐA LUỒNG ĐỘNG

1. **Master Agent đọc & phân tích file `01b_DEEP_BUSINESS_ANALYSIS.md`**: Trích xuất toàn bộ danh mục rules.
2. **Quyết định số lượng Subagents (Min 4, Max 8+)**: Phân chia danh mục rules cho N Subagents song song.
3. **Dispatch Subagents qua `invoke_subagent`**: Khởi chạy đồng thời N Subagents phỏng vấn đối chiếu 1-1 với NotebookLM (`fti-am-notebooklm-query`).
4. **Lọc cắt tỉa & tổng hợp**:
   - **NotebookLM xác nhận CÓ**: Giữ lại rule `[✅ VERIFIED]`.
   - **NotebookLM xác nhận KHÔNG CÓ (tự bịa)**: Xóa 100% `[❌ SANITIZED_HALLUCINATION]`.
5. **Master Agent Cập nhật thời gian thực vào file `01b_DEEP_BUSINESS_ANALYSIS.md`**.
