"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Card } from "@/lib/schemas";

interface StudyModeProps {
    deck: {
        id: string;
        title: string;
        topic: string;
        cards: Card[];
    };
}

export function StudyMode({ deck }: StudyModeProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [studied, setStudied] = useState<Set<number>>(new Set());
    const [correct, setCorrect] = useState<Set<number>>(new Set());
    const [incorrect, setIncorrect] = useState<Set<number>>(new Set());
    const router = useRouter();

    // Safety check for empty cards array
    if (!deck.cards || deck.cards.length === 0) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyIcon}>⚠️</div>
                <h2>No Cards Available</h2>
                <p>This deck doesn't have any cards to study.</p>
                <button
                    className={`${styles.studyButton} ${styles.primary}`}
                    onClick={() => router.push("/dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const currentCard = deck.cards[currentIndex];
    const progress =
        deck.cards.length > 0
            ? ((studied.size / deck.cards.length) * 100).toFixed(0)
            : "0";

    const handleFlip = useCallback(() => {
        setIsFlipped(!isFlipped);
    }, [isFlipped]);

    const handleNext = useCallback(() => {
        if (currentIndex < deck.cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    }, [currentIndex, deck.cards.length]);

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
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
            handleNext();
        },
        [currentIndex, handleNext],
    );

    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === " ") {
                e.preventDefault();
                handleFlip();
            } else if (e.key === "ArrowRight" || e.key === "n") {
                handleNext();
            } else if (e.key === "ArrowLeft" || e.key === "p") {
                handlePrevious();
            } else if (e.key === "1") {
                handleAnswer(true);
            } else if (e.key === "2") {
                handleAnswer(false);
            }
        },
        [handleFlip, handleNext, handlePrevious, handleAnswer],
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [handleKeyPress]);

    if (!currentCard || currentIndex >= deck.cards.length) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyIcon}>🎉</div>
                <h2>Study Complete!</h2>
                <div className={styles.studyStats}>
                    <div className={styles.studyStat}>
                        <div className={styles.studyStatValue}>
                            {correct.size}
                        </div>
                        <div className={styles.studyStatLabel}>Correct</div>
                    </div>
                    <div className={styles.studyStat}>
                        <div className={styles.studyStatValue}>
                            {incorrect.size}
                        </div>
                        <div className={styles.studyStatLabel}>Incorrect</div>
                    </div>
                    <div className={styles.studyStat}>
                        <div className={styles.studyStatValue}>
                            {deck.cards.length > 0
                                ? Math.round(
                                      (correct.size / deck.cards.length) * 100,
                                  )
                                : 0}
                            %
                        </div>
                        <div className={styles.studyStatLabel}>Accuracy</div>
                    </div>
                </div>
                <button
                    className={`${styles.studyButton} ${styles.primary}`}
                    onClick={() => router.push("/dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className={styles.studyContainer}>
            <div className={styles.studyProgress}>
                Card {currentIndex + 1} of {deck.cards.length} ({progress}%
                complete)
            </div>

            <div className={styles.studyCard}>
                <div
                    className={`${styles.studyCardInner} ${isFlipped ? styles.flipped : ""}`}
                    onClick={handleFlip}
                >
                    <div className={styles.studyCardFront}>
                        <div className={styles.studyCardLabel}>Question</div>
                        <div className={styles.studyCardContent}>
                            {currentCard.front}
                        </div>
                        <div
                            style={{
                                marginTop: "2rem",
                                fontSize: "0.875rem",
                                color: "var(--text-tertiary)",
                            }}
                        >
                            Click or press SPACE to flip
                        </div>
                    </div>
                    <div className={styles.studyCardBack}>
                        <div className={styles.studyCardLabel}>Answer</div>
                        <div className={styles.studyCardContent}>
                            {currentCard.back}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.studyControls}>
                <button
                    className={styles.studyButton}
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    ← Previous
                </button>
                <button
                    className={`${styles.studyButton} ${styles.primary}`}
                    onClick={() => handleAnswer(true)}
                >
                    ✓ Correct (1)
                </button>
                <button
                    className={styles.studyButton}
                    onClick={() => handleAnswer(false)}
                    style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        borderColor: "var(--error)",
                        color: "var(--error)",
                    }}
                >
                    ✗ Incorrect (2)
                </button>
                <button
                    className={styles.studyButton}
                    onClick={handleNext}
                    disabled={currentIndex === deck.cards.length - 1}
                >
                    Next →
                </button>
            </div>

            <div className={styles.studyStats}>
                <div className={styles.studyStat}>
                    <div className={styles.studyStatValue}>{studied.size}</div>
                    <div className={styles.studyStatLabel}>Studied</div>
                </div>
                <div className={styles.studyStat}>
                    <div className={styles.studyStatValue}>{correct.size}</div>
                    <div className={styles.studyStatLabel}>Correct</div>
                </div>
                <div className={styles.studyStat}>
                    <div className={styles.studyStatValue}>
                        {incorrect.size}
                    </div>
                    <div className={styles.studyStatLabel}>Incorrect</div>
                </div>
            </div>
        </div>
    );
}
