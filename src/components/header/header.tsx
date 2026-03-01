"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Sparkles } from "lucide-react";

import ThemeToggle from "../ui/theme-toggle";
import { NavButtons } from "./nav-buttons";

export function Header() {
  const session = authClient.useSession();

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center px-4">
        <nav className="flex w-full items-center">
          <Link
            href="/"
            className="mr-8 flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Sparkles size={18} className="animate-pulse" />
            </span>
            <span className="from-primary bg-linear-to-r to-purple-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              VibeCards
            </span>
          </Link>

          {session.data?.session && (
            <div className="hidden items-center gap-2 md:flex">
              <NavButtons />
            </div>
          )}

          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
