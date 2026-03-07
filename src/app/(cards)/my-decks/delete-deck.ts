"use server";

import { revalidatePath } from "next/cache";
import db from "@/database/db";
import { decks } from "@/database/schema";
import logger from "@/lib/pino";
import authenticate from "@/utils/authenticate";
import { eq } from "drizzle-orm";

/**
 * Deletes a flashcard deck securely.
 * Verifies authentication and ensures the deck belongs to the user before deleting.
 *
 * @param deckId - The unique identifier of the deck to delete
 * @returns An object containing a success boolean and an optional error message if the deletion fails
 */
export async function deleteDeckAction(deckId: string) {
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
        "Forbidden: user attempted to delete another user's deck",
      );
      return { success: false, error: "Forbidden" };
    }

    // Delete the deck
    await db.delete(decks).where(eq(decks.id, deckId));

    logger.info({ userId, deckId }, "Deck deleted successfully");

    revalidatePath("/my-decks");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    logger.error({ err: error, deckId }, "Error deleting deck");
    return { success: false, error: "Internal server error" };
  }
}
