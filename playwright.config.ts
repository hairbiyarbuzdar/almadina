import { defineConfig, devices } from "@playwright/test";

const database = process.env.TEST_DATABASE_URL;
if (!database || !["localhost", "127.0.0.1"].includes(new URL(database).hostname) || !new URL(database).pathname.endsWith("_test")) {
  throw new Error("Set TEST_DATABASE_URL to an isolated local database ending in _test.");
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 90000,
  expect: { timeout: 15000 },
  use: {
    baseURL: "http://127.0.0.1:3001",
    actionTimeout: 15000,
    launchOptions: process.platform === "win32" ? { executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" } : {},
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: [{
    command: "node tests/storage-server.mjs",
    url: "http://127.0.0.1:55440/health",
    reuseExistingServer: !process.env.CI,
  }, {
    command: "npm run dev -- --port 3001 --hostname 127.0.0.1",
    url: "http://127.0.0.1:3001/shop",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      DATABASE_URL: database, DIRECT_URL: database, SESSION_SECRET: "almadina-local-variation-test-session-secret-only",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:55440", SUPABASE_SECRET_KEY: "local-test-storage-key",
    },
  }],
});
