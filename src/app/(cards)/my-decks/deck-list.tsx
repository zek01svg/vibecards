"use client";

import { useState } from "react";
import { Deck, FlashcardDeck } from "@/components/deck/flashcard-deck";
import { useDeleteDeck } from "@/hooks/use-delete-deck";

interface DeckListProps {
  decks: Deck[];
}

/**
 * Renders a grid of flashcard deck summary cards.
 * Manages the delete state for individual decks to ensure appropriate UI feedback during deletion.
 *
 * @param props - Component properties
 * @param props.decks - Array of deck objects to display
 * @returns A responsive grid layout containing the user's decks
 */
export function DeckList({ decks }: DeckListProps) {
  const { handleDeleteDeck, isPending } = useDeleteDeck();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onDelete = async (id: string) => {
    setDeletingId(id);
    await handleDeleteDeck(id);
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => (
        <FlashcardDeck
          key={deck.id}
          deck={deck}
          onDelete={async (id) => await onDelete(id)}
          isPending={isPending && deletingId === deck.id}
        />
      ))}
    </div>
  );
}
