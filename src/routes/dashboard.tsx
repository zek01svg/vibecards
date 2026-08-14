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
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-2xl font-black tracking-tight sm:text-3xl">
                Generate a Deck
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Turn a topic or notes into a focused flashcard deck.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void form.handleSubmit();
                }}
              >
                <FieldGroup className="gap-5">
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
                        <FieldLabel htmlFor="topic">Topic or notes</FieldLabel>
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
                          <FieldLabel htmlFor="difficulty">
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
                            <SelectTrigger id="difficulty" className="w-full">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              {difficulties.map((value) => (
                                <SelectItem
                                  key={value}
                                  value={value}
                                  className="capitalize"
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
                          <FieldLabel htmlFor="card-count">Cards</FieldLabel>
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
                    selector={(state) => [
                      state.canSubmit,
                      state.isSubmitting,
                      state.values.topic,
                    ]}
                  >
                    {([canSubmit, isSubmitting, topic]) => (
                      <Button
                        type="submit"
                        disabled={
                          !canSubmit || Boolean(isSubmitting) || !topic.trim()
                        }
                      >
                        {isSubmitting ? "Generating..." : "Generate Deck"}
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                My Decks
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Study, favorite, and manage your generated flashcards.
              </p>
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
                Export Decks
              </Button>
            </div>
          </div>

          {decks.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search decks by title or topic..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="h-9 pl-9 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={activeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={activeFilter === "favorites" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilter("favorites")}
                >
                  Favorites
                </Button>
              </div>
            </div>
          )}

          {decks.length === 0 ? (
            <EmptyState />
          ) : filteredDecks.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-sm sm:text-base">
                No decks found matching your search.
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
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
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
