import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import auth from "@/lib/auth";

export async function proxy(request: NextRequest) {
    // 1. Check for the session
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    // 2. If no session exists, return a 401 response
    if (!session) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
        });
    }

    // 3. Continue to the protected route
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
