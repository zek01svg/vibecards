"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Deck, FlashcardDeck } from "@/components/ui/flashcard-deck";
import { toast } from "sonner";

interface DeckListProps {
  decks: Deck[];
}

export function DeckList({ decks }: DeckListProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filter, setFilter] = useState(searchParams.get("filter") || "all");
  const router = useRouter();

  // Sync with URL params
  useEffect(() => {
    // Note: SearchBar handles its own routing, so we only need to sync internal state if needed
  }, [searchQuery, filter, router]);

  const handleDelete = async (deckId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Deck deleted successfully");
        router.refresh();
      } else {
        toast.error(`Failed to delete deck`);
      }
    } catch (error) {
      toast.error(`Error deleting deck`);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => (
        <Link key={deck.id} href={`/deck/${deck.id}`} className="group block">
          <FlashcardDeck deck={deck} onDelete={handleDelete} />
        </Link>
      ))}
    </div>
  );
}
