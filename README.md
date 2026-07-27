# 🤖 AI QC Playwright Pipeline — Universal Automation Testing Kit (v2.4)

> **Bộ công cụ kiểm thử tự động đa luồng AI Agent dành cho mọi dự án phần mềm.**
> Hỗ trợ chạy song song nhiều AI Agent không conflict, chẩn đoán môi trường tự động, cô lập hoàn toàn theo session, sẵn sàng xác thực FTMS, chuyển đổi vai trò (User Switching), đóng vết bug hai chiều (Dev ↔ QC) và xem replay E2E UI trực quan.

---

## 📦 Giới thiệu

**AI QC Playwright Pipeline** là một bộ skill chuyên biệt dành cho **AI Coding Agents** (Antigravity, Claude, Gemini...) để tự động hóa toàn bộ quy trình kiểm thử phần mềm từ phân tích nghiệp vụ đến chạy test E2E — không cần viết code thủ công.

### ✨ Điểm nổi bật phiên bản v2.4:
- 🎭 **Step 0 Environment Auto-Diagnostics & Setup Gate** — Tự động kiểm tra Node.js, Playwright packages, Browser Binaries, Proxy/VPN, Ports, WebServer, và tự động tối ưu `playwright.config.ts` không phá vỡ dự án.
- 🔀 **Multi-Agent Safe & Modular Execution** — Phân nhỏ 5 skills độc lập. Nhiều AI chạy song song cho các tính năng khác nhau, không conflict.
- 📊 **Team Progress Dashboard** — Sau mỗi bước, AI tự động xuất bản tin Dashboard minh bạch: *Đã hoàn thành gì? File tạo ra nằm ở đâu? Bước tiếp theo làm gì?*
- 🔄 **Closed-Loop Dev-QC Bug Lifecycle** — Quản lý vòng đời Bug hai chiều (`[NEW_BUG]` ➔ `[RESOLVED_BY_DEV]` ➔ `[RECHECKING]` ➔ `[CLOSED_VERIFIED]`). AI Dev sửa code ➔ AI QC tự động recheck và đóng vết bug.
- 🖥️ **Interactive Visual E2E Replay (`--ui`)** — Tự động sinh lệnh Terminal chuẩn trong mọi file Report và Dashboard để User/QC/Dev tự mở Playwright UI xem lại màn hình test thực tế mà AI đã chạy.
- 🔐 **4-Tier FTMS Auth Setup** — Mock Mode → Real Token → API Test Endpoint → Fallback FPT SSO OTP (ISC22QC).
- 👥 **Multi-Role User Switching** — Tích hợp `users.real.json` để chuyển đổi vai trò (Salesman, Leader, Legal, Signer...) ngay trong kịch bản test.

---

## 🗂️ Cấu trúc thư mục

```
ai-qc-playwright-pipeline/
├── 📄 README.md                          ← File này — Tổng quan & Quickstart v2.4
├── 📄 USAGE_GUIDE.md                     ← Hướng dẫn chi tiết + Prompt mẫu & FTMS Guide
├── 📄 .gitignore                         ← Loại bỏ secrets & auth tokens
├── 📁 docs/
│   ├── SSO_LOGIN_FLOW.md                 ← Tài liệu kỹ thuật: FTMS Auth, FPT SSO & User Switching
│   ├── WORKFLOW_DIAGRAM.md               ← Sơ đồ luồng 5 bước & Bug Lifecycle chi tiết
│   └── SKILL_REFERENCE.md                ← Tham chiếu đầy đủ 5 skills & tham số
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
└── 📁 skills/                            ← 🤖 5 AI Skill chuyên biệt
    ├── qc-pipeline-orchestrator/         ← Master Orchestrator (Điều phối 5 bước)
    ├── ai-playwright-environment-engineer/← Step 0: Auto-Diagnostics & Setup Gate
    ├── ai-qa-lead/                       ← Step 1: Phân tích URD & QC Spec
    ├── ai-testcase-generator/            ← Step 2: Sinh testcase Markdown
    ├── ai-playwright-spec-builder/       ← Step 3: Sinh code Playwright (POM & User Switching)
    └── ai-playwright-test-runner/        ← Step 4: Run test, Self-Heal, QC Report, Auto Update Testcase & Bug Lifecycle
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
Mở `e2e/config/users.real.json` và cập nhật thông tin tài khoản test cho các vai trò trong dự án.

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
Hãy dùng skill qc-pipeline-orchestrator để kiểm thử tính năng "Duyệt phiếu hợp đồng" của dự án.
```

---

## 🔄 Luồng hoạt động 5 Bước (Modular Pipeline)

```
User yêu cầu kiểm thử tính năng X
        ↓
[Bước -1] Orchestrator sinh SESSION_ID duy nhất & Đăng ký REGISTRY
        ↓
[Step 0] ai-playwright-environment-engineer ➔ Chẩn đoán môi trường Node, Packages, Browsers, Proxy
        ↓  (In Team Progress Dashboard #0)
[Step 1] ai-qa-lead ➔ Phân tích URD → QC Spec (KB Lock khi merge)
        ↓  (In Team Progress Dashboard #1)
[Step 2] ai-testcase-generator ➔ QC Spec → testcase.md
        ↓  (In Team Progress Dashboard #2)
[Step 3] ai-playwright-spec-builder ➔ Đọc users.real.json → POM + *.spec.ts (User Switching)
        ↓  (In Team Progress Dashboard #3)
[Step 4] ai-playwright-test-runner ➔ Run REAL mode → Self-Heal → QC_REPORT_R<N>.md (Lệnh --ui) ➔ Auto Update testcase.md ➔ BUG-*.md (Dev-QC Lifecycle)
        ↓  (In Team Progress Dashboard #4)
Output: QC_REPORT_R<N>.md, 02_testcase.md (Certified PASS), BUG-*.md, Traces trong session riêng
```

---

## 📚 Tài liệu thêm

- 📖 [USAGE_GUIDE.md](./USAGE_GUIDE.md) — Hướng dẫn chi tiết + Prompt mẫu v2.4 & FTMS User Switching
- 🔐 [docs/SSO_LOGIN_FLOW.md](./docs/SSO_LOGIN_FLOW.md) — Cấu hình xác thực FTMS, 4-Tier Auth Setup, FPT SSO OTP & User Switching
- 📊 [docs/WORKFLOW_DIAGRAM.md](./docs/WORKFLOW_DIAGRAM.md) — Sơ đồ luồng 5 bước & Closed-Loop Bug Lifecycle
- 📎 [docs/SKILL_REFERENCE.md](./docs/SKILL_REFERENCE.md) — Tham chiếu đầy đủ 5 skills & tham số

---

*Phiên bản: 2.4 — Universal, Multi-Agent Safe & Closed-Loop Edition*
*Tương thích: Antigravity AI Agent, Claude Code, Cursor AI*
