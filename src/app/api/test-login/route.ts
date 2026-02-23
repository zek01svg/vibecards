import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import auth from "@/lib/auth";
import { env } from "@/lib/env";

/**
 * TEST ONLY: Password-based login endpoint to bypass OTP during local/test development.
 * This endpoint is explicitly disabled in production for security.
 */
export async function POST(req: NextRequest) {
  // Robust security check: Strictly deny in production environments
  if (env.NODE_ENV === "production") {
    return new Response(
      JSON.stringify({ error: "Test endpoint disabled in production" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Use better-auth internal API to perform the sign-in
    // asResponse: true ensures it returns a standard Response with session cookies set
    const authResponse = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    if (!authResponse.ok) {
      return authResponse;
    }

    // Create a redirect response and copy the session cookies (and other headers)
    // from the better-auth response.
    const redirectResponse = NextResponse.redirect(
      new URL("/dashboard", req.url),
      {
        status: 303, // See Other is often better for POST -> GET redirects
      },
    );

    // Copy Set-Cookie headers from the auth response to the redirect response
    authResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        redirectResponse.headers.append(key, value);
      }
    });

    return redirectResponse;
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Login failed",
        message: error instanceof Error ? error.message : "Internal error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
