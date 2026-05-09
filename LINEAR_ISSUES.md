# Linear Issue Drafts

These issue drafts mirror the completed work captured in `CHANGELOG.md` and
the current follow-up backlog. Use this file as the source of truth when the
Linear connector is available.

Target project: VibeCards

## Done Issues

### Project foundation and early setup

- Status: Done
- Type: History
- Representative commits: `e11cb0c`, `5585593`, `06c6747`, `18ae6d0`,
  `9e73aed`, `78036d2`, `0f2e85e`, `54a57f1`, `494aa58`

Summary:

Created the initial VibeCards project foundation from the Next.js scaffold,
added product/setup documentation, introduced environment validation, added
Vercel Analytics, and kept README/setup docs aligned as the project shape
changed.

Notes:

- Initial app scaffold and baseline configuration landed.
- PRD and setup documentation were added.
- `.env.example` and environment validation were introduced.
- Early dependency, linting, formatting, and documentation updates were made.

### Build the core app shell and UI

- Status: Done
- Type: History
- Representative commits: `4ce6e05`, `9acdd48`, `c5e1eec`, `267f027`,
  `12dc321`, `e088e22`, `3ddf4ec`, `1e18cc2`, `7607ff4`, `140aa70`,
  `6064d61`, `5765130`, `5e4e27d`, `ea36f3b`, `e0d1bde`, `a55ab59`,
  `2b47d58`, `4479c3c`, `bccdf33`, `9b01cc1`

Summary:

Built the user-facing app shell, landing page, dashboard, deck UI, legal pages,
theme controls, header/footer, reusable UI primitives, and feedback states.

Notes:

- Added dashboard, deck list, deck detail, study mode, and generate-deck UI.
- Added header, footer, navigation, theme provider, and theme toggle.
- Added landing-page sections, feature cards, typewriter UI, auth entry buttons,
  policy cards, and reusable deck components.
- Added global error and not-found pages during the Next.js app phase.
- Added Pino-based structured logging during initial app buildout.
- Reworked visual feedback from spinners toward toast-based feedback.

### Migrate authentication, database, and AI foundations

- Status: Done
- Type: History
- Representative commits: `59f5f4f`, `afbc2f3`, `79898d2`, `045c0be`,
  `99bd371`, `69ea4b0`, `89cfc59`, `2936efe`, `1251a84`

Summary:

Moved the app foundations to better-auth, Drizzle ORM, Supabase-backed schema
management, Gemini deck generation, and Zod validation.

Notes:

- Migrated authentication from Clerk to better-auth.
- Migrated data access from Supabase client usage to Drizzle ORM.
- Added better-auth server/client configuration and auth route handling.
- Added Drizzle schema, relations, database client, and Supabase SQL policy
  files.
- Migrated AI generation from OpenAI to Gemini.
- Added Zod validation schemas for auth and deck-generation inputs.
- Fixed OTP suspense behavior, auth imports, wildcard origins, and validation
  behavior.

### Add testing and QA foundations

- Status: Done
- Type: History
- Representative commits: `5adecd0`, `3b2f6ca`, `d443261`, `19751a2`,
  `22e8e18`, `362ebef`, `568cfaf`, `a5cac8f`, `67269e9`

Summary:

Added automated testing foundations with Vitest/Jest-era setup, Playwright E2E
coverage, auth-aware global setup, and coverage for deck and auth workflows.

Notes:

- Added unit testing and Playwright configuration.
- Added unit tests for validation, utilities, hooks, auth, deck generation,
  deck viewing, and deck deletion.
- Added Playwright coverage for landing, auth, generated deck, and deck
  workflows.
- Replaced a temporary test-login endpoint with Playwright global setup.
- Updated test scripts and test environment handling as the app changed.

### Refactor deck workflows and server actions

- Status: Done
- Type: History
- Representative commits: `07d9ee1`, `052d815`, `401bc75`, `b988452`,
  `287792f`, `171bec7`, `07ab2da`

Summary:

Improved deck workflows, search, deletion, favorite filtering, and the
server-side flow around deck generation/deletion during the Next.js phase.

Notes:

- Added hooks for deck search and deck deletion.
- Added `isFavorite` filtering and favorite toggling support.
- Added deck empty states, search behavior, deleting states, and improved deck
  card navigation.
- Reworked deck generation and deletion from API route flows into server action
  flows.
- Fixed search behavior and updated deck workflow tests.

### Migrate package manager, tooling, and CI

- Status: Done
- Type: History
- Representative commits: `497c0ad`, `60f139b`, `02cd904`, `fba9335`,
  `97c6c9f`, `ff3dcf8`

Summary:

Moved project tooling and automation toward Bun, oxlint/oxfmt, GitHub Actions,
Playwright CI execution, and security/deployment checks.

Notes:

- Migrated dependency and script workflows from pnpm toward Bun.
- Added Bun lockfile and Bun-based scripts.
- Added oxlint and oxfmt as the current linting and formatting toolchain.
- Added GitHub Actions workflows for install, lint, test, security, and
  deployment-related checks.
- Updated CI for Bun installs, Playwright container execution, unzip
  availability, and task environment variables.
- Removed pnpm lockfile usage and older ESLint/Prettier configuration paths.

### Add observability and environment operations

- Status: Done
- Type: History
- Representative commits: `725d7e3`, `fc5817b`, `482881e`, `7607ff4`,
  `66c9543`, `91a0668`, `c9482dd`

Summary:

Added and iterated on production monitoring, logging utilities, dotenv loading,
and quieter local/test environment behavior.

Notes:

- Added Sentry configuration for production error monitoring during the Next.js
  phase.
