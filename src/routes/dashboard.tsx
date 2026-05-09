import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import type { cardCounts } from "@/lib/validations/generate-deck-schema";
import { difficulties } from "@/lib/validations/generate-deck-schema";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session) throw redirect({ to: "/sign-in" });
  },
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] =
    useState<(typeof difficulties)[number]>("intermediate");
  const [cardCount, setCardCount] = useState<(typeof cardCounts)[number]>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, cardCount }),
      });
      const result = (await response.json()) as {
        success: boolean;
        deckId?: string;
        error?: string;
      };

      if (!response.ok || !result.success || !result.deckId) {
        toast.error(result.error ?? "Failed to generate deck");
        return;
      }

      toast.success("Deck generated");
      await navigate({ to: "/deck/$id", params: { id: result.deckId } });
    } catch {
      toast.error("Failed to generate deck");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container mx-auto max-w-3xl px-6 py-12">
      <Card className="border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-black tracking-tight">
            Generate a Deck
          </CardTitle>
          <CardDescription>
            Turn a topic or notes into a focused flashcard deck.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="topic">Topic or notes</FieldLabel>
                <Textarea
                  id="topic"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="Paste notes or describe what you want to study"
                  required
                  rows={7}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="difficulty">Difficulty</FieldLabel>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(event) =>
                      setDifficulty(
                        event.target.value as (typeof difficulties)[number],
                      )
                    }
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {difficulties.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="card-count">Cards</FieldLabel>
                  <Input
                    id="card-count"
                    type="number"
                    min={5}
                    max={20}
                    value={cardCount}
                    onChange={(event) =>
                      setCardCount(
                        Number(
                          event.target.value,
                        ) as (typeof cardCounts)[number],
                      )
                    }
                  />
                </Field>
              </div>

              <Button type="submit" disabled={isSubmitting || !topic.trim()}>
                {isSubmitting ? "Generating..." : "Generate Deck"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
