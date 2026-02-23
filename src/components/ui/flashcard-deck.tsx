"use client";

import { Card as CardType } from "@/lib/schemas";
import { Calendar, ChevronRight, Trash2 } from "lucide-react";

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
} from "./alert-dialog";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";

export interface Deck {
  id: string;
  title: string;
  topic: string;
  cards: CardType[];
  createdAt: string;
}

interface FlashcardProps {
  deck: Deck;
  onDelete: (id: string, e: React.MouseEvent) => Promise<void>;
}

export function FlashcardDeck({ deck, onDelete }: FlashcardProps) {
  return (
    <Card className="border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card hover:shadow-primary/5 h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="p-6">
        <div className="flex items-start justify-between gap-4">
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  deck <strong>&quot;{deck.title}&quot;</strong> and all its
                  cards.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={(e) => onDelete(deck.id, e)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="px-6 pt-0 pb-6">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {deck.topic}
        </p>
      </CardContent>

      <CardFooter className="border-border/50 bg-muted/20 flex items-center justify-between border-t px-6 py-4">
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
