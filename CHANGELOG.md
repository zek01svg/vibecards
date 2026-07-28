# Changelog

All notable changes to VibeCards are documented here.

This file follows a semver-based structure. Dates reflect when the work landed
in git history, not public release dates.

## [3.0.0] - 2026-07-28

Stateless local-first architecture migration: removed authentication and server database in favor of client-side local storage and unauthenticated Gemini deck generation.

Representative commits: `2c85b72`, `42fc46f`, `f92aa7a`, `40ec113`, `e08944e`

### Breaking Changes

- **Removed Auth & Server DB**: Removed Better Auth, PostgreSQL database, Drizzle ORM, server session management, authentication components (`login-form`, `signup-form`, `otp-form`), and auth routes (`/sign-in`, `/sign-up`, `/verify-otp`, `/api/auth/$`).
- **Client-First Deck Storage**: Migrated deck persistence from PostgreSQL to browser `localStorage` using UUID-indexed keys (`vibecards_deck_<uuid>`) and a master index (`vibecards_deck_index`).
- **Stateless Generation Route**: Converted `POST /api/decks` into an unauthenticated, stateless endpoint powered by Gemini AI with Upstash Redis IP rate-limiting. Removed server deck CRUD endpoints (`/api/decks/$id`).
- **Environment Schema Update**: Removed database and authentication environment variables (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `SMTP_*`).

### Added

- Added `src/lib/local-deck-store.ts` for synchronous, local-first deck index and item storage.
- Added `src/hooks/use-local-decks.ts` for reactive deck listing, search, favoriting, and deck deletion.
- Added `docs/adr/0001-stateless-localstorage-architecture.md` detailing the architectural pivot and operational trade-offs.
- Added comprehensive unit tests for local storage layer (`tests/unit/lib/local-deck-store.test.ts` and `tests/unit/hooks/use-local-decks.test.ts`).

### Changed

- Updated `/dashboard`, `/my-decks`, and `/deck/$id` routes to operate directly on `localStorage` state without auth guards or server loaders.
- Updated application header to provide direct navigation without login/signup prompts.

---

## [2.3.0] - 2026-05-12

Vitest integration testing migration, SSR/client bundle boundary hardening, and auth OTP error recovery fixes.

Representative commits: `42fc46f`, `f92aa7a`, `40ec113`, `e08944e`, `f416a81`, `4db8385`, `0cf68cb`

### Added

- Added Vitest integration test suite (`tests/integration/`) against Docker Compose PostgreSQL (`compose.yml` on port 5433), replacing Playwright E2E tests.
- Added `test:integration` script to `package.json` (`vitest run --project integration`).
- Added `compose.yml` with a `postgres:16-alpine` service and healthcheck for local test database isolation.
- Added 70% code coverage thresholds (lines, branches, functions) in `vitest.config.ts` using the Istanbul provider.

### Changed

- Migrated CI/CD workflows (`.github/workflows/ci.yml`, `.github/workflows/cd.yml`) from Playwright E2E execution to Vitest integration tests against Docker Compose PostgreSQL.
- Replaced server-only `authenticate()` call in `LandingPageButton` (`src/components/landing/landing-page-button.tsx`) with client-side `authClient.useSession()` hook, preventing `@tanstack/start-server-core` from leaking into the client bundle and fixing `[plugin:vite:import-analysis]` errors on virtual module `tanstack-start-injected-head-scripts:v`.
- Updated `build` script in `package.json` to prefix `cross-env NODE_ENV=production` so `.env.local` (`NODE_ENV=development`) cannot override Vite's JSX transform in SSR bundles (fixing `TypeError: jsxDEV is not a function` during server rendering).

### Removed

- Removed Playwright E2E test suite (`tests/e2e/`), `playwright.config.ts`, and E2E-related scripts and dependencies.

### Fixed

- Fixed `sendVerificationOTP` in `src/lib/auth.ts`: added error handling for Resend email delivery failures so user sign-up succeeds even if OTP email delivery fails (preventing 500 errors on sign-up).
- Fixed API route handler validator method calls in `src/routes/deck/$id.tsx`: replaced `.validator()` with `.inputValidator()` to match `@tanstack/react-start@1.167.65` and prevent route tree generation crashes on dev server startup and build.
- Restored `src/routes/deck/$id.tsx` full page component and `getDeck` handler after accidental truncation during validator renaming.

---

## [2.2.0] - 2026-05-10

Observability migration and post-migration QA hardening pass.

Representative commits: `76bfc1e`, `71df923`, `52d4df4`, `2b43f96`,
`b0eadea`, `8ab63a7`, `98df930`, `4f7a509`, `615798e`

### Added

