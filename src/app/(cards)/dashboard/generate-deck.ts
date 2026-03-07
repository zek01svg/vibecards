"use server";

import db from "@/database/db";
import { decks } from "@/database/schema";
import { env } from "@/lib/env";
import logger from "@/lib/pino";
import {
  GeminiResponseSchema,
  GenerateDeckRequestSchema,
} from "@/lib/validations/generate-deck-schema";
import authenticate from "@/utils/authenticate";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ZodError } from "zod";

// Guardrails
const MAX_OUTPUT_TOKENS = 8192;

/**
 * Generates a deck of flashcards based on a topic and difficulty level.
 * @param data - The topic and difficulty level for the deck.
 * @returns A promise that resolves to the generated deck.
 */
export async function generateDeckAction(data: {
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  cardCount: string;
}) {
  try {
    // 1. Verify authentication
    const userId = await authenticate();
    if (userId === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Parse and validate request body
    const validatedRequest = GenerateDeckRequestSchema.parse(data);
    const { topic, difficulty, cardCount } = validatedRequest;

    // 4. Instantiate Gemini client
    const apiKey = env.GOOGLE_GENERATIVE_AI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelHierarchy = [
      "gemini-3.1-flash",
      "gemini-3.1-flash-lite-preview",
      "gemini-3.0-flash",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash-lite",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-lite",
    ];

    logger.info(
      {
        userId: userId,
        topic: topic,
        difficulty: difficulty,
        cardCount: cardCount,
      },
      "Generating deck via Gemini",
    );

    // 5. Call Gemini
    const prompt = `You are a helpful assistant that creates educational flashcards. 
Given a topic or notes, generate exactly ${cardCount} flashcards with clear front and back content.
Each card should cover an important concept, fact, or question related to the topic.

Difficulty Level: ${difficulty}
- Beginner: Use simple language, basic concepts, and clear explanations. Suitable for newcomers.
- Intermediate: Use moderate complexity, detailed explanations, and assume some prior knowledge.
- Advanced: Use complex terminology, in-depth analysis, and assume strong background knowledge.

Adjust the complexity and depth of each flashcard according to the difficulty level.

Create ${cardCount} ${difficulty}-level flashcards for the following topic:
${topic}`;

    let responseText: string | null = null;
    let lastError: any = null;

    for (const modelName of modelHierarchy) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            temperature: 0.7,
            responseMimeType: "application/json",
            responseSchema: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                topic: { type: SchemaType.STRING },
                cards: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      front: { type: SchemaType.STRING },
                      back: { type: SchemaType.STRING },
                    },
                    required: ["front", "back"],
                  },
                },
              },
              required: ["title", "topic", "cards"],
            },
          },
        });

        logger.info(
          { modelName },
          "Attempting to generate content with Gemini model",
        );
        const result = await model.generateContent(prompt);
        responseText = result.response.text();

        if (responseText) {
          logger.info({ modelName }, "Successfully generated deck");
          break;
        }
      } catch (error) {
        logger.warn(
          { modelName, err: error },
          "Failed to generate with model, falling back...",
        );
        lastError = error;
      }
    }

    if (!responseText) {
      logger.error(
        { userId: userId, topic: topic, err: lastError },
        "All Gemini models failed to generate a response",
      );
      return {
        success: false,
        error: "No response from Gemini after trying all models",
      };
    }

    // 6. Parse response
    let parsedData;

    try {
      logger.info(
        { responseLength: responseText.length },
        "Gemini response received",
      );
      parsedData = JSON.parse(responseText);
    } catch (error) {
      logger.error(
        { err: error, userId: userId, topic: topic },
        "Failed to parse Gemini JSON response",
      );
      return { success: false, error: "Failed to parse Gemini response" };
    }

    // Validate with Zod schema
    const validatedDeck = GeminiResponseSchema.parse(parsedData);

    // 7. Save to Supabase with owner_id
    const deck = await db
      .insert(decks)
      .values({
        ownerId: userId,
        title: validatedDeck.title,
        topic: validatedDeck.topic,
        cards: validatedDeck.cards,
      })
      .returning();

    const createdDeck = deck[0];
    if (!createdDeck) {
      logger.error({ userId: userId }, "Deck insert returned no rows");
      return { success: false, error: "Failed to save deck" };
    }

    logger.info(
      { userId: userId, deckId: createdDeck.id, topic: validatedDeck.topic },
      "Deck generated and saved successfully",
    );

    // 8. Return deckId
    return { success: true, deckId: createdDeck.id };
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn({ err: error.format() }, "Validation error");
      return {
        success: false,
        error: "Validation failed",
        details: error.issues.map((issue) => issue.message),
      };
    }
    logger.error({ err: error }, "Error generating deck");
    return { success: false, error: "Internal server error" };
  }
}
