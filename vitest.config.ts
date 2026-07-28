import { fileURLToPath, URL } from "node:url";
import { defineConfig, defineProject, mergeConfig } from "vitest/config";

export const baseConfig = defineConfig({
  test: {
    exclude: ["node_modules", "coverage", "dist", "playwright"],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    coverage: {
      provider: "istanbul" as const,
      reporter: [
        ["json", { subdir: "json" }],
        ["html", { subdir: "html" }],
      ] as const,
      enabled: true,
      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
      },
    },
    reporters: ["dot"],
  },
});

const uiConfig = mergeConfig(
  baseConfig,
  defineProject({
    test: {
      name: "unit",
      environment: "jsdom",
      include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
    },
  }),
);

export default defineConfig({
  test: {
    projects: [uiConfig],
  },
});
