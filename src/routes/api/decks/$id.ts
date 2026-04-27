import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

import db from "@/database/db";
import { decks } from "@/database/schema";
import auth from "@/lib/auth";
import logger from "@/lib/pino";

async function getUserId(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.session?.userId ?? null;
}

export const Route = createFileRoute("/api/decks/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const userId = await getUserId(request);
        if (!userId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const deck = await db.query.decks.findFirst({ where: eq(decks.id, params.id) });
        if (!deck) return Response.json({ success: false, error: "Deck not found" }, { status: 404 });
        if (deck.ownerId !== userId) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
        return Response.json({ success: true, deck });
      },
      DELETE: async ({ request, params }) => {
        try {
          const userId = await getUserId(request);
          if (!userId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
          const deck = await db.query.decks.findFirst({ where: eq(decks.id, params.id) });
          if (!deck) return Response.json({ success: false, error: "Deck not found" }, { status: 404 });
          if (deck.ownerId !== userId) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
          await db.delete(decks).where(eq(decks.id, params.id));
          return Response.json({ success: true });
        } catch (error) {
          logger.error({ err: error, deckId: params.id }, "Error deleting deck");
          return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
        }
      },
      PATCH: async ({ request, params }) => {
        try {
          const userId = await getUserId(request);
          if (!userId) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
          const deck = await db.query.decks.findFirst({ where: eq(decks.id, params.id) });
          if (!deck) return Response.json({ success: false, error: "Deck not found" }, { status: 404 });
          if (deck.ownerId !== userId) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
          const body = (await request.json()) as { isFavorite?: boolean };
          await db.update(decks).set({ isFavorite: body.isFavorite ?? false }).where(eq(decks.id, params.id));
          return Response.json({ success: true });
        } catch (error) {
          logger.error({ err: error, deckId: params.id }, "Error toggling favorite deck");
          return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
        }
      }
    }
  }
});
