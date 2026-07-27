import { test as setup, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * 🔐 UNIVERSAL AUTH & USER SWITCHING SETUP FOR FTMS / ENTERPRISE APPS
 * 
 * Kịch bản xác thực 4 Tầng (4-Tier Auth Fallback Flow):
 * Tầng 1: MOCK Mode -> Tự động nạp Fake Token nếu IS_MOCK=true
 * Tầng 2: REAL TOKEN Mode -> Dùng token trực tiếp từ biến môi trường E2E_REAL_TOKEN
 * Tầng 3: API Test Endpoint Auth -> Gọi API backend test endpoint để lấy JWT token tốc độ cao (không cần UI)
 * Tầng 4: Fallback FPT SSO + OTP -> Tự động đăng nhập qua trang SSO fpt.net với OTP tĩnh (ví dụ: ISC22QC) hoặc chờ nhập OTP thật
 * 
 * Hỗ trợ Sinh Auth State cho từng Role trong users.real.json để Chuyển đổi tài khoản (User Switching).
 */

// Đọc cấu hình danh sách người dùng từ users.real.json
const USERS_CONFIG_PATH = path.join(__dirname, "../config/users.real.json");
const AUTH_DIR = path.join(__dirname, "../playwright/.auth");

const defaultUsers = {
  salesman: { username: "TuanHP3", email: "tuanhp3@fpt.com" },
  system_admin: { username: "longht17", email: "longht17@fpt.com" }
};

function getUsersConfig() {
  if (fs.existsSync(USERS_CONFIG_PATH)) {
    try {
      const raw = fs.readFileSync(USERS_CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      return parsed.users || defaultUsers;
    } catch {
      return defaultUsers;
    }
  }
  return defaultUsers;
}

setup("authenticate-all-roles", async ({ page, request }) => {
  // Đảm bảo thư mục lưu trữ auth state tồn tại
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const IS_MOCK = process.env.IS_MOCK === "true" || process.env.PLAYWRIGHT_MODE === "mock";
  const realToken = process.env.E2E_REAL_TOKEN;
  const baseUrl = process.env.BASE_URL || "http://localhost:8082";
  const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:44313";
  const otpCode = process.env.E2E_OTP || "ISC22QC";

  // TẦNG 1: MOCK Mode -> Ghi cookie giả lập cho tất cả roles
  if (IS_MOCK) {
    console.log(">>> [E2E Auth Setup] 🎭 Chế độ MOCK. Đang khởi tạo session test giả lập cho các roles...");
    const users = getUsersConfig();
    for (const [roleKey, user] of Object.entries(users)) {
      const roleAuthFile = path.join(AUTH_DIR, `${roleKey}.json`);
      const mockState = {
        cookies: [
          {
            name: "access_token",
            value: `mock-token-${user.username}`,
            domain: "localhost",
            path: "/",
            expires: -1,
            httpOnly: false,
            secure: false,
            sameSite: "Lax"
          }
        ],
        origins: [
          {
            origin: baseUrl,
            localStorage: [
              { name: "ACCESS_TOKEN", value: `mock-token-${user.username}` },
              { name: "CURRENT_USER", value: JSON.stringify(user) }
            ]
          }
        ]
      };
      fs.writeFileSync(roleAuthFile, JSON.stringify(mockState, null, 2));
    }
    // Ghi mặc định vào user.json (cho testcase đơn)
    fs.copyFileSync(path.join(AUTH_DIR, "system_admin.json"), path.join(AUTH_DIR, "user.json"));
    console.log(">>> [E2E Auth Setup] ✅ Đã khởi tạo xong MOCK Session cho toàn bộ roles!");
    return;
  }

  // TẦNG 2: REAL TOKEN Mode -> Dùng token trực tiếp từ biến môi trường
  if (realToken) {
    console.log(">>> [E2E Auth Setup] 🔑 Chế độ REAL TOKEN. Ghi token từ E2E_REAL_TOKEN...");
    const defaultAuthFile = path.join(AUTH_DIR, "user.json");
    const realState = {
      cookies: [
        {
          name: "access_token",
          value: realToken,
          domain: "localhost",
          path: "/",
          expires: -1,
          httpOnly: false,
          secure: false,
          sameSite: "Lax"
        }
      ],
      origins: [
        {
          origin: baseUrl,
          localStorage: [{ name: "ACCESS_TOKEN", value: realToken }]
        }
      ]
    };
    fs.writeFileSync(defaultAuthFile, JSON.stringify(realState, null, 2));
    console.log(">>> [E2E Auth Setup] ✅ Đã lưu session từ E2E_REAL_TOKEN thành công!");
    return;
  }

  // TẦNG 3: API Test Endpoint Auth -> Gọi API test backend lấy JWT token từng role
  const users = getUsersConfig();
  let apiAuthSuccessCount = 0;

  console.log(">>> [E2E Auth Setup] ⚡ Chế độ REAL API Auth: Đang lấy token trực tiếp từ Backend API...");

  for (const [roleKey, user] of Object.entries(users)) {
    const roleEmail = user.email || `${user.username.toLowerCase()}@fpt.com`;
    const roleAuthFile = path.join(AUTH_DIR, `${roleKey}.json`);

    try {
      const response = await fetch(`${apiBaseUrl}/api/am/auth/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: roleEmail, username: user.username })
      });

      if (response.ok) {
        const resBody = await response.json();
        const token = resBody.data?.accessToken || resBody.token;

        if (token) {
          console.log(`   [Role: ${roleKey}] ✅ Lấy token thành công cho user: ${user.username} (${roleEmail})`);
          const roleState = {
            cookies: [
              {
                name: "access_token",
                value: token,
                domain: "localhost",
                path: "/",
                expires: -1,
                httpOnly: false,
                secure: false,
                sameSite: "Lax"
              }
            ],
            origins: [
              {
                origin: baseUrl,
                localStorage: [{ name: "ACCESS_TOKEN", value: token }]
              }
            ]
          };
          fs.writeFileSync(roleAuthFile, JSON.stringify(roleState, null, 2));
          apiAuthSuccessCount++;
          continue;
        }
      }
    } catch (error) {
      console.warn(`   [Role: ${roleKey}] ⚠️ Gọi API test không thành công, sẽ fallback SSO:`, error.message);
    }
  }

  if (apiAuthSuccessCount > 0) {
    // Copy admin hoặc role đầu tiên làm mặc định cho user.json
    const defaultRoleFile = fs.existsSync(path.join(AUTH_DIR, "system_admin.json"))
      ? path.join(AUTH_DIR, "system_admin.json")
      : path.join(AUTH_DIR, `${Object.keys(users)[0]}.json`);
    fs.copyFileSync(defaultRoleFile, path.join(AUTH_DIR, "user.json"));
    console.log(`>>> [E2E Auth Setup] 🚀 Thành công lấy API Token cho ${apiAuthSuccessCount}/${Object.keys(users).length} roles!`);
    return;
  }

  // TẦNG 4: Fallback FPT SSO + OTP -> Tự động đăng nhập qua trang SSO fpt.net với OTP
  console.log(">>> [E2E Auth Setup] 🌐 Fallback: Tiến hành Đăng nhập tự động bằng FPT SSO & OTP...");

  const adminUser = users.system_admin || users.salesman || Object.values(users)[0];
  const targetEmail = adminUser.email || `${adminUser.username.toLowerCase()}@fpt.com`;

  await page.goto(`${baseUrl}/am/review-request/create`);

  // Đợi chuyển hướng sang trang đăng nhập SSO fpt.net
  await page.waitForURL((u) => u.host.includes("fpt.net") && u.pathname.includes("/login"));

  // 1. Chọn phương thức "Sử dụng mật khẩu một lần (OTP)"
  await page.getByText("Sử dụng mật khẩu một lần (OTP)").click();

  // 2. Nhập Email
  await page.getByPlaceholder("Nhập email để tiếp tục").fill(targetEmail);
  await page.getByRole("button", { name: "TIẾP THEO" }).click();

  // 3. Nhập mã OTP xác thực tĩnh (hoặc từ env)
  await page.getByPlaceholder("Vui lòng nhập xác thực đã được gửi qua email").fill(otpCode);
  await page.getByRole("button", { name: "ĐĂNG NHẬP" }).click();

  // 4. Chờ chuyển hướng thành công về ứng dụng và hiển thị trang chính
  console.log(">>> [E2E Auth Setup] Đang đợi chuyển hướng về ứng dụng...");
  const profileDropdown = page.locator(".ant-dropdown-trigger").first();
  try {
    await expect(profileDropdown).toBeVisible({ timeout: 8000 });
  } catch {
    console.log(">>> [E2E Auth Setup] ⚠️ Đăng nhập tự động bằng OTP mặc định thất bại hoặc chậm.");
    console.log(">>> [E2E Auth Setup] ⏳ Vui lòng nhập OTP thật vào trình duyệt nếu đang chạy UI Mode (Chờ tối đa 60 giây)...");
    await expect(profileDropdown).toBeVisible({ timeout: 60000 });
  }

  await page.waitForLoadState("domcontentloaded");

  // 5. Lưu trạng thái đăng nhập
  const defaultAuthFile = path.join(AUTH_DIR, "user.json");
  await page.context().storageState({ path: defaultAuthFile });
  console.log(">>> [E2E Auth Setup] 🎉 Đăng nhập SSO thành công và đã lưu session vào user.json!");
});
