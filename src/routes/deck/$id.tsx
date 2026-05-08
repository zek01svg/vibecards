import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import DeckPage from "@/app/(cards)/deck/[id]/page";

export const Route = createFileRoute("/deck/$id")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session) throw redirect({ to: "/sign-in" });
  },
  component: DeckPage,
});
