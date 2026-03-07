"use client";

import Link from "next/link";
import { Card as CardType } from "@/lib/validations/generate-deck-schema";
import { Calendar, ChevronRight, Star, Trash2 } from "lucide-react";

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

export interface Deck {
  id: string;
  title: string;
  topic: string;
  cards: CardType[];
  createdAt: string;
  isFavorite: boolean;
}

interface FlashcardProps {
  deck: Deck;
  onDelete: (id: string, e: React.MouseEvent) => Promise<void>;
  onToggleFavorite: (
    id: string,
    isFavorite: boolean,
    e: React.MouseEvent,
  ) => Promise<void>;
}

export function FlashcardDeck({
  deck,
  onDelete,
  onToggleFavorite,
  isPending,
  isPendingFavorite,
}: FlashcardProps & { isPending?: boolean; isPendingFavorite?: boolean }) {
  return (
    <Card className="border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card hover:shadow-primary/5 group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/deck/${deck.id}`}
        className="focus:ring-primary absolute inset-0 z-0 rounded-xl focus:ring-2 focus:ring-offset-2 focus:outline-none"
        aria-label={`Study deck: ${deck.title}`}
      />
      <CardHeader className="pointer-events-none relative z-10 p-6">
        <div className="pointer-events-auto flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 mb-2 border-none font-bold"
            >
              {deck.cards?.length || 0} Cards
            </Badge>
            <CardTitle className="group-hover:text-primary line-clamp-1 transition-colors">
              {deck.title}
            </CardTitle>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`relative z-10 shrink-0 transition-colors hover:bg-yellow-500/10 hover:text-yellow-500 ${deck.isFavorite ? "text-yellow-500" : "text-muted-foreground"}`}
              onClick={(e) => onToggleFavorite(deck.id, !deck.isFavorite, e)}
              disabled={isPendingFavorite}
            >
              <Star
                className={`h-4 w-4 ${deck.isFavorite ? "fill-current" : ""}`}
              />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive relative z-10 shrink-0 transition-colors"
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
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
                  <AlertDialogCancel disabled={isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={(e) => onDelete(deck.id, e)}
                    disabled={isPending}
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pointer-events-none relative z-10 px-6 pt-0 pb-6">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {deck.topic}
        </p>
      </CardContent>

      <CardFooter className="border-border/50 bg-muted/20 pointer-events-none relative z-10 flex items-center justify-between border-t px-6 py-4">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
          <Calendar className="h-3 w-3" />
          {new Date(deck.createdAt).toLocaleDateString()}
        </div>
        <div className="group-hover:text-primary flex items-center gap-1 text-xs font-bold transition-all">
          Study Now
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </div>
      </CardFooter>
    </Card>
  );
}
