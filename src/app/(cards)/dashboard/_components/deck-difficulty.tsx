"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const difficulties = ["beginner", "intermediate", "advanced"] as const;

interface DeckDifficultyProps {
  field: any; // Using any for brevity as tanstack form field types are complex to export sometimes
}

export function DeckDifficulty({ field }: DeckDifficultyProps) {
  return (
    <Field>
      <FieldLabel htmlFor="difficulty">Difficulty Level</FieldLabel>
      <Select
        value={field.state.value}
        onValueChange={(value) =>
          field.handleChange(value as (typeof difficulties)[number])
        }
      >
        <SelectTrigger
          id="difficulty"
          className="border-border/50 bg-background/50 hover:bg-muted/50 h-11 rounded-xl transition-all"
        >
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent className="border-border/50 bg-card/95 rounded-xl backdrop-blur-md">
          <SelectGroup>
            <SelectItem value="beginner" className="rounded-lg">
              🌱 Beginner
            </SelectItem>
            <SelectItem value="intermediate" className="rounded-lg">
              📚 Intermediate
            </SelectItem>
            <SelectItem value="advanced" className="rounded-lg">
              🚀 Advanced
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldDescription>
        {field.state.value === "beginner" &&
          "Simple concepts for foundational learning."}
        {field.state.value === "intermediate" &&
          "Balanced complexity with clear explanations."}
        {field.state.value === "advanced" &&
          "Deep dives into complex analytical topics."}
      </FieldDescription>
    </Field>
  );
}
