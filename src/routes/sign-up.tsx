import { createFileRoute } from "@tanstack/react-router";
import SignupPage from "@/app/(auth)/sign-up/[[...sign-up]]/page";

export const Route = createFileRoute("/sign-up")({ component: SignupPage });
