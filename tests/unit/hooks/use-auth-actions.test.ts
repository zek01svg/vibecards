import { useRouter } from "next/navigation";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { authClient } from "@/lib/auth-client";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signOut: vi.fn(),
    signIn: {
      social: vi.fn(),
      emailOtp: vi.fn(),
    },
    emailOtp: {
      sendVerificationOtp: vi.fn(),
      verifyEmail: vi.fn(),
    },
    signUp: {
      email: vi.fn(),
    },
  },
}));

describe("useAuthActions", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
  });

  it("should handle handleSignout", async () => {
    const { result } = renderHook(() => useAuthActions());
    await act(async () => {
      await result.current.handleSignout();
    });
    expect(authClient.signOut).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/");
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
    expect(mockPush).toHaveBeenCalledWith(
      "/verify-otp?email=test%40example.com&type=sign-in",
    );
  });

  it("should verify verifySignInOTP and redirect on success", async () => {
    (authClient.signIn.emailOtp as any).mockResolvedValue({
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
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("should handle verifySignInOTP throwing error on fail", async () => {
    (authClient.signIn.emailOtp as any).mockResolvedValue({
      data: null,
      error: { message: "Wrong OTP" },
    });
    const { result } = renderHook(() => useAuthActions());
    await expect(
      result.current.verifySignInOTP("test@example.com", "123456"),
    ).rejects.toThrow("Wrong OTP");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should verify email and redirect on success", async () => {
    (authClient.emailOtp.verifyEmail as any).mockResolvedValue({ error: null });
    const { result } = renderHook(() => useAuthActions());
    await act(async () => {
      await result.current.verifyEmail("test@example.com", "123456");
    });
    expect(authClient.emailOtp.verifyEmail).toHaveBeenCalledWith({
      email: "test@example.com",
      otp: "123456",
    });
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("should handle verifyEmail throwing error on fail", async () => {
    (authClient.emailOtp.verifyEmail as any).mockResolvedValue({
      error: { message: "Invalid code" },
    });
    const { result } = renderHook(() => useAuthActions());
    await expect(
      result.current.verifyEmail("test@example.com", "123456"),
    ).rejects.toThrow("Invalid code");
  });

  it("should handle resendOTP", async () => {
    (authClient.emailOtp.sendVerificationOtp as any).mockResolvedValue({
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
    (authClient.emailOtp.sendVerificationOtp as any).mockResolvedValue({
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
    expect(mockPush).toHaveBeenCalledWith(
      "/verify-otp?email=new%40example.com&type=email-verification",
    );
  });

  it("should handle handleSignUp throwing error on fail", async () => {
    (authClient.signUp.email as any).mockRejectedValue(
      new Error("Email taken"),
    );
    const { result } = renderHook(() => useAuthActions());
    await expect(
      result.current.handleSignUp("new@example.com", "pw", "New User"),
    ).rejects.toThrow("Email taken");
  });
});
