import { createFileRoute } from "@tanstack/react-router";
import { OTPForm } from "@/components/auth/otp-form";

export const Route = createFileRoute("/verify-otp")({
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
      <OTPForm className="w-full max-w-md" />
    </main>
  );
}
