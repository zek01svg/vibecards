import { chat } from "@tanstack/ai";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { env } from "@/lib/env";
import { Route, resetRatelimitForTest } from "@/routes/api/decks";

const { mockLimit, MockRatelimit } = vi.hoisted(() => {
  const limitFn = vi.fn<(ip: string) => Promise<{ success: boolean }>>();
  class RatelimitClass {
    limit = limitFn;
    static slidingWindow = vi.fn<() => void>();
  }
  return { mockLimit: limitFn, MockRatelimit: RatelimitClass };
});

vi.mock("@tanstack/ai", () => ({
  chat: vi.fn<(args: unknown) => Promise<unknown>>(),
}));

vi.mock("@tanstack/ai-gemini", () => ({
  createGeminiChat: vi.fn<(model: string, apiKey: string) => unknown>(),
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: MockRatelimit,
}));

vi.mock("@upstash/redis", () => ({
  Redis: vi.fn<() => void>(),
}));

vi.mock("@/lib/env", () => ({
  env: {
    GOOGLE_GENERATIVE_AI_API_KEY: "mock-google-key",
    UPSTASH_REDIS_REST_URL: undefined as string | undefined,
    UPSTASH_REDIS_REST_TOKEN: undefined as string | undefined,
  },
}));

type RouteServerHandlers = {
  handlers: {
    POST: (opts: { request: Request }) => Promise<Response>;
  };
};

const mutableEnv = env as unknown as {
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
};

describe("POST /api/decks", () => {
  // oxlint-disable-next-line typescript/no-non-null-assertion -- Route server handlers defined in source
  const postHandler = (Route.options.server as unknown as RouteServerHandlers)
    .handlers.POST;

  beforeEach(() => {
    vi.clearAllMocks();
    resetRatelimitForTest();
    mutableEnv.UPSTASH_REDIS_REST_URL = undefined;
    mutableEnv.UPSTASH_REDIS_REST_TOKEN = undefined;
  });

  describe("Stateless deck generation (rate limiting bypassed)", () => {
    it("should successfully generate flashcards and return stateless payload without database fields", async () => {
      const mockGeminiDeck = {
        title: "TypeScript Essentials",
        topic: "TypeScript",
        cards: Array.from({ length: 5 }, (_, i) => ({
          front: `Question ${i + 1}`,
          back: `Answer ${i + 1}`,
        })),
      };

      vi.mocked(chat).mockResolvedValueOnce(mockGeminiDeck);

      const request = new Request("http://localhost:3000/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "TypeScript",
          difficulty: "beginner",
          cardCount: 5,
        }),
      });

      const response = await postHandler({ request });
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toEqual({
        success: true,
        deck: {
          title: "TypeScript Essentials",
          topic: "TypeScript",
          cards: mockGeminiDeck.cards,
        },
      });

      expect(data.deckId).toBeUndefined();
      expect(data.deck.id).toBeUndefined();
      expect(data.deck.createdAt).toBeUndefined();
    });

    it("should return 400 validation error for invalid request payload", async () => {
      const request = new Request("http://localhost:3000/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "",
          cardCount: 999,
        }),
      });

      const response = await postHandler({ request });
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Validation failed");
      expect(data.details).toBeDefined();
    });

    it("should return 502 when all Gemini models fail", async () => {
      vi.mocked(chat).mockRejectedValue(new Error("Gemini API error"));

      const request = new Request("http://localhost:3000/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "Rust",
          difficulty: "intermediate",
          cardCount: 10,
        }),
      });

      const response = await postHandler({ request });
      expect(response.status).toBe(502);

      const data = await response.json();
      expect(data).toEqual({
        success: false,
        error: "No response from Gemini after trying all models",
      });
    });
  });

  describe("Upstash Redis Rate Limiting", () => {
    beforeEach(() => {
      mutableEnv.UPSTASH_REDIS_REST_URL = "https://mock-redis.upstash.io";
      mutableEnv.UPSTASH_REDIS_REST_TOKEN = "mock-redis-token";
    });

    it("should allow request when rate limit is not exceeded", async () => {
      mockLimit.mockResolvedValueOnce({ success: true });

      const mockGeminiDeck = {
        title: "React Hooks",
        topic: "React",
        cards: Array.from({ length: 5 }, (_, i) => ({
          front: `Front ${i + 1}`,
          back: `Back ${i + 1}`,
        })),
      };

      vi.mocked(chat).mockResolvedValueOnce(mockGeminiDeck);

      const request = new Request("http://localhost:3000/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "203.0.113.195",
        },
        body: JSON.stringify({
          topic: "React",
          difficulty: "beginner",
          cardCount: 5,
        }),
      });

      const response = await postHandler({ request });
      expect(mockLimit).toHaveBeenCalledWith("203.0.113.195");
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("should return 429 Too Many Requests when rate limit is exceeded", async () => {
      mockLimit.mockResolvedValueOnce({ success: false });

      const request = new Request("http://localhost:3000/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "198.51.100.42, 10.0.0.1",
        },
        body: JSON.stringify({
          topic: "Python",
          difficulty: "beginner",
          cardCount: 5,
        }),
      });

      const response = await postHandler({ request });
      expect(mockLimit).toHaveBeenCalledWith("198.51.100.42");
      expect(response.status).toBe(429);

      const data = await response.json();
      expect(data).toEqual({
        success: false,
        error: "Too Many Requests",
      });
      expect(chat).not.toHaveBeenCalled();
    });
  });
});
