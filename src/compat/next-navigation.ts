import { notFound as tanstackNotFound, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (to: string) => navigate({ to }),
    replace: (to: string) => navigate({ to, replace: true })
  };
}

export function useSearchParams() {
  const searchStr = useRouterState({ select: (state) => state.location.searchStr });
  return useMemo(() => {
    const query = searchStr.startsWith("?") ? searchStr.slice(1) : searchStr;
    return new URLSearchParams(query);
  }, [searchStr]);
}

export function redirect(to: string) {
  if (typeof window !== "undefined") {
    window.location.assign(to);
    return;
  }

  throw Response.redirect(to, 302);
}

export function notFound() {
  throw tanstackNotFound();
}
