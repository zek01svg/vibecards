"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RotateCw } from "lucide-react";

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ front, back, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div className="perspective-1000 group cursor-pointer" onClick={onFlip}>
      <div
        className={cn(
          "relative h-[400px] w-full transition-all duration-700 transform-3d",
          isFlipped ? "transform-[rotateY(180deg)]" : "",
        )}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <Card className="border-border/50 bg-card shadow-primary/5 flex h-full flex-col items-center justify-center rounded-[2.5rem] border-2 p-12 text-center shadow-2xl">
            <Badge
              variant="outline"
              className="border-primary/20 text-primary absolute top-8 left-8 font-bold"
            >
              PROMPT
            </Badge>
            <div className="text-foreground/90 custom-scrollbar max-h-[250px] overflow-y-auto pr-2 text-3xl leading-tight font-medium">
              {front}
            </div>
            <div className="text-muted-foreground/60 group-hover:text-primary/60 absolute right-0 bottom-10 left-0 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors">
              <RotateCw className="animate-spin-slow h-4 w-4" />
              Click to flip
            </div>
          </Card>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 transform-[rotateY(180deg)] backface-hidden">
          <Card className="border-primary/30 bg-primary/3 shadow-primary/10 flex h-full flex-col items-center justify-center rounded-[2.5rem] border-2 p-12 text-center shadow-2xl backdrop-blur-sm">
            <Badge className="bg-primary text-primary-foreground absolute top-8 left-8 border-none font-bold shadow-md">
              EXPLANATION
            </Badge>
            <div className="text-foreground/80 custom-scrollbar max-h-[250px] overflow-y-auto pr-2 text-2xl leading-relaxed font-medium italic">
              {back}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
