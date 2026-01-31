import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export const restrictEnvAccess = tseslint.config(
    { ignores: ["**/env.ts", "**/playwright.config.ts"] },
    {
        files: ["**/*.js", "**/*.ts", "**/*.tsx"],
        rules: {
            "no-restricted-properties": [
                "error",
                {
                    object: "process",
                    property: "env",
                    message:
                        "Use `import { env } from '@/lib/env'` instead to ensure validated types.",
                },
            ],
            "no-restricted-imports": [
                "error",
                {
                    name: "process",
                    importNames: ["env"],
                    message:
                        "Use `import { env } from '@/lib/env'` instead to ensure validated types.",
                },
            ],
        },
    }
);

const eslintConfig = defineConfig([
    ...nextVitals,
    ...restrictEnvAccess,
    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        "node_modules/**",
        ".clerk/**",
    ]),
]);

export default eslintConfig;