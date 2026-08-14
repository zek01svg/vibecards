import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
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
