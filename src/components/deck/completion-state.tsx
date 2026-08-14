import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface CompletionStateProps {
  title: string;
  correctCount: number;
  incorrectCount: number;
  totalCards: number;
  onRestart: () => void;
}

export function CompletionState({
  title,
  correctCount,
  incorrectCount,
  totalCards,
  onRestart,
}: CompletionStateProps) {
  const navigate = useNavigate();
  const accuracy =
    totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

  return (
    <div className="bg-card text-card-foreground shadow-card animate-card-in border-border/70 mx-auto max-w-xl rounded-sm border p-10 text-center sm:p-14">
      <p className="text-muted-foreground font-mono text-[11px] font-semibold tracking-[0.2em] uppercase">
        Session complete
      </p>
      <h1 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        You finished &quot;{title}&quot;.
      </h1>

      <div className="mt-12 flex flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-14">
        {/* The graded mark */}
        <div className="flex flex-col items-center gap-3">
          <div className="border-destructive flex h-40 w-40 items-center justify-center rounded-full border-[3px]">
            <span className="font-display text-6xl font-bold tracking-tight">
              {accuracy}
            </span>
            <span className="text-2xl font-bold">%</span>
          </div>
          <span className="text-muted-foreground font-mono text-[10px] font-semibold tracking-[0.2em] uppercase">
            Accuracy
          </span>
        </div>

        <div className="space-y-4 text-left font-mono text-xs font-semibold tracking-[0.15em] uppercase">
          <div className="flex items-center gap-3">
            <span className="bg-success inline-block h-2 w-2 rounded-full" />
            <span className="text-foreground text-sm tracking-widest">
              {correctCount} got it
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-destructive inline-block h-2 w-2 rounded-full" />
            <span className="text-foreground text-sm tracking-widest">
              {incorrectCount} missed
            </span>
          </div>
          <p className="text-muted-foreground pt-1 text-[10px] font-normal tracking-normal normal-case">
            {totalCards} cards reviewed
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3">
        <Button onClick={onRestart} className="h-12 w-full rounded-md">
          <RotateCcw className="mr-2 h-4 w-4" />
          Study again
        </Button>
        <Button
          variant="outline"
          onClick={() => void navigate({ to: "/dashboard" })}
          className="h-12 w-full rounded-md"
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
