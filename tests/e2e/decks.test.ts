import { env } from "@/lib/env";
import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test.skip(!env.TEST_EMAIL || !env.TEST_PASSWORD, "Requires TEST_EMAIL and TEST_PASSWORD for authenticated deck flows");
  test("Generation, Study, and Deletion Flow", async ({ page }) => {
    await test.step("Navigate to Dashboard and check form elements", async () => {
      await page.goto("/dashboard");

      await expect(
        page.getByRole("heading", { name: "Generate New Deck" }),
      ).toBeVisible();
      await expect(page.getByText("Transform any topic into a")).toBeVisible();
      await expect(page.getByText("Topic or Notes")).toBeVisible();
      await expect(
        page.getByRole("textbox", { name: "Topic or Notes" }),
      ).toBeVisible();
      await expect(page.getByText("Detailed topics result in")).toBeVisible();
      await expect(page.getByText("Difficulty Level")).toBeVisible();
      await expect(
        page.getByRole("combobox", { name: "Difficulty Level" }),
      ).toBeVisible();
      await expect(page.getByText("Balanced complexity with")).toBeVisible();
      await expect(page.getByText("/ 500")).toBeVisible();
      await expect(page.getByText("Number of Cards")).toBeVisible();
      await expect(
        page.getByRole("combobox", { name: "Number of Cards" }),
      ).toBeVisible();
      await expect(
        page.getByText("Optimal for manageable study"),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Generate My Deck" }),
      ).toBeVisible();
    });

    await test.step("Generate a new deck", async () => {
      await page
        .getByRole("textbox", { name: "Topic or Notes" })
        .fill("the recently declassified albatross files in singapore");
      await page.getByRole("button", { name: "Generate My Deck" }).click();

      // Wait for navigation to the specific dynamic deck view URL
      await page.waitForURL(/\/deck\/.+/);
    });

    await test.step("Verify deck view", async () => {
      await expect(
        page.getByRole("link", { name: "Study Mode" }),
      ).toBeVisible();
      await expect(page.getByRole("link", { name: "View All" })).toBeVisible();

      await expect(page.locator(".text-card-foreground").first()).toBeVisible();
      await expect(page.getByText("Prompt").first()).toBeVisible();
      await expect(page.getByText("Explanation").first()).toBeVisible();
    });

    await test.step("Explore Study Mode", async () => {
      await page.getByRole("link", { name: "Study Mode" }).click();
      await expect(page.locator("body")).toContainText("Card 1 of");
      await expect(page.locator("body")).toContainText("0% Complete");
      await expect(page.locator("body")).toContainText("PROMPT");
      await expect(page.locator("body")).toContainText("Click to flip");
      await expect(
        page.getByRole("button", { name: "Reveal Answer SPACE" }),
      ).toBeVisible();
      await expect(page.getByText("Shortcuts:")).toBeVisible();
      await expect(page.getByText("SPACE Flip")).toBeVisible();
      await expect(page.getByText("→")).toBeVisible();
      await expect(page.getByText("←→ Nav")).toBeVisible();
      await expect(page.getByText("1 Correct")).toBeVisible();
      await expect(page.getByText("Incorrect")).toBeVisible();

      // Navigate to next card
      await page.getByRole("button").filter({ hasText: /^$/ }).nth(5).click();
      await expect(page.getByText("Card 2 of")).toBeVisible();
    });

    await test.step("View My Decks", async () => {
      await page.getByRole("button", { name: "My Decks" }).click();

      // Wait for navigation
      await page.waitForURL(/.*\/my-decks/);

      await expect(
        page.getByRole("heading", { name: "Your Decks" }),
      ).toBeVisible();
      await expect(page.getByText("Browse and manage your")).toBeVisible();
      await expect(
        page.getByRole("textbox", { name: "Search your decks..." }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "all" })).toBeVisible();
      await expect(page.getByRole("button", { name: "recent" })).toBeVisible();
      await expect(
        page.getByRole("button", { name: "favorites" }),
      ).toBeVisible();

      await expect(
        page.getByText("Cards").filter({ hasText: "Cards" }).first(),
      ).toBeVisible();
      // Locate the delete button on the card
      await expect(
        page
          .locator("button")
          .filter({ has: page.locator(".lucide-trash-2") })
          .first(),
      ).toBeVisible();
    });

    await test.step("Delete Deck", async () => {
      await page
        .locator("button")
        .filter({ has: page.locator(".lucide-trash-2") })
        .first()
        .click();

      await expect(
        page.getByRole("heading", { name: "Are you sure?" }),
      ).toBeVisible();
      await expect(
        page.getByText("This action cannot be undone"),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();

      await page.getByRole("button", { name: "Delete" }).click();

      // toast
      await expect(page.getByText("Deck deleted successfully")).toBeVisible();
    });
  });
});
