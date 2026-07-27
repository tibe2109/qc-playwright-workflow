# 🤖 AI QC Playwright Pipeline — Universal Automation Testing Kit

> **Bộ công cụ kiểm thử tự động đa luồng AI Agent dành cho mọi dự án phần mềm.**
> Hỗ trợ chạy song song nhiều AI Agent không conflict, cô lập hoàn toàn theo session, sẵn sàng xác thực FTMS & Chuyển đổi vai trò (User Switching).

---

## 📦 Giới thiệu

**AI QC Playwright Pipeline** là một bộ skill chuyên biệt dành cho **AI Coding Agents** (Antigravity, Claude, Gemini...) để tự động hóa toàn bộ quy trình kiểm thử phần mềm từ phân tích nghiệp vụ đến chạy test E2E — không cần viết code thủ công.

### ✨ Điểm nổi bật:
- 🔀 **Multi-Agent Safe** — Nhiều AI chạy song song cho các tính năng khác nhau, không conflict
- 🔒 **Session Isolation** — Mỗi luồng test có thư mục riêng, log riêng, output riêng
- 🔐 **4-Tier FTMS Auth Setup** — Mock Mode → Real Token → API Test Endpoint → Fallback FPT SSO OTP (ISC22QC)
- 👥 **Multi-Role User Switching** — Tích hợp `users.real.json` để chuyển đổi vai trò (Salesman, Leader, Legal, Signer...) ngay trong kịch bản test
- 🌐 **Universal** — Áp dụng cho mọi dự án: Web App, API, ERP, FinTech, E-Commerce, FTMS...
- 🔧 **Self-Healing** — Test runner tự sửa lỗi script và chạy lại tự động
- 📊 **8-Pillar Quality Matrix** — Bao phủ 100% góc độ kiểm thử: Functional, Security, Boundary, Race Condition...

---

## 🗂️ Cấu trúc thư mục

```
ai-qc-playwright-pipeline/
├── 📄 README.md                          ← File này — Tổng quan & Quickstart
├── 📄 USAGE_GUIDE.md                     ← Hướng dẫn chi tiết + Prompt mẫu & FTMS Guide
├── 📄 .gitignore                         ← Loại bỏ secrets & auth tokens
├── 📁 docs/
│   ├── SSO_LOGIN_FLOW.md                 ← Tài liệu kỹ thuật: FTMS Auth, FPT SSO & User Switching
│   ├── WORKFLOW_DIAGRAM.md               ← Sơ đồ luồng hoạt động chi tiết
│   └── SKILL_REFERENCE.md               ← Tham chiếu đầy đủ các skill & tham số
├── 📁 config/
│   ├── pipeline.config.json              ← ⚙️ Cấu hình chính (PHẢI chỉnh trước khi dùng)
│   ├── users.real.json                   ← 👥 Cấu hình tài khoản & Role Matrix chuẩn FTMS / Enterprise
│   ├── users.real.template.json          ← 👥 Template cấu hình tài khoản & Role Matrix
│   ├── auth-roles.template.json          ← 👤 Template cấu hình User & Role chung
│   └── sso-config.template.json          ← 🔐 Template cấu hình SSO/Login
├── 📁 templates/
│   ├── auth.setup.ts                     ← ⚡ File Playwright Auth Setup 4 Tầng chuẩn (Mock, Token, API, SSO OTP)
│   ├── SESSION_CONTEXT.template.json     ← Template ngữ cảnh session
│   └── REGISTRY.template.json            ← Template registry đa session
├── 📁 sessions/                          ← 🔄 Thư mục runtime (tự động tạo)
│   ├── REGISTRY.json                     ← Theo dõi tất cả sessions đang chạy
│   └── SES_<ID>/                         ← Session riêng của từng AI Agent
└── 📁 skills/                            ← 🤖 Các AI Skill chuyên biệt
    ├── qc-pipeline-orchestrator/         ← Skill điều phối pipeline chính
    ├── ai-qa-lead/                       ← Skill phân tích nghiệp vụ QA
    ├── ai-testcase-generator/            ← Skill sinh testcase từ spec
    ├── ai-playwright-spec-builder/       ← Skill sinh code Playwright (Hỗ trợ User Switching)
    └── ai-playwright-test-runner/        ← Skill chạy test & self-healing
```

