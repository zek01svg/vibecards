import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    client: {
        NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
    },
    server: {
        GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
        NODE_ENV: z.enum(["development", "production"]).default("development"),

        DATABASE_URL: z.string(),

        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),

        BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
        BETTER_AUTH_SECRET: z.string(),

        RESEND_API_KEY: z.string(),
    },
    clientPrefix: "NEXT_PUBLIC_",
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,

        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

        GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,

        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

        RESEND_API_KEY: process.env.RESEND_API_KEY,

        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    },
    skipValidation:
        !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});

export type Env = {
    [K in keyof typeof env as K extends `VITE_${string}` ? K : never]: string;
};
