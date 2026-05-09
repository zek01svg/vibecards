# Changelog

All notable changes to VibeCards are documented here.

This file follows a semver-based structure. Dates reflect when the work landed
in git history, not public release dates.

## [Unreleased]

### Known Follow-Ups

- Complete the remaining route/page migration so current route files no longer
  import deleted `src/app/...` modules.
- Restore or regenerate `src/routeTree.gen.ts` so typecheck and routing can
  resolve the generated route tree.
- Decide whether to carry over the TanStack Start template's LogTape logging
  setup and replace the current Pino logger.
- Correct README/runtime/package-manager references that still describe npm or
  Node-first workflows where the repo now uses Bun.
- Fix current lint, format, typecheck, and unit-test failures.
- Run browser QA once the app can start cleanly and capture remaining user-flow
  issues.

## [2.1.0] - 2026-05-09

Current working-tree version. This section covers the TanStack Start migration
cleanup and history reconstruction work.

Representative commits: `c111218`, `3a4e90b`, `a749671`, `f3ff904`,
`7a93970`

### Added

- Added this semver-based changelog structure with project history grouped by
  package version.
- Added `LINEAR_ISSUES.md` as a local source of truth for later Linear issue
  creation.
- Added grouped Linear issue drafts for completed project history and open
  follow-up work.

### Changed

- Reworked the changelog from a migration-only note into full project history.
- Grouped historical work by semver version instead of by public releases.
- Documented TanStack Start migration follow-ups separately from completed
  history.
- Moved protected dashboard, deck, and my-decks routes toward route-level
  `beforeLoad` auth guards.
- Replaced unsafe Gemini response casts with explicit response unwrapping and
  narrowing.
- Updated TanStack Router and TanStack Start test mocks for migrated utilities.

### Removed

- Removed remaining dead Next.js artifacts from the migration branch, including
  compatibility shims, duplicate app globals, and old Next.js API route files.

### Fixed

- Addressed code-review feedback around auth header handling, deck search tests,
  and Gemini response normalisation.

## [1.1.0] - 2026-04-27

Initial TanStack Start migration foundation.

Representative commits: `4ecdba0`, `fde480b`, `4c4c5c8`, `99792a1`,
`0aa36ca`, `33143c2`

### Added

- Added TanStack Start, TanStack Router, Vite, and route-based application
  entrypoints.
- Added TanStack Router file routes for home, auth, dashboard, deck detail,
  user decks, legal pages, redirects, and API handlers.
- Added TanStack Start server route handlers for better-auth and deck
  CRUD/generation endpoints.
- Added TanStack AI + Gemini integration with structured output parsing and a
  Gemini model fallback hierarchy.
- Added TanStack Form usage across migrated auth and deck-generation forms.
- Added a custom `useSearchParams` hook to replace Next.js navigation helpers.
- Added a server-side `authenticate` utility backed by TanStack Start request
  headers.
- Added `src/globals.css` as the TanStack Start-era global stylesheet.

### Changed

- Began moving the app from Next.js App Router conventions to TanStack Start
  routing, rendering, and server handlers.
- Replaced Next.js navigation usage with TanStack Router navigation and route
  state APIs.
- Migrated deck generation from a Next.js Server Action flow toward an
  API-backed TanStack Start handler.
- Updated `use-auth-actions` and `use-deck-search` around TanStack Router
  navigation.
- Updated README content for the TanStack Start and TanStack AI migration.
- Updated Vitest configuration and unit tests away from Next.js mocks.

### Removed

- Removed initial Next.js compatibility shims and stale Next.js aliases as the
  TanStack Start migration progressed.
- Removed `next.config.js` during the migration work.

### Fixed

- Fixed TypeScript errors introduced during the TanStack Start migration.
- Fixed route, env, mailer, and test setup issues found while moving away from
  Next.js APIs.

## [1.0.0] - 2026-02-02 to 2026-04-17

Main VibeCards application buildout on the Next.js stack.

Representative commits: `a65a227`, `59f5f4f`, `afbc2f3`, `99bd371`,
`c5e1eec`, `d443261`, `19751a2`, `287792f`, `07ab2da`, `02cd904`,
`ff3dcf8`

### Added

- Added better-auth server and client configuration.
- Added sign-in, sign-up, OTP verification pages, and protected-route
  middleware.
