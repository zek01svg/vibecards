import { headers } from "next/headers";
import auth from "@/lib/auth";
import logger from "@/lib/pino";

async function authenticate() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) {
    logger.warn("Authentication failed: no valid session");
    return "Unauthorized";
  }

  return session.session.userId;
}

export default authenticate;
