# VibeCards

AI-powered flashcards for learning. Generate personalized study decks from any topic using OpenAI.

## Overview

VibeCards is a Next.js application that allows authenticated users to:
- Generate flashcards automatically from any topic or notes using OpenAI
- Save and organize their flashcard decks in Supabase
- View and study their decks anytime

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API with structured outputs (Zod schemas)
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm/pnpm
- A Clerk account (for authentication)
- A Supabase project (for database)
- An OpenAI API key

## Local Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd vibecards-workshop
npm install
# or
pnpm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-...
```

### 3. Database Setup

1. Log in to your Supabase dashboard
2. Go to SQL Editor
3. Run the schema from `supabase/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  cards JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decks_owner_id ON decks(owner_id);
CREATE INDEX IF NOT EXISTS idx_decks_created_at ON decks(created_at DESC);
```

### 4. Clerk Setup

1. Create a new application in [Clerk Dashboard](https://dashboard.clerk.com)
2. Copy your Publishable Key and Secret Key to `.env.local`
3. Configure sign-in/sign-up methods as needed
4. Set the following redirect URLs:
   - After sign-in: `http://localhost:3000/dashboard`
   - After sign-up: `http://localhost:3000/dashboard`

### 5. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure

```
src/
  app/
    api/
      generate-deck/        # API route for deck generation
    dashboard/              # Protected dashboard page
    deck/
      [id]/                 # Individual deck view
    sign-in/                # Clerk sign-in page
    sign-up/                # Clerk sign-up page
    page.tsx                # Landing page
  components/
    providers.tsx           # ClerkProvider wrapper
  lib/
    supabase.ts             # Supabase client
    schemas.ts              # Zod schemas for validation
  middleware.ts             # Clerk middleware for route protection
```

## Features

### Authentication
- Sign up and sign in using Clerk
- Protected routes require authentication
- User-specific data isolation

### Deck Generation
- Input a topic or notes (max 500 characters)
- AI generates 8-12 flashcards automatically
- Structured output validation with Zod
- Decks saved to Supabase with user ownership

### Dashboard
- View all your decks
- Generate new decks
- Navigate to individual deck views

### Deck View
- Display all cards in a deck
- Simple, clean card layout
- Access control (only owner can view)

## Security

- All protected routes require authentication via Clerk middleware
- Database queries filter by `owner_id` to ensure users only see their own decks
- Deck access is verified on the server side
- Environment variables are never exposed to the client

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel:
   - Add all variables from `.env.example`
   - Use production values (not test keys)
5. Deploy

### 3. Post-Deployment Setup

1. **Update Clerk Redirect URLs**:
   - After sign-in: `https://your-app.vercel.app/dashboard`
   - After sign-up: `https://your-app.vercel.app/dashboard`

2. **Verify Supabase Connection**:
   - Ensure your Supabase project allows connections from Vercel
   - Check that the database schema is applied

3. **Test the Application**:
   - Sign up for a new account
   - Generate a test deck
   - Verify deck appears in dashboard

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |

## Troubleshooting

### Build Errors

**Note**: The build requires all environment variables to be set. If you see errors about missing Clerk or Supabase keys, ensure your `.env.local` file is properly configured.

- Ensure all environment variables are set in `.env.local`
- Check that Supabase client is properly configured
- Verify Clerk middleware is set up correctly
- For production builds on Vercel, ensure all env vars are set in the Vercel dashboard

### Authentication Issues

- Verify Clerk keys are correct
- Check redirect URLs in Clerk dashboard
- Ensure middleware is protecting the right routes

### Database Errors

- Verify Supabase connection string
- Check that the `decks` table exists
- Ensure indexes are created

### OpenAI API Errors

- Verify API key is valid
- Check API rate limits
- Ensure model name is correct (gpt-5.2 or fallback to gpt-4o)

## License

MIT
