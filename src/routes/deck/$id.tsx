import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { CompletionState } from "@/components/deck/completion-state";
import { DeckHeader } from "@/components/deck/deck-header";
import { EmptyState } from "@/components/deck/empty-state";
import { Flashcard } from "@/components/deck/flashcard";
import { KeyboardShortcutsHint } from "@/components/deck/keyboard-shortcuts-hint";
import { StudyControls } from "@/components/deck/study-controls";
import { StudyProgress } from "@/components/deck/study-progress";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useLocalDecks } from "@/hooks/use-local-decks";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/deck/$id")({
  component: DeckPage,
});

function DeckPage() {
  const { id } = Route.useParams();
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
              <Link to="/my-decks">Back to My Decks</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  const currentCard = deck.cards[currentCardIndex];
  const totalCards = deck.cards.length;
  const isStudyMode = totalCards > 0;
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
    void navigate({ to: "/my-decks" });
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
          <EmptyState />
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
