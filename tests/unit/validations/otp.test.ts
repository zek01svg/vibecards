import { otpSchema } from "@/lib/validations/otp";
import { describe, expect, it } from "vitest";

describe("OtpSchema", () => {
  it("should validate a valid 6-character OTP", () => {
    const result = otpSchema.safeParse({ otp: "123456" });
    expect(result.success).toBe(true);
  });

  it("should invalidate OTPs that are less than 6 characters", () => {
    const result = otpSchema.safeParse({ otp: "12345" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.issues[0]?.message).toBe(
        "Verification code must be 6 digits",
      );
    }
  });

  it("should invalidate OTPs that are more than 6 characters", () => {
    const result = otpSchema.safeParse({ otp: "1234567" });
    expect(result.success).toBe(false);
  });
});
