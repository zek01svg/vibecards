import { describe, expect, it } from "vitest";

import { getPasswordResetOTPEmail } from "../../../../src/components/email-templates/templates";

describe("getPasswordResetOTPEmail", () => {
  it("should generate an HTML email containing the provided OTP and email", () => {
    const mockOtp = "123456";
    const mockEmail = "test@example.com";

    const result = getPasswordResetOTPEmail({ otp: mockOtp, email: mockEmail });

    // Verify it returns a string
    expect(typeof result).toBe("string");

    // Verify it contains the OTP and email
    expect(result).toContain(mockOtp);
    expect(result).toContain(mockEmail);

    // Verify some generic content from the template
    expect(result).toContain("Reset Your Access");
    expect(result).toContain("VibeCards");
  });
});
