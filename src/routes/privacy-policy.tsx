import { createFileRoute } from "@tanstack/react-router";
import { PolicyCard } from "@/components/legal/policy-card";
import { HardDrive, Lock, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-4xl space-y-8 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">
          How VibeCards handles local storage, offline-first data, and AI
          prompts.
        </p>
      </div>

      <PolicyCard
        title="Local Storage & Stateless Architecture"
        description="No accounts, user profiles, or centralized server database records."
        icon={HardDrive}
      >
        VibeCards is designed with a local-first, stateless architecture. We do
        not require accounts, email addresses, or user registration. All
        generated study decks, favorite cards, and study progress are stored
        locally within your browser&apos;s local storage.
      </PolicyCard>

      <PolicyCard
        title="Study Content & AI Generation"
        description="How topic prompts are processed by Google Gemini."
        icon={Lock}
        iconColorClass="text-emerald-500"
        iconBgClass="border-emerald-500/20 bg-emerald-500/10"
      >
        When you request a new deck, your topic prompt and difficulty
        preferences are processed via Google Gemini to generate flashcard
        content. Your prompts and study decks are never saved to a backend
        database or user account.
      </PolicyCard>

      <PolicyCard
        title="Data Control & Privacy"
        description="Full control over your stored flashcards and study history."
        icon={ShieldCheck}
        iconColorClass="text-orange-500"
        iconBgClass="border-orange-500/20 bg-orange-500/10"
      >
        Because all your data remains on your device in browser local storage,
        you have full control over it. You can create, manage, export, or delete
        your flashcard decks at any time directly in your browser without
        contacting support.
      </PolicyCard>
    </main>
  );
}
