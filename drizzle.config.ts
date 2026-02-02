import { env } from "@/lib/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./src/database/drizzle",
    schema: "./src/database/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
});
