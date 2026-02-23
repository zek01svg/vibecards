import { type NextRequest } from "next/server";
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
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    return response;
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
