import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import db from "@/database/db";
import { decks } from "@/database/schema";
import { Card } from "@/lib/validations/generate-deck-schema";
import authenticate from "@/utils/authenticate";
import { eq } from "drizzle-orm";

import { DeckList } from "./deck-list";
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

  let totalCards = 0;
  if (userDecks.length > 0) {
    for (const deck of userDecks) {
      totalCards += deck.cards?.length || 0;
    }
  }

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
                <Empty className="border-border/60 bg-card/30 rounded-3xl border border-dashed p-12 text-center backdrop-blur-sm">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <div className="text-4xl opacity-50">📚</div>
                    </EmptyMedia>
                    <EmptyTitle className="mt-4 text-xl font-semibold">
                      No decks found
                    </EmptyTitle>
                    <EmptyDescription className="text-muted-foreground">
                      You haven&apos;t generated any flashcard decks yet.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent className="mt-6">
                    <Link href="/dashboard">
                      <Button className="shadow-primary/20 rounded-xl font-bold shadow-lg transition-all active:scale-95">
                        Generate Your First Deck
                      </Button>
                    </Link>
                  </EmptyContent>
                </Empty>
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
