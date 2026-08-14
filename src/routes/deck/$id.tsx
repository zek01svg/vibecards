import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CompletionState } from "@/components/deck/completion-state";
import { DeckHeader } from "@/components/deck/deck-header";
import { EmptyState } from "@/components/deck/empty-state";
import { Flashcard } from "@/components/deck/flashcard";
import { KeyboardShortcutsHint } from "@/components/deck/keyboard-shortcuts-hint";
import { StudyControls } from "@/components/deck/study-controls";
import { StudyProgress } from "@/components/deck/study-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useLocalDecks } from "@/hooks/use-local-decks";

export type DeckSearch = {
  mode?: "study" | "list";
};

export const Route = createFileRoute("/deck/$id")({
  validateSearch: (search: Record<string, unknown>): DeckSearch => ({
    mode: search.mode === "list" ? "list" : "study",
  }),
  component: DeckPage,
});

function DeckPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { getDeck, toggleFavorite, deleteDeck } = useLocalDecks();

  const [deck, setDeck] = useState(() => getDeck(id));

  useEffect(() => {
    setDeck(getDeck(id));
  }, [id, getDeck]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  if (!deck) {
    return (
      <main className="container mx-auto max-w-3xl px-6 py-12">
        <Empty className="border-border rounded-xl border py-12">
          <EmptyHeader>
            <EmptyTitle className="text-2xl font-bold">
              Deck Not Found
            </EmptyTitle>
            <EmptyDescription>
              The deck you are looking for does not exist or has been deleted.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  const currentCard = deck.cards[currentCardIndex];
  const totalCards = deck.cards.length;
  const isStudyMode = (search.mode ?? "study") !== "list";
  const progressValue = useMemo(() => {
    if (totalCards === 0) return 0;
    return ((currentCardIndex + 1) / totalCards) * 100;
  }, [currentCardIndex, totalCards]);

  function handleToggleFavorite() {
    if (!deck) return;
    const updated = toggleFavorite(deck.id);
    if (updated) setDeck({ ...updated });
  }

  function handleDelete() {
    if (!deck) return;
    deleteDeck(deck.id);
    toast.success("Deck deleted successfully");
    void navigate({ to: "/dashboard" });
  }

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

  const deckHeader = (
    <DeckHeader
      id={id}
      title={deck.title}
      isStudyMode={isStudyMode}
      isFavorite={deck.isFavorite}
      onToggleFavorite={handleToggleFavorite}
      onDelete={handleDelete}
    />
  );

  if (totalCards === 0) {
    return (
      <>
        {deckHeader}
        <main className="container mx-auto px-6 py-12">
          <EmptyState kind="deck" />
        </main>
      </>
    );
  }

  if (!isStudyMode) {
    return (
      <>
        {deckHeader}
        <main className="container mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-3xl font-bold tracking-tight">
                  All cards
                </h2>
                <span className="bg-secondary text-secondary-foreground rounded-[3px] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.15em] uppercase">
                  {totalCards} cards
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Every card in &quot;{deck.title}&quot; at a glance.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild className="shadow-paper">
                <Link
                  to="/deck/$id"
                  params={{ id: deck.id }}
                  search={{ mode: "study" }}
                >
                  Start studying
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {deck.cards.map((card, index) => (
              <Card
                key={index}
                className="bg-card text-card-foreground border-border/70 hover:border-foreground/30 hover:shadow-card shadow-paper flex flex-col justify-between rounded-sm border transition-all"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-card-foreground/40 font-mono text-[10px] font-semibold tracking-[0.18em] uppercase">
                      № {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <CardTitle className="font-display mt-2 text-base leading-snug font-semibold tracking-tight">
                    {card.front}
                  </CardTitle>
                </CardHeader>
                <CardContent className="border-border/60 bg-secondary/50 border-t p-5">
                  <div className="text-card-foreground/40 mb-1.5 font-mono text-[10px] font-semibold tracking-[0.18em] uppercase">
                    Answer
                  </div>
                  <p className="text-card-foreground/70 text-sm leading-relaxed">
                    {card.back}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </>
    );
  }

  if (isComplete) {
    return (
      <>
        {deckHeader}
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
      {deckHeader}
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
