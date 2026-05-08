import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import MyDecksPage from "@/app/(cards)/my-decks/page";

export const Route = createFileRoute("/my-decks")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session) throw redirect({ to: "/sign-in" });
  },
  component: MyDecksPage,
});
