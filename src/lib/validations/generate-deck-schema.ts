import { z } from "zod";

const difficulties = ["beginner", "intermediate", "advanced"] as const;
const cardCounts = [5, 8, 10, 12, 15, 20] as const;

export const CardSchema = z.object({
  front: z.string(),
  back: z.string(),
});

export const DeckSchema = z.object({
  title: z.string(),
  topic: z.string(),
  cards: z.array(CardSchema).min(5).max(20),
});

export const generateDeckSchema = z.object({
  topic: z
    .string()
    .min(1, "Topic is required")
    .max(500, "Topic must be 500 characters or fewer"),
  difficulty: z.enum(difficulties),
  cardCount: z.enum(cardCounts.map(String) as [string, ...string[]]),
});

export type Card = z.infer<typeof CardSchema>;
export type Deck = z.infer<typeof DeckSchema>;
