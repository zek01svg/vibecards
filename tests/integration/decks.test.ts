import { desc, eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";

import db from "@/database/db";
import { decks } from "@/database/schema";

const TEST_USER_ID = "test-user-id";
const OTHER_USER_ID = "other-user-id";

const sampleCards = [
  { front: "What is TypeScript?", back: "A typed superset of JavaScript" },
  {
    front: "What is a type?",
    back: "A label that describes the shape of a value",
  },
];

beforeEach(async () => {
  await db.delete(decks).where(eq(decks.ownerId, TEST_USER_ID));
});

describe("decks — insert and retrieve", () => {
  it("inserts a deck and reads it back", async () => {
    const [deck] = await db
      .insert(decks)
      .values({
        ownerId: TEST_USER_ID,
        title: "TypeScript Basics",
        topic: "TypeScript",
        cards: sampleCards,
      })
      .returning();

    expect(deck).toBeDefined();
    expect(deck.title).toBe("TypeScript Basics");
    expect(deck.cards).toHaveLength(2);

    const found = await db.query.decks.findFirst({
      where: eq(decks.id, deck.id),
    });
    expect(found?.topic).toBe("TypeScript");
    expect(found?.isFavorite).toBe(false);
  });

  it("lists decks for a user ordered by createdAt desc", async () => {
    await db.insert(decks).values([
      { ownerId: TEST_USER_ID, title: "Deck A", topic: "JS", cards: [] },
      { ownerId: TEST_USER_ID, title: "Deck B", topic: "TS", cards: [] },
    ]);

    const userDecks = await db.query.decks.findMany({
      where: eq(decks.ownerId, TEST_USER_ID),
      orderBy: [desc(decks.createdAt)],
    });

    expect(userDecks).toHaveLength(2);
    expect(userDecks.map((d) => d.title)).toEqual(
      expect.arrayContaining(["Deck A", "Deck B"]),
    );
  });

  it("does not return decks belonging to another user", async () => {
    await db.insert(decks).values({
      ownerId: OTHER_USER_ID,
      title: "Other",
      topic: "Other",
      cards: [],
    });

    const userDecks = await db.query.decks.findMany({
      where: eq(decks.ownerId, TEST_USER_ID),
    });

    expect(userDecks).toHaveLength(0);
  });
});

describe("decks — update", () => {
  it("toggles isFavorite", async () => {
    const [deck] = await db
      .insert(decks)
      .values({
        ownerId: TEST_USER_ID,
        title: "Fav Test",
        topic: "JS",
        cards: [],
      })
      .returning();

    await db
      .update(decks)
      .set({ isFavorite: true })
      .where(eq(decks.id, deck.id));

    const updated = await db.query.decks.findFirst({
      where: eq(decks.id, deck.id),
    });
    expect(updated?.isFavorite).toBe(true);
  });
});

describe("decks — delete", () => {
  it("deletes a deck by id", async () => {
    const [deck] = await db
      .insert(decks)
      .values({
        ownerId: TEST_USER_ID,
        title: "To Delete",
        topic: "JS",
        cards: [],
      })
      .returning();

    await db.delete(decks).where(eq(decks.id, deck.id));

    const found = await db.query.decks.findFirst({
      where: eq(decks.id, deck.id),
    });
    expect(found).toBeUndefined();
  });

  it("only deletes the specified deck, not others", async () => {
    const [a] = await db
      .insert(decks)
      .values({ ownerId: TEST_USER_ID, title: "Keep", topic: "JS", cards: [] })
      .returning();
    const [b] = await db
      .insert(decks)
      .values({
        ownerId: TEST_USER_ID,
        title: "Remove",
        topic: "TS",
        cards: [],
      })
      .returning();

    await db.delete(decks).where(eq(decks.id, b.id));

    const remaining = await db.query.decks.findMany({
      where: eq(decks.ownerId, TEST_USER_ID),
    });
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(a.id);
  });
});
