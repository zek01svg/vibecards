import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicyPage from "@/app/(legal)/privacy-policy/page";

export const Route = createFileRoute("/privacy-policy")({ component: PrivacyPolicyPage });
