import { FeatureCards } from "@/components/landing/feature-cards";
import { HeroSection } from "@/components/landing/hero-section";
import LandingPageButton from "@/components/landing/landing-page-button";

export default function Home() {
  return (
    <div className="bg-background relative min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="bg-primary/20 dark:bg-primary/10 absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"></div>
        <div className="bg-primary/10 absolute right-0 bottom-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative container mx-auto flex flex-col items-center justify-center px-4 pt-12 pb-24 text-center sm:pt-20 sm:pb-32">
        <div className="max-w-4xl space-y-8">
          <HeroSection />

          <div className="flex flex-col items-center justify-center pt-2">
            <LandingPageButton />
            <p className="text-muted-foreground/60 mt-4 text-xs">
              No credit card required. Free forever for students.
            </p>
          </div>

          <FeatureCards />
        </div>
      </main>
    </div>
  );
}
