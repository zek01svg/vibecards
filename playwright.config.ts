import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI if your resources are limited, otherwise default to undefined (max workers) */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. CI likes 'blob' or 'github', Local likes 'html' */
  reporter: process.env.CI ? "blob" : "html",

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See "Best Practices" below. */
    trace: "on-first-retry",

    /* Capture screenshot only on failure */
    screenshot: "only-on-failure",

    /* Capture video only on failure to save disk space */
    video: "retain-on-failure",

    /* Set a consistent viewport for reproducibility */
    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit", // Safari engine
      use: { ...devices["Desktop Safari"] },
    },
    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["iPhone 15 Pro Max"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["iPhone 15 Pro"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
