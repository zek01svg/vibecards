import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { createLogger, defineConfig, loadEnv } from "vite";

const logger = createLogger();
const originalWarn = logger.warn;
logger.warn = (msg, options) => {
  if (msg.includes("Failed to load source map")) return;
  originalWarn(msg, options);
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    customLogger: logger,
    resolve: { tsconfigPaths: true },
    plugins: [
      nitro({ rollupConfig: { external: [/^@sentry\//] } }),
      tailwindcss(),
      tanstackStart(),
      ...(env.SENTRY_AUTH_TOKEN &&
      env.SENTRY_AUTH_TOKEN !== "your-sentry-auth-token"
        ? sentryTanstackStart({
            org: env.VITE_SENTRY_ORG,
            project: env.VITE_SENTRY_PROJECT,
            authToken: env.SENTRY_AUTH_TOKEN,
          })
        : []),
      viteReact(),
    ],
  };
});
