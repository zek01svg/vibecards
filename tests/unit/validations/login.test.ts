import { loginSchema } from "@/lib/validations/login";
import { describe, expect, it } from "vitest";

describe("loginSchema", () => {
  it("should validate a correct email", () => {
    const result = loginSchema.safeParse({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });

  it("should fail on empty email", () => {
    const result = loginSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.issues[0]?.message).toBe("Email is required");
    }
  });

  it("should fail on invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.issues[0]?.message).toBe(
        "Please enter a valid email address",
      );
    }
  });
});
