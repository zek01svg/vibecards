import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  id: string;
  isStudyMode: boolean;
  className?: string;
}

export function ModeToggle({ id, isStudyMode, className }: ModeToggleProps) {
  const base =
    "rounded-sm px-2 sm:px-4 py-1.5 font-mono text-[11px] font-semibold tracking-[0.14em] uppercase transition-all";
  const active = "bg-primary text-primary-foreground shadow-paper";
  const idle = "text-muted-foreground hover:text-foreground hover:bg-accent/40";

  return (
    <div
      className={cn(
        "bg-muted/40 border-border flex items-center gap-0.5 rounded-md border p-0.5",
        className,
      )}
    >
      <Link
        to="/deck/$id"
        params={{ id }}
        search={{ mode: "study" }}
        aria-current={isStudyMode ? "page" : undefined}
        className={cn(base, isStudyMode ? active : idle)}
      >
        Study
      </Link>
      <Link
        to="/deck/$id"
        params={{ id }}
        search={{ mode: "list" }}
        aria-current={!isStudyMode ? "page" : undefined}
        className={cn(base, !isStudyMode ? active : idle)}
      >
        <span className="hidden sm:inline">All cards</span>
        <span className="sm:hidden">List</span>
      </Link>
    </div>
  );
}
