import { headers } from "next/headers";
import auth from "@/lib/auth";

async function authenticate() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.session) {
        return "Unauthorized";
    }

    return session.session.userId;
}

export default authenticate;
