# 📊 Sơ đồ Luồng Hoạt động Chi tiết (Workflow Diagrams v2.4)

## 1. Luồng Pipeline 5 Bước (5-Step Modular Pipeline)

```mermaid
graph TD
    USER["👤 User"] -->|"Yêu cầu kiểm thử tính năng X"| OB
    OB["⚙️ Onboarding Gate<br/>Hỏi cấu hình nếu isDefaultLocked=false"] --> INIT
    INIT["🔑 Bước -1: Sinh SESSION_ID<br/>Tạo thư mục session<br/>Đăng ký REGISTRY.json"] --> S0

    S0["🎭 Step 0: ai-playwright-environment-engineer<br/>Auto-Diagnostics Node, Proxy, Packages<br/>Browsers, Ports & playwright.config.ts"] -->|"Dashboard #0"| S1

    S1["👑 Step 1: ai-qa-lead<br/>Phân tích URD<br/>Phỏng vấn PO (Zero Hallucination)"] -->|"Giữ KB Lock"| KB_LOCK["🔒 KB_MERGE.lock<br/>Chỉ 1 agent merge cùng lúc"]
    KB_LOCK -->|"Merge Delta 4 màu"| KB["🏛️ QC Knowledge Base<br/>00_DICTIONARY<br/>02_REQUIREMENTS_BASELINE"]
    KB_LOCK -->|"Giải phóng lock"| KB_UNLOCK["🔓 Lock Released"]
    S1 -->|"Dashboard #1 & Output"| QC_SPEC["📄 SESSION_ID/<br/>01_QC_SPEC_*.md"]

    QC_SPEC --> S2["🧪 Step 2: ai-testcase-generator<br/>Bóc tách 8 trụ cột<br/>Sinh testcase Markdown"]
    S2 -->|"Dashboard #2 & Output"| TC["📋 SESSION_ID/<br/>02_testcase.md"]

    TC --> S3["🏗️ Step 3: ai-playwright-spec-builder<br/>Đọc users.real.json<br/>Sinh POM + *.spec.ts (User Switching)"]
    AUTH["👤 users.real.json<br/>Users & Roles"] --> S3
    S3 -->|"Dashboard #3 & Output"| SPEC["✍️ SESSION_ID/03_playwright/<br/>pages/*.ts<br/>*.spec.ts"]
    SPEC -->|"Copy để chạy"| E2E["📁 e2e/features/<FEATURE>/"]

    E2E --> S4["🚀 Step 4: ai-playwright-test-runner<br/>REAL Mode execution<br/>Self-Healing Loop"]
    S4 -->|"100% PASS (0 Bug)"| PASS["✅ QC_REPORT_R<N>.md<br/>02_testcase.md CERTIFIED PASS"]
    S4 -->|"Script error → Auto-fix"| HEAL["🛠️ Self-Heal<br/>Sửa code → Re-run<br/>Max 5 lần"]
    HEAL --> S4
    S4 -->|"Product bug"| BUG["🐛 BUG-*.md<br/>Dev-QC Closed-Loop Lifecycle"]

    PASS --> SESSION_OUT["📁 SESSION_ID/04_test_results/<br/>QC_REPORT_R<N>.md (Lệnh --ui Replay)<br/>BUG-*.md<br/>Traces & Screenshots"]
    BUG --> SESSION_OUT

    style OB fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
    style INIT fill:#e3f2fd,stroke:#1565c0,stroke-width:3px
    style S0 fill:#e0f7fa,stroke:#00838f,stroke-width:2px
    style S1 fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style S2 fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style S3 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style S4 fill:#fce4ec,stroke:#c62828,stroke-width:2px
```

---

## 2. Vòng đời Đóng vết Bug Hai chiều giữa AI Dev và AI QC (Dev-QC Closed-Loop Bug Lifecycle)

