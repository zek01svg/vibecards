"use client";

import { useCallback, useEffect, useState } from "react";
import { CompletionState } from "@/components/deck/completion-state";
import { EmptyState } from "@/components/deck/empty-state";
import { Flashcard } from "@/components/deck/flashcard";
import { KeyboardHint } from "@/components/deck/keyboard-hint";
import { StudyControls } from "@/components/deck/study-controls";
import { StudyProgress } from "@/components/deck/study-progress";
import type { Card as CardType } from "@/lib/validations/generate-deck-schema";

interface StudyModeProps {
  deck: {
    id: string;
    title: string;
    topic: string;
    cards: CardType[];
  };
}

export function StudyMode({ deck }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studied, setStudied] = useState<Set<number>>(new Set());
  const [correct, setCorrect] = useState<Set<number>>(new Set());
  const [incorrect, setIncorrect] = useState<Set<number>>(new Set());

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const cardsLength = deck?.cards?.length || 0;

  const handleNext = useCallback(() => {
    if (currentIndex < cardsLength - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, cardsLength]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      setStudied((prev) => new Set([...prev, currentIndex]));
      if (isCorrect) {
        setCorrect((prev) => new Set([...prev, currentIndex]));
      } else {
        setIncorrect((prev) => new Set([...prev, currentIndex]));
      }
      if (currentIndex < cardsLength - 1) {
        handleNext();
      } else {
        setCurrentIndex(cardsLength);
      }
    },
    [currentIndex, cardsLength, handleNext],
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (currentIndex >= cardsLength) return;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "1") {
        handleAnswer(true);
      } else if (e.key === "2") {
        handleAnswer(false);
      }
    },
    [
      handleFlip,
      handleNext,
      handlePrevious,
      handleAnswer,
      currentIndex,
      cardsLength,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const onRestart = useCallback(() => {
    setCurrentIndex(0);
    setStudied(new Set());
    setCorrect(new Set());
    setIncorrect(new Set());
    setIsFlipped(false);
  }, []);

  // ALL HOOKS ABOVE THIS LINE

  if (!deck.cards || deck.cards.length === 0) {
    return <EmptyState />;
  }

  if (currentIndex >= deck.cards.length) {
    return (
      <CompletionState
        title={deck.title}
        correctCount={correct.size}
        incorrectCount={incorrect.size}
        totalCards={deck.cards.length}
        onRestart={onRestart}
      />
    );
  }

  const currentCard = deck.cards[currentIndex];
  if (!currentCard) return null;

  const progressValue = (studied.size / deck.cards.length) * 100;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <StudyProgress
        currentCard={currentIndex + 1}
        totalCards={deck.cards.length}
        progressValue={progressValue}
      />

      <Flashcard
        front={currentCard.front}
        back={currentCard.back}
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StudyControls
          isFlipped={isFlipped}
          canGoNext={currentIndex < deck.cards.length - 1}
          canGoPrevious={currentIndex > 0}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onFlip={handleFlip}
        />
      </div>

      <KeyboardHint />
    </div>
  );
}
