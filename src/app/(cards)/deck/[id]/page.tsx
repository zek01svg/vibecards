"use client";

import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useRouter, useSearchParams } from "next/navigation";

import { DeckHeader } from "@/components/deck/deck-header";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { authClient } from "@/lib/auth-client";
import type { Card } from "@/lib/validations/generate-deck-schema";

import { DeckView } from "./deck-view";
import { StudyMode } from "./study-mode";

interface Deck {
  id: string;
  title: string;
  topic: string;
  cards: Card[];
  ownerId: string;
}

export default function DeckPage() {
  const session = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams({ strict: false }) as { id: string };
  const [deck, setDeck] = useState<Deck | null>(null);
  const isStudyMode = searchParams.get("mode") === "study";

  useEffect(() => {
    if (!session.isPending && !session.data?.session) {
      router.push("/sign-in");
      return;
    }

    const load = async () => {
      try {
        const response = await fetch(`/api/decks/${id}`);
        if (!response.ok) {
          router.push("/my-decks");
          return;
        }

        const data = (await response.json()) as { success: boolean; deck?: Deck };
        if (data.success && data.deck) setDeck(data.deck);
        else router.push("/my-decks");
      } catch {
        router.push("/my-decks");
      }
    };

    if (session.data?.session) void load();
  }, [id, router, session.data?.session, session.isPending]);

  if (!deck) return null;

  return (
    <div className="bg-background/50 flex min-h-[calc(100vh-64px)] flex-col">
      <DeckHeader id={id} title={deck.title} isStudyMode={isStudyMode} />
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-center sm:hidden">
            <ModeToggle id={id} isStudyMode={isStudyMode} mobile />
          </div>
          <div className="animate-fade-in">
            {isStudyMode ? (
              <StudyMode deck={deck} />
            ) : (
              <div className="space-y-8">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold tracking-tight">{deck.title}</h2>
                  <p className="text-muted-foreground mt-1">{deck.topic}</p>
                </div>
                <DeckView deck={deck} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
