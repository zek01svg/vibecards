'use client';

import styles from './page.module.css';
import { Card } from '@/lib/schemas';

interface DeckViewProps {
  deck: {
    id: string;
    title: string;
    topic: string;
    cards: Card[];
  };
}

export function DeckView({ deck }: DeckViewProps) {
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
