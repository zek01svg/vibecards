import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/app/(auth)/sign-in/[[...sign-in]]/page";

export const Route = createFileRoute("/sign-in")({ component: LoginPage });