```mermaid
graph TD
    A["🔴 AI QC phát hiện lỗi sản phẩm<br/>Tạo file BUG-*.md (Trạng thái: NEW_BUG)"] --> B["🤖 AI Dev Agent đọc BUG-*.md,<br/>xem Trace & Screenshot, sửa source code"]
    B --> C["✍️ AI Dev ghi log sửa lỗi vào BUG-*.md<br/>Đổi trạng thái -> [RESOLVED_BY_DEV]"]
    C --> D["🚀 Kích hoạt AI QC Test Runner (--recheck-bugs)"]
    D --> E["🧪 AI QC chạy lại Spec bị lỗi ở Round N+1"]
    E --> F{"Kết quả Recheck Round N+1"}
    F -->|"100% PASS"| G["🟢 Đổi status BUG -> [CLOSED_VERIFIED]<br/>Cập nhật 02_testcase.md thành PASS<br/>Sinh QC_REPORT_R<N+1>.md"]
    F -->|"Vẫn FAIL"| H["🟠 Đổi status BUG -> [REOPENED]<br/>Ghi lý do & gửi lại AI Dev"]
    H --> B
```

---

## 3. Luồng Session Lifecycle & Multi-Agent Concurrent

```mermaid
stateDiagram-v2
    [*] --> INIT: User kích hoạt Orchestrator
    INIT --> STEP0: Sinh SESSION_ID + Thư mục riêng
    STEP0 --> QA_LEAD: Môi trường sẵn sàng (Node, Packages, Browsers)
    QA_LEAD --> TC_GEN: QC Spec hoàn tất (Dashboard #1)
    TC_GEN --> SPEC_BUILD: testcase.md hoàn tất (Dashboard #2)
    SPEC_BUILD --> TEST_RUN: POM + Spec files hoàn tất (Dashboard #3)
    TEST_RUN --> PASS: 100% tests pass
    TEST_RUN --> SELF_HEAL: Có test fail (Script error)
    SELF_HEAL --> TEST_RUN: Re-run sau khi sửa code (Max 5 lần)
    TEST_RUN --> BUG_REPORT: Phát hiện bug sản phẩm (BUG-*.md)
    BUG_REPORT --> DEV_FIX: AI Dev sửa code -> [RESOLVED_BY_DEV]
    DEV_FIX --> TEST_RUN: AI QC Recheck (--recheck-bugs)
    PASS --> COMPLETED: Cấp chứng nhận PASS + Dashboard #4
    COMPLETED --> [*]
```

---

## 4. Cấu trúc thư mục Runtime Output hoàn chỉnh (v2.4)

```
your-project/
├── docs/
│   ├── qc-sessions/
│   │   ├── REGISTRY.json                          ← Track tất cả sessions
│   │   ├── SES_20260727_143000_ORDER/              ← Session Agent 1 (Độc lập)
│   │   │   ├── SESSION_CONTEXT.json
│   │   │   ├── 01_QC_SPEC_ORDER_v1.0.md
│   │   │   ├── 02_testcase.md                     ← [Certified 100% PASS]
│   │   │   ├── 03_playwright/
│   │   │   │   ├── pages/OrderPage.ts
│   │   │   │   └── order.spec.ts
│   │   │   └── 04_test_results/
│   │   │       ├── QC_REPORT_R1.md                ← [Chứa lệnh terminal --ui]
│   │   │       ├── BUG-ORDER-001.md               ← [Closed-loop Dev-QC report]
│   │   │       └── traces/
│   │   │           ├── screenshot-fail.png
│   │   │           └── trace-TC_03.zip
│   │   └── SES_20260727_143052_PAYMENT/            ← Session Agent 2 (Độc lập)
│   │       └── ...
│   └── qc-specs/
│       ├── .locks/
│       │   └── KB_MERGE.lock                      ← Tạm thời khi 1 agent đang merge
│       ├── logs/
│       └── FEATURE_SPECS/
└── e2e/
    ├── .auth/                                      ← Auth storage states (.auth/<role>.json)
    ├── config/
    │   └── users.real.json                        ← Cấu hình roles & accounts
    ├── auth.setup.ts                              ← Auth setup 4 tầng (Mock, Token, API, SSO OTP)
    ├── playwright.config.ts                       ← Config đã được tối ưu
    ├── pages/
    └── features/
```
