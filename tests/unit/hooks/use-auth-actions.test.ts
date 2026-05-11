import { useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { authClient } from "@/lib/auth-client";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn<() => (options: { to: string }) => Promise<void>>(),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signOut: vi.fn<() => Promise<void>>(),
    signIn: {
      social:
        vi.fn<
          (options: { provider: string; callbackURL: string }) => Promise<void>
        >(),
      emailOtp: vi.fn<
        (options: { email: string; otp: string }) => Promise<{
          data: { user: object } | null;
          error: { message: string } | null;
        }>
      >(),
    },
    emailOtp: {
      sendVerificationOtp:
        vi.fn<
          (options: {
            email: string;
            type: "sign-in" | "email-verification" | "forget-password";
          }) => Promise<{ error: { message: string } | null }>
        >(),
      verifyEmail:
        vi.fn<
          (options: {
            email: string;
            otp: string;
          }) => Promise<{ error: { message: string } | null }>
        >(),
    },
    signUp: {
      email:
        vi.fn<
          (options: {
            email: string;
            password: string;
            name: string;
          }) => Promise<void>
        >(),
    },
  },
}));

describe("useAuthActions", () => {
  const mockNavigate = vi.fn<(options: { to: string }) => Promise<void>>();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(
      mockNavigate as unknown as ReturnType<typeof useNavigate>,
    );
  });

  it("should handle handleSignout", async () => {
    const { result } = renderHook(() => useAuthActions());
    await act(async () => {
      await result.current.handleSignout();
    });
    expect(authClient.signOut).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
  });

  it("should handle handleGoogleSignIn", async () => {
    const { result } = renderHook(() => useAuthActions());
    await act(async () => {
      await result.current.handleGoogleSignIn();
    });
    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/dashboard",
    });
  });

  it("should handle sendSignInOTP", async () => {
    const { result } = renderHook(() => useAuthActions());
    await act(async () => {
      await result.current.sendSignInOTP("test@example.com");
    });
    expect(authClient.emailOtp.sendVerificationOtp).toHaveBeenCalledWith({
      email: "test@example.com",
      type: "sign-in",
    });
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/verify-otp?email=test%40example.com&type=sign-in",
    });
  });

  it("should verify verifySignInOTP and redirect on success", async () => {
    vi.mocked(authClient.signIn.emailOtp).mockResolvedValue({
      data: { user: {} },
      error: null,
    });
    const { result } = renderHook(() => useAuthActions());
    await act(async () => {
      await result.current.verifySignInOTP("test@example.com", "123456");
    });
    expect(authClient.signIn.emailOtp).toHaveBeenCalledWith({
      email: "test@example.com",
      otp: "123456",
    });
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
  });

  it("should handle verifySignInOTP throwing error on fail", async () => {
    vi.mocked(authClient.signIn.emailOtp).mockResolvedValue({
      data: null,
      error: { message: "Wrong OTP" },
    });
    const { result } = renderHook(() => useAuthActions());
    await expect(
      result.current.verifySignInOTP("test@example.com", "123456"),
    ).rejects.toThrow("Wrong OTP");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should verify email and redirect on success", async () => {
    vi.mocked(authClient.emailOtp.verifyEmail).mockResolvedValue({
      error: null,
    });
    const { result } = renderHook(() => useAuthActions());
    await act(async () => {
      await result.current.verifyEmail("test@example.com", "123456");
    });
    expect(authClient.emailOtp.verifyEmail).toHaveBeenCalledWith({
      email: "test@example.com",
      otp: "123456",
    });
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
  });

  it("should handle verifyEmail throwing error on fail", async () => {
    vi.mocked(authClient.emailOtp.verifyEmail).mockResolvedValue({
      error: { message: "Invalid code" },
    });
    const { result } = renderHook(() => useAuthActions());
    await expect(
      result.current.verifyEmail("test@example.com", "123456"),
    ).rejects.toThrow("Invalid code");
  });

  it("should handle resendOTP", async () => {
    vi.mocked(authClient.emailOtp.sendVerificationOtp).mockResolvedValue({
      error: null,
    });
    const { result } = renderHook(() => useAuthActions());
    await act(async () => {
      await result.current.resendOTP("test@example.com", "sign-in");
    });
    expect(authClient.emailOtp.sendVerificationOtp).toHaveBeenCalledWith({
      email: "test@example.com",
      type: "sign-in",
    });
  });

  it("should handle resendOTP throwing error on fail", async () => {
    vi.mocked(authClient.emailOtp.sendVerificationOtp).mockResolvedValue({
      error: { message: "Failed resend" },
    });
    const { result } = renderHook(() => useAuthActions());
    await expect(
      result.current.resendOTP("test@example.com", "sign-in"),
    ).rejects.toThrow("Failed resend");
  });

  it("should handle handleSignUp", async () => {
    const { result } = renderHook(() => useAuthActions());
    await act(async () => {
      await result.current.handleSignUp("new@example.com", "pw123", "New User");
    });
    expect(authClient.signUp.email).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "pw123",
      name: "New User",
    });
    expect(authClient.emailOtp.sendVerificationOtp).toHaveBeenCalledWith({
      email: "new@example.com",
      type: "email-verification",
    });
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/verify-otp?email=new%40example.com&type=email-verification",
    });
  });

  it("should handle handleSignUp throwing error on fail", async () => {
    vi.mocked(authClient.signUp.email).mockRejectedValue(
      new Error("Email taken"),
    );
    const { result } = renderHook(() => useAuthActions());
    await expect(
      result.current.handleSignUp("new@example.com", "pw", "New User"),
    ).rejects.toThrow("Email taken");
  });
});
