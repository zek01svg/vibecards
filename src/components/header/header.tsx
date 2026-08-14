import { Link } from "@tanstack/react-router";

import ThemeToggle from "../ui/theme-toggle";

export function Header() {
  return (
    <header className="border-border bg-background/85 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center px-4 sm:px-6">
        <nav className="flex w-full items-center">
          <Link
            to="/"
            className="group mr-8 flex items-center transition-opacity hover:opacity-80"
          >
            <span className="font-display text-lg font-bold tracking-tight">
              VibeCards
            </span>
            <span
              aria-hidden="true"
              className="bg-accent ml-0.5 h-[3px] w-[3px] translate-y-2 rounded-full transition-transform duration-300 group-hover:w-3 group-hover:rounded-sm"
            />
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
