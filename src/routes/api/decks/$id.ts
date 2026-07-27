import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

import db from "@/database/db";
import { decks } from "@/database/schema";
import auth from "@/lib/auth";
import { logger } from "@/lib/logger";

async function getUserId(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.session?.userId ?? null;
}

const PatchDeckSchema = z.object({ isFavorite: z.boolean() });

export const Route = createFileRoute("/api/decks/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const userId = await getUserId(request);
          if (!userId)
            return Response.json(
              { success: false, error: "Unauthorized" },
              { status: 401 },
            );
          const deck = await db.query.decks.findFirst({
            where: eq(decks.id, params.id),
          });
          if (!deck)
            return Response.json(
              { success: false, error: "Deck not found" },
              { status: 404 },
            );
          if (deck.ownerId !== userId)
            return Response.json(
              { success: false, error: "Forbidden" },
              { status: 403 },
            );
          return Response.json({ success: true, deck });
        } catch (error) {
          logger.error("Error fetching deck", {
            err: error,
            deckId: params.id,
          });
          return Response.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
          );
        }
      },
      DELETE: async ({ request, params }) => {
        try {
          const userId = await getUserId(request);
          if (!userId)
            return Response.json(
              { success: false, error: "Unauthorized" },
              { status: 401 },
            );
          const deck = await db.query.decks.findFirst({
            where: eq(decks.id, params.id),
          });
          if (!deck)
            return Response.json(
              { success: false, error: "Deck not found" },
              { status: 404 },
            );
          if (deck.ownerId !== userId)
            return Response.json(
              { success: false, error: "Forbidden" },
              { status: 403 },
            );
          await db.delete(decks).where(eq(decks.id, params.id));
          return Response.json({ success: true });
        } catch (error) {
          logger.error("Error deleting deck", {
            err: error,
            deckId: params.id,
          });
          return Response.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
          );
        }
      },
      PATCH: async ({ request, params }) => {
        try {
          const userId = await getUserId(request);
          if (!userId)
            return Response.json(
              { success: false, error: "Unauthorized" },
              { status: 401 },
            );
          const deck = await db.query.decks.findFirst({
            where: eq(decks.id, params.id),
          });
          if (!deck)
            return Response.json(
              { success: false, error: "Deck not found" },
              { status: 404 },
            );
          if (deck.ownerId !== userId)
            return Response.json(
              { success: false, error: "Forbidden" },
              { status: 403 },
            );
          const parsed = PatchDeckSchema.safeParse(await request.json());
          if (!parsed.success)
            return Response.json(
              { success: false, error: "Invalid request body" },
              { status: 400 },
            );
          await db
            .update(decks)
            .set({ isFavorite: parsed.data.isFavorite })
            .where(eq(decks.id, params.id));
          return Response.json({ success: true });
        } catch (error) {
          logger.error("Error toggling favorite deck", {
            err: error,
            deckId: params.id,
          });
          return Response.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
          );
        }
      },
    },
  },
});
