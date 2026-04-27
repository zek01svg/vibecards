
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, RotateCw, X } from "lucide-react";

interface StudyControlsProps {
  isFlipped: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFlip: () => void;
}

export function StudyControls({
  isFlipped,
  canGoNext,
  canGoPrevious,
  onAnswer,
  onNext,
  onPrevious,
  onFlip,
}: StudyControlsProps) {
  if (isFlipped) {
    return (
      <div className="animate-in fade-in slide-in-from-top-4 col-span-1 flex gap-4 duration-500 sm:col-span-2">
        <Button
          variant="outline"
          onClick={() => onAnswer(false)}
          className="border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive group shadow-destructive/5 h-16 flex-1 scale-100 rounded-3xl font-black shadow-lg transition-all hover:scale-[1.02] hover:text-white active:scale-95"
        >
          <X className="mr-2 h-6 w-6 transition-transform group-hover:rotate-90" />
          Incorrect
          <span className="ml-2 hidden rounded-md border border-current px-2 py-0.5 text-xs opacity-40 md:inline-block">
            2
          </span>
        </Button>
        <Button
          onClick={() => onAnswer(true)}
          className="bg-primary shadow-primary/20 group h-16 flex-1 scale-100 rounded-3xl font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95"
        >
          <Check className="mr-2 h-6 w-6 transition-transform group-hover:scale-125" />
          Got it Right
          <span className="ml-2 hidden rounded-md border border-white/40 bg-white/10 px-2 py-0.5 text-xs opacity-50 md:inline-block">
            1
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className="col-span-1 flex gap-4 sm:col-span-2">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="border-border/50 bg-background/50 hover:bg-background h-14 w-14 shrink-0 rounded-2xl"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        onClick={onFlip}
        className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground group h-14 flex-1 rounded-3xl font-black shadow-lg shadow-black/5 transition-all"
      >
        <RotateCw className="mr-2 h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
        Reveal Answer
        <span className="ml-2 hidden rounded-md border border-current px-2 py-0.5 text-xs opacity-40 md:inline-block">
          SPACE
        </span>
      </Button>
      <Button
        variant="outline"
        onClick={onNext}
        disabled={!canGoNext}
        className="border-border/50 bg-background/50 hover:bg-background h-14 w-14 shrink-0 rounded-2xl"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
