import { execSync } from "child_process";
import { Pool } from "pg";

const TEST_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5433/testdb";

export async function setup() {
  const pool = new Pool({ connectionString: TEST_DATABASE_URL });
  try {
    await pool.query("SELECT 1");
  } catch {
    throw new Error(
      "Cannot connect to test database at localhost:5433. Run: docker compose up -d",
    );
  }

  await pool.query("DROP SCHEMA IF EXISTS public CASCADE");
  await pool.query("CREATE SCHEMA public");
  await pool.query("DROP SCHEMA IF EXISTS auth CASCADE");
  await pool.query("CREATE SCHEMA auth");
  await pool.query(`
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS text
    LANGUAGE sql STABLE AS $$ SELECT NULL::text $$
  `);
  await pool.end();

  execSync("bun run node_modules/.bin/drizzle-kit push --force", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL, CI: "1" },
    cwd: process.cwd(),
  });

  // Insert stable test users for all integration tests.
  const pool2 = new Pool({ connectionString: TEST_DATABASE_URL });
  await pool2.query(
    `INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
     VALUES
       ('test-user-id',  'Test User',  'test@integration.test',  true, NOW(), NOW()),
       ('other-user-id', 'Other User', 'other@integration.test', true, NOW(), NOW())
     ON CONFLICT (email) DO NOTHING`,
  );
  await pool2.end();
}

export async function teardown() {}
