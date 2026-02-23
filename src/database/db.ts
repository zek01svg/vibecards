import { env } from "@/lib/env";
import logger from "@/lib/pino";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema";

const { Pool } = pg;
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// test connection first before exporting
(async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT 1 + 1 AS test");
    client.release();
    logger.info({ test: result.rows[0] }, "Database connection successful");
  } catch (err) {
    logger.error({ err }, "Database connection failed");
  }
})();

const db = drizzle(pool, { schema });

export default db;
