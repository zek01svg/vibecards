import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { Select } from "#/components/ui/select";
import { useLocalDecks } from "@/hooks/use-local-decks";
import {
  cardCounts,
  difficulties,
} from "@/lib/validations/generate-deck-schema";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type GenerateDeckResponse = {
  success: boolean;
  deck?: {
    title: string;
    topic: string;
    cards: { front: string; back: string }[];
  };
  error?: string;
};

function isDifficulty(val: string): val is (typeof difficulties)[number] {
  return (difficulties as readonly string[]).includes(val);
}

function isCardCount(val: number): val is (typeof cardCounts)[number] {
  return (cardCounts as readonly number[]).includes(val);
}

function isGenerateDeckResponse(val: unknown): val is GenerateDeckResponse {
  return typeof val === "object" && val !== null && "success" in val;
}

function DashboardPage() {
  const navigate = useNavigate();
  const { createDeck } = useLocalDecks();
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
      const data: unknown = await response.json();

      if (
        !isGenerateDeckResponse(data) ||
        !response.ok ||
        !data.success ||
        !data.deck
      ) {
        const errorMsg = isGenerateDeckResponse(data) ? data.error : undefined;
        toast.error(errorMsg ?? "Failed to generate deck");
        return;
      }

      const newDeck = createDeck(data.deck);
      toast.success("Deck generated");
      await navigate({ to: "/deck/$id", params: { id: newDeck.id } });
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
          <form
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
          >
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
                  <Select
                    value={difficulty}
                    onValueChange={(event: { target: { value: any } }) => {
                      const val = event.target.value;
                      if (isDifficulty(val)) setDifficulty(val);
                    }}
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {difficulties.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="card-count">Cards</FieldLabel>
                  <Input
                    id="card-count"
                    type="number"
                    min={5}
                    max={20}
                    value={cardCount}
                    onChange={(event) => {
                      const val = Number(event.target.value);
                      if (isCardCount(val)) setCardCount(val);
                    }}
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
