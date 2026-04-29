
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import type { Card } from "@/lib/validations/generate-deck-schema";

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

export default function MyDecksPage() {
  const navigate = useNavigate();
  const session = authClient.useSession();
  const [items, setItems] = useState<Deck[] | null>(null);

  useEffect(() => {
    if (!session.isPending && !session.data?.session) {
      void navigate({ to: "/sign-in" });
      return;
    }

    const load = async () => {
      try {
        const response = await fetch("/api/decks");
        if (!response.ok) {
          setItems([]);
          return;
        }

        const data = (await response.json()) as { success: boolean; decks?: Deck[] };
        if (data.success) setItems(data.decks ?? []);
        else setItems([]);
      } catch {
        setItems([]);
      }
    };

    if (session.data?.session) {
      void load();
    }
  }, [navigate, session.data?.session, session.isPending]);

  if (session.isPending || !items) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-background/50 flex min-h-[calc(100vh-64px)] flex-col">
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl space-y-12">
          <section className="animate-fade-in">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Your Decks</h2>
                <p className="text-muted-foreground mt-2">Browse and manage your personalized study collections.</p>
              </div>
            </div>

            <div className="mb-8">
              <SearchBar />
            </div>

            <Suspense fallback={<div className="flex h-32 items-center justify-center"><div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" /></div>}>
              {items.length === 0 ? <EmptyDeckList /> : <DeckList decks={items} />}
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}
