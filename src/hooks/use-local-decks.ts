import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteDeck as deleteLocalDeck,
  exportBackup,
  getDeck,
  getDeckIndex,
  importBackup as importLocalBackup,
  saveDeck,
  toggleFavorite as toggleLocalFavorite,
} from "@/lib/local-deck-store";
import type {
  DeckIndexItem,
  LocalDeck,
  SaveDeckInput,
} from "@/lib/local-deck-store";

export function useLocalDecks() {
  const [decks, setDecks] = useState<DeckIndexItem[]>(() => getDeckIndex());

  const refreshIndex = useCallback(() => {
    setDecks(getDeckIndex());
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || event.key.startsWith("vibecards_")) {
        refreshIndex();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshIndex]);

  const createDeck = useCallback(
    (payload: SaveDeckInput): LocalDeck => {
      const newDeck = saveDeck(payload);
      refreshIndex();
      return newDeck;
    },
    [refreshIndex],
  );

  const deleteDeck = useCallback(
    (id: string): void => {
      deleteLocalDeck(id);
      refreshIndex();
    },
    [refreshIndex],
  );

  const toggleFavorite = useCallback(
    (id: string): LocalDeck | null => {
      const updated = toggleLocalFavorite(id);
      refreshIndex();
      if (updated) {
        toast.success(
          `Deck ${updated.isFavorite ? "added to" : "removed from"} favorites`,
        );
      }
      return updated;
    },
    [refreshIndex],
  );

  const importBackup = useCallback(
    (jsonString: string) => {
      const result = importLocalBackup(jsonString);
      refreshIndex();
      return result;
    },
    [refreshIndex],
  );

  return {
    decks,
    getDeck,
    createDeck,
    deleteDeck,
    toggleFavorite,
    exportBackup,
    importBackup,
    refreshIndex,
  };
}
