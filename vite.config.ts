import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/home/runner/work/vibecards/vibecards/src",
      "next/link": "/home/runner/work/vibecards/vibecards/src/compat/next-link.tsx",
      "next/navigation": "/home/runner/work/vibecards/vibecards/src/compat/next-navigation.ts",
      "next/headers": "/home/runner/work/vibecards/vibecards/src/compat/next-headers.ts",
      "next/cache": "/home/runner/work/vibecards/vibecards/src/compat/next-cache.ts",
      "next/dynamic": "/home/runner/work/vibecards/vibecards/src/compat/next-dynamic.tsx",
      "next/font/google": "/home/runner/work/vibecards/vibecards/src/compat/next-font-google.ts",
      "next/server": "/home/runner/work/vibecards/vibecards/src/compat/next-server.ts"
    }
  },
  plugins: [tanstackStart(), tailwindcss(), viteReact()]
});
