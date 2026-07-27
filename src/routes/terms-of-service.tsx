import { createFileRoute } from "@tanstack/react-router";
import { PolicyCard } from "@/components/legal/policy-card";
import { FileText, Scale, Sparkles } from "lucide-react";

export const Route = createFileRoute("/terms-of-service")({
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <main className="container mx-auto max-w-4xl space-y-8 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground">
          Basic terms for using VibeCards to create and study flashcard decks.
        </p>
      </div>

      <PolicyCard
        title="Use of VibeCards"
        description="Use the app for lawful study and learning purposes."
        icon={Sparkles}
      >
        You are responsible for the topics and content you submit. Do not use
        VibeCards to generate or store harmful, unlawful, or abusive content.
      </PolicyCard>

      <PolicyCard
        title="Generated Content"
        description="AI-generated decks may need review before study use."
        icon={FileText}
        iconColorClass="text-emerald-500"
        iconBgClass="border-emerald-500/20 bg-emerald-500/10"
      >
        Generated cards can be inaccurate or incomplete. Review important study
        material before relying on it.
      </PolicyCard>

      <PolicyCard
        title="Service Changes"
        description="The service may change as the project evolves."
        icon={Scale}
        iconColorClass="text-orange-500"
        iconBgClass="border-orange-500/20 bg-orange-500/10"
      >
        Features, providers, and availability may change over time. Continued
        use means you accept the current service behavior.
      </PolicyCard>
    </main>
  );
}
