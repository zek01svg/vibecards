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
    <button
      type="button"
      className="perspective-1000 group w-full cursor-pointer text-left"
      onClick={onFlip}
      aria-label={isFlipped ? "Show the prompt" : "Reveal the explanation"}
    >
      <div
        className={cn(
          "relative h-[420px] w-full transition-all duration-700 transform-3d",
          isFlipped ? "transform-[rotateY(180deg)]" : "",
        )}
      >
        {/* Front side — blank paper, marker chip */}
        <div className="absolute inset-0 backface-hidden">
          <div className="bg-card text-card-foreground shadow-card border-border/70 flex h-full flex-col items-center justify-center rounded-sm border p-10 sm:p-12">
            <div className="bg-accent text-accent-foreground absolute top-7 left-7 rounded-[3px] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.2em] uppercase">
              Prompt
            </div>
            <div className="max-h-[260px] w-full overflow-y-auto pr-2 text-center text-2xl leading-snug font-medium text-balance sm:text-3xl">
              {front}
            </div>
            <div className="text-card-foreground/40 group-hover:text-card-foreground/70 absolute right-0 bottom-6 left-0 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors">
              <RotateCw className="h-3.5 w-3.5" />
              Click to flip
            </div>
          </div>
        </div>

        {/* Back side — ink-filled paper, outline chip */}
        <div className="absolute inset-0 transform-[rotateY(180deg)] backface-hidden">
          <div className="bg-card text-card-foreground shadow-card border-border/70 flex h-full flex-col items-center justify-center rounded-sm border p-10 sm:p-12">
            <div className="border-border text-card-foreground/70 absolute top-7 left-7 rounded-[3px] border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.2em] uppercase">
              Explanation
            </div>
            <div className="max-h-[260px] w-full overflow-y-auto pr-2 text-center text-xl leading-relaxed text-balance italic sm:text-2xl">
              {back}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
