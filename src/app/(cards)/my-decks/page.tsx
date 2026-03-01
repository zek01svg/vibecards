import { Suspense } from "react";
import { redirect } from "next/navigation";
import db from "@/database/db";
import { decks } from "@/database/schema";
import { Card } from "@/lib/validations/generate-deck-schema";
import authenticate from "@/utils/authenticate";
import { eq } from "drizzle-orm";


import { DeckList } from "./deck-list";
import { EmptyDeckList } from "./empty-deck-list";
import { SearchBar } from "./search-bar";


export const dynamic = "force-dynamic";

interface Deck {
  id: string;
  title: string;
  topic: string;
  cards: Card[];
  createdAt: string;
}

export default async function DashboardPage() {
  const userId = await authenticate();
  if (userId === "Unauthorized") {
    redirect("/sign-in");
  }

  // Query MUST filter by owner_id to only show current user's decks
  const userDecks = await db.query.decks.findMany({
    where: eq(decks.ownerId, userId),
  });

  return (
    <div className="bg-background/50 flex min-h-[calc(100vh-64px)] flex-col">
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl space-y-12">
          <section className="animate-fade-in group">
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

            <Suspense
              fallback={
                <div className="flex h-32 items-center justify-center">
                  <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                </div>
              }
            >
              <div className="mb-8">
                <SearchBar />
              </div>

              {!userDecks || userDecks.length === 0 ? (
                <EmptyDeckList />
              ) : (
                <DeckList decks={userDecks as Deck[]} />
              )}
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}