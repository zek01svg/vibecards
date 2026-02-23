import { notFound, redirect } from "next/navigation";
import { DeckHeader } from "@/components/deck/deck-header";
import { ModeToggle } from "@/components/ui/mode-toggle";
import db from "@/database/db";
import { decks } from "@/database/schema";
import { Card } from "@/lib/validations/generate-deck-schema";
import authenticate from "@/utils/authenticate";
import { eq } from "drizzle-orm";

import { DeckView } from "./deck-view";
import { StudyMode } from "./study-mode";

export const dynamic = "force-dynamic";

interface Deck {
  id: string;
  title: string;
  topic: string;
  cards: Card[];
  ownerId: string;
}

export default async function DeckPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const userId = await authenticate();
  const { id } = await params;
  const { mode } = await searchParams;

  if (userId === "Unauthorized") {
    redirect("/sign-in");
  }

  // Fetch deck and verify it belongs to current user
  const [deck] = await db.select().from(decks).where(eq(decks.id, id));

  if (!deck) {
    notFound();
  }

  // Verify deck belongs to current user (owner_id check)
  if (deck.ownerId !== userId) {
    notFound();
  }

  const typedDeck = deck as Deck;
  const isStudyMode = mode === "study";

  return (
    <div className="bg-background/50 flex min-h-[calc(100vh-64px)] flex-col">
      <DeckHeader id={id} title={typedDeck.title} isStudyMode={isStudyMode} />

      {/* Main Content Area */}
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          {/* Mobile Mode Switcher */}
          <div className="mb-8 flex items-center justify-center sm:hidden">
            <ModeToggle id={id} isStudyMode={isStudyMode} mobile />
          </div>

          <div className="animate-fade-in">
            {isStudyMode ? (
              <StudyMode deck={typedDeck} />
            ) : (
              <div className="space-y-8">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {typedDeck.title}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {typedDeck.topic}
                  </p>
                </div>
                <DeckView deck={typedDeck} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
