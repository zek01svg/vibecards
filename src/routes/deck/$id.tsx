import { createServerFn } from "@tanstack/react-start";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

import { CompletionState } from "@/components/deck/completion-state";
import { DeckHeader } from "@/components/deck/deck-header";
import { EmptyState } from "@/components/deck/empty-state";
import { Flashcard } from "@/components/deck/flashcard";
import { KeyboardShortcutsHint } from "@/components/deck/keyboard-shortcuts-hint";
import { StudyControls } from "@/components/deck/study-controls";
import { StudyProgress } from "@/components/deck/study-progress";
import db from "@/database/db";
import { decks } from "@/database/schema";
import { authClient } from "@/lib/auth-client";
import type { Card as FlashcardData } from "@/lib/validations/generate-deck-schema";
import authenticate from "@/utils/authenticate";
import { useMemo, useState } from "react";

const getDeck = createServerFn({ method: "GET" })
  .inputValidator((deckId: string) => deckId)
  .handler(async ({ data: deckId }) => {
