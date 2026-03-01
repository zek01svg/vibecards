import z from "zod/v4";

export const otpSchema = z.object({
  otp: z.string().length(6, "Verification code must be 6 digits"),
});

export type OtpSchema = z.infer<typeof otpSchema>;
