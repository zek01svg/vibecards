import { Suspense } from "react";
import { OTPForm } from "@/components/auth/otp-form";

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense>
          <OTPForm />
        </Suspense>
      </div>
    </div>
  );
}
