import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  test("auth boundaries protect routes", async ({ page, context }) => {
    await test.step("Clear session", async () => {
      await context.clearCookies();
    });

    await test.step("Verify dashboard redirect", async () => {
      await page.goto("/dashboard");
      await page.waitForURL(/.*\/sign-in/);
      await expect(page.locator("form")).toBeVisible();
    });

    await test.step("Verify my-decks redirect", async () => {
      await page.goto("/my-decks");
      await page.waitForURL(/.*\/sign-in/);
    });
  });

  test("Sign In Flow", async ({ page, context }) => {
    // simulate unauthenticated user
    await context.clearCookies();

    await test.step("Navigate to login", async () => {
      await page.goto("/");
      await page.getByRole("link", { name: "Sign In" }).click();
    });

    await test.step("Validate login page elements", async () => {
      await expect(page.getByText("Welcome Back")).toBeVisible();
      await expect(
        page.getByText("Enter your email to receive a"),
      ).toBeVisible();
      await expect(page.getByText("Email Address")).toBeVisible();
      await expect(
        page.getByRole("textbox", { name: "Email Address" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Login with Email" }),
      ).toBeVisible();

      await expect(page.getByText("Or continue with")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Continue with Google" }),
      ).toBeVisible();

      await expect(
        page.getByText("Don't have an account? Sign up"),
      ).toBeVisible();
      await expect(page.getByRole("main")).toContainText(
        "By clicking continue, you agree to our Terms of Service and Privacy Policy.",
      );
    });

    await test.step("Submit login form", async () => {
      await page
        .getByRole("textbox", { name: "Email Address" })
        .fill("john.doe@gmail.com");
      await page.getByRole("button", { name: "Login with Email" }).click();
    });

    await test.step("Validate Verification page elements", async () => {
      await expect(page.getByText("Verify Identity")).toBeVisible();
      await expect(page.getByRole("main")).toContainText(
        "We sent a 6-digit code to john.doe@gmail.com.",
      );

      await expect(
        page.getByRole("textbox", { name: "Verification code" }),
      ).toBeVisible();
      await expect(page.getByRole("group")).toContainText(
        "Enter the 6-digit code sent to your email.",
      );

      await expect(
        page.getByRole("button", { name: "Verify Code" }),
      ).toBeVisible();
      await expect(page.locator("form")).toContainText(
        "Didn't receive the code? Resend",
      );
    });
  });

  test("Sign Up Flow", async ({ page, context }) => {
    // simulate unauthenticated user
    await context.clearCookies();

    await test.step("Navigate to signup", async () => {
      await page.goto("/sign-up");
    });

    await test.step("Validate signup page elements", async () => {
      await expect(
        page.getByText("Create your account", { exact: true }),
      ).toBeVisible();
      await expect(page.getByRole("main")).toContainText(
        "Enter your email below to create your account",
      );

      await expect(page.getByText("Full Name")).toBeVisible();
      await expect(
        page.getByRole("textbox", { name: "Full Name" }),
      ).toBeVisible();

      await expect(page.getByText("Email", { exact: true })).toBeVisible();
      await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();

      await expect(page.getByText("Password", { exact: true })).toBeVisible();
      await expect(
        page.getByRole("textbox", { name: "Password", exact: true }),
      ).toBeVisible();

      await expect(page.getByText("Confirm Password")).toBeVisible();
      await expect(
        page.getByRole("textbox", { name: "Confirm Password" }),
      ).toBeVisible();
      await expect(page.locator("form")).toContainText(
        "Must be at least 8 characters long.",
      );

      await expect(
        page.getByRole("button", { name: "Create Account" }),
      ).toBeVisible();
      await expect(page.locator("form")).toContainText(
        "Already have an account? Sign in",
      );

      await expect(page.getByText("Or", { exact: true })).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Continue with Google" }),
      ).toBeVisible();
    });

    await test.step("Validate form validation rules", async () => {
      // Test Name validation
      await page.getByRole("textbox", { name: "Full Name" }).click();
      await page.getByRole("textbox", { name: "Full Name" }).fill("C");
      await expect(page.locator("form")).toContainText(
        "Name must be at least 2 characters",
      );
      await page.getByRole("textbox", { name: "Full Name" }).fill("");

      // Test Email validation
      await page.getByRole("textbox", { name: "Email" }).click();
      await page.getByRole("textbox", { name: "Email" }).fill("hello.com");
      await expect(page.locator("form")).toContainText(
        "Please enter a valid email address",
      );
      await page
        .getByRole("textbox", { name: "Email" })
        .fill("john.doe@gmail.com");

      // Test Password length validation
      await page
        .getByRole("textbox", { name: "Password", exact: true })
        .click();
      await page
        .getByRole("textbox", { name: "Password", exact: true })
        .fill("hello");
      await expect(page.locator("form")).toContainText(
        "Must be at least 8 characters",
      );

      // Test Password Match validation
      await page.getByRole("textbox", { name: "Confirm Password" }).click();
      await page.getByRole("textbox", { name: "Confirm Password" }).fill("hi");
      await expect(page.locator("form")).toContainText(
        "Passwords do not match",
      );
    });
  });
});
