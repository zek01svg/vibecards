import { NextRequest, NextResponse } from "next/server";
import db from "@/database/db";
import { decks } from "@/database/schema";
import { authClient } from "@/lib/auth-client";
import authenticate from "@/utils/authenticate";
import { eq } from "drizzle-orm";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const userId = await authenticate();
        if (userId === "Unauthorized") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Verify deck belongs to user
        const deck = await db.query.decks.findFirst({
            where: eq(decks.id, userId),
        });

        if (!deck) {
            return NextResponse.json(
                { error: "Deck not found" },
                { status: 404 },
            );
        }

        if (deck.ownerId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Delete the deck
        await db.delete(decks).where(eq(decks.id, userId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in DELETE /api/decks/[id]:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
