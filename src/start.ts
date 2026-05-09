import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
} from "@sentry/tanstackstart-react";
import { createMiddleware, createStart } from "@tanstack/react-start";

import { logger } from "#/lib/logger";

const loggerMiddleware = createMiddleware({ type: "request" }).server(
  async ({ request, next }) => {
    logger.info("Incoming request", {
      method: request.method,
      url: request.url,
    });
    return next();
  },
);

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [sentryGlobalRequestMiddleware, loggerMiddleware],
    functionMiddleware: [sentryGlobalFunctionMiddleware],
  };
});
