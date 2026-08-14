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
      <div className="animate-in fade-in slide-in-from-top-4 flex gap-3 duration-500">
        <Button
          variant="outline"
          onClick={() => onAnswer(false)}
          className="group border-destructive/40 text-destructive shadow-paper hover:bg-destructive/10 hover:border-destructive/60 h-14 flex-1 rounded-md"
        >
          <X className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
          Missed it
          <span className="ml-2 rounded-[3px] border border-current px-1.5 py-0.5 font-mono text-[10px] opacity-50">
            2
          </span>
        </Button>
        <Button
          onClick={() => onAnswer(true)}
          className="group shadow-paper hover:bg-primary/90 h-14 flex-1 rounded-md"
        >
          <Check className="mr-2 h-4 w-4 transition-transform group-hover:scale-125" />
          Got it
          <span className="ml-2 rounded-[3px] border border-current px-1.5 py-0.5 font-mono text-[10px] opacity-50">
            1
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="h-14 w-14 shrink-0 rounded-md"
        aria-label="Previous card"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        onClick={onFlip}
        className="group shadow-paper hover:bg-primary/90 h-14 flex-1 rounded-md"
      >
        <RotateCw className="mr-2 h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
        Reveal answer
        <span className="ml-2 rounded-[3px] border border-current px-1.5 py-0.5 font-mono text-[10px] opacity-50">
          Space
        </span>
      </Button>
      <Button
        variant="outline"
        onClick={onNext}
        disabled={!canGoNext}
        className="h-14 w-14 shrink-0 rounded-md"
        aria-label="Next card"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
