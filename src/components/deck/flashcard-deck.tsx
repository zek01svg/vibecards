import { Link } from "@tanstack/react-router";
import { Calendar, ChevronRight, Star, Trash2 } from "lucide-react";
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
import { Badge } from "../ui/badge";
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
    <Card className="border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card hover:shadow-primary/5 group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        to="/deck/$id"
        params={{ id: deck.id }}
        className="focus:ring-primary absolute inset-0 z-0 rounded-2xl focus:ring-2 focus:ring-offset-2 focus:outline-none"
        aria-label={`Study deck: ${deck.title}`}
      />
      <div>
        <CardHeader className="pointer-events-none relative z-10 p-4 pb-2">
          <div className="pointer-events-auto flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 mb-1 border-none px-2 py-0.5 text-xs font-bold"
              >
                {cardCount} Cards
              </Badge>
              <CardTitle className="group-hover:text-primary line-clamp-1 text-base font-bold transition-colors">
                {deck.title}
              </CardTitle>
            </div>

            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className={`relative z-10 h-8 w-8 shrink-0 rounded-lg transition-colors hover:bg-yellow-500/10 hover:text-yellow-500 ${deck.isFavorite ? "text-yellow-500" : "text-muted-foreground"}`}
                onClick={(e) => {
                  void onToggleFavorite(deck.id, !deck.isFavorite, e);
                }}
              >
                <Star
                  className={`h-3.5 w-3.5 ${deck.isFavorite ? "fill-current" : ""}`}
                />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive relative z-10 h-8 w-8 shrink-0 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the deck <strong>&quot;{deck.title}&quot;</strong> and all
                      its cards.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

        <CardContent className="pointer-events-none relative z-10 px-4 pt-0 pb-3">
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {deck.topic}
          </p>
        </CardContent>
      </div>

      <CardFooter className="border-border/50 bg-muted/20 pointer-events-none relative z-10 flex items-center justify-between border-t px-4 py-2.5 text-xs">
        <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium">
          <Calendar className="h-3 w-3" />
          {new Date(deck.createdAt).toLocaleDateString()}
        </div>
        <div className="group-hover:text-primary flex items-center gap-1 text-[11px] font-bold transition-all">
          Study Now
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </div>
      </CardFooter>
    </Card>
  );
}
