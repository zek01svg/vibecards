-- Row Level Security (RLS) Policies for VibeCards
-- Optional: Enable RLS and add policies for additional security

-- Enable RLS on decks table
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own decks
CREATE POLICY "Users can view own decks"
  ON decks
  FOR SELECT
  USING (auth.uid()::text = owner_id);

-- Policy: Users can only insert their own decks
CREATE POLICY "Users can insert own decks"
  ON decks
  FOR INSERT
  WITH CHECK (auth.uid()::text = owner_id);

-- Policy: Users can only update their own decks
CREATE POLICY "Users can update own decks"
  ON decks
  FOR UPDATE
  USING (auth.uid()::text = owner_id);

-- Policy: Users can only delete their own decks
CREATE POLICY "Users can delete own decks"
  ON decks
  FOR DELETE
  USING (auth.uid()::text = owner_id);

-- Note: These policies use Supabase auth.uid() which requires Supabase Auth.
-- Since we're using Clerk for authentication, these policies won't work directly.
-- Instead, we rely on application-level filtering by owner_id in our queries.
-- This file is kept for reference if migrating to Supabase Auth in the future.
