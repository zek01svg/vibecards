import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

/**
 * Returns a URLSearchParams object reflecting the current URL search string.
 * Drop-in replacement for the Next.js `useSearchParams` hook.
 */
export function useSearchParams(): URLSearchParams {
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  return useMemo(() => {
    const query = searchStr.startsWith("?") ? searchStr.slice(1) : searchStr;
    return new URLSearchParams(query);
  }, [searchStr]);
}
