import { chat } from "@tanstack/ai";
import { createGeminiChat } from "@tanstack/ai-gemini";
import { createFileRoute } from "@tanstack/react-router";
import { desc, eq } from "drizzle-orm";
import { ZodError } from "zod";

import db from "@/database/db";
import { decks } from "@/database/schema";
import auth from "@/lib/auth";
import { env } from "@/lib/env";
import logger from "@/lib/pino";
import { GeminiResponseSchema, GenerateDeckRequestSchema } from "@/lib/validations/generate-deck-schema";

const MAX_OUTPUT_TOKENS = 8192;
const modelHierarchy = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-flash-lite"] as const;

async function getUserId(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.session?.userId ?? null;
}

export const Route = createFileRoute("/api/decks")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const userId = await getUserId(request);
        if (!userId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const userDecks = await db.query.decks.findMany({ where: eq(decks.ownerId, userId), orderBy: [desc(decks.createdAt)] });
        return Response.json({ success: true, decks: userDecks });
      },
      POST: async ({ request }) => {
        try {
          const userId = await getUserId(request);
          if (!userId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

          const body = await request.json();
          const validatedRequest = GenerateDeckRequestSchema.parse(body);
          const { topic, difficulty, cardCount } = validatedRequest;

          const prompt = `You are a helpful assistant that creates educational flashcards.\nGiven a topic or notes, generate exactly ${cardCount} flashcards with clear front and back content.\nEach card should cover an important concept, fact, or question related to the topic.\n\nDifficulty Level: ${difficulty}\n- Beginner: Use simple language, basic concepts, and clear explanations. Suitable for newcomers.\n- Intermediate: Use moderate complexity, detailed explanations, and assume some prior knowledge.\n- Advanced: Use complex terminology, in-depth analysis, and assume strong background knowledge.\n\nAdjust the complexity and depth of each flashcard according to the difficulty level.\n\nCreate ${cardCount} ${difficulty}-level flashcards for the following topic:\n${topic}`;

          let generated: unknown = null;
          let lastError: unknown = null;

          for (const modelName of modelHierarchy) {
            try {
              generated = await chat({
                adapter: createGeminiChat(modelName, env.GOOGLE_GENERATIVE_AI_API_KEY),
                messages: [{ role: "user", content: [{ type: "text", content: prompt }] }],
                outputSchema: GeminiResponseSchema,
                stream: false,
                maxTokens: MAX_OUTPUT_TOKENS,
                temperature: 0.7
              });
              if (generated) break;
            } catch (error) {
              lastError = error;
              logger.warn({ modelName, err: error }, "Gemini model failed, falling back");
            }
          }

          if (!generated) {
            logger.error({ err: lastError, topic, userId }, "All Gemini models failed");
            return Response.json({ success: false, error: "No response from Gemini after trying all models" }, { status: 502 });
          }

          const validatedDeck = GeminiResponseSchema.parse(generated);
          const deck = await db.insert(decks).values({ ownerId: userId, title: validatedDeck.title, topic: validatedDeck.topic, cards: validatedDeck.cards }).returning();
          const createdDeck = deck[0];
          if (!createdDeck) return Response.json({ success: false, error: "Failed to save deck" }, { status: 500 });

          return Response.json({ success: true, deckId: createdDeck.id });
        } catch (error) {
          if (error instanceof ZodError) {
            return Response.json({ success: false, error: "Validation failed", details: error.issues.map((issue) => issue.message) }, { status: 400 });
          }
          logger.error({ err: error }, "Error generating deck");
          return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
        }
      }
    }
  }
});
