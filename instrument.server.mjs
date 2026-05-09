import * as Sentry from "@sentry/tanstackstart-react";
import { configureAppLogging } from "./src/lib/logger.ts";
// oxlint-disable-next-line import/no-unassigned-import
import "dotenv/config";

const sentryDsn = process.env.VITE_SENTRY_DSN;
const isDevelopment = process.env.NODE_ENV === "development";

if (!sentryDsn) {
  console.warn("VITE_SENTRY_DSN is not defined. Sentry is disabled.");
}

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1,
    enableLogs: true,
    integrations: [],
  });
}

configureAppLogging({
  isDevelopment,
  enableSentrySink: Boolean(sentryDsn),
});
