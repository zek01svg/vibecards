import { beforeEach, describe, expect, it } from "vitest";
import {
  DECK_INDEX_KEY,
  DECK_KEY_PREFIX,
  DeckIndexItemSchema,
  LocalDeckSchema,
  deleteDeck,
  exportBackup,
  getDeck,
  getDeckIndex,
  importBackup,
  saveDeck,
  toggleFavorite,
} from "@/lib/local-deck-store";

describe("localDeckStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Zod Schemas", () => {
    it("should validate a valid LocalDeck", () => {
      const validDeck = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "TypeScript Basics",
        topic: "Programming",
        cards: [
          { front: "What is TS?", back: "Typed JS" },
          { front: "What is Zod?", back: "Schema validation" },
        ],
        createdAt: "2026-07-27T00:00:00.000Z",
        isFavorite: true,
      };

      const result = LocalDeckSchema.safeParse(validDeck);
      expect(result.success).toBe(true);
    });

    it("should default isFavorite to false when omitted in LocalDeck", () => {
      const deckWithoutFav = {
        id: "deck-1",
        title: "Test Deck",
        topic: "Testing",
        cards: [{ front: "Q", back: "A" }],
        createdAt: "2026-07-27T00:00:00.000Z",
      };

      const parsed = LocalDeckSchema.parse(deckWithoutFav);
      expect(parsed.isFavorite).toBe(false);
    });

    it("should validate DeckIndexItem", () => {
      const validIndexItem = {
        id: "deck-1",
        title: "Test Deck",
        topic: "Testing",
        cardCount: 5,
        createdAt: "2026-07-27T00:00:00.000Z",
        isFavorite: false,
      };

      const result = DeckIndexItemSchema.safeParse(validIndexItem);
      expect(result.success).toBe(true);
    });
  });

  describe("getDeckIndex", () => {
    it("should return empty array when localStorage is empty", () => {
      expect(getDeckIndex()).toEqual([]);
    });

    it("should return parsed deck index items", () => {
      const items = [
        {
          id: "d1",
          title: "Deck 1",
          topic: "Topic 1",
          cardCount: 3,
          createdAt: "2026-07-27T00:00:00.000Z",
          isFavorite: false,
        },
      ];
      localStorage.setItem(DECK_INDEX_KEY, JSON.stringify(items));
      expect(getDeckIndex()).toEqual(items);
    });

    it("should return empty array on invalid JSON", () => {
      localStorage.setItem(DECK_INDEX_KEY, "invalid-json");
      expect(getDeckIndex()).toEqual([]);
    });
  });

  describe("saveDeck & getDeck", () => {
    it("should generate a UUID if ID is not provided", () => {
      const saved = saveDeck({
        title: "New Deck",
        topic: "General",
        cards: [{ front: "Front", back: "Back" }],
      });

      expect(saved.id).toBeDefined();
      expect(typeof saved.id).toBe("string");
      expect(saved.id.length).toBeGreaterThan(0);
      expect(saved.isFavorite).toBe(false);
    });

    it("should persist deck and update master index", () => {
      const deckInput = {
        id: "custom-id-1",
        title: "Custom Deck",
        topic: "Math",
        cards: [
          { front: "1 + 1", back: "2" },
          { front: "2 + 2", back: "4" },
        ],
        isFavorite: true,
      };

      const saved = saveDeck(deckInput);
      expect(saved.id).toBe("custom-id-1");

      const rawStoredDeck = localStorage.getItem(
        `${DECK_KEY_PREFIX}custom-id-1`,
      );
      expect(rawStoredDeck).not.toBeNull();

      const retrieved = getDeck("custom-id-1");
      expect(retrieved).toEqual(saved);

      const index = getDeckIndex();
      expect(index).toHaveLength(1);
      expect(index[0]).toEqual({
        id: "custom-id-1",
        title: "Custom Deck",
        topic: "Math",
        cardCount: 2,
        createdAt: saved.createdAt,
        isFavorite: true,
      });
    });

    it("should update an existing deck and master index entry", () => {
      const initial = saveDeck({
        id: "deck-to-update",
        title: "Old Title",
        topic: "Old Topic",
        cards: [{ front: "Q1", back: "A1" }],
      });

      expect(getDeckIndex()[0].title).toBe("Old Title");

      const updated = saveDeck({
        id: initial.id,
        title: "New Title",
        topic: "New Topic",
        cards: [
          { front: "Q1", back: "A1" },
          { front: "Q2", back: "A2" },
        ],
        createdAt: initial.createdAt,
        isFavorite: true,
      });

      expect(updated.title).toBe("New Title");
      expect(getDeckIndex()).toHaveLength(1);
      expect(getDeckIndex()[0].title).toBe("New Title");
      expect(getDeckIndex()[0].cardCount).toBe(2);
      expect(getDeckIndex()[0].isFavorite).toBe(true);
    });

    it("should preserve original createdAt timestamp when updating an existing deck without explicit createdAt", () => {
      saveDeck({
        id: "timestamp-test",
        title: "Initial Title",
        topic: "Topic",
        cards: [{ front: "Q", back: "A" }],
        createdAt: "2026-01-01T00:00:00.000Z",
      });

      const updated = saveDeck({
        id: "timestamp-test",
        title: "Updated Title",
        topic: "Topic",
        cards: [{ front: "Q", back: "A" }],
      });

      expect(updated.createdAt).toBe("2026-01-01T00:00:00.000Z");
      expect(getDeck("timestamp-test")?.createdAt).toBe(
        "2026-01-01T00:00:00.000Z",
      );
    });

    it("should return null for getDeck when key does not exist or has invalid JSON", () => {
      expect(getDeck("non-existent")).toBeNull();

      localStorage.setItem(`${DECK_KEY_PREFIX}corrupt`, "{bad json");
      expect(getDeck("corrupt")).toBeNull();
    });
  });

  describe("deleteDeck", () => {
    it("should remove deck key and remove item from master index", () => {
      saveDeck({
        id: "d-1",
        title: "Deck 1",
        topic: "Topic 1",
        cards: [{ front: "F", back: "B" }],
      });
      saveDeck({
        id: "d-2",
        title: "Deck 2",
        topic: "Topic 2",
        cards: [{ front: "F", back: "B" }],
      });

      expect(getDeckIndex()).toHaveLength(2);

      deleteDeck("d-1");

      expect(getDeck("d-1")).toBeNull();
      expect(localStorage.getItem(`${DECK_KEY_PREFIX}d-1`)).toBeNull();
      expect(getDeckIndex()).toHaveLength(1);
      expect(getDeckIndex()[0].id).toBe("d-2");
    });
  });

  describe("toggleFavorite", () => {
    it("should toggle favorite status on deck and index item", () => {
      const saved = saveDeck({
        id: "fav-test",
        title: "Fav Test",
        topic: "Fav",
        cards: [{ front: "F", back: "B" }],
        isFavorite: false,
      });

      expect(saved.isFavorite).toBe(false);

      const updated = toggleFavorite("fav-test");
      expect(updated?.isFavorite).toBe(true);
      expect(getDeck("fav-test")?.isFavorite).toBe(true);
      expect(getDeckIndex()[0].isFavorite).toBe(true);

      const toggledBack = toggleFavorite("fav-test");
      expect(toggledBack?.isFavorite).toBe(false);
      expect(getDeck("fav-test")?.isFavorite).toBe(false);
      expect(getDeckIndex()[0].isFavorite).toBe(false);
    });

    it("should return null if deck does not exist", () => {
      expect(toggleFavorite("unknown-id")).toBeNull();
    });
  });

  describe("exportBackup & importBackup", () => {
    it("should export all stored decks to valid JSON", () => {
      saveDeck({
        id: "d-1",
        title: "Deck 1",
        topic: "T1",
        cards: [{ front: "F1", back: "B1" }],
      });
      saveDeck({
        id: "d-2",
        title: "Deck 2",
        topic: "T2",
        cards: [{ front: "F2", back: "B2" }],
      });

      const backupStr = exportBackup();
      const backupObj = JSON.parse(backupStr);

      expect(backupObj.version).toBe(1);
      expect(backupObj.decks).toHaveLength(2);
      expect(backupObj.decks.map((d: { id: string }) => d.id)).toContain("d-1");
      expect(backupObj.decks.map((d: { id: string }) => d.id)).toContain("d-2");
    });

    it("should import backup payload with object wrapper", () => {
      const backupData = {
        version: 1,
        decks: [
          {
            id: "imp-1",
            title: "Imported 1",
            topic: "Topic 1",
            cards: [{ front: "Q", back: "A" }],
            createdAt: "2026-07-27T00:00:00.000Z",
            isFavorite: true,
          },
        ],
      };

      const result = importBackup(JSON.stringify(backupData));
      expect(result.success).toBe(true);
      expect(result.importedCount).toBe(1);

      const deck = getDeck("imp-1");
      expect(deck?.title).toBe("Imported 1");
      expect(getDeckIndex()).toHaveLength(1);
    });

    it("should return failure result on invalid backup format or bad JSON", () => {
      const badFormat = importBackup(JSON.stringify({ invalid: true }));
      expect(badFormat.success).toBe(false);
      expect(badFormat.importedCount).toBe(0);

      const badJson = importBackup("{ bad json");
      expect(badJson.success).toBe(false);
      expect(badJson.importedCount).toBe(0);
    });
  });
});
