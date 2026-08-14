import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-7rem)] items-center px-6 py-16">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        <div className="animate-fade-in text-left">
          <h1 className="font-display mt-6 text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Tell it the topic.
            <br />
            Get the cards.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-balance">
            VibeCards turns any topic into a ready-to-study deck in about forty
            seconds. Every card lives in your browser — no account, no cloud, no
            tracking.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4">
            <Button asChild size="lg" className="shadow-paper h-12 px-8">
              <Link to="/dashboard">Make a deck</Link>
            </Button>
            <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
              ≈ 40 seconds per deck · no sign-up
            </p>
          </div>
        </div>

        <div className="animate-float group relative mx-auto mt-4 h-[420px] w-[300px] motion-reduce:animate-none sm:h-[460px] sm:w-[340px] lg:mt-0">
          {/* Bottom of the stack */}
          <div
            aria-hidden="true"
            className="bg-muted absolute inset-0 translate-x-4 translate-y-3 rotate-6 rounded-sm border opacity-40 transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-2"
          />
          {/* Back of the card */}
          <div
            aria-hidden="true"
            className="bg-card text-card-foreground shadow-card absolute inset-0 rotate-[2.5deg] rounded-sm border p-8 transition-transform duration-500 group-hover:rotate-3"
          >
            <div className="text-muted-foreground font-mono text-[10px] font-semibold tracking-[0.2em] uppercase">
              Explanation
            </div>
            <p className="mt-8 text-2xl leading-snug font-medium text-balance">
              Air scatters shorter, blue wavelengths far more than longer ones —
              sunlight bouncing off air molecules paints the sky blue.
            </p>
          </div>
          {/* Front of the card */}
          <div className="bg-card text-card-foreground shadow-card absolute inset-0 -rotate-2 rounded-sm border p-8 transition-transform duration-500 group-hover:-rotate-1">
            <div className="bg-accent text-accent-foreground inline-block rounded-[3px] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.2em] uppercase">
              Prompt
            </div>
            <p className="mt-10 text-3xl leading-snug font-medium text-balance">
              Why does the sky appear blue during the day?
            </p>
            <div className="text-muted-foreground absolute right-8 bottom-6 left-8 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
              <span>Card 1 of 12</span>
              <span className="bg-accent inline-block h-1.5 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
