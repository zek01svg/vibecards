import { NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication
    const userId = await authenticate();
    if (userId === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validatedRequest = GenerateDeckRequestSchema.parse(body);
    const { topic, difficulty, cardCount } = validatedRequest;

    // 4. Instantiate Gemini client
    const apiKey = env.GOOGLE_GENERATIVE_AI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      logger.warn(
        { userId: userId, topic: topic },
        "Empty response from Gemini",
      );
      return NextResponse.json(
        { error: "No response from Gemini" },
        { status: 500 },
      );
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
      return NextResponse.json(
        { error: "Failed to parse Gemini response" },
        { status: 500 },
      );
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
      return NextResponse.json(
        { error: "Failed to save deck" },
        { status: 500 },
      );
    }

    logger.info(
      { userId: userId, deckId: createdDeck.id, topic: validatedDeck.topic },
      "Deck generated and saved successfully",
    );

    // 8. Return deckId
    return NextResponse.json({ deckId: createdDeck.id });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn({ err: error.format() }, "Validation error");
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((issue) => issue.message),
        },
        { status: 400 },
      );
    }
    logger.error({ err: error }, "Error generating deck");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
