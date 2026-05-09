import { createFileRoute, redirect } from "@tanstack/react-router";
import { CompletionState } from "@/components/deck/completion-state";
import { DeckHeader } from "@/components/deck/deck-header";
import { EmptyState } from "@/components/deck/empty-state";
import { Flashcard } from "@/components/deck/flashcard";
import { KeyboardShortcutsHint } from "@/components/deck/keyboard-shortcuts-hint";
import { StudyControls } from "@/components/deck/study-controls";
import { StudyProgress } from "@/components/deck/study-progress";
import { authClient } from "@/lib/auth-client";
import type { Card as FlashcardData } from "@/lib/validations/generate-deck-schema";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/deck/$id")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session) throw redirect({ to: "/sign-in" });
  },
  component: DeckPage,
});

type DeckResponse = {
  id: string;
  title: string;
  cards: FlashcardData[];
};

function DeckPage() {
  const { id } = Route.useParams();
  const [deck, setDeck] = useState<DeckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    async function loadDeck() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/decks/${id}`);
        const result = (await response.json()) as {
          success: boolean;
          deck?: DeckResponse;
          error?: string;
        };

        if (!response.ok || !result.success || !result.deck) {
          setError(result.error ?? "Failed to load deck");
          return;
        }

        setDeck(result.deck);
      } catch {
        setError("Failed to load deck");
      } finally {
        setIsLoading(false);
      }
    }

    void loadDeck();
  }, [id]);

  const currentCard = deck?.cards[currentCardIndex] ?? null;
  const totalCards = deck?.cards.length ?? 0;
  const progressValue = useMemo(() => {
    if (totalCards === 0) return 0;
    return ((currentCardIndex + 1) / totalCards) * 100;
  }, [currentCardIndex, totalCards]);

  function goNext() {
    setCurrentCardIndex((index) => Math.min(index + 1, totalCards - 1));
    setIsFlipped(false);
  }

  function goPrevious() {
    setCurrentCardIndex((index) => Math.max(index - 1, 0));
    setIsFlipped(false);
  }

  function answerCard(correct: boolean) {
    if (correct) {
      setCorrectCount((count) => count + 1);
    } else {
      setIncorrectCount((count) => count + 1);
    }

    if (currentCardIndex >= totalCards - 1) {
      setIsComplete(true);
      return;
    }

    goNext();
  }

  function restart() {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsComplete(false);
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-12">Loading deck...</main>
    );
  }

  if (error || !deck) {
    return (
      <main className="container mx-auto px-6 py-12">
        <p className="text-destructive">{error ?? "Deck not found"}</p>
      </main>
    );
  }

  if (totalCards === 0 || !currentCard) {
    return (
      <>
        <DeckHeader id={id} title={deck.title} isStudyMode={false} />
        <main className="container mx-auto px-6 py-12">
          <EmptyState />
        </main>
      </>
    );
  }

  if (isComplete) {
    return (
      <>
        <DeckHeader id={id} title={deck.title} isStudyMode />
        <main className="container mx-auto px-6 py-12">
          <CompletionState
            title={deck.title}
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            totalCards={totalCards}
            onRestart={restart}
          />
        </main>
      </>
    );
  }

  return (
    <>
      <DeckHeader id={id} title={deck.title} isStudyMode />
      <main className="container mx-auto max-w-3xl space-y-8 px-6 py-12">
        <StudyProgress
          currentCard={currentCardIndex + 1}
          totalCards={totalCards}
          progressValue={progressValue}
        />
        <Flashcard
          front={currentCard.front}
          back={currentCard.back}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped((flipped) => !flipped)}
        />
        <StudyControls
          isFlipped={isFlipped}
          canGoNext={currentCardIndex < totalCards - 1}
          canGoPrevious={currentCardIndex > 0}
          onAnswer={answerCard}
          onNext={goNext}
          onPrevious={goPrevious}
          onFlip={() => setIsFlipped(true)}
        />
        <div className="text-muted-foreground flex flex-wrap justify-center gap-3 text-xs">
          <KeyboardShortcutsHint />
        </div>
      </main>
    </>
  );
}
