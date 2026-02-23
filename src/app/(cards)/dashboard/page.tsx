import { redirect } from "next/navigation";
import db from "@/database/db";
import { decks } from "@/database/schema";
import authenticate from "@/utils/authenticate";
import { eq } from "drizzle-orm";

import { GenerateDeckForm } from "./_components/generate-deck-form";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userId = await authenticate();

  if (userId === "Unauthorized") {
    redirect("/sign-in");
  }

  const userDecks = await db.query.decks.findMany({
    where: eq(decks.ownerId, userId),
  });

  let totalCards = 0;
  if (userDecks.length > 0) {
    for (let deck of userDecks) {
      totalCards += deck.cards?.length || 0;
    }
  }

  return (
    <div className="bg-background/50 flex min-h-[calc(100vh-64px)] flex-col">
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <section className="animate-fade-in group">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  Generate New Deck
                </h2>
                <p className="text-muted-foreground mt-2">
                  Transform any topic into a study deck.
                </p>
              </div>
            </div>

            <div className="border-border bg-card/50 shadow-primary/5 hover:border-primary/20 rounded-3xl border p-6 shadow-2xl backdrop-blur-sm transition-all">
              <GenerateDeckForm />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
