import { fileURLToPath, URL } from "node:url";
import { defineConfig, defineProject, mergeConfig } from "vitest/config";

export const baseConfig = defineConfig({
  test: {
    exclude: ["node_modules", "coverage", "dist", ".next", "playwright", "tests/e2e"],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "next/link": fileURLToPath(new URL("./src/compat/next-link.tsx", import.meta.url)),
      "next/navigation": fileURLToPath(new URL("./src/compat/next-navigation.ts", import.meta.url)),
      "next/headers": fileURLToPath(new URL("./src/compat/next-headers.ts", import.meta.url)),
      "next/cache": fileURLToPath(new URL("./src/compat/next-cache.ts", import.meta.url)),
      "next/dynamic": fileURLToPath(new URL("./src/compat/next-dynamic.tsx", import.meta.url)),
      "next/font/google": fileURLToPath(new URL("./src/compat/next-font-google.ts", import.meta.url)),
      "next/server": fileURLToPath(new URL("./src/compat/next-server.ts", import.meta.url)),
    },
    coverage: {
      provider: "istanbul" as const,
      reporter: [["json", { subdir: "json" }], ["html", { subdir: "html" }]] as const,
      enabled: true,
    },
    reporters: ["dot"],
  },
});

const uiConfig = mergeConfig(
  baseConfig,
  defineProject({
    test: {
      environment: "jsdom",
    },
  }),
);

export default uiConfig;
