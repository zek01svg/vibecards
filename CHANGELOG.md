# Changelog

All notable changes to VibeCards are documented here.

## [Unreleased] — TanStack Start Migration

### Added

- **TanStack Router file-based routing** (`src/routes/`) — full route tree replacing the Next.js App Router:
  - `__root.tsx` — global HTML shell, ThemeProvider, Header, Footer, Toaster, and
    root-level `notFoundComponent` / `errorComponent`
  - `index.tsx`, `dashboard.tsx`, `my-decks.tsx`, `deck/$id.tsx` — page routes
  - `sign-in.tsx`, `sign-up.tsx`, `verify-otp.tsx` — auth routes
  - `privacy-policy.tsx`, `terms-of-service.tsx` — legal routes
  - `privacy.tsx`, `terms.tsx` — redirect shims to canonical URLs
  - `api/auth/$.ts` — better-auth wildcard handler via TanStack Start server
    route handlers
  - `api/decks.ts` — deck list + AI generation endpoint
  - `api/decks/$id.ts` — single-deck GET / DELETE / PATCH endpoint
- **TanStack AI integration** (`@tanstack/ai` + `@tanstack/ai-gemini`) — Gemini
  structured output with a 4-model fallback hierarchy
  (`gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-2.0-flash` →
  `gemini-2.0-flash-lite`) and Zod schema validation on every response
- **TanStack Form** across all auth and deck-generation forms with field-level
  Zod validators
- **`useSearchParams` hook** (`src/hooks/use-search-params.ts`) — drop-in
  replacement for the Next.js `useSearchParams`, backed by `useRouterState`
  from `@tanstack/react-router`
- **`authenticate` server utility** (`src/utils/authenticate.ts`) — server-side
  session check using `getRequestHeaders()` from `@tanstack/start-server-core`
- **`beforeLoad` auth guards** on `/dashboard`, `/my-decks`, and `/deck/$id`
  routes — server-side redirect to `/sign-in` before any component renders,
  replacing the previous client-side `useEffect` anti-pattern
- **oxlint + oxfmt** code-quality toolchain replacing ESLint + Prettier
  (`oxlint.config.ts`, `.oxfmtrc.json`, Husky pre-commit hook via
  `lint-staged.config.js`)
- **Pino structured logging** (`src/lib/pino.ts`) used throughout API routes
- **`src/globals.css`** — Tailwind CSS v4 theme tokens used by the root route

### Changed

- Replaced `next/link` with `<Link>` from `@tanstack/react-router` across all
  navigation components (Header, NavButtons, Footer, LandingPageButton)
- Replaced `next/navigation` (`useRouter`, `useSearchParams`) with TanStack
  Router equivalents (`useNavigate`, `useRouterState`, custom `useSearchParams`)
- Replaced `next/headers` with `@tanstack/start-server-core` `getRequestHeaders`
  in the `authenticate` utility
- `use-auth-actions` hook migrated from `useRouter().push()` (Next.js) to
  `useNavigate()` (TanStack Router)
- `use-deck-search` hook migrated from Next.js `useSearchParams` /
  `useRouter().replace()` to TanStack Router equivalents
- `GenerateDeckForm` migrated from a Next.js Server Action to a plain `fetch`
  call against the `/api/decks` TanStack Start API route
- `DashboardPage`, `MyDecksPage`, `DeckPage` — auth-guard logic moved from
  `useEffect` to route-level `beforeLoad`; components are now pure UI
- `vitest.config.ts` — removed stale `next/*` module aliases (compat shims
  deleted); kept `@` path alias only
- Unit tests updated to mock TanStack Router (`@tanstack/react-router`) and
  `@tanstack/start-server-core` instead of `next/navigation` / `next/headers`
- `README.md` — updated package manager references from pnpm to npm, corrected
  prerequisites table, script commands, and code-quality toolchain names

### Removed

- **Next.js** (`next` package) and all `next/*` imports — framework fully
  replaced by TanStack Start
- `src/compat/` shim directory — `next-link.tsx`, `next-navigation.ts`,
  `next-headers.ts`, `next-cache.ts`, `next-dynamic.tsx`, `next-font-google.ts`,
  `next-server.ts`, `next.ts`
- `src/app/layout.tsx` — replaced by `src/routes/__root.tsx`
- `src/app/not-found.tsx` — replaced by `notFoundComponent` in root route
- `src/app/global-error.tsx` — replaced by `errorComponent` in root route
- `src/app/globals.css` — duplicate; canonical file is `src/globals.css`
- `src/app/proxy.ts` — internal auth helper not imported outside its own file
- `src/app/api/auth/[...all]/route.ts` — Next.js API route, superseded by
  `src/routes/api/auth/$.ts`
- `next.config.js` — Next.js configuration no longer needed
- `vite.config.ts` Next.js plugin references
- Unsafe `(generated as any)` casts in the Gemini response normalisation block
  (`src/routes/api/decks.ts`) — replaced with explicit type-narrowed object
  checks

### Fixed

- `vitest.config.ts` no longer references deleted `src/compat/next-*` shims
- All unit tests in `tests/unit/` pass without any next/\* module resolution
  errors (42 tests across 9 files)
