"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeFilter, setActiveFilter] = useState(
    searchParams.get("filter") || "all",
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    updatePath(query, activeFilter);
  };

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    updatePath(searchQuery, filter);
  };

  const updatePath = (query: string, filter: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    if (filter !== "all") {
      params.set("filter", filter);
    } else {
      params.delete("filter");
    }

    router.replace(`/my-decks?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="group relative flex-1">
        <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transition-colors" />
        <Input
          type="text"
          placeholder="Search your decks..."
          value={searchQuery}
          onChange={handleSearch}
          className="bg-background/50 border-border/50 focus:bg-background h-11 rounded-xl pr-10 pl-10 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              updatePath("", activeFilter);
            }}
            className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="bg-muted/30 border-border/50 flex items-center gap-1.5 overflow-hidden rounded-xl border p-1 shadow-inner">
        {["all", "recent", "favorites"].map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilter(filter)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-bold capitalize transition-all",
              activeFilter === filter
                ? "bg-background text-primary scale-[1.02] shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40",
            )}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
