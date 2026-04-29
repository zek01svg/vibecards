import auth from "@/lib/auth";

export async function proxy(request: Request) {
  // 1. Check for the session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // 2. If no session exists, return a 401 response
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  // 3. Continue to the protected route
  return new Response(null, { status: 200 });
}
