import path from "path";
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true });

export default defineConfig({
  testDir: "./tests/e2e",
  // Run tests in parallel for speed
  fullyParallel: true,
  // Fail CI if test.only is accidentally left in
  forbidOnly: !!process.env.CI,
  // Retry failed tests (2x in CI, 1x locally for flake detection)
  retries: process.env.CI ? 2 : 1,
  // Concurrency (limited in CI for stability, full speed locally)
  workers: process.env.CI ? 1 : 4,
  // Keep the dot reporter; add HTML report for detailed post-run analysis
  reporter: "dot",
  // Folder for test artifacts (screenshots, videos, traces)
  outputDir: "playwright/test-results",

  // Assertion-level expect configuration
  expect: {
    // Max time an expect() call waits for condition (10s)
    timeout: 10_000,
    toHaveScreenshot: {
      // Allow up to 100 differing pixels for visual regression tolerance
      maxDiffPixels: 100,
    },
  },

  use: {
    baseURL:
      process.env.NODE_ENV === "production" && !process.env.CI
        ? "https://vibecards-v2.vercel.app"
        : "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "en-SG",
    timezoneId: "Asia/Singapore",
    ignoreHTTPSErrors: true,
  },

  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
