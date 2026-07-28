import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Plus, Search, Upload } from "lucide-react";
import type { ChangeEvent, MouseEvent } from "react";
import { useMemo, useRef } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/deck/empty-state";
import { FlashcardDeck } from "@/components/deck/flashcard-deck";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeckSearch } from "@/hooks/use-deck-search";
import { useLocalDecks } from "@/hooks/use-local-decks";

export const Route = createFileRoute("/my-decks")({
  component: MyDecksPage,
});

function MyDecksPage() {
  const { decks, deleteDeck, toggleFavorite, exportBackup, importBackup } =
    useLocalDecks();
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

  function handleImportClick() {
    fileInputRef.current?.click();
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

  return (
    <main className="container mx-auto space-y-8 px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">My Decks</h1>
          <p className="text-muted-foreground mt-2">
            Study, favorite, and manage your generated flashcards.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Decks
          </Button>
          <Button variant="outline" onClick={handleImportClick}>
            <Upload className="mr-2 h-4 w-4" />
            Import Decks
          </Button>
          <Button asChild>
            <Link to="/dashboard">
              <Plus className="mr-2 h-4 w-4" />
              Generate Deck
            </Link>
          </Button>
        </div>
      </div>

      {decks.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search decks by title or topic..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9"
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
          <p className="text-muted-foreground text-lg">
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </main>
  );
}
