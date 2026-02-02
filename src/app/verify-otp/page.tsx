import { Suspense } from "react"; // <--- 1. Import Suspense
import { OTPForm } from "@/components/auth/otp-form";

export default function VerifyOtpPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Suspense>
                <OTPForm />
            </Suspense>
        </div>
    );
}
