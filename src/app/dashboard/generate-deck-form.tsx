"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type Difficulty = "beginner" | "intermediate" | "advanced";
type CardCount = 5 | 8 | 10 | 12 | 15 | 20;

export function GenerateDeckForm() {
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
    const [cardCount, setCardCount] = useState<CardCount>(10);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/generate-deck", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    topic,
                    difficulty,
                    cardCount,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate deck");
            }

            // Redirect to the new deck
            router.push(`/deck/${data.deckId}`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="topic" className={styles.label}>
                    Topic or Notes
                </label>
                <textarea
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic or notes to generate flashcards from..."
                    className={styles.textarea}
                    rows={4}
                    required
                    maxLength={500}
                    disabled={isLoading}
                />
                <p className={styles.charCount}>
                    {topic.length}/500 characters
                </p>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="difficulty" className={styles.label}>
                        Difficulty Level
                    </label>
                    <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) =>
                            setDifficulty(e.target.value as Difficulty)
                        }
                        className={styles.select}
                        disabled={isLoading}
                    >
                        <option value="beginner">🌱 Beginner</option>
                        <option value="intermediate">📚 Intermediate</option>
                        <option value="advanced">🚀 Advanced</option>
                    </select>
                    <p className={styles.helpText}>
                        {difficulty === "beginner" &&
                            "Simple concepts with clear explanations"}
                        {difficulty === "intermediate" &&
                            "Moderate complexity with detailed answers"}
                        {difficulty === "advanced" &&
                            "Complex topics with in-depth analysis"}
                    </p>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="cardCount" className={styles.label}>
                        Number of Cards
                    </label>
                    <select
                        id="cardCount"
                        value={cardCount}
                        onChange={(e) =>
                            setCardCount(Number(e.target.value) as CardCount)
                        }
                        className={styles.select}
                        disabled={isLoading}
                    >
                        <option value={5}>5 cards</option>
                        <option value={8}>8 cards</option>
                        <option value={10}>10 cards</option>
                        <option value={12}>12 cards</option>
                        <option value={15}>15 cards</option>
                        <option value={20}>20 cards</option>
                    </select>
                    <p className={styles.helpText}>
                        Choose how many flashcards to generate
                    </p>
                </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            <button
                type="submit"
                className={styles.button}
                disabled={isLoading || !topic.trim()}
            >
                {isLoading ? (
                    <>
                        <span className={styles.spinner}></span>
                        Generating...
                    </>
                ) : (
                    <>✨ Generate Deck</>
                )}
            </button>
        </form>
    );
}
