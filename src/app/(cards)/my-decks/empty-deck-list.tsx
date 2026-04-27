import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

/**
 * Renders an empty state UI when a user has no flashcard decks.
 * Provides a clear call-to-action instructing the user to generate their first deck.
 *
 * @returns A visually distinct empty state component with a CTA button
 */
export function EmptyDeckList() {
  return (
    <>
      <Empty className="border-border/60 bg-card/30 rounded-3xl border border-dashed p-12 text-center backdrop-blur-sm">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <div className="text-4xl opacity-50">📚</div>
          </EmptyMedia>
          <EmptyTitle className="mt-4 text-xl font-semibold">
            No decks found
          </EmptyTitle>
          <EmptyDescription className="text-muted-foreground">
            You haven&apos;t generated any flashcard decks yet.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="mt-6">
          <Link to="/dashboard">
            <Button className="shadow-primary/20 rounded-xl font-bold shadow-lg transition-all active:scale-95">
              Generate Your First Deck
            </Button>
          </Link>
        </EmptyContent>
      </Empty>
    </>
  );
}
