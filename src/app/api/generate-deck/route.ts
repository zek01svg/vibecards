import { NextRequest, NextResponse } from "next/server";
import db from "@/database/db";
import { decks } from "@/database/schema";
import { env } from "@/lib/env";
import { createDeckSchema } from "@/lib/schemas";
import authenticate from "@/utils/authenticate";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ZodError } from "zod";

// Guardrails
const MAX_TOPIC_LENGTH = 500;
const MAX_OUTPUT_TOKENS = 8192;

export async function POST(request: NextRequest) {
    try {
        // 1. Verify authentication
        const userId = await authenticate();
        if (userId === "Unauthorized") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // 2. Parse and validate request body
        const body = await request.json();
        const { topic, difficulty = "intermediate", cardCount = 10 } = body;

        if (!topic || typeof topic !== "string") {
            return NextResponse.json(
                { error: "Topic is required" },
                { status: 400 },
            );
        }

        // Validate difficulty
        const validDifficulties = ["beginner", "intermediate", "advanced"];
        if (difficulty && !validDifficulties.includes(difficulty)) {
            return NextResponse.json(
                { error: "Invalid difficulty level" },
                { status: 400 },
            );
        }

        // Validate card count
        const validCardCounts = [5, 8, 10, 12, 15, 20];
        const numCardCount = Number(cardCount);
        if (!validCardCounts.includes(numCardCount)) {
            return NextResponse.json(
                {
                    error: "Invalid card count. Must be 5, 8, 10, 12, 15, or 20",
                },
                { status: 400 },
            );
        }

        // 3. Validate topic length
        if (topic.length > MAX_TOPIC_LENGTH) {
            return NextResponse.json(
                {
                    error: `Topic must be ${MAX_TOPIC_LENGTH} characters or less`,
                },
                { status: 400 },
            );
        }

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
            return NextResponse.json(
                { error: "No response from Gemini" },
                { status: 500 },
            );
        }

        // 6. Parse response
        let parsedData;

        try {
            console.log(responseText);
            parsedData = JSON.parse(responseText);
        } catch (error) {
            console.error("JSON parse error:", error);
            return NextResponse.json(
                { error: "Failed to parse Gemini response" },
                { status: 500 },
            );
        }

        // Validate with Zod schema (dynamic based on card count)
        const DeckSchema = createDeckSchema(numCardCount, numCardCount);
        const validatedDeck = DeckSchema.parse(parsedData);

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

        // 8. Return deckId
        return NextResponse.json({ deckId: deck[0].id });
    } catch (error) {
        console.error("Error generating deck:", error);
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid deck structure from AI" },
                { status: 500 },
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
