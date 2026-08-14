import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CompletionState } from "@/components/deck/completion-state";
import { DeckHeader } from "@/components/deck/deck-header";
import { EmptyState } from "@/components/deck/empty-state";
import { Flashcard } from "@/components/deck/flashcard";
import { FlashcardDeck } from "@/components/deck/flashcard-deck";
import { KeyboardShortcutsHint } from "@/components/deck/keyboard-shortcuts-hint";
import { StudyControls } from "@/components/deck/study-controls";
import { StudyProgress } from "@/components/deck/study-progress";

const mockNavigate = vi.fn<() => void>();

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to?: string;
  }) => (
    <a href={to ?? "#"} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

describe("Deck Components Unit Tests", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("CompletionState", () => {
    it("renders accuracy, score breakdown, and triggers restart and navigate", () => {
      const onRestart = vi.fn<() => void>();
      render(
        <CompletionState
          title="Biology 101"
          correctCount={4}
          incorrectCount={1}
          totalCards={5}
          onRestart={onRestart}
        />,
      );

      expect(screen.getByText(/session complete/i)).toBeDefined();
      expect(screen.getByText(/you finished "Biology 101"/i)).toBeDefined();
      expect(screen.getByText("80")).toBeDefined(); // 4/5 = 80%
      expect(screen.getByText(/4 got it/i)).toBeDefined();
      expect(screen.getByText(/1 missed/i)).toBeDefined();

      const restartButton = screen.getByRole("button", {
        name: /study again/i,
      });
      fireEvent.click(restartButton);
      expect(onRestart).toHaveBeenCalledTimes(1);

      const backButton = screen.getByRole("button", {
        name: /back to dashboard/i,
      });
      fireEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
    });
  });

  describe("StudyControls", () => {
    it("renders navigation and flip buttons when not flipped", () => {
      const onAnswer = vi.fn<(correct: boolean) => void>();
      const onNext = vi.fn<() => void>();
      const onPrevious = vi.fn<() => void>();
      const onFlip = vi.fn<() => void>();

      render(
        <StudyControls
          isFlipped={false}
          canGoNext={true}
          canGoPrevious={true}
          onAnswer={onAnswer}
          onNext={onNext}
          onPrevious={onPrevious}
          onFlip={onFlip}
        />,
      );

      const prevButton = screen.getByRole("button", { name: /previous card/i });
      const nextButton = screen.getByRole("button", { name: /next card/i });
      const flipButton = screen.getByRole("button", { name: /reveal answer/i });

      fireEvent.click(prevButton);
      expect(onPrevious).toHaveBeenCalledTimes(1);

      fireEvent.click(nextButton);
      expect(onNext).toHaveBeenCalledTimes(1);

      fireEvent.click(flipButton);
      expect(onFlip).toHaveBeenCalledTimes(1);
    });

    it("renders Got It and Missed It buttons when flipped", () => {
      const onAnswer = vi.fn<(correct: boolean) => void>();
      const onNext = vi.fn<() => void>();
      const onPrevious = vi.fn<() => void>();
      const onFlip = vi.fn<() => void>();

      render(
        <StudyControls
          isFlipped={true}
          canGoNext={true}
          canGoPrevious={true}
          onAnswer={onAnswer}
          onNext={onNext}
          onPrevious={onPrevious}
          onFlip={onFlip}
        />,
      );

      const missedButton = screen.getByRole("button", { name: /missed it/i });
      const gotButton = screen.getByRole("button", { name: /got it/i });

      fireEvent.click(missedButton);
      expect(onAnswer).toHaveBeenCalledWith(false);

      fireEvent.click(gotButton);
      expect(onAnswer).toHaveBeenCalledWith(true);
    });
  });

  describe("DeckHeader", () => {
    it("renders deck title and invokes favorite and delete callbacks", () => {
      const onToggleFavorite = vi.fn<() => void>();
      const onDelete = vi.fn<() => void>();

      render(
        <DeckHeader
          id="deck-123"
          title="World History"
          isStudyMode={true}
          isFavorite={false}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />,
      );

      expect(screen.getByText("World History")).toBeDefined();

      const favoriteButton = screen.getByRole("button", {
        name: /favorite deck/i,
      });
      fireEvent.click(favoriteButton);
      expect(onToggleFavorite).toHaveBeenCalledTimes(1);

      const deleteButton = screen.getByRole("button", {
        name: /delete deck/i,
      });
      fireEvent.click(deleteButton);

      const confirmDelete = screen.getByRole("button", { name: /^delete$/i });
      fireEvent.click(confirmDelete);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe("Flashcard", () => {
    it("renders front and back text with flip button click", () => {
      const onFlip = vi.fn<() => void>();
      const { rerender } = render(
        <Flashcard
          front="What is React?"
          back="A JS library"
          isFlipped={false}
          onFlip={onFlip}
        />,
      );

      expect(screen.getByText("What is React?")).toBeDefined();

      rerender(
        <Flashcard
          front="What is React?"
          back="A JS library"
          isFlipped={true}
          onFlip={onFlip}
        />,
      );

      expect(screen.getByText("A JS library")).toBeDefined();
    });
  });

  describe("EmptyState", () => {
    it("renders desk and deck empty variants", () => {
      const { rerender } = render(<EmptyState kind="desk" />);
      expect(screen.getByText("It's quiet in here.")).toBeDefined();

      rerender(<EmptyState kind="deck" />);
      expect(screen.getByText("Nothing to study here.")).toBeDefined();
    });
  });

  describe("StudyProgress & KeyboardShortcutsHint", () => {
    it("renders progress bar and keyboard shortcuts guide", () => {
      render(
        <>
          <StudyProgress currentCard={2} totalCards={4} progressValue={50} />
          <KeyboardShortcutsHint />
        </>,
      );

      expect(screen.getByText("Card 2 of 4")).toBeDefined();
      expect(screen.getByText("50%")).toBeDefined();
      expect(screen.getByText("Flip")).toBeDefined();
      expect(screen.getByText("Got it")).toBeDefined();
      expect(screen.getByText("Missed")).toBeDefined();
    });
  });

  describe("FlashcardDeck", () => {
    it("renders deck card item and triggers delete and favorite actions", () => {
      const onDelete = vi.fn<(id: string, e: React.MouseEvent) => void>();
      const onToggleFavorite =
        vi.fn<(id: string, isFavorite: boolean, e: React.MouseEvent) => void>();

      render(
        <FlashcardDeck
          deck={{
            id: "deck-xyz",
            title: "Physics Mechanics",
            topic: "Newton's laws of motion",
            cardCount: 10,
            createdAt: new Date().toISOString(),
            isFavorite: false,
          }}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />,
      );

      expect(screen.getByText("Physics Mechanics")).toBeDefined();
      expect(screen.getByText("10 cards")).toBeDefined();

      const favoriteButton = screen.getByRole("button", {
        name: /favorite physics mechanics/i,
      });
      fireEvent.click(favoriteButton);
      expect(onToggleFavorite).toHaveBeenCalledTimes(1);

      const deleteButton = screen.getByRole("button", {
        name: /delete physics mechanics/i,
      });
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByRole("button", { name: /^delete$/i });
      fireEvent.click(confirmButton);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });
});
