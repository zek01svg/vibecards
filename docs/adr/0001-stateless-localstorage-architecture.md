# 0001: Move from Auth and Postgres DB to LocalStorage and Stateless Gemini Generation

- **Status**: Accepted
- **Context**: The application previously used Drizzle ORM, PostgreSQL, and BetterAuth for account management, authentication, and server-side deck persistence.
- **Decision**: We decided to remove authentication (`BetterAuth`) and database tables (`PostgreSQL`/`Drizzle`), migrating deck storage entirely to client-side `localStorage` with UUID keys (`vibecards_deck_<uuid>`) and a master `vibecards_deck_index`. Gemini deck generation is retained as an unauthenticated, stateless server API route (`POST /api/decks`) protected by Upstash Redis IP rate-limiting.
- **Consequences**:
  - Zero database maintenance cost and zero authentication complexity.
  - Decks are private to each user's browser device and loaded instantly.
  - Multi-device syncing and cross-device account restoration are not supported without manual export/import.
