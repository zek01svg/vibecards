import { env } from "@/lib/env";
import { expect, test } from "@playwright/test";

test("login via test endpoint redirects to dashboard", async ({ page }) => {
  // Use page.request to perform the login so cookies are shared with the browser context
  await page.request.post("/api/test-login", {
    data: {
      email: env.TEST_EMAIL,
      password: env.TEST_PASSWORD,
    },
  });

  // Navigate the page to the dashboard to verify the session
  await page.goto("/dashboard");

  // Verify the URL is correct (logged in)
  await expect(page).toHaveURL("/dashboard");
});
