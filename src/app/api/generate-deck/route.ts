import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createDeckSchema } from '@/lib/schemas';
import { supabase } from '@/lib/supabase';

// Guardrails
const MAX_TOPIC_LENGTH = 500;
const MAX_OUTPUT_TOKENS = 2000;

export async function POST(request: NextRequest) {
    try {
        // 1. Verify authentication
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse and validate request body
        const body = await request.json();
        const { topic, difficulty = 'intermediate', cardCount = 10 } = body;

        if (!topic || typeof topic !== 'string') {
            return NextResponse.json(
                { error: 'Topic is required' },
                { status: 400 }
            );
        }

        // Validate difficulty
        const validDifficulties = ['beginner', 'intermediate', 'advanced'];
        if (difficulty && !validDifficulties.includes(difficulty)) {
            return NextResponse.json(
                { error: 'Invalid difficulty level' },
                { status: 400 }
            );
        }

        // Validate card count
        const validCardCounts = [5, 8, 10, 12, 15, 20];
        const numCardCount = Number(cardCount);
        if (!validCardCounts.includes(numCardCount)) {
            return NextResponse.json(
                { error: 'Invalid card count. Must be 5, 8, 10, 12, 15, or 20' },
                { status: 400 }
            );
        }

        // 3. Validate topic length
        if (topic.length > MAX_TOPIC_LENGTH) {
            return NextResponse.json(
                { error: `Topic must be ${MAX_TOPIC_LENGTH} characters or less` },
                { status: 400 }
            );
        }

        // 4. Instantiate OpenAI client inside route handler
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        const openai = new OpenAI({ apiKey });

        // 5. Call OpenAI with structured output
        // Using chat completions with response_format for structured outputs
        // Try gpt-5.2 first, fallback to gpt-4o if not available
        let completion;
        try {
            completion = await openai.chat.completions.create({
                model: 'gpt-5.2',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful assistant that creates educational flashcards. 
Given a topic or notes, generate exactly ${numCardCount} flashcards with clear front and back content.
Each card should cover an important concept, fact, or question related to the topic.

Difficulty Level: ${difficulty}
- Beginner: Use simple language, basic concepts, and clear explanations. Suitable for newcomers.
- Intermediate: Use moderate complexity, detailed explanations, and assume some prior knowledge.
- Advanced: Use complex terminology, in-depth analysis, and assume strong background knowledge.

Adjust the complexity and depth of each flashcard according to the difficulty level.`,
                    },
                    {
                        role: 'user',
                        content: `Create ${numCardCount} ${difficulty}-level flashcards for the following topic:\n\n${topic}`,
                    },
                ],
                response_format: {
                    type: 'json_schema',
                    json_schema: {
                        name: 'deck_schema',
                        description: 'A deck of flashcards',
                        schema: {
                            type: 'object',
                            properties: {
                                title: {
                                    type: 'string',
                                    description: 'A concise title for the flashcard deck',
                                },
                                topic: {
                                    type: 'string',
                                    description: 'The topic covered by these flashcards',
                                },
                                cards: {
                                    type: 'array',
                                    description: `Array of flashcards, exactly ${numCardCount} cards`,
                                    minItems: numCardCount,
                                    maxItems: numCardCount,
                                    items: {
                                        type: 'object',
                                        properties: {
                                            front: {
                                                type: 'string',
                                                description: 'The front of the card (question or prompt)',
                                            },
                                            back: {
                                                type: 'string',
                                                description: 'The back of the card (answer or explanation)',
                                            },
                                        },
                                        required: ['front', 'back'],
                                        additionalProperties: false,
                                    },
                                },
                            },
                            required: ['title', 'topic', 'cards'],
                            additionalProperties: false,
                        },
                        strict: true,
                    },
                },
                max_tokens: MAX_OUTPUT_TOKENS,
                temperature: 0.7,
            });
        } catch (modelError: any) {
            // Fallback to gpt-4o if gpt-5.2 is not available
            if (modelError?.status === 404 || modelError?.message?.includes('model')) {
                completion = await openai.chat.completions.create({
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a helpful assistant that creates educational flashcards. 
Given a topic or notes, generate exactly ${numCardCount} flashcards with clear front and back content.
Each card should cover an important concept, fact, or question related to the topic.

Difficulty Level: ${difficulty}
- Beginner: Use simple language, basic concepts, and clear explanations. Suitable for newcomers.
- Intermediate: Use moderate complexity, detailed explanations, and assume some prior knowledge.
- Advanced: Use complex terminology, in-depth analysis, and assume strong background knowledge.

Adjust the complexity and depth of each flashcard according to the difficulty level.`,
                        },
                        {
                            role: 'user',
                            content: `Create ${numCardCount} ${difficulty}-level flashcards for the following topic:\n\n${topic}`,
                        },
                    ],
                    response_format: {
                        type: 'json_schema',
                        json_schema: {
                            name: 'deck_schema',
                            description: 'A deck of flashcards',
                            schema: {
                                type: 'object',
                                properties: {
                                    title: {
                                        type: 'string',
                                        description: 'A concise title for the flashcard deck',
                                    },
                                    topic: {
                                        type: 'string',
                                        description: 'The topic covered by these flashcards',
                                    },
                                    cards: {
                                        type: 'array',
                                        description: `Array of flashcards, exactly ${numCardCount} cards`,
                                        minItems: numCardCount,
                                        maxItems: numCardCount,
                                        items: {
                                            type: 'object',
                                            properties: {
                                                front: {
                                                    type: 'string',
                                                    description: 'The front of the card (question or prompt)',
                                                },
                                                back: {
                                                    type: 'string',
                                                    description: 'The back of the card (answer or explanation)',
                                                },
                                            },
                                            required: ['front', 'back'],
                                            additionalProperties: false,
                                        },
                                    },
                                },
                                required: ['title', 'topic', 'cards'],
                                additionalProperties: false,
                            },
                            strict: true,
                        },
                    },
                    max_tokens: MAX_OUTPUT_TOKENS,
                    temperature: 0.7,
                });
            } else {
                throw modelError;
            }
        }

        // 6. Parse response with Zod
        const content = completion.choices[0]?.message?.content;
        if (!content) {
            return NextResponse.json(
                { error: 'No response from OpenAI' },
                { status: 500 }
            );
        }

        let parsedData;
        try {
            parsedData = JSON.parse(content);
        } catch (error) {
            return NextResponse.json(
                { error: 'Failed to parse OpenAI response' },
                { status: 500 }
            );
        }

        // Validate with Zod schema (dynamic based on card count)
        const DeckSchema = createDeckSchema(numCardCount, numCardCount);
        const validatedDeck = DeckSchema.parse(parsedData);

        // 7. Save to Supabase with owner_id
        const { data, error: dbError } = await supabase
            .from('decks')
            .insert({
                owner_id: userId,
                title: validatedDeck.title,
                topic: validatedDeck.topic,
                cards: validatedDeck.cards,
            })
            .select('id')
            .single();

        if (dbError || !data) {
            console.error('Database error:', dbError);
            return NextResponse.json(
                { error: 'Failed to save deck to database' },
                { status: 500 }
            );
        }

        // 8. Return deckId
        return NextResponse.json({ deckId: data.id });
    } catch (error) {
        console.error('Error generating deck:', error);
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid deck structure from AI' },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
