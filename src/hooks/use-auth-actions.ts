
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

/**
 * Custom hook that provides authentication-related actions.
 * Wraps Better Auth client methods and handles routing after auth events.
 *
 * @returns An object containing authentication handler functions.
 */
export function useAuthActions() {
  const navigate = useNavigate();

  /**
   * Signs the current user out and redirects to the home page.
   */
  async function handleSignout() {
    await authClient.signOut();
    await navigate({ to: "/" });
  }

  /**
   * Initiates the Google OAuth sign-in flow.
   * Redirects to the dashboard upon successful authentication.
   */
  async function handleGoogleSignIn() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  }

  /**
   * Sends a One-Time Password (OTP) to the specified email for sign-in.
   * Redirects the user to the OTP verification page.
   *
   * @param {string} email - The email address to send the OTP to.
   */
  async function sendSignInOTP(email: string) {
    // send the email otp
    await authClient.emailOtp.sendVerificationOtp({
      email: email,
      type: "sign-in",
    });

    // redirect to the verify otp page
    await navigate({ to: `/verify-otp?email=${encodeURIComponent(email)}&type=sign-in` });
  }

  /**
   * Verifies the provided OTP for signing in.
   * Redirects to the dashboard on success, or throws an error on failure.
   *
   * @param {string} email - The email address associated with the OTP.
   * @param {string} otp - The one-time password to verify.
   * @throws {Error} Will throw an error if the OTP is invalid or verification fails.
   */
  async function verifySignInOTP(email: string, otp: string) {
    // verify the email otp
    const { data, error } = await authClient.signIn.emailOtp({
      email: email,
      otp: otp,
    });

    if (data?.user) {
      await navigate({ to: "/dashboard" });
    } else {
      throw new Error(error?.message || "Invalid OTP");
    }
  }

  /**
   * Verifies the user's email address using the provided OTP.
   * Redirects to the dashboard on success, or throws an error on failure.
   *
   * @param {string} email - The email address to verify.
   * @param {string} otp - The one-time password to verify the email.
   * @throws {Error} Will throw an error if the OTP is invalid or verification fails.
   */
  async function verifyEmail(email: string, otp: string) {
    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (error) {
      throw new Error(error.message || "Invalid OTP");
    }

    await navigate({ to: "/dashboard" });
  }

  /**
   * Resends the verification OTP to the specified email.
   *
   * @param {string} email - The email address to send the OTP to.
   * @param {"sign-in" | "email-verification" | "forget-password"} type - The type of OTP to send.
   * @throws {Error} Will throw an error if resending the OTP fails.
   */
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

  /**
   * Creates a new user account with email and password, then sends an email verification OTP.
   * Redirects the user to the email verification page on success.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's chosen password.
   * @param {string} name - The user's full name.
   * @throws {Error} Will throw an error if the sign-up process fails.
   */
  async function handleSignUp(email: string, password: string, name: string) {
    try {
      await authClient.signUp.email({
        email,
        password,
        name,
      });

      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "email-verification",
      });

      await navigate({ to: `/verify-otp?email=${encodeURIComponent(email)}&type=email-verification` });
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign up");
    }
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
