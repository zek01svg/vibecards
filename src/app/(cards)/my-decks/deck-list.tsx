"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
/**
 * Renders a grid of flashcard deck summary cards.
 * Manages the delete state for individual decks to ensure appropriate UI feedback during deletion.
 *
 * @param props - Component properties
 * @param props.decks - Array of deck objects to display
 * @returns A responsive grid layout containing the user's decks
 */
import { FlashcardDeck } from "@/components/deck/flashcard-deck";
import type { Deck } from "@/components/deck/flashcard-deck";
import { useDeleteDeck } from "@/hooks/use-delete-deck";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";

interface DeckListProps {
  decks: Deck[];
}

export function DeckList({ decks }: DeckListProps) {
  const { handleDeleteDeck, isPending } = useDeleteDeck();
  const { handleToggleFavorite, isPendingFavorite } = useToggleFavorite();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const onDelete = async (id: string) => {
    setDeletingId(id);
    await handleDeleteDeck(id);
  };

  const onToggleFavorite = async (id: string, isFavorite: boolean) => {
    setTogglingId(id);
    await handleToggleFavorite(id, isFavorite);
  };

  const q = searchParams.get("q")?.toLowerCase() || "";
  const filter = searchParams.get("filter") || "all";

  const filteredDecks = decks.filter((deck) => {
    if (
      q &&
      !deck.title.toLowerCase().includes(q) &&
      !deck.topic.toLowerCase().includes(q)
    )
      return false;
    if (filter === "favorites" && !deck.isFavorite) return false;
    if (filter === "recent") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (new Date(deck.createdAt) < sevenDaysAgo) return false;
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredDecks.map((deck) => (
        <FlashcardDeck
          key={deck.id}
          deck={deck}
          onDelete={async (id) => await onDelete(id)}
          onToggleFavorite={async (id, isFav) =>
            await onToggleFavorite(id, isFav)
          }
          isPending={isPending && deletingId === deck.id}
          isPendingFavorite={isPendingFavorite && togglingId === deck.id}
        />
      ))}
    </div>
  );
}
