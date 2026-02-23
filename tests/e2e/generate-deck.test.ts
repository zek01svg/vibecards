import { env } from "@/lib/env";
import { expect, test } from "@playwright/test";

test("generate deck", async ({ page }) => {
  await page.request.post("/api/test-login", {
    data: {
      email: env.TEST_EMAIL,
      password: env.TEST_PASSWORD,
    },
  });

  // Navigate the page to the dashboard to verify the session
  await page.goto("/dashboard");

  await page.getByRole("button", { name: "Dark theme" }).click();
  const html = page.locator("html");
  await expect(html).toHaveClass("dark");

  await page.getByRole("button", { name: "Light theme" }).click();
  await expect(html).toHaveClass("light");

  // generate deck form
  await expect(page.getByRole("heading")).toContainText("Generate New Deck");
  await expect(page.locator("section")).toContainText(
    "Transform any topic into a study deck.",
  );
  await expect(page.locator("form")).toContainText("Topic or Notes");
  await expect(
    page.getByRole("textbox", { name: "Topic or Notes" }),
  ).toBeVisible();
  await expect(page.locator("form")).toContainText(
    "Detailed topics result in better cards.",
  );

  // dropdowns
  await expect(
    page.getByRole("combobox", { name: "Difficulty Level" }),
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Number of Cards" }),
  ).toBeVisible();

  // generate button
  await expect(
    page.getByRole("button", { name: "Generate My Deck" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Topic or Notes" })
    .fill("playwright e2e testing");
  await expect(page.locator("form")).toContainText("22 / 500");
  await page.getByRole("button", { name: "Generate My Deck" }).click();

  // wait for url to change to deck page
  await page.waitForURL(/\/deck\/.+/);

  await expect(page.getByRole("link", { name: "Study Mode" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View All" })).toBeVisible();
  await expect(page.getByText("Prompt").first()).toBeVisible();
  await expect(page.getByText("Explanation").first()).toBeVisible();

  // go to my decks
  await page.getByRole("button", { name: "My Decks" }).click();

  // wait for url to change to my decks page
  await page.waitForURL(/my-decks/);
  await expect(page.getByRole("heading")).toContainText("Your Decks");
  await expect(page.locator("section")).toContainText(
    "Browse and manage your personalized study collections.",
  );
  await expect(page.getByRole("heading")).toContainText("Your Decks");
  await expect(page.locator("section")).toContainText(
    "Browse and manage your personalized study collections.",
  );
  await expect(
    page.getByRole("textbox", { name: "Search your decks..." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "all" })).toBeVisible();
  await expect(page.getByRole("button", { name: "recent" })).toBeVisible();
  await expect(page.getByRole("button", { name: "favorites" })).toBeVisible();
});
