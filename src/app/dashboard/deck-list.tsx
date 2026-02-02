"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/lib/schemas";

import styles from "./page.module.css";

interface Deck {
    id: string;
    title: string;
    topic: string;
    cards: Card[];
    createdAt: string;
}

interface DeckListProps {
    decks: Deck[];
}

export function DeckList({ decks }: DeckListProps) {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [filter, setFilter] = useState(searchParams.get("filter") || "all");
    const router = useRouter();

    // Sync with URL params
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (filter !== "all") params.set("filter", filter);
        router.replace(`/dashboard?${params.toString()}`, { scroll: false });
    }, [searchQuery, filter, router]);

    const filteredDecks = useMemo(() => {
        let filtered = [...decks];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (deck) =>
                    deck.title.toLowerCase().includes(query) ||
                    deck.topic.toLowerCase().includes(query),
            );
        }

        // Apply category filter
        if (filter === "recent") {
            filtered = filtered.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            );
        } else if (filter === "large") {
            filtered = filtered
                .filter((deck) => (deck.cards?.length || 0) >= 10)
                .sort(
                    (a, b) => (b.cards?.length || 0) - (a.cards?.length || 0),
                );
        }

        return filtered;
    }, [decks, searchQuery, filter]);

    const handleDelete = async (deckId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Are you sure you want to delete this deck?")) {
            return;
        }

        try {
            const response = await fetch(`/api/decks/${deckId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert("Failed to delete deck");
            }
        } catch (error) {
            console.error("Error deleting deck:", error);
            alert("Failed to delete deck");
        }
    };

    const handleExport = async (deck: Deck, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const dataStr = JSON.stringify(deck, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${deck.title.replace(/\s+/g, "-")}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <ul className={styles.deckList}>
                {filteredDecks.map((deck) => (
                    <li key={deck.id} className={styles.deckItem}>
                        <Link
                            href={`/deck/${deck.id}`}
                            className={styles.deckLink}
                        >
                            <h3>{deck.title}</h3>
                            <p className={styles.topic}>{deck.topic}</p>
                            <div className={styles.date}>
                                <span>📅</span>
                                Created:{" "}
                                {new Date(deck.createdAt).toLocaleDateString()}
                            </div>
                            <span className={styles.cardCount}>
                                {deck.cards?.length || 0} cards
                            </span>
                        </Link>
                        <div className={styles.deckActions}>
                            <Link
                                href={`/deck/${deck.id}?mode=study`}
                                className={styles.deckActionButton}
                                onClick={(e) => e.stopPropagation()}
                            >
                                🎓 Study
                            </Link>
                            <button
                                className={styles.deckActionButton}
                                onClick={(e) => handleExport(deck, e)}
                            >
                                📥 Export
                            </button>
                            <button
                                className={`${styles.deckActionButton} ${styles.danger}`}
                                onClick={(e) => handleDelete(deck.id, e)}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {filteredDecks.length === 0 && searchQuery && (
                <div className={styles.empty}>
                    <p>No decks found matching &quot;{searchQuery}&quot;</p>
                </div>
            )}
        </>
    );
}
