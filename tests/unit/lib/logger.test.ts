import { describe, expect, it } from "vitest";

import { configureAppLogging, logger } from "@/lib/logger";

describe("Logger Unit Tests", () => {
  it("configures app logging for development with console sink", () => {
    expect(() => {
      configureAppLogging({ isDevelopment: true, enableSentrySink: false });
    }).not.toThrow();
    expect(logger).toBeDefined();
  });

  it("configures app logging for development with sentry sink", () => {
    expect(() => {
      configureAppLogging({ isDevelopment: true, enableSentrySink: true });
    }).not.toThrow();
  });

  it("configures app logging for production with sentry sink", () => {
    expect(() => {
      configureAppLogging({ isDevelopment: false, enableSentrySink: true });
    }).not.toThrow();
  });

  it("configures app logging for production without sentry sink", () => {
    expect(() => {
      configureAppLogging({ isDevelopment: false, enableSentrySink: false });
    }).not.toThrow();
  });
});
