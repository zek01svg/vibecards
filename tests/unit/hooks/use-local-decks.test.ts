import { useLocalDecks } from "@/hooks/use-local-decks";
import { deleteDeck, saveDeck } from "@/lib/local-deck-store";
import type { LocalDeck } from "@/lib/local-deck-store";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

describe("useLocalDecks", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with empty decks array when storage is empty", () => {
    const { result } = renderHook(() => useLocalDecks());
    expect(result.current.decks).toEqual([]);
  });

  it("should initialize with existing decks from localStorage", () => {
    saveDeck({
      id: "initial-deck",
      title: "Initial Deck",
      topic: "Init Topic",
      cards: [{ front: "Q", back: "A" }],
    });

    const { result } = renderHook(() => useLocalDecks());
    expect(result.current.decks).toHaveLength(1);
    expect(result.current.decks[0].id).toBe("initial-deck");
  });

  it("should create a deck and update state", () => {
    const { result } = renderHook(() => useLocalDecks());

    let createdDeck: LocalDeck | undefined;
    act(() => {
      createdDeck = result.current.createDeck({
        title: "New Created Deck",
        topic: "Testing",
        cards: [
          { front: "Card 1 Front", back: "Card 1 Back" },
          { front: "Card 2 Front", back: "Card 2 Back" },
        ],
      });
    });

    expect(createdDeck).toBeDefined();
    expect(result.current.decks).toHaveLength(1);
    expect(result.current.decks[0].title).toBe("New Created Deck");
    expect(result.current.decks[0].cardCount).toBe(2);

    const deckId = createdDeck?.id ?? "";
    const fetched = result.current.getDeck(deckId);
    expect(fetched?.title).toBe("New Created Deck");
  });

  it("should toggle favorite status and update state", () => {
    const { result } = renderHook(() => useLocalDecks());

    act(() => {
      result.current.createDeck({
        id: "fav-hook-test",
        title: "Fav Hook Test",
        topic: "Topic",
        cards: [{ front: "Q", back: "A" }],
        isFavorite: false,
      });
    });

    expect(result.current.decks[0].isFavorite).toBe(false);

    act(() => {
      result.current.toggleFavorite("fav-hook-test");
    });

    expect(result.current.decks[0].isFavorite).toBe(true);
    expect(result.current.getDeck("fav-hook-test")?.isFavorite).toBe(true);
  });

  it("should delete a deck and update state", () => {
    const { result } = renderHook(() => useLocalDecks());

    act(() => {
      result.current.createDeck({
        id: "deck-1",
        title: "Deck 1",
        topic: "Topic 1",
        cards: [{ front: "Q", back: "A" }],
      });
      result.current.createDeck({
        id: "deck-2",
        title: "Deck 2",
        topic: "Topic 2",
        cards: [{ front: "Q", back: "A" }],
      });
    });

    expect(result.current.decks).toHaveLength(2);

    act(() => {
      result.current.deleteDeck("deck-1");
    });

    expect(result.current.decks).toHaveLength(1);
    expect(result.current.decks[0].id).toBe("deck-2");
    expect(result.current.getDeck("deck-1")).toBeNull();
  });

  it("should support exportBackup and importBackup", () => {
    const { result } = renderHook(() => useLocalDecks());

    act(() => {
      result.current.createDeck({
        id: "backup-deck",
        title: "Backup Deck",
        topic: "Backup Topic",
        cards: [{ front: "Q", back: "A" }],
      });
    });

    let exported = "";
    act(() => {
      exported = result.current.exportBackup();
    });

    expect(exported).toContain("Backup Deck");

    act(() => {
      deleteDeck("backup-deck");
    });

    const { result: newHookResult } = renderHook(() => useLocalDecks());

    act(() => {
      newHookResult.current.importBackup(exported);
    });

    expect(newHookResult.current.decks).toHaveLength(1);
    expect(newHookResult.current.decks[0].id).toBe("backup-deck");
  });

  it("should synchronize state when a storage event is fired from another tab", () => {
    const { result } = renderHook(() => useLocalDecks());
    expect(result.current.decks).toHaveLength(0);

    // Simulate external storage update (e.g., another tab writing to localStorage)
    act(() => {
      saveDeck({
        id: "external-deck",
        title: "External Tab Deck",
        topic: "Tab Sync",
        cards: [{ front: "Q", back: "A" }],
      });
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "vibecards_deck_index",
        }),
      );
    });

    expect(result.current.decks).toHaveLength(1);
    expect(result.current.decks[0].title).toBe("External Tab Deck");
  });
});
