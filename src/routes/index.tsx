import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/landing/hero-section";
import LandingPageButton from "@/components/landing/landing-page-button";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 py-16 text-center">
      <HeroSection />
      <div className="mt-10">
        <LandingPageButton />
      </div>
    </main>
  );
}
