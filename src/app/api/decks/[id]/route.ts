import { NextRequest, NextResponse } from "next/server";
import db from "@/database/db";
import { decks } from "@/database/schema";
import logger from "@/lib/pino";
import authenticate from "@/utils/authenticate";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await authenticate();
    if (userId === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: deckId } = await params;

    // Verify deck belongs to user
    const deck = await db.query.decks.findFirst({
      where: eq(decks.id, deckId),
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    if (deck.ownerId !== userId) {
      logger.warn(
        { userId: userId, deckId: deckId, ownerId: deck.ownerId },
        "Forbidden: user attempted to delete another user's deck",
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the deck
    await db.delete(decks).where(eq(decks.id, deckId));

    logger.info(
      { userId: userId, deckId: deckId },
      "Deck deleted successfully",
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const { id: deckId } = await params;
    logger.error({ err: error, deckId: deckId }, "Error deleting deck");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
