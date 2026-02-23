import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeCards",
  description: "AI-powered flashcards for learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider defaultTheme="dark" storageKey="vibecards-theme">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Analytics />
          <div>
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </body>
      </ThemeProvider>
    </html>
  );
}
