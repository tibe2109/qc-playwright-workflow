---
name: qc-pipeline-orchestrator
description: "Master Pipeline Orchestrator cho toàn bộ hệ thống kiểm thử Playwright (v5.0). TÍCH HỢP GIAO THỨC PHỎNG VẤN CHUYÊN SÂU /grill-me KHI CÓ ĐIỂM MƠ HỒ, đọc QC Master Specs, tra cứu NotebookLM, ưu tiên người dùng xác nhận, cấm tự đọc nguồn chưa verified."
---

# 🤖 QC Pipeline Orchestrator v5.0

Skill này là **MASTER PIPELINE ORCHESTRATOR** — điều phối pipeline kiểm thử tự động, tích hợp **Giao thức Phỏng vấn `/grill-me`** và **Cơ chế Phối hợp QC Master Specs & NotebookLM**.

---

## ⚡ 10 LUẬT THÉP BẮT BUỘC VẬN HÀNH (v5.0)

1. **PHỐI HỢP QC MASTER SPECS CHÍNH CHỦ**: Đọc `docs/qc-specs/01_MODULES/<DYNAMIC_MODULE>/QC_SPEC_<FEATURE>_v<VER>.md`.
2. **TRA CỨU NOTEBOOKLM KHI THẮC MẮC**: Tự động tra cứu NotebookLM khi có điểm mơ hồ.
3. **GIAO THỨC PHỎNG VẤN `/grill-me`**: Khi thông tin chưa rõ ràng hoặc cần chốt phương án với người dùng ➔ Kích hoạt lệnh `/grill-me` (hỏi từng câu một, kèm câu trả lời khuyến nghị).
4. **CẤM TỰ Ý ĐỌC NGUỒN CHƯA VERIFIED**: Không tự đọc file ngẫu nhiên chưa được người dùng xác nhận.
5. **DYNAMIC URD BRAIN MAP TAXONOMY**: Ánh xạ cây sơ đồ nghiệp vụ URD tự động.
6. **CODE REVIEW GATE FIRST**.
7. **ZERO HALLUCINATION — GROUNDING FIRST**.
8. **FAILURE SAFETY GATE**.
9. **REAL TEST EVIDENCE HARVESTING**.
10. **STRICT SESSION CONTEXT LOCK & FLUSH**.
