
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="bg-muted/20 border-border/60 flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center">
      <div className="mb-4 text-4xl">⚠️</div>
      <h2 className="mb-2 text-2xl font-bold">No Cards Available</h2>
      <p className="text-muted-foreground mb-6">
        This deck doesn&apos;t have any cards to study.
      </p>
      <Button
        onClick={() => void navigate({ to: "/dashboard" })}
        variant="outline"
        className="rounded-xl"
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