- Added Drizzle ORM database schema, relations, database client, and Supabase
  SQL policy files.
- Added Gemini-based deck generation after moving away from the earlier OpenAI
  integration.
- Added Zod validation schemas for auth forms and deck-generation inputs.
- Added the main dashboard, deck list, deck detail, study mode, and
  generate-deck UI.
- Added shared header, footer, navigation buttons, theme provider, theme toggle,
  legal pages, landing page sections, reusable deck components, and shadcn/ui
  primitives.
- Added Pino-based structured logging.
- Added Sentry configuration during the Next.js phase, then removed it during
  later observability cleanup.
- Added unit and Playwright test coverage for validation, auth, landing, deck
  generation, deck viewing, and deck deletion flows.
- Added Playwright global setup for authenticated E2E tests.
- Added hooks for deck search, deck deletion, and favorite filtering.
- Added GitHub Actions CI/CD workflows with install, lint, test, security, and
  deployment-related checks.
- Added Bun lockfile, Bun scripts, oxlint, oxfmt, and Turbo configuration.

### Changed

- Migrated authentication from Clerk to better-auth.
- Migrated data access from Supabase client usage to Drizzle ORM.
- Migrated AI generation from OpenAI to Gemini.
- Reworked deck generation and deletion from API route flows into server action
  flows during the Next.js phase.
- Rewrote API route usage around deck workflows before the later TanStack Start
  migration.
- Replaced a temporary test-login endpoint with Playwright global setup to avoid
  keeping a risky testing backdoor in the app.
- Migrated dependency and script workflows from pnpm toward Bun.
- Moved project linting and formatting from ESLint/Prettier toward
  oxlint/oxfmt.
- Updated CI for Bun installs, Playwright container execution, unzip
  availability, and task environment variables.
- Reworked app shell feedback from spinner behavior toward toast-based feedback.
- Grouped components by feature and moved email templates under
  `src/components/email-templates`.

### Removed

- Removed Clerk and Supabase client functionality after the better-auth/Drizzle
  migration.
- Removed the temporary test-login endpoint after replacing it with safer E2E
  setup.
- Removed pnpm lockfile usage as part of the Bun migration.
- Removed older ESLint/Prettier configuration paths as oxlint/oxfmt took over.
- Removed Sentry temporarily after initial observability experimentation.

### Fixed

- Fixed verify-OTP suspense behavior.
- Fixed auth import paths, wildcard origin handling, and form validation
  behavior.
- Fixed search bar behavior.
- Fixed toaster styling and app-level toaster mounting.
- Fixed Gemini model hierarchy after unavailable model issues.
- Fixed build, lint-staged, line-ending, import, and environment-loading issues.
- Fixed CI task env handling and test setup issues.

## [0.1.0] - 2026-01-04 to 2026-02-02

Initial project foundation.

Representative commits: `e11cb0c`, `5585593`, `4ce6e05`, `06c6747`,
`5adecd0`, `9e73aed`, `78036d2`, `0f2e85e`, `9acdd48`

### Added

- Created the project from the initial Next.js scaffold.
- Added the original product requirements document and setup documentation.
- Added the first VibeCards dashboard, deck list, deck detail, study mode, and
  generate-deck UI.
- Added initial API routes for deck generation and deck operations.
- Added Supabase schema and policy files during the first app buildout.
- Added Vercel Analytics.
- Added Husky, Jest/Playwright configuration, Prettier configuration, ESLint
  configuration, and lint-staged setup.
- Added environment validation and `.env.example`.
- Added shadcn components and early shared UI setup.
- Added Resend email support and auth-related environment variables.
- Added early auth helper work before the later better-auth/Drizzle migration.

### Changed

- Reworked the initial scaffold into the first VibeCards product UI.
- Updated dependencies and formatting/linting configuration during bootstrap.
- Updated README and setup documentation as the initial app structure formed.
- Started moving from npm lockfile usage toward pnpm during the early setup
  period.

### Removed

- Removed unnecessary scaffold and footer/header code during early cleanup.
- Removed the original npm lockfile when pnpm lockfile usage was introduced.

### Fixed

- Fixed early import, PostCSS, trusted-origin, wildcard URL, and verify-OTP
  suspense issues.
