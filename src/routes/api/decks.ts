import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { chat } from "@tanstack/ai";
import { createGeminiChat } from "@tanstack/ai-gemini";
import { createFileRoute } from "@tanstack/react-router";
import { ZodError } from "zod/v4";

import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import {
  GeminiResponseSchema,
  GenerateDeckRequestSchema,
} from "@/lib/validations/generate-deck-schema";

const MAX_OUTPUT_TOKENS = 8192;
const modelHierarchy: readonly Parameters<typeof createGeminiChat>[0][] = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
] as const;

let ratelimit: Ratelimit | null | undefined;

function getRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit;

  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  ratelimit =
    url && token
      ? new Ratelimit({
          redis: new Redis({ url, token }),
          limiter: Ratelimit.slidingWindow(10, "1 m"),
        })
      : null;
  return ratelimit;
}

/** @internal Reset cached ratelimit singleton — test use only. */
export function resetRatelimitForTest(): void {
  ratelimit = undefined;
}

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "127.0.0.1"
  );
}

/**
 * The @tanstack/ai `chat()` response shape varies across adapters and schema
 * configurations. When a structured `outputSchema` is provided the result is
 * typically wrapped in an `output` property; some adapters surface it under
 * `content`; others return the value directly. This helper unwraps the value
 * so it can be fed straight into the Zod schema parser.
 */
function normaliseGeminiResponse(raw: unknown): unknown {
  if (raw !== null && typeof raw === "object") {
    if ("output" in raw) return raw.output;
    if ("content" in raw) return raw.content;
  }
  return raw;
}

export const Route = createFileRoute("/api/decks")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const limiter = getRatelimit();
          if (limiter) {
            const ip = getClientIp(request);
            const { success: rateLimitSuccess } = await limiter.limit(ip);
            if (!rateLimitSuccess) {
              return Response.json(
                { success: false, error: "Too Many Requests" },
                { status: 429 },
              );
            }
          }

          const body = await request.json();
          const validatedRequest = GenerateDeckRequestSchema.parse(body);
          const { topic, difficulty, cardCount } = validatedRequest;

          const prompt = `You are a helpful assistant that creates educational flashcards.\nGiven a topic or notes, generate exactly ${cardCount} flashcards with clear front and back content.\nEach card should cover an important concept, fact, or question related to the topic.\n\nDifficulty Level: ${difficulty}\n- Beginner: Use simple language, basic concepts, and clear explanations. Suitable for newcomers.\n- Intermediate: Use moderate complexity, detailed explanations, and assume some prior knowledge.\n- Advanced: Use complex terminology, in-depth analysis, and assume strong background knowledge.\n\nAdjust the complexity and depth of each flashcard according to the difficulty level.\n\nCreate ${cardCount} ${difficulty}-level flashcards for the following topic:\n${topic}`;

          let generated: unknown = null;
          let lastError: unknown = null;

          for (const modelName of modelHierarchy) {
            try {
              generated = await chat({
                adapter: createGeminiChat(
                  modelName,
                  env.GOOGLE_GENERATIVE_AI_API_KEY,
                ),
                messages: [
                  {
                    role: "user",
                    content: [{ type: "text", content: prompt }],
                  },
                ],
                outputSchema: GeminiResponseSchema,
                stream: false,
                modelOptions: {
                  maxOutputTokens: MAX_OUTPUT_TOKENS,
                  temperature: 0.7,
                },
              });
              if (generated) break;
            } catch (error) {
              lastError = error;
              logger.warn("Gemini model failed, falling back", {
                modelName,
                err: error,
              });
            }
          }

          if (!generated) {
            logger.error("All Gemini models failed", {
              err: lastError,
              topic,
            });
            return Response.json(
              {
                success: false,
                error: "No response from Gemini after trying all models",
              },
              { status: 502 },
            );
          }

          const validatedDeck = GeminiResponseSchema.parse(
            normaliseGeminiResponse(generated),
          );

          return Response.json({
            success: true,
            deck: {
              title: validatedDeck.title,
              topic: validatedDeck.topic,
              cards: validatedDeck.cards,
            },
          });
        } catch (error) {
          if (error instanceof ZodError) {
            return Response.json(
              {
                success: false,
                error: "Validation failed",
                details: error.issues.map((issue) => issue.message),
              },
              { status: 400 },
            );
          }
          logger.error("Error generating deck", { err: error });
          return Response.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
          );
        }
      },
    },
  },
});
