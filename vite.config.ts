import { fileURLToPath, URL } from "node:url";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
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
  },
  plugins: [tanstackStart(), tailwindcss(), viteReact()],
});
