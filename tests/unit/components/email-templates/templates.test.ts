import { describe, expect, it } from "vitest";
import { getVerificationOTPEmail, getSignInOTPEmail, getPasswordResetOTPEmail } from "../../../../src/components/email-templates/templates";

describe("Email Templates", () => {
  describe("getVerificationOTPEmail", () => {
    it("should include the OTP and the correct wording", () => {
      const otp = "123456";
      const result = getVerificationOTPEmail({ otp });

      expect(result).toContain(otp);
      expect(result).toContain("Time to Lock in Your Vibe");
      expect(result).toContain("Welcome to the circle!");
    });
  });

  describe("getSignInOTPEmail", () => {
    it("should include the OTP and the correct wording", () => {
      const otp = "654321";
      const result = getSignInOTPEmail({ otp });

      expect(result).toContain(otp);
      expect(result).toContain("Welcome Back to the Flow");
    });
  });

  describe("getPasswordResetOTPEmail", () => {
    it("should include the OTP, email, and correct wording", () => {
      const otp = "789012";
      const email = "test@example.com";
      const result = getPasswordResetOTPEmail({ otp, email });

      expect(result).toContain(otp);
      expect(result).toContain(email);
      expect(result).toContain("Reset Your Access");
    });
  });
});
