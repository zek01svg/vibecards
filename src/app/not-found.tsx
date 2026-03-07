import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-background/50 animate-fade-in text-foreground flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-12 md:py-20">
      <div className="container mx-auto max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 rounded-full p-6">
            <SearchX className="text-primary h-16 w-16" />
          </div>
        </div>

        <h1 className="from-primary mb-4 bg-linear-to-r to-purple-400 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
          404 Not Found
        </h1>

        <p className="text-muted-foreground mx-auto mb-10 max-w-lg text-lg">
          We couldn&apos;t find the page or deck you&apos;re looking for. It
          might have been deleted, or the URL might be incorrect.
        </p>

        <Button
          asChild
          size="lg"
          className="shadow-primary/20 hover:shadow-primary/30 rounded-2xl px-8 py-6 text-lg font-bold shadow-xl transition-all hover:-translate-y-1"
        >
          <Link href="/">Back to safety</Link>
        </Button>
      </div>
    </div>
  );
}