- Added `instrument.server.mjs` as the server-side bootstrap: loads
  `dotenv/config`, initialises Sentry, and calls `configureAppLogging`
  before the app starts (preloaded via `NODE_OPTIONS=--import`).
- Added `src/lib/logger.ts`: LogTape-backed structured logger with a console
  sink in development and an optional Sentry sink in production; exposes
  a named `logger` export used across the codebase.
- Added Sentry global request/function middleware and a per-request
  structured logging middleware in `src/start.ts`.
- Added Sentry fetch wrapper in `src/server.ts` via `wrapFetchWithSentry`.
- Added client-side Sentry initialisation in `src/router.tsx` (browser
  tracing + replay integration) with a one-time guard flag to prevent
  re-initialisation across router recreation.
- Added `VITE_SENTRY_DSN` to the T3 Env schema.

### Changed

- Replaced Pino with LogTape across all import sites (mailer, authenticate,
  API route handlers); updated call sites to LogTape's message-first API.
- Route data loading in `/my-decks` and `/deck/:id` moved from `useEffect`
  to `createServerFn` + TanStack Router `loader`, so data is available on
  the initial SSR render and route preloading works on hover.
- `/deck/:id` now uses `notFound()` for missing decks and `redirect()` for
  ownership failures, routing those cases through the router's error
  boundaries instead of component-level error strings.

### Fixed

- Fixed `engines.bun` field in `package.json`: `>=24.14` was a phantom
  version number; corrected to `>=1.3.13` to match `packageManager`.
- Fixed client-side Sentry config: `sendDefaultPii: true` forwarded IPs and
  cookies to Sentry without user consent; set to `false` to match the
  server-side config. `tracesSampleRate` lowered from `1.0` to `0.1`.
- Fixed GET `/api/decks` and GET/DELETE/PATCH `/api/decks/:id` handlers:
  missing try-catch blocks caused DB errors to escape as unstructured 500s
  instead of the `{ success, error }` envelope the client expects.
- Fixed PATCH `/api/decks/:id` body handling: replaced the unsafe
  `as { isFavorite?: boolean }` cast with `PatchDeckSchema.safeParse()`;
  now returns 400 on invalid input.
- Fixed `trustedOrigins` in `src/lib/auth.ts`: removed the hardcoded
  production URL; derived from `env.BETTER_AUTH_URL` so domain changes
  require only an environment variable update.
- Fixed Vite dep optimiser: excluded `@tanstack/start-server-core` and
  `@tanstack/react-start` from pre-bundling to prevent SSR breakage.

---

## [2.1.0] - 2026-05-09

TanStack Start migration cleanup, route tree restoration, and quality gate
fixes after the initial migration foundation.

Representative commits: `c111218`, `3a4e90b`, `a749671`, `f3ff904`,
`7a93970`, `edd36ec`, `99792a1`

### Added

- Regenerated `src/routeTree.gen.ts`: restores the TanStack Router generated
  route tree that was missing after the initial migration.
- Added this semver-based changelog file with full project history.
- Added `LINEAR_ISSUES.md` as a local source of truth for open work items.

### Changed

- Moved protected routes (`/dashboard`, `/my-decks`, `/deck/:id`) to
  route-level `beforeLoad` auth guards using `authClient.getSession()`.
- Replaced unsafe Gemini response `as` casts with explicit
  `normaliseGeminiResponse` unwrapping and Zod schema validation.
- Updated README for TanStack Start, Bun, and correct runtime references.
- Updated unit test mocks to work with TanStack Router navigation APIs
  instead of Next.js navigation mocks.

### Removed

- Removed all remaining dead Next.js artefacts: compatibility shims, stale
  `src/app/` page modules, duplicate globals, and old Next.js API route files.

### Fixed

- Fixed TypeScript errors introduced during the TanStack Start migration.
- Fixed auth header handling, deck search tests, and Gemini response
  normalisation issues raised in code review.
- Fixed lint, format, and typecheck failures from the migration branch.

---

## [1.1.0] - 2026-04-27

Initial TanStack Start migration foundation — first working version on the
new stack.

Representative commits: `4ecdba0`, `fde480b`

### Added

- Added TanStack Start, TanStack Router, Vite, and route-based application
  entrypoints (`src/start.ts`, `src/server.ts`, `src/router.tsx`).
- Added TanStack Router file routes for home, auth, dashboard, deck detail,
  user decks, legal pages, redirect aliases, and API handlers.
- Added TanStack Start server route handlers for better-auth and deck
  CRUD/generation endpoints.
- Added TanStack AI + Gemini integration with structured output parsing and a
  4-model fallback hierarchy (gemini-2.5-flash → 2.5-flash-lite →
  2.0-flash → 2.0-flash-lite).
