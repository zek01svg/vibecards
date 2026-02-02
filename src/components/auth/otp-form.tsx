"use client";

import { useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { toast } from "sonner";

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const type = searchParams.get("type") as
        | "sign-in"
        | "email-verification"
        | "forget-password"
        | null;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const { verifySignInOTP, verifyEmail, resendOTP } = useAuthActions();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !type) {
            toast.error("Invalid verification request");
            return;
        }

        setLoading(true);
        try {
            if (type === "sign-in") {
                await verifySignInOTP(email, otp);
            } else {
                await verifyEmail(email, otp);
            }
            toast.success("Verified successfully");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email || !type) {
            toast.error("Cannot resend code: missing email or type");
            return;
        }

        try {
            await resendOTP(email, type);
            toast.success("Code resent successfully");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Enter verification code</CardTitle>
                <CardDescription>
                    We sent a 6-digit code to {email || "your email"}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleVerify}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="otp">
                                Verification code
                            </FieldLabel>
                            <InputOTP
                                maxLength={6}
                                id="otp"
                                required
                                value={otp}
                                onChange={(value) => setOtp(value)}
                            >
                                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <FieldDescription>
                                Enter the 6-digit code sent to your email.
                            </FieldDescription>
                        </Field>
                        <FieldGroup>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Verifying..." : "Verify"}
                            </Button>
                            <FieldDescription className="text-center">
                                Didn&apos;t receive the code?{" "}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Resend
                                </button>
                            </FieldDescription>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
