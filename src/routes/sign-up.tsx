import { createFileRoute, Link } from "@tanstack/react-router";
import { SignupForm } from "@/components/auth/signup-form";

export const Route = createFileRoute("/sign-up")({ component: SignupPage });

function SignupPage() {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <SignupForm />
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="text-primary font-semibold underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
