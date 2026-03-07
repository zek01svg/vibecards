import { expect, test } from "@playwright/test";

test.describe("Landing page", () => {
  test("should have complete elements", async ({ page }) => {
    await page.goto("/");

    // header
    await page
      .locator("div")
      .filter({ hasText: /^VibeCards$/ })
      .click();
    await expect(page.getByRole("link", { name: "VibeCards" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Light theme" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "System theme" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Dark theme" }),
    ).toBeVisible();

    // cta
    await expect(page.getByText("Transform your topics into")).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("No credit card required. Free")).toBeVisible();

    // feature cards
    await expect(page.locator("body")).toContainText("AI Magic");
    await expect(page.locator("body")).toContainText(
      "Gemini transforms your messy notes into perfect study decks in milliseconds.",
    );
    await expect(page.locator("body")).toContainText("Vibe Study");
    await expect(page.locator("body")).toContainText(
      "A focused, premium study mode designed for flow and maximum retention.",
    );
    await expect(page.locator("body")).toContainText("Instant Sync");
    await expect(page.locator("body")).toContainText(
      "Your decks are everywhere you are. Mobile, desktop, or in-class. Always ready.",
    );
    await expect(page.locator("body")).toContainText("Pro Organization");
    await expect(page.locator("body")).toContainText(
      "Tag, filter, and search through thousands of cards with lightning speed.",
    );

    // footer
    await expect(
      page.getByRole("contentinfo").getByText("VibeCards"),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Terms" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "GitHub Repository" }),
    ).toBeVisible();
  });
});
