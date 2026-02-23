import nextVitals from "eslint-config-next/core-web-vitals";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export const restrictEnvAccess = tseslint.config(
  {
    ignores: [
      "**/env.ts",
      "**/playwright.config.ts",
      "**/instrumentation.ts",
      "**/instrumentation-client.ts",
      "**/instrumentation-server.ts",
      "**/instrumentation-edge.ts",
      "**/next.config.js",
    ],
  },
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
  },
);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...restrictEnvAccess,
  {
    settings: {
      react: {
        version: "19.2.4",
      },
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
