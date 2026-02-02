import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import db from "@/database/db";
import { decks } from "@/database/schema";
import { Card } from "@/lib/schemas";
import authenticate from "@/utils/authenticate";
import { eq } from "drizzle-orm";

import { DeckView } from "./deck-view";
import { ExportButton } from "./export-button";
import styles from "./page.module.css";
import { StudyMode } from "./study-mode";

export const dynamic = "force-dynamic";

interface Deck {
    id: string;
    title: string;
    topic: string;
    cards: Card[];
    ownerId: string;
}

export default async function DeckPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ mode?: string }>;
}) {
    const userId = await authenticate();
    const { id } = await params;
    const { mode } = await searchParams;

    if (userId === "Unauthorized") {
        redirect("/sign-in");
    }

    // Fetch deck and verify it belongs to current user
    const [deck] = await db.select().from(decks).where(eq(decks.id, id));

    if (!deck) {
        notFound();
    }

    // Verify deck belongs to current user (owner_id check)
    if (deck.ownerId !== userId) {
        notFound();
    }

    const typedDeck = deck as Deck;
    const isStudyMode = mode === "study";

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <Link href="/dashboard" className={styles.backLink}>
                        ← Back to Dashboard
                    </Link>
                    <div className={styles.headerActions}>
                        <ExportButton deck={typedDeck} />
                    </div>
                </div>
                <h1>{typedDeck.title}</h1>
                <p className={styles.topic}>{typedDeck.topic}</p>
            </header>

            <div className={styles.modeToggle}>
                <Link
                    href={`/deck/${id}`}
                    className={`${styles.modeButton} ${!isStudyMode ? styles.active : ""}`}
                >
                    📋 View All
                </Link>
                <Link
                    href={`/deck/${id}?mode=study`}
                    className={`${styles.modeButton} ${isStudyMode ? styles.active : ""}`}
                >
                    🎓 Study Mode
                </Link>
            </div>

            <main className={styles.main}>
                {isStudyMode ? (
                    <StudyMode deck={typedDeck} />
                ) : (
                    <DeckView deck={typedDeck} />
                )}
            </main>
        </div>
    );
}
