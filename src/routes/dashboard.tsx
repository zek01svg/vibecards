import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import type { ChangeEvent, MouseEvent } from "react";
import { useMemo, useRef } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/deck/empty-state";
import { FlashcardDeck } from "@/components/deck/flashcard-deck";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDeckSearch } from "@/hooks/use-deck-search";
import { useLocalDecks } from "@/hooks/use-local-decks";
import {
  cardCounts,
  difficulties,
} from "@/lib/validations/generate-deck-schema";

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
  const {
    decks,
    createDeck,
    deleteDeck,
    toggleFavorite,
    exportBackup,
    importBackup,
  } = useLocalDecks();
  const {
    searchQuery,
    setSearchQuery,
    handleSearch,
    activeFilter,
    handleFilter,
  } = useDeckSearch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDecks = useMemo(() => {
    return decks.filter((deck) => {
      const matchesSearch =
        !searchQuery.trim() ||
        deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.topic.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "favorites" && deck.isFavorite);

      return matchesSearch && matchesFilter;
    });
  }, [decks, searchQuery, activeFilter]);

  function onDelete(deckId: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    deleteDeck(deckId);
    toast.success("Deck deleted successfully");
  }

  function onToggleFavorite(
    deckId: string,
    _isFavorite: boolean,
    event: MouseEvent,
  ) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(deckId);
  }

  function handleExport() {
    try {
      const jsonString = exportBackup();
      const filename = `vibecards-backup-${new Date().toISOString().slice(0, 10)}.json`;
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement("a"), {
        href: url,
        download: filename,
      }).click();
      URL.revokeObjectURL(url);
      toast.success("Decks exported successfully");
    } catch {
      toast.error("Failed to export decks");
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const result = importBackup(content);
      if (result.success) {
        toast.success(
          `Successfully imported ${result.importedCount} deck${result.importedCount === 1 ? "" : "s"}`,
        );
      } else {
        toast.error(result.error || "Failed to import backup");
      }
    } catch {
      toast.error("Failed to read backup file");
    }

    event.target.value = "";
  }

  const form = useForm({
    defaultValues: {
      topic: "",
      difficulty: "intermediate" as (typeof difficulties)[number],
      cardCount: 10,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch("/api/decks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: value.topic,
            difficulty: value.difficulty,
            cardCount: value.cardCount,
          }),
        });
        const data: unknown = await response.json();

        if (
          !isGenerateDeckResponse(data) ||
          !response.ok ||
          !data.success ||
          !data.deck
        ) {
          const errorMsg = isGenerateDeckResponse(data)
            ? data.error
            : undefined;
          toast.error(errorMsg ?? "Failed to generate deck");
          return;
        }

        const newDeck = createDeck(data.deck);
        toast.success("Deck generated");
        await navigate({ to: "/deck/$id", params: { id: newDeck.id } });
      } catch {
        toast.error("Failed to generate deck");
      }
    },
  });

  return (
    <main className="container mx-auto max-w-[1700px] px-4 py-6 sm:px-6 lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
      <div className="flex flex-col lg:h-full lg:flex-row lg:items-start lg:gap-8">
        {/* Left Column: Generate Form (stays put) */}
        <section className="w-full shrink-0 lg:w-[380px] xl:w-[420px]">
          <Card
            id="make-a-deck"
            className="border-border/70 bg-secondary text-secondary-foreground shadow-paper rounded-lg"
          >
            <CardHeader className="p-6 pb-4">
              <CardTitle className="font-display text-2xl font-bold tracking-tight">
                Make a deck
              </CardTitle>
              <CardDescription className="text-secondary-foreground/60">
                Type a topic or drop in notes. Cards come back ready to study.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void form.handleSubmit();
                }}
              >
                <FieldGroup className="gap-6">
                  <form.Field
                    name="topic"
                    validators={{
                      onChange: ({ value }) =>
                        !value.trim()
                          ? "Topic or notes is required"
                          : undefined,
                    }}
                  >
                    {(field) => (
                      <Field>
                        <FieldLabel
                          htmlFor="topic"
                          className="font-mono text-[11px] font-semibold tracking-[0.18em] uppercase"
                        >
                          Topic or notes
                        </FieldLabel>
                        <Textarea
                          id="topic"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          placeholder="Paste notes or describe what you want to study"
                          required
                          rows={6}
                          className="dark:bg-card bg-card text-card-foreground placeholder:text-card-foreground/40 border-border/60 shadow-paper rounded-sm"
                        />
                        {field.state.meta.errors.length > 0 &&
                        field.state.meta.isTouched ? (
                          <FieldError
                            errors={field.state.meta.errors.map((error) => ({
                              message: String(error),
                            }))}
                          />
                        ) : null}
                      </Field>
                    )}
                  </form.Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <form.Field name="difficulty">
                      {(field) => (
                        <Field>
                          <FieldLabel
                            htmlFor="difficulty"
                            className="font-mono text-[11px] font-semibold tracking-[0.18em] uppercase"
                          >
                            Difficulty
                          </FieldLabel>
                          <Select
                            value={field.state.value}
                            onValueChange={(val) => {
                              if (isDifficulty(val)) {
                                field.handleChange(val);
                              }
                            }}
                          >
                            <SelectTrigger
                              id="difficulty"
                              className="dark:hover:bg-card/90 dark:bg-card bg-card text-card-foreground border-border/60 shadow-paper w-full rounded-sm"
                            >
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              {difficulties.map((value) => (
                                <SelectItem
                                  key={value}
                                  value={value}
                                  className="font-display text-sm font-medium capitalize"
                                >
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    </form.Field>

                    <form.Field
                      name="cardCount"
                      validators={{
                        onChange: ({ value }) => {
                          if (
                            typeof value !== "number" ||
                            Number.isNaN(value)
                          ) {
                            return "Card count is required";
                          }
                          if (!isCardCount(value)) {
                            return `Card count must be one of: ${cardCounts.join(", ")}`;
                          }
                          return undefined;
                        },
                      }}
                    >
                      {(field) => (
                        <Field>
                          <FieldLabel
                            htmlFor="card-count"
                            className="font-mono text-[11px] font-semibold tracking-[0.18em] uppercase"
                          >
                            Cards
                          </FieldLabel>
                          <Input
                            id="card-count"
                            name={field.name}
                            type="number"
                            min={5}
                            max={20}
                            value={
                              Number.isNaN(field.state.value)
                                ? ""
                                : field.state.value
                            }
                            onBlur={field.handleBlur}
                            onChange={(event) => {
                              const val = event.target.value;
                              field.handleChange(
                                val === "" ? Number.NaN : Number(val),
                              );
                            }}
                            className="dark:bg-card bg-card text-card-foreground placeholder:text-card-foreground/40 border-border/60 shadow-paper rounded-sm"
                          />
                          {field.state.meta.errors.length > 0 &&
                          field.state.meta.isTouched ? (
                            <FieldError
                              errors={field.state.meta.errors.map((error) => ({
                                message: String(error),
                              }))}
                            />
                          ) : null}
                        </Field>
                      )}
                    </form.Field>
                  </div>

                  <form.Subscribe
                    selector={(state) => ({
                      canSubmit: state.canSubmit,
                      isSubmitting: state.isSubmitting,
                      topic: state.values.topic,
                    })}
                  >
                    {({ canSubmit, isSubmitting, topic }) => (
                      <Button
                        type="submit"
                        size="lg"
                        disabled={!canSubmit || isSubmitting || !topic.trim()}
                      >
                        {isSubmitting ? "Generating…" : "Generate deck"}
                      </Button>
                    )}
                  </form.Subscribe>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Right Column: User's Decks (Independently scrollable with 3 cards per row) */}
        <section className="mt-8 min-w-0 flex-1 space-y-6 lg:mt-0 lg:h-full lg:overflow-y-auto lg:pr-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Your decks
                </h2>
                {decks.length > 0 && (
                  <span className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
                    {decks.length} {decks.length === 1 ? "deck" : "decks"} ·{" "}
                    {decks.reduce((sum, d) => sum + d.cardCount, 0)} cards
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(event) => {
                  void handleFileChange(event);
                }}
                accept=".json,application/json"
                className="hidden"
                data-testid="import-file-input"
              />
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export decks
              </Button>
            </div>
          </div>

          {decks.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search decks by title or topic…"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="h-9 pl-9 text-sm"
                />
              </div>
              <fieldset className="border-border/60 flex items-center gap-6 border-b">
                <legend className="sr-only">Filter decks</legend>
                <button
                  type="button"
                  onClick={() => handleFilter("all")}
                  aria-pressed={activeFilter === "all"}
                  className={`relative pb-2 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors ${
                    activeFilter === "all"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                  <span
                    aria-hidden="true"
                    className={`bg-accent absolute -bottom-px left-0 h-[3px] w-full transition-opacity ${
                      activeFilter === "all" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleFilter("favorites")}
                  aria-pressed={activeFilter === "favorites"}
                  className={`relative pb-2 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors ${
                    activeFilter === "favorites"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Favorites
                  <span
                    aria-hidden="true"
                    className={`bg-accent absolute -bottom-px left-0 h-[3px] w-full transition-opacity ${
                      activeFilter === "favorites" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              </fieldset>
            </div>
          )}

          {decks.length === 0 ? (
            <EmptyState kind="desk" />
          ) : filteredDecks.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-sm sm:text-base">
                No decks match your search.
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  handleFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredDecks.map((deck) => (
                <FlashcardDeck
                  key={deck.id}
                  deck={deck}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
