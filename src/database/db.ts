import { env } from "@/lib/env";
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
        console.log(
            "✅ Database connection successful! Test result:",
            result.rows[0],
        );
    } catch (err) {
        console.error("❌ Database connection failed:", err);
    }
})();

const db = drizzle(pool, { schema });

export default db;
