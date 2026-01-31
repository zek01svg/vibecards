"use client";

import styles from "./page.module.css";
import { Card } from "@/lib/schemas";

interface DeckViewProps {
    deck: {
        id: string;
        title: string;
        topic: string;
        cards: Card[];
    };
}

export function DeckView({ deck }: DeckViewProps) {
    if (!deck.cards || deck.cards.length === 0) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyIcon}>⚠️</div>
                <p>This deck doesn't have any cards.</p>
            </div>
        );
    }

    return (
        <div className={styles.cardsContainer}>
            {deck.cards.map((card, index) => (
                <div key={index} className={styles.card}>
                    <div className={styles.cardFront}>
                        <h3>Front</h3>
                        <p>{card.front}</p>
                    </div>
                    <div className={styles.cardBack}>
                        <h3>Back</h3>
                        <p>{card.back}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
