# Vibecards Context

Vibecards is an offline-first AI flashcard generator and study application. Decks are generated via a stateless server route powered by Gemini and Upstash Redis rate-limiting, and persisted client-side in browser local storage without user accounts or auth layers.

## Language

**Local Deck**:
A flashcard deck stored in browser `localStorage` under a UUID key (`vibecards_deck_<uuid>`).
_Avoid_: Remote deck, database record, server deck

**Deck Index**:
A master list stored in `localStorage` under `vibecards_deck_index` containing deck metadata (ID, title, topic, card count, creation timestamp, favorite status) used for fast list rendering.
_Avoid_: Database index, SQL table

**Stateless Deck Generation Route**:
An unauthenticated server API route (`POST /api/decks`) that transforms user prompts into structured flashcard JSON via Gemini with Upstash Redis rate-limiting.
_Avoid_: Authenticated deck endpoint, CRUD route

**Study Session**:
An active study interface operating entirely on client-side deck data held in state or local storage.
_Avoid_: Server-side study log

**Public Navigation**:
Direct UI access to Dashboard, My Decks, and Deck Generation without sign-in prompts or session checks.
_Avoid_: Protected route, auth gate

**Deck Backup**:
A JSON file export/import payload allowing users to back up and restore their local decks across browser sessions or devices.
_Avoid_: Cloud sync, DB restore
