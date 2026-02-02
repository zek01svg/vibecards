"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function useAuthActions() {
    const router = useRouter();

    async function handleSignout() {
        await authClient.signOut();
        router.push("/");
    }

    async function handleGoogleSignIn() {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        });
    }

    async function sendSignInOTP(email: string) {
        // send the email otp
        await authClient.emailOtp.sendVerificationOtp({
            email: email,
            type: "sign-in",
        });

        // redirect to the verify otp page
        router.push(
            `/verify-otp?email=${encodeURIComponent(email)}&type=sign-in`,
        );
    }

    async function verifySignInOTP(email: string, otp: string) {
        // verify the email otp
        const { data, error } = await authClient.signIn.emailOtp({
            email: email,
            otp: otp,
        });

        if (data?.user) {
            router.push("/dashboard");
        } else {
            throw new Error(error?.message || "Invalid OTP");
        }
    }

    async function verifyEmail(email: string, otp: string) {
        const { data, error } = await authClient.emailOtp.verifyEmail({
            email,
            otp,
        });

        if (error) {
            throw new Error(error.message || "Invalid OTP");
        }

        router.push("/dashboard");
    }

    async function resendOTP(
        email: string,
        type: "sign-in" | "email-verification" | "forget-password",
    ) {
        const { error } = await authClient.emailOtp.sendVerificationOtp({
            email,
            type,
        });
        if (error) {
            throw new Error(error.message || "Failed to resend OTP");
        }
    }

    async function handleSignUp(email: string, password: string, name: string) {
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
        });
        if (error) {
            throw new Error(
                error.message || "An error occurred during sign up",
            );
        }

        router.push(
            `/verify-otp?email=${encodeURIComponent(email)}&type=email-verification`,
        );
    }

    return {
        handleSignout,
        handleGoogleSignIn,
        sendSignInOTP,
        verifySignInOTP,
        handleSignUp,
        verifyEmail,
        resendOTP,
    };
}
