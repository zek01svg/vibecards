import { getRequestHeaders } from "@tanstack/start-server-core";

import auth from "@/lib/auth";
import logger from "@/lib/pino";

async function authenticate() {
  const session = await auth.api.getSession({
    headers: new Headers(getRequestHeaders() as unknown as HeadersInit),
  });
  if (!session?.session) {
    logger.warn("Authentication failed: no valid session");
    return "Unauthorized";
  }

  return session.session.userId;
}

export default authenticate;
