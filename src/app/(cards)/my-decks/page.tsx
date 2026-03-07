import { Suspense } from "react";
import { redirect } from "next/navigation";
import db from "@/database/db";
import { decks } from "@/database/schema";
import { Card } from "@/lib/validations/generate-deck-schema";
import authenticate from "@/utils/authenticate";
import { desc, eq } from "drizzle-orm";

import { DeckList } from "./deck-list";
import { EmptyDeckList } from "./empty-deck-list";
import { SearchBar } from "./search-bar";

interface Deck {
  id: string;
  title: string;
  topic: string;
  cards: Card[];
  createdAt: string;
  isFavorite: boolean;
}

/**
 * Server Component responsible for securely querying the database for a specific user's decks.
 * If no decks are found, it falls back to the `EmptyDeckList` view.
 *
 * @param props - Component properties
 * @param props.userId - The authenticated user's ID
 * @returns The populated `DeckList` component or the `EmptyDeckList` fallback
 */
async function DecksFetcher({ userId }: { userId: string }) {
  // Query MUST filter by owner_id to only show current user's decks
  const userDecks = await db.query.decks.findMany({
    where: eq(decks.ownerId, userId),
    orderBy: [desc(decks.createdAt)],
  });

  if (!userDecks || userDecks.length === 0) {
    return <EmptyDeckList />;
  }

  return <DeckList decks={userDecks as Deck[]} />;
}

/**
 * The main "My Decks" page structural layout.
 * Ensures the user is authenticated, provides the header UI, and utilizes React Suspense
 * to stream the database deck fetching process for better perceived performance.
 *
 * @returns The Next.js page layout
 */
export default async function MyDecksPage() {
  const userId = await authenticate();
  if (userId === "Unauthorized") {
    redirect("/sign-in");
  }

  return (
    <div className="bg-background/50 flex min-h-[calc(100vh-64px)] flex-col">
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl space-y-12">
          <section className="animate-fade-in">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  Your Decks
                </h2>
                <p className="text-muted-foreground mt-2">
                  Browse and manage your personalized study collections.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <SearchBar />
            </div>

            <Suspense
              fallback={
                <div className="flex h-32 items-center justify-center">
                  <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                </div>
              }
            >
              <DecksFetcher userId={userId} />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}
