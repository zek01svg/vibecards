import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star, Trash2 } from "lucide-react";
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

import { ModeToggle } from "../ui/mode-toggle";

interface DeckHeaderProps {
  id: string;
  title: string;
  isStudyMode: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
}

export function DeckHeader({
  id,
  title,
  isStudyMode,
  isFavorite,
  onToggleFavorite,
  onDelete,
}: DeckHeaderProps) {
  return (
    <header className="border-border bg-background/85 sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="focus-visible:ring-ring text-muted-foreground hover:bg-accent/40 hover:text-foreground flex h-8 w-8 items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Back to dashboard"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display max-w-[110px] truncate text-base font-semibold tracking-tight sm:max-w-md sm:text-lg">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon-sm"
            className={`h-8 w-8 rounded-sm transition-colors ${
              isFavorite
                ? "text-accent hover:text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Unfavorite deck" : "Favorite deck"}
          >
            <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        )}

        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-sm transition-colors"
                aria-label="Delete deck"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this deck?</AlertDialogTitle>
                <AlertDialogDescription>
                  This can&apos;t be undone. It permanently removes &quot;
                  {title}&quot; and all its cards from your browser.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep it</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={onDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <ModeToggle id={id} isStudyMode={isStudyMode} />
      </div>
    </header>
  );
}