- Moved Sentry client configuration during instrumentation setup.
- Removed Sentry temporarily after initial observability experimentation.
- Added logging utilities and Pino-based structured logging.
- Added dotenv-based environment loading and quieted dotenv output.

### Migrate VibeCards to TanStack Start

- Status: Done
- Type: History
- Representative commits: `4ecdba0`, `fde480b`, `99792a1`, `c111218`,
  `3a4e90b`, `a749671`, `7a93970`

Summary:

Moved VibeCards from Next.js conventions toward TanStack Start, TanStack Router,
TanStack Form, and TanStack AI, including route handlers, auth guards, Gemini
normalisation, and test/doc updates.

Notes:

- Added TanStack Start, TanStack Router, Vite, and route-based application
  entrypoints.
- Added file routes for home, auth, dashboard, deck detail, user decks, legal
  pages, and API handlers.
- Added TanStack Start server handlers for better-auth and deck CRUD/generation.
- Added TanStack AI + Gemini integration with structured output parsing and
  model fallback handling.
- Added `useSearchParams` and `authenticate` replacements for Next.js helpers.
- Moved protected routes to `beforeLoad` guards.
- Removed Next.js route artifacts, compatibility shims, duplicate globals, and
  old API route files.
- Removed unsafe Gemini response casts in favor of explicit type narrowing.

## Todo Issues

### Complete remaining TanStack route/page migration

- Status: Todo
- Type: Follow-up
- Source: QA/template audit

Summary:

Current route files still import deleted `src/app/...` modules, which blocks
typecheck and app startup.

Acceptance criteria:

- Route components import existing TanStack-era page/component modules.
- Deleted Next.js page component paths are no longer referenced.
- `bunx tsc --noEmit` no longer reports missing `@/app/...` route imports.

Evidence:

- `bunx tsc --noEmit` reports missing imports for dashboard, my-decks, deck,
  auth, legal, and index routes.
- `tests/unit/hooks/use-delete-deck.test.ts` still mocks a deleted
  `@/app/(cards)/my-decks/delete-deck` path.

### Restore or regenerate the TanStack route tree

- Status: Todo
- Type: Follow-up
- Source: QA/template audit

Summary:

`src/router.tsx` imports `./routeTree.gen`, but `src/routeTree.gen.ts` is
currently deleted in the worktree.

Acceptance criteria:

- `src/routeTree.gen.ts` is regenerated or restored using the expected TanStack
  Router workflow.
- `src/router.tsx` resolves the generated route tree.
- Typecheck no longer fails on route tree or `createFileRoute` path typing.

Evidence:

- `bunx tsc --noEmit` reports `Cannot find module './routeTree.gen'`.
- API and page route files show `createFileRoute(...)` argument type failures
  after the missing route tree error.

### Replace Pino with template-style LogTape logging

- Status: Backlog
- Type: Follow-up
- Source: TanStack Start template carry-over audit

Summary:

The TanStack Start template uses a LogTape-backed `src/lib/logger.ts` with
runtime bootstrap in `instrument.server.mjs` and client/router setup. VibeCards
still uses `src/lib/pino.ts`, `pino`, and `pino-pretty`.

Acceptance criteria:

- Add a single LogTape logger entrypoint matching the template's simple
  structured logging pattern.
- Replace imports from `@/lib/pino` / `./pino` with the new logger entrypoint.
- Remove `pino` and `pino-pretty` if no longer used.
- Update docs/changelog follow-ups once the migration is complete.

Evidence:

- `src/lib/pino.ts` exists.
- `package.json` includes `pino` and `pino-pretty`.
- Logger imports appear in auth, mailer, API routes, and authenticate tests.

### Correct package-manager and runtime documentation

- Status: Todo
- Type: Follow-up
- Source: Template audit and changelog review

Summary:

README content still describes npm and Node-first workflows even though the
repo currently declares Bun and uses `bun.lock`.

Acceptance criteria:

- README setup commands use Bun consistently.
- Tech stack/runtime/package-manager tables match `package.json`.
- Stale npm references are removed unless they are explicitly historical.
- Environment file instructions match the scripts' expected `.env` / `.env.local`
  behavior.

Evidence:

- README lists npm installation and `npm run ...` commands.
- `package.json` declares `packageManager: bun@1.3.13`.
- `bun.lock` exists and `package-lock.json` is deleted in the worktree.

### Fix current lint, format, typecheck, and unit-test failures

- Status: Todo
- Type: Follow-up
- Source: verification pass

Summary:

The current branch has quality-gate failures that should be cleared after the
route migration is completed.

Acceptance criteria:

- `bun run lint` passes.
- `bun run format:check` passes.
- `bunx tsc --noEmit` passes.
- `bun run test:unit` passes.

Evidence:

- `bun run lint` reported 53 errors and 23 warnings.
- `bun run format:check` reported 42 files needing formatting.
- `bunx tsc --noEmit` fails on stale imports, missing route tree, and route
  typing.
- `bun run test:unit` has 8 passing test files and 1 failing suite due to a
  deleted import path.

### Run browser QA after app startup is fixed

- Status: Backlog
- Type: Follow-up
- Source: qa-only planning

Summary:

Browser QA should be run after the app can build/start cleanly so core user
flows can be verified from the browser.

Acceptance criteria:

- Start the app locally.
- Run a `qa-only` pass covering landing, auth routes, dashboard, my-decks, deck
  detail, legal routes, responsive behavior, and console errors.
- Save screenshots and a QA report under `.gstack/qa-reports/...`.
- Convert confirmed QA bugs into Linear issues.

Evidence:

- Current typecheck/test failures prevent a reliable browser QA pass.
