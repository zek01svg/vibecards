import { expect, test as setup } from "@playwright/test";
import { Pool } from "pg";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ request }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  const databaseUrl = process.env.DATABASE_URL;

  if (!email || !password) {
    console.warn(
      "TEST_EMAIL/TEST_PASSWORD not set; skipping authenticated setup state",
    );
    await request.storageState({ path: authFile });
    return;
  }

  await request.post("/api/auth/sign-up/email", {
    data: { name: "Test User", email, password },
  });

  // emailOTP(overrideDefaultEmailVerification: true) blocks sign-in until
  // email_verified is true — bypass by updating the DB directly.
  if (databaseUrl) {
    const pool = new Pool({ connectionString: databaseUrl });
    try {
      await pool.query(
        `UPDATE "user" SET email_verified = true WHERE email = $1`,
        [email],
      );
    } finally {
      await pool.end();
    }
  }

  const response = await request.post("/api/auth/sign-in/email", {
    data: { email, password },
  });

  expect(response.ok()).toBeTruthy();

  await request.storageState({ path: authFile });
});
