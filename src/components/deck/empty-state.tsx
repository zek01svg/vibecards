interface EmptyStateProps {
  kind?: "desk" | "deck";
}

export function EmptyState({ kind = "desk" }: EmptyStateProps) {
  if (kind === "deck") {
    return (
      <div className="border-border/60 flex flex-col items-center justify-center rounded-sm border border-dashed py-20 text-center">
        <p className="text-muted-foreground font-mono text-[11px] font-semibold tracking-[0.2em] uppercase">
          No cards
        </p>
        <h2 className="mt-3 text-2xl font-bold">Nothing to study here.</h2>
        <p className="text-muted-foreground mt-2">
          This deck came back empty. Make another one, or delete this.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/60 bg-card/40 flex flex-col items-center justify-center rounded-sm border border-dashed py-20 text-center">
      <p className="text-muted-foreground font-mono text-[11px] font-semibold tracking-[0.2em] uppercase">
        Your desk
      </p>
      <h2 className="mt-3 text-2xl font-bold">It&apos;s quiet in here.</h2>
      <p className="text-muted-foreground mt-2 max-w-sm">
        Make your first deck and it lands right here — ready to study tonight.
      </p>
    </div>
  );
}
