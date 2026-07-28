import { z } from "zod/v4";

export const difficulties = ["beginner", "intermediate", "advanced"] as const;
export const cardCounts = [5, 8, 10, 12, 15, 20] as const;
type CardCount = (typeof cardCounts)[number];

function isCardCount(value: number): value is CardCount {
  return (cardCounts as readonly number[]).includes(value);
}

export const CardSchema = z.object({
  front: z
    .string()
    .min(1, "Front of card cannot be empty")
    .max(1000, "Front of card is too long"),
  back: z
    .string()
    .min(1, "Back of card cannot be empty")
    .max(2000, "Back of card is too long"),
});

/**
 * Schema for the JSON response we expect from Gemini
 */
export const GeminiResponseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  topic: z.string().min(1, "Topic is required").max(500),
  cards: z
    .array(CardSchema)
    .min(5, "Minimum 5 cards required")
    .max(20, "Maximum 20 cards allowed"),
});

/**
 * Schema for the POST request to /api/generate-deck
 */
export const GenerateDeckRequestSchema = z.object({
  topic: z
    .string()
    .min(1, "Topic is required")
    .max(500, "Topic must be 500 characters or fewer"),
  difficulty: z.enum(difficulties).default("intermediate"),
  cardCount: z
    .union([
      z.number().refine(isCardCount, {
        message: "Invalid card count",
      }),
      z
        .string()
        .transform((val) => {
          const parsed = parseInt(val, 10);
          if (isNaN(parsed)) return val;
          return parsed;
        })
        .refine((n) => typeof n === "number" && isCardCount(n), {
          message: "Invalid card count",
        }),
    ])
    .default(10),
});

export type Card = z.infer<typeof CardSchema>;
export type GeminiResponse = z.infer<typeof GeminiResponseSchema>;
export type GenerateDeckRequest = z.infer<typeof GenerateDeckRequestSchema>;
