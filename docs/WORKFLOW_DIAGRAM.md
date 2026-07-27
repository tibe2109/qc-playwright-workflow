# 📊 Sơ đồ Luồng Hoạt động Chi tiết

## 1. Luồng Pipeline Tổng thể

```mermaid
graph TD
    USER["👤 User"] -->|"Yêu cầu kiểm thử tính năng X"| OB
    OB["⚙️ Onboarding Gate<br/>Hỏi cấu hình nếu isDefaultLocked=false"] --> INIT
    INIT["🔑 Bước -1: Sinh SESSION_ID<br/>Tạo thư mục session<br/>Đăng ký REGISTRY.json"] --> S1

    S1["👑 Skill 1: ai-qa-lead<br/>Phân tích URD<br/>Phỏng vấn PO đa vòng"] -->|"Giữ KB Lock"| KB_LOCK["🔒 KB_MERGE.lock<br/>Chỉ 1 agent merge cùng lúc"]
    KB_LOCK -->|"Merge Delta 4 màu"| KB["🏛️ QC Knowledge Base<br/>00_DICTIONARY<br/>02_REQUIREMENTS_BASELINE"]
    KB_LOCK -->|"Giải phóng lock"| KB_UNLOCK["🔓 Lock Released"]
    S1 -->|"Ghi log riêng"| LOG["📝 03_LOGS/<br/>LOG_<SESSION_ID>.md"]
    S1 -->|"Output"| QC_SPEC["📄 SESSION_ID/<br/>01_QC_SPEC_*.md"]

    QC_SPEC --> S2["🧪 Skill 2: ai-testcase-generator<br/>Bóc tách 8 trụ cột<br/>Sinh testcase Markdown"]
    S2 -->|"Output"| TC["📋 SESSION_ID/<br/>02_testcase.md"]

    TC --> S3["🏗️ Skill 3: ai-playwright-spec-builder<br/>Đọc auth-roles.json<br/>Sinh POM + *.spec.ts"]
    AUTH["👤 auth-roles.json<br/>Users & Roles"] --> S3
    S3 -->|"Output"| SPEC["✍️ SESSION_ID/03_playwright/<br/>pages/*.ts<br/>*.spec.ts"]
    SPEC -->|"Copy để chạy"| E2E["📁 e2e/features/<FEATURE>/"]

    E2E --> S4["🚀 Skill 4: ai-playwright-test-runner<br/>REAL Mode execution<br/>Self-Healing Loop"]
    S4 -->|"100% PASS"| PASS["✅ QC_REPORT_PASS.md"]
    S4 -->|"Script error → Auto-fix"| HEAL["🛠️ Self-Heal<br/>Sửa code → Re-run<br/>Max 5 lần"]
    HEAL --> S4
    S4 -->|"Product bug"| BUG["🐛 BUG-*.md<br/>Bug Report đầy đủ"]

    PASS --> SESSION_OUT["📁 SESSION_ID/04_test_results/"]
    BUG --> SESSION_OUT

    style OB fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
    style INIT fill:#e3f2fd,stroke:#1565c0,stroke-width:3px
    style KB_LOCK fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style HEAL fill:#fff3e0,stroke:#e65100,stroke-width:2px
```

---

## 2. Luồng Multi-Agent Concurrent (3 Agent song song)

```mermaid
graph LR
    A1["🤖 Agent 1<br/>SES_..._ORDER"] --> D1["📁 QC_SESSIONS/<br/>SES_..._ORDER/"]
    A2["🤖 Agent 2<br/>SES_..._PAYMENT"] --> D2["📁 QC_SESSIONS/<br/>SES_..._PAYMENT/"]
    A3["🤖 Agent 3<br/>SES_..._USER_MGMT"] --> D3["📁 QC_SESSIONS/<br/>SES_..._USER_MGMT/"]

    A1 & A2 & A3 -->|"Đọc chung (READ-ONLY)"| CONFIG["📄 pipeline.config.json<br/>(Stateless config)"]
    A1 & A2 & A3 -->|"Đọc chung (READ-ONLY)"| KB["🏛️ QC Knowledge Base<br/>(Shared read-only)"]

    A1 -->|"Khi cần merge KB"| LOCK["🔒 KB_MERGE.lock<br/>Agent 1 đang giữ"]
    A2 & A3 -->|"Đợi lock"| WAIT["⏳ Chờ... retry 5s"]
    LOCK -->|"A1 merge xong → xóa lock"| FREE["🔓 Lock Released"]
    FREE --> A2

    A1 & A2 & A3 -->|"Append-only"| REG["📊 REGISTRY.json<br/>Track all sessions"]

    style LOCK fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style WAIT fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
    style FREE fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
```

