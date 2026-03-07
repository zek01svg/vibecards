import { expect, test } from "@playwright/test";

test("auth boundaries protect routes", async ({ page, context }) => {
  await context.clearCookies();

  await page.goto("/dashboard");
  await page.waitForURL(/.*\/sign-in/);
  await expect(page.locator("form")).toBeVisible();

  await page.goto("/my-decks");
  await page.waitForURL(/.*\/sign-in/);
});
