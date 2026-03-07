import { Card } from "@/components/ui/card";
import { Card as CardType } from "@/lib/validations/generate-deck-schema";
import { HelpCircle, MessageSquareQuote } from "lucide-react";

interface DeckViewProps {
  deck: {
    id: string;
    title: string;
    topic: string;
    cards: CardType[];
  };
}

export function DeckView({ deck }: DeckViewProps) {
  if (!deck.cards || deck.cards.length === 0) {
    return (
      <div className="animate-fade-in text-muted-foreground bg-muted/20 border-border/60 flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center">
        <HelpCircle className="mb-4 h-12 w-12 opacity-20" />
        <h3 className="text-foreground mb-1 text-xl font-semibold">
          No Cards Found
        </h3>
        <p>This deck doesn&apos;t have any cards yet.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1 xl:mx-auto xl:max-w-4xl">
      {deck.cards.map((card, index) => (
        <Card
          key={index}
          className="border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 hover:shadow-primary/5 overflow-hidden transition-all hover:shadow-xl"
        >
          <div className="divide-border/40 grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
            {/* Front of common */}
            <div className="space-y-4 p-6 md:p-8">
              <div className="text-primary bg-primary/10 border-primary/20 flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase">
                <HelpCircle className="h-3 w-3" />
                Prompt
              </div>
              <p className="text-foreground/90 text-lg leading-relaxed font-medium">
                {card.front}
              </p>
            </div>

            {/* Back of common */}
            <div className="bg-muted/5 space-y-4 p-6 md:p-8">
              <div className="text-primary/70 bg-muted border-border/40 flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase">
                <MessageSquareQuote className="h-3 w-3" />
                Explanation
              </div>
              <p className="text-muted-foreground text-base leading-relaxed italic">
                {card.back}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
