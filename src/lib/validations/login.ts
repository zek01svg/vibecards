import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
