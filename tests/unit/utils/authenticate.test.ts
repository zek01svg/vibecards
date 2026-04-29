import { getRequestHeaders } from "@tanstack/start-server-core";
import auth from "@/lib/auth";
import logger from "@/lib/pino";
import authenticate from "@/utils/authenticate";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/start-server-core", () => ({
  getRequestHeaders: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  default: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/pino", () => ({
  default: {
    warn: vi.fn(),
  },
}));

describe("authenticate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getRequestHeaders as any).mockReturnValue({});
  });

  it("should return Unauthorized and log warning when no session is found", async () => {
    (auth.api.getSession as any).mockResolvedValue(null);

    const result = await authenticate();

    expect(result).toBe("Unauthorized");
    expect(logger.warn).toHaveBeenCalledWith(
      "Authentication failed: no valid session",
    );
  });

  it("should return userId when a valid session is present", async () => {
    (auth.api.getSession as any).mockResolvedValue({
      session: {
        userId: "user_123",
      },
    });

    const result = await authenticate();

    expect(result).toBe("user_123");
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
