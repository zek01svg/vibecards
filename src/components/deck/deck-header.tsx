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
    <header className="border-border bg-background/80 sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 hover:text-primary h-9 w-9 rounded-xl transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="bg-border/60 h-4 w-px" />
        <h1 className="max-w-[150px] truncate text-lg font-bold tracking-tight sm:max-w-md">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-xl transition-colors hover:bg-yellow-500/10 hover:text-yellow-500 ${
              isFavorite ? "text-yellow-500" : "text-muted-foreground"
            }`}
            onClick={onToggleFavorite}
          >
            <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        )}

        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-9 w-9 rounded-xl transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  deck <strong>&quot;{title}&quot;</strong> and all its cards.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={onDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <ModeToggle
          id={id}
          isStudyMode={isStudyMode}
          className="hidden sm:flex"
        />
      </div>
    </header>
  );
}
