import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/app/(cards)/dashboard/page";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });
