"use client";

import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full border-t backdrop-blur">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand & Copyright Section */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="from-primary bg-linear-to-r to-purple-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              VibeCards
            </span>
            <p className="text-muted-foreground text-sm font-medium">
              © {currentYear} — Built with ☕, Gemini, Next.js, Supabase, &
              Better Auth.
            </p>
          </div>

          {/* Social & Links Section */}
          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-xs font-bold tracking-widest uppercase">
              <Link
                href="/terms-of-service"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </Link>
            </div>
            <a
              href="https://github.com/zek01svg/vibecards"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-muted/50 hover:bg-primary hover:text-primary-foreground relative flex h-10 w-10 items-center justify-center rounded-xl transition-all"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5 transition-transform group-hover:scale-110" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
