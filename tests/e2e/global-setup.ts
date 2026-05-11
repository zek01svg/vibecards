import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import dotenv from "dotenv";

export default async function globalSetup() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

  fs.mkdirSync(path.join(process.cwd(), "playwright/.auth"), {
    recursive: true,
  });

  const container = await new PostgreSqlContainer("postgres:16-alpine").start();
  const databaseUrl = container.getConnectionUri();

  process.env.DATABASE_URL = databaseUrl;

  if (!process.env.TEST_EMAIL) process.env.TEST_EMAIL = "test@vibecards.test";
  if (!process.env.TEST_PASSWORD)
    process.env.TEST_PASSWORD = "TestPass123!";

  const pool = new Pool({ connectionString: databaseUrl });
  try {
    await pool.query("CREATE SCHEMA IF NOT EXISTS auth");
    await pool.query(`
      CREATE OR REPLACE FUNCTION auth.uid() RETURNS text
      LANGUAGE sql STABLE AS $$ SELECT NULL::text $$
    `);
  } finally {
    await pool.end();
  }

  // CI=1 skips T3 Env validation so only DATABASE_URL is needed for drizzle-kit
  execSync("bun run node_modules/.bin/drizzle-kit push --force", {
    stdio: "inherit",
    env: { ...process.env, CI: "1" },
    cwd: process.cwd(),
  });

  return async () => {
    await container.stop();
  };
}
