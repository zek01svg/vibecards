import { Brain, Layers, Sparkles, Zap } from "lucide-react";

import { FeatureCard } from "./feature-card";

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 gap-6 pt-24 sm:grid-cols-2 lg:grid-cols-4">
      <FeatureCard
        title="AI Magic"
        description="Gemini transforms your messy notes into perfect study decks in milliseconds."
        icon={Sparkles}
        variant="primary"
      />
      <FeatureCard
        title="Vibe Study"
        description="A focused, premium study mode designed for flow and maximum retention."
        icon={Brain}
        variant="purple"
      />
      <FeatureCard
        title="Instant Sync"
        description="Your decks are everywhere you are. Mobile, desktop, or in-class. Always ready."
        icon={Zap}
        variant="emerald"
      />
      <FeatureCard
        title="Pro Organization"
        description="Tag, filter, and search through thousands of cards with lightning speed."
        icon={Layers}
        variant="orange"
      />
    </div>
  );
}
