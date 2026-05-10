import { createServerFn } from "@tanstack/react-start";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { desc, eq } from "drizzle-orm";

import { EmptyState } from "@/components/deck/empty-state";
import type { Deck } from "@/components/deck/flashcard-deck";
import { FlashcardDeck } from "@/components/deck/flashcard-deck";
import { Button } from "@/components/ui/button";
import db from "@/database/db";
import { decks } from "@/database/schema";
import { useDeleteDeck } from "@/hooks/use-delete-deck";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";
import { authClient } from "@/lib/auth-client";
import authenticate from "@/utils/authenticate";
import type { MouseEvent } from "react";
import { useState } from "react";

const getDecks = createServerFn({ method: "GET" }).handler(
  async (): Promise<Deck[]> => {
    const userId = await authenticate();
    if (userId === "Unauthorized") throw redirect({ to: "/sign-in" });
    return db.query.decks.findMany({
      where: eq(decks.ownerId, userId),
      orderBy: [desc(decks.createdAt)],
    });
  },
);

export const Route = createFileRoute("/my-decks")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session) throw redirect({ to: "/sign-in" });
  },
  loader: () => getDecks(),
  component: MyDecksPage,
});

function MyDecksPage() {
  const initialDecks = Route.useLoaderData();
  const [deckList, setDeckList] = useState<Deck[]>(initialDecks);
  const { handleDeleteDeck, isPending } = useDeleteDeck();
  const { handleToggleFavorite, isPendingFavorite } = useToggleFavorite();

  async function onDelete(deckId: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    await handleDeleteDeck(deckId);
    setDeckList((current) => current.filter((deck) => deck.id !== deckId));
  }

  async function onToggleFavorite(
    deckId: string,
    isFavorite: boolean,
    event: MouseEvent,
  ) {
    event.preventDefault();
    event.stopPropagation();
    await handleToggleFavorite(deckId, isFavorite);
    setDeckList((current) =>
      current.map((deck) =>
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

      {deckList.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deckList.map((deck) => (
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