---

## ⚡ Quickstart (5 bước)

### Bước 1: Cài đặt vào dự án
```bash
# Copy thư mục này hoặc từng phần vào dự án của bạn
cp -r ai-qc-playwright-pipeline/skills/* /path/to/your-project/.agents/skills/
cp ai-qc-playwright-pipeline/config/pipeline.config.json /path/to/your-project/.agents/skills/
cp ai-qc-playwright-pipeline/config/users.real.json /path/to/your-project/e2e/config/users.real.json
cp ai-qc-playwright-pipeline/templates/auth.setup.ts /path/to/your-project/e2e/auth.setup.ts
```

### Bước 2: Cấu hình project
Mở `config/pipeline.config.json` và điền các đường dẫn của dự án:
```json
{
  "projectName": "Tên dự án của bạn",
  "isDefaultLocked": false
}
```
> 💡 Với `isDefaultLocked: false`, AI sẽ hỏi bạn từng đường dẫn khi chạy lần đầu.

### Bước 3: Cấu hình tài khoản test & Roles
Mở `e2e/config/users.real.json` và cập nhật thông tin tài khoản test cho các vai trò trong dự án (salesman, sales_leader, legal_assignor, legal_reviewer, deputy_signer, system_admin...).

### Bước 4: Tích hợp `auth.setup.ts` vào `playwright.config.ts`
Trong `playwright.config.ts`, khai báo `setup` project để nạp tự động token cho các roles:
```typescript
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup'],
  },
]
```

### Bước 5: Chạy pipeline với AI Agent
Nói với AI Agent của bạn:
```
Hãy dùng skill qc-pipeline-orchestrator để kiểm thử tính năng "Duyệt phiếu hợp đồng" của dự án FTMS.
Sử dụng e2e/config/users.real.json để sinh kịch bản chuyển đổi vai trò (User Switching).
```

---

## 🔄 Luồng hoạt động tổng quan

```
User yêu cầu kiểm thử tính năng X (ví dụ: Quy trình duyệt hợp đồng 3 phòng ban)
        ↓
[Bước -1] Orchestrator sinh SESSION_ID duy nhất
        ↓
[Skill 1] AI QA Lead phân tích URD → tạo QC Spec (bao gồm RBAC Matrix)
        ↓  (KB Lock khi merge knowledge base)
[Skill 2] AI Testcase Generator → sinh testcase.md
        ↓
[Skill 3] AI Playwright Spec Builder → Đọc users.real.json → sinh POM + *.spec.ts (User Switching)
        ↓
[Skill 4] AI Test Runner → Chạy test (auth.setup.ts 4-tier auth) → Self-Healing → Bug Reports
        ↓
Output: QC_REPORT, BUG-*.md, Traces trong session riêng
```

---

## 📚 Tài liệu thêm

- 📖 [USAGE_GUIDE.md](./USAGE_GUIDE.md) — Hướng dẫn chi tiết + Prompt mẫu cho từng tình huống & FTMS User Switching
- 🔐 [docs/SSO_LOGIN_FLOW.md](./docs/SSO_LOGIN_FLOW.md) — Cấu hình xác thực FTMS, 4-Tier Auth Setup, FPT SSO OTP & User Switching
- 📊 [docs/WORKFLOW_DIAGRAM.md](./docs/WORKFLOW_DIAGRAM.md) — Sơ đồ luồng hoạt động
- 📎 [docs/SKILL_REFERENCE.md](./docs/SKILL_REFERENCE.md) — Tham chiếu skill đầy đủ

---

*Phiên bản: 2.0 — Universal & FTMS Multi-Agent Safe Edition*
*Tương thích: Antigravity AI Agent, Claude Code, Cursor AI*
