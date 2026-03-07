"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Custom hook for deck search functionality.
 * @returns {Object} An object containing search query, active filter, and search handlers.
 */
export const useDeckSearch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeFilter, setActiveFilter] = useState(
    searchParams.get("filter") || "all",
  );

  /**
   * Updates the URL path with the search query and filter.
   * @param {string} query - The search query.
   * @param {string} filter - The active filter.
   */
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

  /**
   * Handles the search input change event.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    updatePath(query, activeFilter);
  };

  /**
   * Handles the filter change event.
   * @param {string} filter - The active filter.
   */
  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    updatePath(searchQuery, filter);
  };

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    handleSearch,
    handleFilter,
    updatePath,
  };
};
