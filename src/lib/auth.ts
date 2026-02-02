import db from "@/database/db";
import { account, session, user, verification } from "@/database/schema";
import { env } from "@/lib/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";

import {
    getPasswordResetOTPEmail,
    getSignInOTPEmail,
    getVerificationOTPEmail,
    sendEmail,
} from "./mailer";

const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { user, session, account, verification },
    }),
    baseURL: env.NEXT_PUBLIC_APP_URL,
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        emailOTP({
            overrideDefaultEmailVerification: true,
            sendVerificationOnSignUp: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "sign-in") {
                    const subject = "Sign in to VibeCards";
                    const htmlBody = getSignInOTPEmail(email, otp);

                    await sendEmail({
                        to: email,
                        subject: subject,
                        htmlContent: htmlBody,
                    });
                } else if (type === "email-verification") {
                    const subject =
                        "Welcome to Vibecards! Please verify your email";
                    const htmlBody = getVerificationOTPEmail(email, otp);

                    await sendEmail({
                        to: email,
                        subject: subject,
                        htmlContent: htmlBody,
                    });
                } else {
                    const subject = "Reset your password";
                    const htmlBody = getPasswordResetOTPEmail(email, otp);

                    await sendEmail({
                        to: email,
                        subject: subject,
                        htmlContent: htmlBody,
                    });
                }
            },
        }),
    ],
    trustedOrigins: ["http://localhost:3000", "https://vibecards-*"],
    socialProviders: {
        google: {
            prompt: "select_account consent",
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            getUserInfo: async (token) => {
                const response = await fetch(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${token.accessToken}`,
                        },
                    },
                );
                const profile = await response.json();
                return {
                    user: {
                        id: profile.id,
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                        emailVerified: profile.verified_email,
                    },
                    data: profile,
                };
            },
        },
    },
});

export default auth;
