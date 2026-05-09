import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { EmptyState } from "@/components/deck/empty-state";
import type { Deck } from "@/components/deck/flashcard-deck";
import { FlashcardDeck } from "@/components/deck/flashcard-deck";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useDeleteDeck } from "@/hooks/use-delete-deck";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/my-decks")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session) throw redirect({ to: "/sign-in" });
  },
  component: MyDecksPage,
});

function MyDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleDeleteDeck, isPending } = useDeleteDeck();
  const { handleToggleFavorite, isPendingFavorite } = useToggleFavorite();

  async function loadDecks() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/decks");
      const result = (await response.json()) as {
        success: boolean;
        decks?: Deck[];
        error?: string;
      };

      if (!response.ok || !result.success) {
        setError(result.error ?? "Failed to load decks");
        return;
      }

      setDecks(result.decks ?? []);
    } catch {
      setError("Failed to load decks");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDecks();
  }, []);

  async function onDelete(deckId: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    await handleDeleteDeck(deckId);
    setDecks((currentDecks) =>
      currentDecks.filter((deck) => deck.id !== deckId),
    );
  }

  async function onToggleFavorite(
    deckId: string,
    isFavorite: boolean,
    event: MouseEvent,
  ) {
    event.preventDefault();
    event.stopPropagation();
    await handleToggleFavorite(deckId, isFavorite);
    setDecks((currentDecks) =>
      currentDecks.map((deck) =>
        deck.id === deckId ? { ...deck, isFavorite } : deck,
      ),
    );
  }

  return (
    <main className="container mx-auto space-y-8 px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">My Decks</h1>
          <p className="text-muted-foreground mt-2">
            Study, favorite, and manage your generated flashcards.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard">Generate Deck</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading decks...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : decks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <FlashcardDeck
              key={deck.id}
              deck={deck}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              isPending={isPending}
              isPendingFavorite={isPendingFavorite}
            />
          ))}
        </div>
      )}
    </main>
  );
}
