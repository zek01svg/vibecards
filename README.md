# 🃏 VibeCards

AI-powered flashcards for learning. Generate personalized study decks from any topic using OpenAI.

## 🌟 Overview

VibeCards is a **Next.js** application that allows authenticated users to:

- 🧠 **Generate** flashcards automatically from any topic using **Gemini**
- 🗂️ **Save and organize** their flashcard decks
- 📚 **View and study** their decks anytime

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Authentication**: better-auth
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API with structured outputs
- **Code Quality**: ESLint, Prettier, Husky, lint-staged
- **Testing**: Jest, Playwright

## 🚀 Prerequisites

- **pnpm v10.25+** package manager
- A **Supabase** project (for database)
- A **Google Gemini** API key

## 💻 Local Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
pnpm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

### 3. Database Setup

```bash
pnpm run db:push
```

### 4. Run Development Server

```bash
bun dev
```
