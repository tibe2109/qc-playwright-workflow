---
name: fti-am-qc-business-verifier
description: "Skill Chuyên gia Thẩm định & Kiểm chứng Nghiệp vụ ĐA LUỒNG AGENT (v2.0). Khởi tạo Subagents song song qua invoke_subagent thẩm định đối chiếu 1-1 với NotebookLM (30-50+ câu hỏi song song): cắt tỉa 100% quy tắc AI tự bịa/chênh lệch, chuẩn hóa tài liệu đạt [VERIFIED_STRICT_BASELINE]."
---

# 🔍 FTI-AM QC Business Verifier — Concurrent Multi-Agent Verification Engine (v2.0)

Skill này chịu trách nhiệm **Thẩm định & Kiểm chứng Nghiệp vụ 100% Không Hallucination Ở Quy Mô Đa Luồng (Concurrent Multi-Agent Verification)**. Skill sử dụng `invoke_subagent` để **khởi chạy 3-4 Subagents chạy song song**, chia nhỏ từng section trong `01b_DEEP_BUSINESS_ANALYSIS.md` để đối chiếu 1-1 với Google NotebookLM (`fti-am-notebooklm-query`) đa vòng đồng thời (tổng cộng 30-50+ câu hỏi thẩm định song song), loại bỏ 100% quy tắc tự bịa.

---

## ⚡ I. BỐN SUBAGENTS THẨM ĐỊNH SONG SONG (4 PARALLEL VERIFICATION TRACKS)

1. **Subagent Track A — Workflow & State Transitions Verifier**:
   - Thẩm định 1-1 các luồng thao tác, ma chuyển đổi trạng thái ticket CTI.CTRTICKET.
2. **Subagent Track B — Field Validations & Rules Verifier**:
   - Thẩm định 1-1 từng trường dữ liệu, regex, min/max length, mã số thuế CM.
3. **Subagent Track C — External Integrations Verifier**:
   - Thẩm định 1-1 các quy tắc FPT.eSign, BMS binding, FTI-CM lookup.
4. **Subagent Track D — Edge Cases & Security Verifier**:
   - Thẩm định 1-1 các kịch bản IDOR, double submit, ranh giới và ngoại lệ.

---

## 📑 II. QUY TRÌNH THỰC THI ĐA LUỒNG

1. **Master Agent trích xuất Rules**: Đọc `01b_DEEP_BUSINESS_ANALYSIS.md` và phân chia danh mục rules.
2. **Dispatch 4 Subagents song song**: Gọi `invoke_subagent` giao 4 tracks cho 4 Subagents.
3. **Subagents đối chiếu NotebookLM song song**: Mỗi Subagent chạy 5-8 rounds thẩm định 1-1 với NotebookLM (`fti-am-notebooklm-query`).
4. **Lọc cắt tỉa & tổng hợp**:
   - **Xác nhận CÓ**: Giữ lại rule `[✅ VERIFIED]`.
   - **Xác nhận KHÔNG CÓ (tự bịa)**: Xóa 100% `[❌ SANITIZED_HALLUCINATION]`.
5. **Master Agent Cập nhật thời gian thực vào `01b_DEEP_BUSINESS_ANALYSIS.md`**.
