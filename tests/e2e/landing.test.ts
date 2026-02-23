import { expect, test } from "@playwright/test";

test("landing page", async ({ page }) => {
  await page.goto("/");

  // header
  await expect(page.getByRole("navigation")).toContainText("VibeCards");
  await expect(page.getByRole("button", { name: "Generate" })).toBeVisible();
  await expect(page.getByRole("button", { name: "My Decks" })).toBeVisible();

  // theme toggle
  await expect(page.getByRole("button", { name: "Light theme" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "System theme" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Dark theme" })).toBeVisible();

  // hero section
  await expect(
    page.getByRole("heading", { name: "Master Any Topic in Seco|" }),
  ).toBeVisible();
  await expect(page.locator("body")).toContainText(
    "Transform your topics into comprehensive study decks instantly.Powered by Google Gemini.",
  );
  await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();
  await expect(page.locator("body")).toContainText(
    "No credit card required. Free forever for students.",
  );

  // feature cards
  await expect(page.getByText("AI MagicGemini transforms")).toBeVisible();
  await expect(page.getByText("Vibe StudyA focused, premium")).toBeVisible();
  await expect(page.getByText("Instant SyncYour decks are")).toBeVisible();
  await expect(page.getByText("Pro OrganizationTag, filter,")).toBeVisible();
});
