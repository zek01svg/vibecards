import { FeatureCard } from "@/components/deck/feature-card";
import LandingPageButton from "@/components/landing/landing-page-button";
import Typewriter from "@/components/ui/typewriter-wrapper";
import { Brain, Layers, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background relative min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="bg-primary/20 dark:bg-primary/10 absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"></div>
        <div className="bg-primary/10 absolute right-0 bottom-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative container mx-auto flex flex-col items-center justify-center px-4 pt-12 pb-24 text-center sm:pt-20 sm:pb-32">
        <div className="max-w-4xl space-y-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight whitespace-nowrap sm:text-7xl lg:text-8xl">
              Master Any Topic in{" "}
              <span className="from-primary bg-linear-to-r to-purple-400 bg-clip-text text-transparent">
                <Typewriter
                  options={{
                    strings: ["Seconds", "Minutes", "Style"],
                    autoStart: true,
                    loop: true,
                    wrapperClassName: "text-primary",
                  }}
                />
              </span>
            </h1>

            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl">
              Transform your topics into comprehensive study decks instantly.
              <br />
              Powered by Google Gemini.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center pt-2">
            <LandingPageButton />
            <p className="text-muted-foreground/60 mt-4 text-xs">
              No credit card required. Free forever for students.
            </p>
          </div>

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
        </div>
      </main>
    </div>
  );
}