---

## 3. Luồng Session Lifecycle

```mermaid
stateDiagram-v2
    [*] --> INIT: User kích hoạt Orchestrator
    INIT --> QA_LEAD: Sinh SESSION_ID + Thư mục riêng
    QA_LEAD --> TC_GEN: QC Spec hoàn tất
    TC_GEN --> SPEC_BUILD: testcase.md hoàn tất
    SPEC_BUILD --> TEST_RUN: POM + Spec files hoàn tất
    TEST_RUN --> PASS: 100% tests pass
    TEST_RUN --> SELF_HEAL: Có test fail (Script error)
    SELF_HEAL --> TEST_RUN: Re-run sau khi sửa code
    SELF_HEAL --> HARD_CAP: Đạt giới hạn 5 lần
    TEST_RUN --> BUG_REPORT: Phát hiện bug sản phẩm
    PASS --> COMPLETED: Ghi vào REGISTRY.completedSessions
    HARD_CAP --> COMPLETED: Cần review thủ công
    BUG_REPORT --> COMPLETED: Có bug cần fix
    COMPLETED --> [*]

    note right of SELF_HEAL: Max 3 lần sửa/file\nMax 5 lần re-run suite
    note right of QA_LEAD: KB Lock khi merge\nLog phân tán theo session
```

---

## 4. Luồng Xác thực (SSO Flow)

```mermaid
sequenceDiagram
    participant GS as Global Setup
    participant B as Browser (hidden)
    participant APP as Your App
    participant FS as File System

    Note over GS: Chạy 1 lần trước tất cả test
    GS->>GS: Đọc auth-roles.json (N roles)
    loop Với mỗi role
        GS->>B: Mở browser ẩn
        B->>APP: Điền username/password
        APP-->>B: Redirect → Dashboard (login success)
        B->>FS: Lưu cookies+localStorage → e2e/.auth/<role>.json
        GS->>B: Đóng browser
    end

    Note over GS: Tất cả .auth files sẵn sàng

    loop Mỗi test case
        participant T as Test File
        T->>T: test.use({ storageState: 'e2e/.auth/admin.json' })
        T->>B: Playwright nạp storage state (không cần login)
        B->>APP: Bắt đầu test ngay (đã authenticated)
    end
```

---

## 5. Cấu trúc thư mục output

```
your-project/
├── docs/
│   ├── qc-sessions/
│   │   ├── REGISTRY.json                          ← Track tất cả sessions
│   │   ├── SES_20260727_143000_ORDER/              ← Session Agent 1
│   │   │   ├── SESSION_CONTEXT.json
│   │   │   ├── 01_QC_SPEC_ORDER_v1.0.md
│   │   │   ├── 02_testcase.md
│   │   │   ├── 03_playwright/
│   │   │   │   ├── pages/OrderPage.ts
│   │   │   │   └── order.spec.ts
│   │   │   └── 04_test_results/
│   │   │       ├── QC_REPORT_R1.md
│   │   │       ├── BUG-ORDER-001.md
│   │   │       └── traces/
│   │   └── SES_20260727_143052_PAYMENT/            ← Session Agent 2 (độc lập)
│   │       └── ...
│   └── qc-specs/
│       ├── .locks/
│       │   └── KB_MERGE.lock   ← Tạm thời khi 1 agent đang merge
│       ├── logs/
│       │   ├── LOG_ORDER_SES_20260727_143000.md   ← Log riêng session 1
│       │   └── LOG_PAYMENT_SES_20260727_143052.md ← Log riêng session 2
│       ├── 00_BUSINESS_DICTIONARY.md
│       ├── 02_REQUIREMENTS_BASELINE.md
│       └── FEATURE_SPECS/
│           ├── QC_SPEC_ORDER_v1.0.md
│           └── QC_SPEC_PAYMENT_v1.0.md
└── e2e/
    ├── .auth/                                      ← Auth storage states (git-ignored)
    │   ├── admin.json
    │   ├── manager.json
    │   └── staff.json
    ├── config/
    │   ├── auth-roles.json                         ← (git-ignored)
    │   └── sso-config.json                         ← (git-ignored)
    ├── global-setup.ts
    ├── playwright.config.ts
    ├── pages/                                      ← POM classes
    │   ├── OrderPage.ts
    │   └── PaymentPage.ts
    └── features/                                   ← Spec files
        ├── order/
        │   └── order.spec.ts
        └── payment/
            └── payment.spec.ts
```
