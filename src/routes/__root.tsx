import * as React from "react";
import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";

import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "@/globals.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VibeCards" },
      { name: "description", content: "AI-powered flashcards for learning" }
    ],
    links: [{ rel: "icon", href: "/favicon.ico" }]
  }),
  component: RootComponent,
  notFoundComponent: () => <RootDocument>Page not found.</RootDocument>,
  errorComponent: ({ error }) => <RootDocument>{String(error?.message ?? error)}</RootDocument>
});

function RootComponent() {
  return (
    <RootDocument>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="vibecards-theme">
          {children}
          <Toaster richColors />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
