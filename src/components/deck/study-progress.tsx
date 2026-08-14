import { Progress } from "@/components/ui/progress";

interface StudyProgressProps {
  currentCard: number;
  totalCards: number;
  progressValue: number;
}

export function StudyProgress({
  currentCard,
  totalCards,
  progressValue,
}: StudyProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between font-mono text-[11px] font-semibold tracking-[0.18em] uppercase">
        <span className="text-muted-foreground">
          Card {currentCard} of {totalCards}
        </span>
        <span className="text-foreground">{Math.round(progressValue)}%</span>
      </div>
      <Progress
        value={progressValue}
        className="bg-primary/15 [&_[data-slot=progress-indicator]]:bg-accent h-1.5 rounded-full"
        aria-label={`Study progress: ${Math.round(progressValue)} percent`}
      />
    </div>
  );
}
