"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { generateDeckSchema } from "@/lib/validations/generate-deck-schema";
import { useForm } from "@tanstack/react-form";
import { Sparkles } from "lucide-react";

import { DeckCardCount } from "./deck-card-count";
import { DeckDifficulty } from "./deck-difficulty";

export function GenerateDeckForm() {
  const difficulties = ["beginner", "intermediate", "advanced"] as const;
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      topic: "",
      difficulty: "intermediate" as (typeof difficulties)[number],
      cardCount: "10",
    },
    validators: {
      onChange: generateDeckSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await fetch("/api/generate-deck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: value.topic,
          difficulty: value.difficulty,
          cardCount: Number(value.cardCount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate deck");
      }

      router.push(`/deck/${data.deckId}`);
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      <FieldGroup>
        <form.Field name="topic">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="topic">Topic or Notes</FieldLabel>
              <Textarea
                id="topic"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Enter a topic, paste notes, or describe what you want to learn..."
                className="border-border/50 bg-background/50 focus:border-primary/50 focus:ring-primary/20 min-h-[160px] resize-none rounded-2xl transition-all"
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <FieldDescription>
                  Detailed topics result in better cards.
                </FieldDescription>
                <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase tabular-nums">
                  {field.state.value.length} / 500
                </p>
              </div>
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <FieldError
                    errors={field.state.meta.errors.map((err) =>
                      err ? { message: String(err) } : undefined,
                    )}
                  />
                )}
            </Field>
          )}
        </form.Field>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <form.Field name="difficulty">
            {(field) => <DeckDifficulty field={field} />}
          </form.Field>

          <form.Field name="cardCount">
            {(field) => <DeckCardCount field={field} />}
          </form.Field>
        </div>
      </FieldGroup>

      <div className="pt-2">
        <form.Subscribe
          selector={(state) => [state.isSubmitting, state.errorMap]}
        >
          {([isSubmitting, errorMap]) => (
            <div className="space-y-4">
              {errorMap?.onSubmit && (
                <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-xl border p-4 text-center text-sm">
                  {errorMap.onSubmit.toString()}
                </div>
              )}
              <Button
                type="submit"
                className="bg-primary text-primary-foreground shadow-primary/20 group h-12 w-full rounded-2xl text-base font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                disabled={isSubmitting || !form.state.canSubmit}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-5 w-5" />
                    <span>Brewing Magic...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles
                      size={20}
                      className="transition-transform group-hover:rotate-12"
                    />
                    <span>Generate My Deck</span>
                  </div>
                )}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
