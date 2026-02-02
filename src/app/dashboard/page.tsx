import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import db from "@/database/db";
import { decks } from "@/database/schema";
import { Card } from "@/lib/schemas";
import authenticate from "@/utils/authenticate";
import { eq } from "drizzle-orm";

import { DashboardStats } from "./dashboard-stats";
import { DeckList } from "./deck-list";
import { GenerateDeckForm } from "./generate-deck-form";
import styles from "./page.module.css";
import { SearchBar } from "./search-bar";

export const dynamic = "force-dynamic";

interface Deck {
    id: string;
    title: string;
    topic: string;
    cards: Card[];
    createdAt: string;
}

export default async function DashboardPage() {
    const userId = await authenticate();

    if (userId === "Unauthorized") {
        redirect("/sign-in");
    }

    // Query MUST filter by owner_id to only show current user's decks
    const userDecks = await db.query.decks.findMany({
        where: eq(decks.ownerId, userId),
    });

    let totalCards = 0;
    if (userDecks.length > 0) {
        for (let deck of userDecks) {
            totalCards += deck.cards?.length || 0;
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                </header>
                <div className={styles.container}>
                    <div className={styles.pageHeader}>
                        <h1>Dashboard</h1>
                    </div>

                    <DashboardStats
                        totalDecks={userDecks?.length || 0}
                        totalCards={totalCards}
                    />

                    <main className={styles.main}>
                        <section className={styles.generateSection}>
                            <h2>Generate New Deck</h2>
                            <GenerateDeckForm />
                        </section>

                        <section className={styles.decksSection}>
                            <h2>Your Decks</h2>
                            <Suspense fallback={<div>Loading...</div>}>
                                <SearchBar />
                                {!userDecks || userDecks.length === 0 ? (
                                    <div className={styles.empty}>
                                        <div className={styles.emptyIcon}>
                                            📚
                                        </div>
                                        <p>
                                            No decks yet. Generate your first
                                            deck above!
                                        </p>
                                    </div>
                                ) : (
                                    <DeckList decks={userDecks as Deck[]} />
                                )}
                            </Suspense>
                        </section>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
