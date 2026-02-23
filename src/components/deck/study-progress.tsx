"use client";

import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-bold tracking-tight">
        <div className="text-muted-foreground flex items-center gap-2">
          <Target className="h-4 w-4" />
          Card {currentCard} of {totalCards}
        </div>
        <div className="text-primary">
          {Math.round(progressValue)}% Complete
        </div>
      </div>
      <Progress
        value={progressValue}
        className="bg-muted/40 h-2 rounded-full"
      />
    </div>
  );
}
