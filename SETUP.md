# VibeCards Setup Checklist

This document lists everything you need to do to get the app running.

## ✅ Code is Complete

All code files are in place:
- ✅ API routes
- ✅ Pages (dashboard, deck view, landing, sign-in/up)
- ✅ Components
- ✅ Database schema
- ✅ Middleware and authentication

## 🔧 What You Need to Do

### 1. Create `.env.local` File

Create a file named `.env.local` in the root directory with:

```env
# Clerk Authentication
# Get these from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
# Get these from your Supabase project settings: https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
# Get this from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...
```

### 2. Set Up Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application (or use existing)
3. Copy your **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
4. Copy your **Secret Key** → `CLERK_SECRET_KEY`
5. Configure authentication methods (Email, Google, etc.)
6. Set redirect URLs:
   - **After sign-in**: `http://localhost:3000/dashboard`
   - **After sign-up**: `http://localhost:3000/dashboard`

### 3. Set Up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project (or use existing)
3. Copy your **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy your **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Go to Settings → API → Project API keys → `anon` `public`
5. Run the SQL schema:
   - Go to SQL Editor
   - Copy contents of `supabase/schema.sql`
   - Paste and click "Run"

### 4. Set Up OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Navigate to API Keys
3. Create a new secret key
4. Copy the key → `OPENAI_API_KEY`
5. **Important**: Ensure you have credits/billing set up

### 5. Install Dependencies (if not done)

```bash
npm install
# or
pnpm install
```

### 6. Run the App

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Test the App

1. **Sign Up**: Create a new account
2. **Generate Deck**: 
   - Go to dashboard
   - Enter a topic (e.g., "JavaScript basics")
   - Click "Generate Deck"
   - Wait for AI to generate cards
3. **View Deck**: Should redirect to deck view showing all cards
4. **Dashboard**: Should show your new deck in the list

## ❌ Common Issues

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and has all variables
- Restart the dev server after creating `.env.local`

### "Missing Clerk publishableKey"
- Check that `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- Make sure it starts with `pk_test_` or `pk_live_`

### "Failed to save deck to database"
- Verify Supabase URL and anon key are correct
- Check that you ran the SQL schema in Supabase
- Verify the `decks` table exists in your Supabase project

### "OpenAI API key not configured"
- Check that `OPENAI_API_KEY` is set in `.env.local`
- Verify the key is valid and has credits

### Build errors
- All environment variables must be set for `npm run build` to work
- This is normal - the app will work in dev mode with `.env.local`

## 📝 Quick Reference

| Service | Where to Get Keys | Required Variables |
|---------|-------------------|-------------------|
| Clerk | https://dashboard.clerk.com | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`<br>`CLERK_SECRET_KEY` |
| Supabase | https://supabase.com/dashboard | `NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| OpenAI | https://platform.openai.com/api-keys | `OPENAI_API_KEY` |

## 🚀 Next Steps After Setup

Once everything is working:
1. Test generating multiple decks
2. Verify you can only see your own decks
3. Try accessing another user's deck ID (should fail)
4. Deploy to Vercel (see README.md)
