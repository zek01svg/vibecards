"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Trophy } from "lucide-react";

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
  const router = useRouter();
  const accuracy =
    totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

  return (
    <Card className="border-border/50 bg-card/50 shadow-primary/5 animate-fade-in mx-auto max-w-2xl overflow-hidden rounded-3xl shadow-2xl">
      <CardHeader className="pt-10 pb-6 text-center">
        <div className="bg-primary/10 border-primary/20 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border">
          <Trophy className="text-primary h-10 w-10 animate-bounce" />
        </div>
        <CardTitle className="text-3xl font-black tracking-tight">
          Study Complete!
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          You&apos;ve finished reviewing &quot;{title}&quot;
        </p>
      </CardHeader>

      <CardContent className="px-10 pb-10">
        <div className="mb-10 grid grid-cols-3 gap-4">
          <div className="bg-background/40 border-border/50 rounded-3xl border p-4 text-center">
            <div className="text-primary mb-1 text-2xl font-black">
              {correctCount}
            </div>
            <div className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Correct
            </div>
          </div>
          <div className="bg-background/40 border-border/50 rounded-3xl border p-4 text-center">
            <div className="text-destructive mb-1 text-2xl font-black">
              {incorrectCount}
            </div>
            <div className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Incorrect
            </div>
          </div>
          <div className="bg-background/40 border-border/50 rounded-3xl border p-4 text-center">
            <div className="text-foreground mb-1 text-2xl font-black">
              {accuracy}%
            </div>
            <div className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Accuracy
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onRestart}
            className="shadow-primary/20 h-12 w-full rounded-2xl font-bold shadow-lg"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Study Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/my-decks")}
            className="border-border/50 bg-background/50 hover:bg-background h-12 w-full rounded-2xl font-bold"
          >
            Back to Library
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