- Added a custom `useSearchParams` hook to replace Next.js navigation helpers.
- Added a server-side `authenticate` utility backed by TanStack Start request
  headers via `getRequestHeaders()`.
- Added `src/globals.css` as the TanStack Start-era global stylesheet.

### Changed

- Moved the app from Next.js App Router conventions to TanStack Start routing,
  rendering, and server handlers.
- Replaced Next.js navigation with TanStack Router navigation and route state
  APIs.
- Migrated deck generation from a Next.js Server Action flow to an
  API-backed TanStack Start handler.
- Updated `use-auth-actions` and `use-deck-search` for TanStack Router
  navigation.
- Updated Vitest configuration and unit tests away from Next.js mocks.

### Removed

- Removed `next.config.js` and Next.js compatibility shims.

### Fixed

- Fixed TypeScript errors and environment/mailer issues from the initial
  migration pass.

---

## [1.0.0] - 2026-02-02 to 2026-04-17

Main VibeCards application buildout on the Next.js stack.

Representative commits: `02cd904`, `ff3dcf8`, `07ab2da`, `287792f`,
`19751a2`, `07d9ee1`, `60f139b`, `fba9335`

### Added

- Added better-auth server and client configuration; sign-in, sign-up, and
  OTP verification pages; protected-route middleware.
- Added Drizzle ORM schema, relations, database client, and Supabase SQL
  RLS policy files.
- Added Gemini-based deck generation (replaced earlier OpenAI integration).
- Added Zod validation schemas for auth forms and deck-generation inputs.
- Added the main dashboard, deck list, deck detail, study mode, and
  generate-deck UI.
- Added shared header, footer, nav buttons, theme provider, theme toggle,
  landing page sections, legal pages, reusable deck components, and
  shadcn/ui primitives.
- Added Pino-based structured logging.
- Added unit tests (Vitest + React Testing Library) and Playwright E2E tests
  covering auth, landing, deck generation, deck viewing, and deck deletion.
- Added Playwright global setup for authenticated E2E tests; replaced a
  temporary test-login backdoor endpoint.
- Added hooks for deck search, deck deletion, and favorite filtering.
- Added `isFavorite` deck field with toggle support.
- Added GitHub Actions CI/CD workflows (lint, test, security, deployment).
- Added Bun lockfile, Bun scripts, oxlint, oxfmt, Turbo, and Lefthook.

### Changed

- Migrated authentication from Clerk to better-auth.
- Migrated data access from Supabase client SDK to Drizzle ORM.
- Migrated AI generation from OpenAI to Google Gemini.
- Reworked deck generation and deletion from API route flows to server
  action flows during the Next.js phase.
- Replaced test-login endpoint with Playwright global setup.
- Migrated package manager from pnpm to Bun.
- Migrated linting and formatting from ESLint/Prettier to oxlint/oxfmt.
- Updated CI for Bun installs, Playwright container execution, and task
  environment variable handling.
- Replaced spinner-based feedback with toast notifications.

### Removed

- Removed Clerk and Supabase client SDK after the better-auth/Drizzle
  migration.
- Removed the temporary test-login endpoint.
- Removed pnpm lockfile and ESLint/Prettier configuration.

### Fixed

- Fixed OTP verification suspense behavior.
- Fixed auth import paths, wildcard origin handling, and form validation.
- Fixed search bar behavior, toaster styling, and app-level toaster mounting.
- Fixed Gemini model hierarchy after an unavailable model caused generation
  failures.
- Fixed lint-staged line-ending, CI task env, and environment-loading issues.

---

## [0.1.1] - 2026-01-23 to 2026-02-02

Post-MVP maintenance and continuous improvements.

### Added

- Added Husky, Jest/Playwright configuration, Prettier, ESLint, and
  lint-staged setup.
- Added environment validation and `.env.example`.
- Added Vercel Analytics.

### Fixed

- Fixed early import, PostCSS, trusted-origin, and verify-OTP suspense
  issues.

---

## [0.1.0] - 2026-01-04 to 2026-01-22

Initial project MVP built at a vibecoding workshop.

Representative commit: `4ce6e05`

### Added

- Bootstrapped the project from a Next.js scaffold.
- Added the first VibeCards dashboard, deck list, deck detail, study mode,
  and generate-deck UI.
- Added initial API routes for deck generation and deck CRUD.
- Added Supabase schema and policy files.
- Added shadcn/ui components and shared UI setup.
- Added Resend email support and auth-related environment variables.

### Changed

- Reworked the initial scaffold into the first VibeCards product UI.
- Updated dependencies and linting configuration during bootstrap.
- Migrated from npm to pnpm lockfile during early setup.
