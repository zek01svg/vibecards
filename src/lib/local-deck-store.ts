import { z } from "zod/v4";

export const DECK_INDEX_KEY = "vibecards_deck_index";
export const DECK_KEY_PREFIX = "vibecards_deck_";

export const CardSchema = z.object({
  front: z.string(),
  back: z.string(),
});
export type Card = z.infer<typeof CardSchema>;

export const LocalDeckSchema = z.object({
  id: z.string(),
  title: z.string(),
  topic: z.string(),
  cards: z.array(CardSchema),
  createdAt: z.string(),
  isFavorite: z.boolean().default(false),
});
export type LocalDeck = z.infer<typeof LocalDeckSchema>;

export const DeckIndexItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  topic: z.string(),
  cardCount: z.number(),
  createdAt: z.string(),
  isFavorite: z.boolean().default(false),
});
export type DeckIndexItem = z.infer<typeof DeckIndexItemSchema>;

export const BackupDataSchema = z.object({
  version: z.number().optional(),
  exportedAt: z.string().optional(),
  decks: z.array(LocalDeckSchema),
});
export type BackupData = z.infer<typeof BackupDataSchema>;

export type SaveDeckInput = {
  id?: string;
  title: string;
  topic: string;
  cards: Card[];
  createdAt?: string;
  isFavorite?: boolean;
};

export function getDeckIndex(): DeckIndexItem[] {
  if (typeof localStorage === "undefined") return [];

  try {
    const raw = localStorage.getItem(DECK_INDEX_KEY);
    return raw
      ? (z.array(DeckIndexItemSchema).safeParse(JSON.parse(raw)).data ?? [])
      : [];
  } catch {
    return [];
  }
}

export function getDeck(id: string): LocalDeck | null {
  if (typeof localStorage === "undefined") return null;

  try {
    const raw = localStorage.getItem(DECK_KEY_PREFIX + id);
    return raw
      ? (LocalDeckSchema.safeParse(JSON.parse(raw)).data ?? null)
      : null;
  } catch {
    return null;
  }
}

export function saveDeck(input: SaveDeckInput): LocalDeck {
  const id = input.id || crypto.randomUUID();
  const existingDeck = input.id ? getDeck(input.id) : null;
  const createdAt =
    input.createdAt || existingDeck?.createdAt || new Date().toISOString();
  const isFavorite = input.isFavorite ?? existingDeck?.isFavorite ?? false;

  const deck: LocalDeck = LocalDeckSchema.parse({
    id,
    title: input.title,
    topic: input.topic,
    cards: input.cards,
    createdAt,
    isFavorite,
  });

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(DECK_KEY_PREFIX + id, JSON.stringify(deck));

    const index = getDeckIndex();
    const indexItem: DeckIndexItem = {
      id: deck.id,
      title: deck.title,
      topic: deck.topic,
      cardCount: deck.cards.length,
      createdAt: deck.createdAt,
      isFavorite: deck.isFavorite,
    };

    const updatedIndex = [indexItem, ...index.filter((item) => item.id !== id)];

    localStorage.setItem(DECK_INDEX_KEY, JSON.stringify(updatedIndex));
  }

  return deck;
}

export function deleteDeck(id: string): void {
  if (typeof localStorage === "undefined") return;

  localStorage.removeItem(DECK_KEY_PREFIX + id);

  const index = getDeckIndex();
  const updatedIndex = index.filter((item) => item.id !== id);
  localStorage.setItem(DECK_INDEX_KEY, JSON.stringify(updatedIndex));
}

export function toggleFavorite(id: string): LocalDeck | null {
  const deck = getDeck(id);
  if (!deck) return null;
  return saveDeck({ ...deck, isFavorite: !deck.isFavorite });
}

export function exportBackup(): string {
  const index = getDeckIndex();
  const decks = index
    .map((item) => getDeck(item.id))
    .filter((deck): deck is LocalDeck => deck !== null);

  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      decks,
    },
    null,
    2,
  );
}

export function importBackup(jsonString: string): {
  success: boolean;
  importedCount: number;
  error?: string;
} {
  try {
    const raw = JSON.parse(jsonString);
    const parsed = BackupDataSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        importedCount: 0,
        error: "Invalid backup format",
      };
    }

    const decksToImport = parsed.data.decks;

    decksToImport.forEach((deck) => saveDeck(deck));

    return { success: true, importedCount: decksToImport.length };
  } catch (err) {
    return {
      success: false,
      importedCount: 0,
      error: err instanceof Error ? err.message : "Failed to parse backup JSON",
    };
  }
}
