"use client";

import styles from "./page.module.css";

interface DashboardStatsProps {
    totalDecks: number;
    totalCards: number;
}

export function DashboardStats({
    totalDecks,
    totalCards,
}: DashboardStatsProps) {
    return (
        <div className={styles.stats}>
            <div className={styles.statCard}>
                <div className={styles.statValue}>{totalDecks}</div>
                <div className={styles.statLabel}>Total Decks</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statValue}>{totalCards}</div>
                <div className={styles.statLabel}>Total Cards</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statValue}>
                    {totalDecks > 0 ? Math.round(totalCards / totalDecks) : 0}
                </div>
                <div className={styles.statLabel}>Avg Cards/Deck</div>
            </div>
        </div>
    );
}
