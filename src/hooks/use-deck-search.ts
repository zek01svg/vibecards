import { useNavigate } from "@tanstack/react-router";
import { useSearchParams } from "@/hooks/use-search-params";

/**
 * Custom hook for deck search functionality.
 * Derives searchQuery and activeFilter directly from search params to stay in sync with the URL.
 * @returns {Object} An object containing search query, active filter, and search handlers.
 */
export const useDeckSearch = () => {
  const searchParams = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get("q") || "";
  const activeFilter = searchParams.get("filter") || "all";

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

    const searchStr = params.toString();
    const to = searchStr ? `/dashboard?${searchStr}` : "/dashboard";

    void navigate({ to, replace: true });
  };

  /**
   * Directly sets the search query and updates URL path.
   * @param {string | ((prev: string) => string)} query - The new search query or updater function.
   */
  const setSearchQuery = (query: string | ((prev: string) => string)) => {
    const nextQuery = typeof query === "function" ? query(searchQuery) : query;
    updatePath(nextQuery, activeFilter);
  };

  /**
   * Handles the search input change event.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    updatePath(query, activeFilter);
  };

  /**
   * Handles the filter change event.
   * @param {string} filter - The active filter.
   */
  const handleFilter = (filter: string) => {
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
