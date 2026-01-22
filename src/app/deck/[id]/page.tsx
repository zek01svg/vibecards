import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import styles from './page.module.css';
import { Card } from '@/lib/schemas';
import { StudyMode } from './study-mode';
import { DeckView } from './deck-view';
import { ExportButton } from './export-button';

export const dynamic = 'force-dynamic';

interface Deck {
  id: string;
  title: string;
  topic: string;
  cards: Card[];
  owner_id: string;
}

export default async function DeckPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;
  const { mode } = await searchParams;

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch deck and verify it belongs to current user
  const { data: deck, error } = await supabase
    .from('decks')
    .select('id, title, topic, cards, owner_id')
    .eq('id', id)
    .single();

  if (error || !deck) {
    console.error('Error fetching deck:', error);
    notFound();
  }

  // Verify deck belongs to current user (owner_id check)
  if (deck.owner_id !== userId) {
    notFound();
  }

  const typedDeck = deck as Deck;
  const isStudyMode = mode === 'study';

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
          className={`${styles.modeButton} ${!isStudyMode ? styles.active : ''}`}
        >
          📋 View All
        </Link>
        <Link
          href={`/deck/${id}?mode=study`}
          className={`${styles.modeButton} ${isStudyMode ? styles.active : ''}`}
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
