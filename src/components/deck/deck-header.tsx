import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

import { ModeToggle } from "../ui/mode-toggle";

interface DeckHeaderProps {
  id: string;
  title: string;
  isStudyMode: boolean;
}

export function DeckHeader({ id, title, isStudyMode }: DeckHeaderProps) {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Link href="/my-decks">
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

      <ModeToggle
        id={id}
        isStudyMode={isStudyMode}
        className="hidden sm:flex"
      />

      <div className="w-9 sm:hidden" />
    </header>
  );
}
