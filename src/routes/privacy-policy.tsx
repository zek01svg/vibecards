import { createFileRoute } from "@tanstack/react-router";
import { PolicyCard } from "@/components/legal/policy-card";
import { Lock, Mail, Shield } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-4xl space-y-8 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">
          How VibeCards handles account, deck, and usage data.
        </p>
      </div>

      <PolicyCard
        title="Account Data"
        description="Information needed to authenticate and personalize your account."
        icon={Shield}
      >
        We store the account details you provide, including your name, email
        address, authentication records, and generated study decks.
      </PolicyCard>

      <PolicyCard
        title="Study Content"
        description="Topics and cards are used to provide the app experience."
        icon={Lock}
        iconColorClass="text-emerald-500"
        iconBgClass="border-emerald-500/20 bg-emerald-500/10"
      >
        Deck prompts and generated flashcards are saved to your account so you
        can revisit and study them later.
      </PolicyCard>

      <PolicyCard
        title="Contact"
        description="Questions about privacy can be sent to the project owner."
        icon={Mail}
        iconColorClass="text-orange-500"
        iconBgClass="border-orange-500/20 bg-orange-500/10"
      >
        Contact support if you need account data reviewed, exported, or removed.
      </PolicyCard>
    </main>
  );
}
