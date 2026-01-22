import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import styles from './page.module.css';
import { GenerateDeckForm } from './generate-deck-form';
import { DeckList } from './deck-list';
import { DashboardStats } from './dashboard-stats';
import { SearchBar } from './search-bar';

export const dynamic = 'force-dynamic';

interface Deck {
  id: string;
  title: string;
  topic: string;
  cards: any[];
  created_at: string;
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Query MUST filter by owner_id to only show current user's decks
  const { data: decks, error } = await supabase
    .from('decks')
    .select('id, title, topic, cards, created_at')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching decks:', error);
  }

  const totalCards = decks?.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0) || 0;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1>Dashboard</h1>
      </div>

      <DashboardStats 
        totalDecks={decks?.length || 0} 
        totalCards={totalCards}
      />

      <main className={styles.main}>
        <section className={styles.generateSection}>
          <h2>Generate New Deck</h2>
          <GenerateDeckForm />
        </section>

        <section className={styles.decksSection}>
          <h2>Your Decks</h2>
          <SearchBar />
          {error ? (
            <p className={styles.error}>Error loading decks. Please try again.</p>
          ) : !decks || decks.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📚</div>
              <p>No decks yet. Generate your first deck above!</p>
            </div>
          ) : (
            <DeckList decks={decks as Deck[]} />
          )}
        </section>
      </main>
    </div>
  );
}
