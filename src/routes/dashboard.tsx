import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import DashboardPage from "@/app/(cards)/dashboard/page";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session) throw redirect({ to: "/sign-in" });
  },
  component: DashboardPage,
});
