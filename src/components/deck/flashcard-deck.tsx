import { Link } from "@tanstack/react-router";
import { ChevronRight, Star, Trash2 } from "lucide-react";
import type { DeckIndexItem } from "@/lib/local-deck-store";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export type DeckSummary = DeckIndexItem;

interface FlashcardProps {
  deck: DeckSummary;
  onDelete: (id: string, e: React.MouseEvent) => Promise<void> | void;
  onToggleFavorite: (
    id: string,
    isFavorite: boolean,
    e: React.MouseEvent,
  ) => Promise<void> | void;
}

export function FlashcardDeck({
  deck,
  onDelete,
  onToggleFavorite,
}: FlashcardProps) {
  const cardCount = deck.cardCount;

  return (
    <Card className="group bg-card text-card-foreground border-border/70 hover:border-foreground/30 hover:shadow-card shadow-paper relative flex h-full flex-col justify-between rounded-sm border transition-all duration-300 hover:-translate-y-0.5">
      <Link
        to="/deck/$id"
        params={{ id: deck.id }}
        className="focus-visible:ring-ring focus-visible:ring-offset-background absolute inset-0 z-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-label={`Study deck: ${deck.title}`}
      />
      <div>
        <CardHeader className="pointer-events-none relative z-10 p-5 pb-3">
          <div className="pointer-events-auto flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-2">
              <span className="bg-secondary text-secondary-foreground inline-block rounded-[3px] px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[0.15em] uppercase">
                {cardCount} cards
              </span>
              <CardTitle className="font-display line-clamp-1 text-base font-semibold tracking-tight">
                {deck.title}
              </CardTitle>
            </div>

            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon-sm"
                className={`hover:bg-accent/50 h-8 w-8 shrink-0 rounded-sm transition-colors ${
                  deck.isFavorite
                    ? "text-accent hover:text-accent"
                    : "text-card-foreground/40 hover:text-card-foreground"
                }`}
                onClick={(e) => {
                  void onToggleFavorite(deck.id, !deck.isFavorite, e);
                }}
                aria-label={
                  deck.isFavorite
                    ? `Unfavorite ${deck.title}`
                    : `Favorite ${deck.title}`
                }
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    deck.isFavorite ? "fill-current" : ""
                  }`}
                />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-card-foreground/40 hover:bg-destructive/10 hover:text-destructive h-8 w-8 shrink-0 rounded-sm transition-colors"
                    aria-label={`Delete ${deck.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this deck?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This can&apos;t be undone. It permanently removes &quot;
                      {deck.title}&quot; and all its cards from your browser.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep it</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={(e) => {
                        void onDelete(deck.id, e);
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pointer-events-none relative z-10 px-5 pt-0 pb-4">
          <p className="text-card-foreground/60 line-clamp-2 text-sm leading-relaxed">
            {deck.topic}
          </p>
        </CardContent>
      </div>

      <CardFooter className="border-border/60 pointer-events-none relative z-10 flex items-center justify-between border-t px-5 py-3">
        <span className="text-card-foreground/40 font-mono text-[10px] tracking-[0.12em] uppercase">
          {new Date(deck.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="group-hover:text-card-foreground text-card-foreground/60 flex items-center gap-1 font-mono text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors">
          Study
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </CardFooter>
    </Card>
  );
}
