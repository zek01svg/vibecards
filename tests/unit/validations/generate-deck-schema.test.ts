import { describe, expect, it } from "vitest";

import { GenerateDeckRequestSchema } from "../../../src/lib/validations/generate-deck-schema";

describe("GenerateDeckRequestSchema", () => {
  it("should validate a completely filled correct payload", () => {
    const result = GenerateDeckRequestSchema.safeParse({
      topic: "TypeScript Basics",
      difficulty: "beginner",
      cardCount: 15,
    });
    expect(result.success).toBe(true);
  });

  it("should fallback to defaults when properties are omitted", () => {
    const result = GenerateDeckRequestSchema.safeParse({
      topic: "TypeScript Basics",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.difficulty).toBe("intermediate");
      expect(result.data.cardCount).toBe(10);
    }
  });

  it("should accept valid string cardCounts", () => {
    const result = GenerateDeckRequestSchema.safeParse({
      topic: "TypeScript Basics",
      cardCount: "12",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cardCount).toBe(12);
    }
  });

  it("should fail on invalid difficulties", () => {
    const result = GenerateDeckRequestSchema.safeParse({
      topic: "TypeScript Basics",
      difficulty: "expert", // Not in ["beginner", "intermediate", "advanced"]
    });
    expect(result.success).toBe(false);
  });

  it("should fail on invalid cardCounts", () => {
    const result = GenerateDeckRequestSchema.safeParse({
      topic: "TypeScript Basics",
      cardCount: 99, // Not in [5, 8, 10, 12, 15, 20]
    });
    expect(result.success).toBe(false);
  });

  it("should fail on empty topics", () => {
    const result = GenerateDeckRequestSchema.safeParse({
      topic: "",
    });
    expect(result.success).toBe(false);
  });
});
