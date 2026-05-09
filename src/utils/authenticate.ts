import { getRequestHeaders } from "@tanstack/start-server-core";

import auth from "@/lib/auth";
import logger from "@/lib/pino";

async function authenticate() {
  // getRequestHeaders() returns a Record<string, string> which is a valid
  // HeadersInit format; the Headers constructor accepts it directly.
  const rawHeaders = getRequestHeaders() as unknown as Record<string, string>;
  const session = await auth.api.getSession({
    headers: new Headers(rawHeaders),
  });
  if (!session?.session) {
    logger.warn("Authentication failed: no valid session");
    return "Unauthorized";
  }

  return session.session.userId;
}

export default authenticate;
