# Agent Notes for VibeCards

This document contains notes for AI agents working on this codebase.

## Architecture Overview

VibeCards is a Next.js 16 application using:
- **Clerk** for authentication (server-side auth checks)
- **Supabase** for database (PostgreSQL via Supabase client)
- **OpenAI** for AI-powered flashcard generation
- **Zod** for schema validation

## Key Implementation Details

### Authentication
- Clerk middleware protects routes defined in `src/middleware.ts`
- Protected routes: `/dashboard`, `/deck/*`, `/api/generate-deck`
- Use `auth()` from `@clerk/nextjs/server` for server-side auth checks
- `owner_id` in database uses Clerk's `userId` (string)

### Database
- Table: `decks` with columns: `id`, `owner_id`, `title`, `topic`, `cards` (JSONB), `created_at`
- **CRITICAL**: All queries MUST filter by `owner_id` to ensure data isolation
- Index on `owner_id` for efficient queries
- Index on `created_at` for sorting

### API Routes
- `/api/generate-deck` - POST endpoint for generating decks
- Requires authentication (enforced by middleware)
- Validates topic length (max 500 chars)
- Uses OpenAI with structured outputs (JSON schema)
- Validates response with Zod before saving
- Returns `{ deckId: string }` on success

### OpenAI Integration
- Model: Tries `gpt-5.2` first, falls back to `gpt-4o` if unavailable
- Uses `response_format` with `json_schema` for structured outputs
- Max output tokens: 2000
- Temperature: 0.7
- Generates 8-12 cards per deck (enforced by Zod schema)

### Pages
- All auth-protected pages must include `export const dynamic = 'force-dynamic'`
- Dashboard: Lists user's decks, provides form to generate new deck
- Deck view: Shows individual deck with all cards, verifies ownership
- Landing page: Public, shows sign-in/sign-up links

### Client Components
- `GenerateDeckForm` - Client component for deck generation form
- Uses `useRouter` for navigation after generation
- Handles loading and error states

### Providers
- `Providers` component wraps app with `ClerkProvider`
- Must be a `'use client'` component for Next.js 16 compatibility
- Wrapped in root layout

## Common Patterns

### Server-Side Auth Check
```typescript
const { userId } = await auth();
if (!userId) {
  redirect('/sign-in');
}
```

### Database Query with Owner Filter
```typescript
const { data } = await supabase
  .from('decks')
  .select('*')
  .eq('owner_id', userId); // CRITICAL: Always filter by owner_id
```

### OpenAI Client Instantiation
```typescript
// Instantiate inside route handler, not at module level
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

## File Locations

- Supabase client: `src/lib/supabase.ts`
- Zod schemas: `src/lib/schemas.ts`
- Clerk providers: `src/components/providers.tsx`
- Middleware: `src/middleware.ts`
- API routes: `src/app/api/*/route.ts`
- Pages: `src/app/*/page.tsx`

## Testing Checklist

When making changes, verify:
1. ✅ Build passes (`npm run build`)
2. ✅ Authentication works (sign in/up)
3. ✅ Dashboard only shows user's decks
4. ✅ Deck generation works end-to-end
5. ✅ Deck view verifies ownership
6. ✅ Cannot access other users' decks
7. ✅ Environment variables are set correctly

## Known Issues / Notes

- OpenAI model `gpt-5.2` may not be available - fallback to `gpt-4o` is implemented
- RLS policies in `supabase/level2-rls.sql` are for reference only (uses Supabase Auth, not Clerk)
- Rate limiting is a placeholder - implement proper rate limiting for production
- Error handling is basic - enhance for production use

## Future Enhancements

- Add rate limiting to API routes
- Implement deck editing/deletion
- Add search functionality
- Support for multiple card formats
- Export decks to various formats
- Study mode with spaced repetition
