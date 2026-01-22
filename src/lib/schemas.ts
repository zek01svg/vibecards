import { z } from 'zod';

export const CardSchema = z.object({
  front: z.string(),
  back: z.string(),
});

// Dynamic schema factory for variable card counts
export const createDeckSchema = (minCards: number, maxCards: number) =>
  z.object({
    title: z.string(),
    topic: z.string(),
    cards: z.array(CardSchema).min(minCards).max(maxCards),
  });

// Default schema (for backwards compatibility)
export const DeckSchema = z.object({
  title: z.string(),
  topic: z.string(),
  cards: z.array(CardSchema).min(5).max(20),
});

export type Card = z.infer<typeof CardSchema>;
export type Deck = z.infer<typeof DeckSchema>;
