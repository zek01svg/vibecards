import { Badge } from "@/components/ui/badge";
import { PolicyCard } from "@/components/ui/policy-card";
import { AlertCircle, Scale, ShieldCheck, Sparkles } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="bg-background/50 animate-fade-in text-foreground min-h-screen px-4 py-12 md:py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20 mb-4 border-none px-4 py-1 font-bold"
          >
            Effective: February 2026
          </Badge>
          <h1 className="from-primary mb-4 bg-linear-to-r to-purple-400 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
            Terms of Service: <br className="hidden md:block" /> The Gist
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            We know nobody likes reading the legal fine print. Here&apos;s a
            student-friendly version of what you&apos;re agreeing to when you
            use VibeCards.
          </p>
        </div>

        <div className="space-y-8">
          <PolicyCard
            title="Rule #1: Be Cool"
            description="The ultimate golden rule"
            icon={Sparkles}
          >
            Don&apos;t use VibeCards to be a jerk. Don&apos;t try to hack our
            servers, don&apos;t spam other users, and don&apos;t use our AI to
            generate anything illegal or mean. Pretty simple, right?
          </PolicyCard>

          <PolicyCard
            title="Your Decks, Your Responsibility"
            description="Ownership & Content"
            icon={ShieldCheck}
            iconColorClass="text-purple-500"
            iconBgClass="bg-purple-500/10 border-purple-500/20"
          >
            You own your cards. But if you generate something that gets us in
            trouble (like copyright infringement), that&apos;s on you. We
            reserve the right to remove anything that breaks our &quot;Be
            Cool&quot; rule.
          </PolicyCard>

          <PolicyCard
            title="AI is a Study Buddy"
            description="Limitations of AI"
            icon={Scale}
            iconColorClass="text-blue-500"
            iconBgClass="bg-blue-500/10 border-blue-500/20"
          >
            Our AI is smart, but it&apos;s not perfect. It might occasionally
            hallucinate or get a fact wrong. Always double-check your cards
            before you start studying for the big exam!
          </PolicyCard>

          <PolicyCard
            title="The Real Legal Stuff"
            description="For the lawyers"
            icon={AlertCircle}
            iconColorClass="text-orange-500"
            iconBgClass="bg-orange-500/10 border-orange-500/20"
          >
            <div className="space-y-4">
              <p>
                We provide VibeCards &quot;as is.&quot; While we strive for 100%
                uptime, sometimes things happen. We aren&apos;t liable for any
                lost data or the emotional damage of a failed quiz.
              </p>
              <p>
                By using VibeCards, you agree to these terms. If we change them,
                we&apos;ll post a notice here.
              </p>
            </div>
          </PolicyCard>
        </div>
      </div>
    </div>
  );
}
