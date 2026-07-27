import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/login-form";

export const Route = createFileRoute("/sign-in")({ component: LoginPage });

function LoginPage() {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
      <LoginForm className="w-full max-w-md" />
    </main>
  );
}
