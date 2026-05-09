import { getRequestHeaders } from "@tanstack/start-server-core";
import auth from "@/lib/auth";
import logger from "@/lib/pino";
import authenticate from "@/utils/authenticate";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/start-server-core", () => ({
  getRequestHeaders: vi.fn<() => Record<string, string>>(),
}));

vi.mock("@/lib/auth", () => ({
  default: {
    api: {
      getSession:
        vi.fn<() => Promise<{ session: { userId: string } } | null>>(),
    },
  },
}));

vi.mock("@/lib/pino", () => ({
  default: {
    warn: vi.fn<(message: string) => void>(),
  },
}));

describe("authenticate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getRequestHeaders).mockReturnValue(
      new Headers() as ReturnType<typeof getRequestHeaders>,
    );
  });

  it("should return Unauthorized and log warning when no session is found", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const result = await authenticate();

    expect(result).toBe("Unauthorized");
    expect(logger.warn).toHaveBeenCalledWith(
      "Authentication failed: no valid session",
    );
  });

  it("should return userId when a valid session is present", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      session: {
        id: "session_123",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user_123",
        expiresAt: new Date(),
        token: "token_123",
      },
    } as Awaited<ReturnType<typeof auth.api.getSession>>);

    const result = await authenticate();

    expect(result).toBe("user_123");
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
