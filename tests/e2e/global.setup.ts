import { env } from "@/lib/env";
import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ request }) => {
  if (!env.TEST_EMAIL || !env.TEST_PASSWORD) {
    console.warn("TEST_EMAIL/TEST_PASSWORD not set; skipping authenticated setup state");
    await request.storageState({ path: authFile });
    return;
  }

  const response = await request.post("/api/auth/sign-in/email", {
    data: {
      email: env.TEST_EMAIL,
      password: env.TEST_PASSWORD,
    },
  });

  expect(response.ok()).toBeTruthy();

  await request.storageState({ path: authFile });
});
