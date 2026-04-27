import { createFileRoute } from "@tanstack/react-router";
import VerifyOtpPage from "@/app/(auth)/verify-otp/page";

export const Route = createFileRoute("/verify-otp")({ component: VerifyOtpPage });
