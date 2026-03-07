"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="bg-background/50 animate-fade-in text-foreground flex min-h-screen flex-col items-center justify-center p-4 px-4 py-12 md:py-20">
          <div className="container mx-auto max-w-2xl text-center">
            <Badge
              variant="destructive"
              className="shadow-destructive/20 mb-6 border-none px-4 py-1 font-bold shadow-lg"
            >
              Major Yikes
            </Badge>

            <div className="mb-6 flex justify-center">
              <div className="bg-destructive/10 rounded-full p-6">
                <Ghost className="text-destructive h-16 w-16 animate-pulse" />
              </div>
            </div>

            <h1 className="from-destructive mb-4 bg-linear-to-r to-orange-400 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
              Something killed the vibe.
            </h1>

            <p className="text-muted-foreground mx-auto mb-10 max-w-lg text-lg">
              A critical error occurred while rendering the application. Our
              servers probably just need a second to catch their breath.
            </p>

            <Button
              onClick={() => reset()}
              size="lg"
              className="shadow-primary/20 hover:shadow-primary/30 rounded-2xl px-8 py-6 text-lg font-bold shadow-xl transition-all hover:-translate-y-1"
            >
              Try to recover the vibe
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
