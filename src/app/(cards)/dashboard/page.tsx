
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

import { GenerateDeckForm } from "./_components/generate-deck-form";

export default function DashboardPage() {
  const session = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session.isPending && !session.data?.session) {
      void navigate({ to: "/sign-in" });
    }
  }, [navigate, session.data?.session, session.isPending]);

  if (session.isPending || !session.data?.session) {
    return null;
  }

  return (
    <div className="bg-background/50 flex min-h-[calc(100vh-64px)] flex-col">
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <section className="animate-fade-in group">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  Generate New Deck
                </h2>
                <p className="text-muted-foreground mt-2">Transform any topic into a study deck.</p>
              </div>
            </div>

            <div className="border-border bg-card/50 shadow-primary/5 hover:border-primary/20 rounded-3xl border p-6 shadow-2xl backdrop-blur-sm transition-all">
              <GenerateDeckForm />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
