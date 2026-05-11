import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ request }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    console.warn(
      "TEST_EMAIL/TEST_PASSWORD not set; skipping authenticated setup state",
    );
    await request.storageState({ path: authFile });
    return;
  }

  // Sign up first — testcontainer starts with a fresh DB
  await request.post("/api/auth/sign-up/email", {
    data: { name: "Test User", email, password },
  });

  const response = await request.post("/api/auth/sign-in/email", {
    data: { email, password },
  });

  expect(response.ok()).toBeTruthy();

  await request.storageState({ path: authFile });
});
