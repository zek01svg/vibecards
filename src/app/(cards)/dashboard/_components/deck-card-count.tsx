
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cardCounts = [5, 8, 10, 12, 15, 20] as const;

interface DeckCardCountProps {
  field: any;
}

export function DeckCardCount({ field }: DeckCardCountProps) {
  return (
    <Field>
      <FieldLabel htmlFor="cardCount">Number of Cards</FieldLabel>
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger
          id="cardCount"
          className="border-border/50 bg-background/50 hover:bg-muted/50 h-11 rounded-xl transition-all"
        >
          <SelectValue placeholder="Number of Cards" />
        </SelectTrigger>
        <SelectContent className="border-border/50 bg-card/95 rounded-xl backdrop-blur-md">
          <SelectGroup>
            {cardCounts.map((count) => (
              <SelectItem
                key={count}
                value={String(count)}
                className="rounded-lg"
              >
                {count} Flashcards
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldDescription>
        Optimal for manageable study sessions.
      </FieldDescription>
    </Field>
  );
}
