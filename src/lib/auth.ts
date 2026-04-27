import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { emailOTP } from "better-auth/plugins";

import { getPasswordResetOTPEmail, getSignInOTPEmail, getVerificationOTPEmail } from "@/components/email-templates/templates";
import db from "@/database/db";
import { account, session, user, verification } from "@/database/schema";
import { env } from "@/lib/env";
import logger from "@/lib/pino";

import { sendEmail } from "./mailer";

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    tanstackStartCookies(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        logger.info({ email: email, type: type }, "Sending OTP email");
        if (type === "sign-in") {
          await sendEmail({
            to: email,
            subject: "Sign in to VibeCards",
            html: getSignInOTPEmail({ otp }),
          });
        } else if (type === "email-verification") {
          await sendEmail({
            to: email,
            subject: "Welcome to VibeCards! Please verify your email",
            html: getVerificationOTPEmail({ otp }),
          });
        } else {
          await sendEmail({
            to: email,
            subject: "Reset your password",
            html: getPasswordResetOTPEmail({ otp, email }),
          });
        }
      },
    }),
  ],
  trustedOrigins: ["http://localhost:3000", "https://vibecards-v2.vercel.app"],
  socialProviders: {
    google: {
      prompt: "select_account consent",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      getUserInfo: async (token) => {
        const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
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
