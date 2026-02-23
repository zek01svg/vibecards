import { PolicyCard } from "@/components/legal/policy-card";
import { Badge } from "@/components/ui/badge";
import { Cookie, Eye, Fingerprint, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background/50 animate-fade-in text-foreground min-h-screen px-4 py-12 md:py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-foreground mb-12 text-center">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20 mb-4 border-none px-4 py-1 font-bold"
          >
            Privacy First
          </Badge>
          <h1 className="from-primary mb-4 bg-linear-to-r to-purple-400 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
            We Value Your Vibe <br className="hidden md:block" /> (and Your
            Data)
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            VibeCards is built on trust. Here&apos;s exactly how we handle your
            information—explained in plain English.
          </p>
        </div>

        <div className="space-y-8">
          <PolicyCard
            title="What We Collect"
            description="Just the essentials"
            icon={Eye}
            iconColorClass="text-emerald-500"
            iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          >
            <div className="space-y-4">
              <p>
                We keep it lean. We collect your <strong>email address</strong>{" "}
                so you can sign in and keep your decks, and the{" "}
                <strong>content of your flashcards</strong> so you can study
                them.
              </p>
              <p>
                When you use our AI generator, we send your prompt to our AI
                provider (Google Gemini) to transform your notes into study
                magic.
              </p>
            </div>
          </PolicyCard>

          <PolicyCard
            title="Cookies & Tracking"
            description="Not the tasty kind (sorry)"
            icon={Cookie}
            iconColorClass="text-amber-500"
            iconBgClass="bg-amber-500/10 border-amber-500/20"
          >
            We use small data files called cookies to keep you logged in. We
            also use Vercel Analytics to see which features you love (and which
            ones need some work), so we can keep improving the app.
          </PolicyCard>

          <PolicyCard
            title="Sharing is caring... but not with your data"
            description="No Selling Out"
            icon={Lock}
          >
            We will <strong>never</strong> sell your personal information to
            third parties. We don&apos;t run ads, and we don&apos;t let shady
            data brokers peek at your study habits. Your data is your business.
          </PolicyCard>

          <PolicyCard
            title="Your Privacy Rights"
            description="You're in control"
            icon={Fingerprint}
            iconColorClass="text-indigo-500"
            iconBgClass="bg-indigo-500/10 border-indigo-500/20"
          >
            Want to know what data we have on you? Just ask. Want to delete
            everything and vanish into the digital mist? You can do that too.
            Just hit us up and we&apos;ll help you out.
          </PolicyCard>
        </div>

        <div className="mt-16 space-y-4 text-center">
          <div className="bg-border/40 mx-auto h-px w-32" />
          <p className="text-sm opacity-50">Last Updated: February 23, 2026</p>
        </div>
      </div>
    </div>
  );
}
