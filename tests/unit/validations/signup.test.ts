import { describe, expect, it } from "vitest";

import { signupSchema } from "../../../src/lib/validations/signup";

describe("signupSchema", () => {
  it("should validate a correct signup payload", () => {
    const result = signupSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when name is too short", () => {
    const result = signupSchema.safeParse({
      name: "J",
      email: "john@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });
    expect(result.success).toBe(false);
  });

  it("should fail on weak passwords", () => {
    // Missing uppercase
    let result = signupSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password123!",
      confirmPassword: "password123!",
    });
    expect(result.success).toBe(false);

    // Missing number
    result = signupSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password!",
      confirmPassword: "Password!",
    });
    expect(result.success).toBe(false);

    // Missing symbol
    result = signupSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password123",
      confirmPassword: "Password123",
    });
    expect(result.success).toBe(false);

    // Too short
    result = signupSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Pw1!",
      confirmPassword: "Pw1!",
    });
    expect(result.success).toBe(false);
  });
});
