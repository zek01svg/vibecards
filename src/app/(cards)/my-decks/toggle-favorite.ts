"use server";

import { revalidatePath } from "next/cache";
import db from "@/database/db";
import { decks } from "@/database/schema";
import logger from "@/lib/pino";
import authenticate from "@/utils/authenticate";
import { eq } from "drizzle-orm";

/**
 * Toggles the favorite status of a flashcard deck securely.
 * Verifies authentication and ensures the deck belongs to the user before updating.
 *
 * @param deckId - The unique identifier of the deck
 * @param isFavorite - The new favorite status boolean
 * @returns An object containing a success boolean and an optional error message if the toggle fails
 */
export async function toggleFavoriteAction(
  deckId: string,
  isFavorite: boolean,
) {
  try {
    const userId = await authenticate();
    if (userId === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }

    // Verify deck belongs to user
    const deck = await db.query.decks.findFirst({
      where: eq(decks.id, deckId),
    });

    if (!deck) {
      return { success: false, error: "Deck not found" };
    }

    if (deck.ownerId !== userId) {
      logger.warn(
        { userId, deckId, ownerId: deck.ownerId },
        "Forbidden: user attempted to toggle favorite on another user's deck",
      );
      return { success: false, error: "Forbidden" };
    }

    // Update the deck favorite status
    await db.update(decks).set({ isFavorite }).where(eq(decks.id, deckId));

    logger.info(
      { userId, deckId, isFavorite },
      "Deck favorite toggled successfully",
    );

    revalidatePath("/my-decks");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    logger.error({ err: error, deckId }, "Error toggling favorite deck");
    return { success: false, error: "Internal server error" };
  }
}
