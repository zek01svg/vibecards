
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { GraduationCap, List } from "lucide-react";

interface ModeToggleProps {
  id: string;
  isStudyMode: boolean;
  className?: string;
  mobile?: boolean;
}

export function ModeToggle({
  id,
  isStudyMode,
  className,
  mobile = false,
}: ModeToggleProps) {
  return (
    <div
      className={cn(
        "bg-muted/30 border-border/50 flex items-center gap-1.5 rounded-xl border p-1 shadow-inner",
        className,
      )}
    >
      <Link
        to="/deck/$id"
        params={{ id }}
        search={{ mode: "study" }}
        className={cn(
          "flex items-center gap-2 rounded-lg font-bold transition-all",
          mobile ? "px-6 py-2 text-xs" : "px-4 py-1.5 text-xs",
          isStudyMode
            ? "bg-background text-primary scale-[1.02] shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40",
        )}
      >
        <GraduationCap className={mobile ? "h-4 w-4" : "h-3.5 w-3.5"} />
        {mobile ? "Study" : "Study Mode"}
      </Link>
      <Link
        to="/deck/$id"
        params={{ id }}
        className={cn(
          "flex items-center gap-2 rounded-lg font-bold transition-all",
          mobile ? "px-6 py-2 text-xs" : "px-4 py-1.5 text-xs",
          !isStudyMode
            ? "bg-background text-primary scale-[1.02] shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40",
        )}
      >
        <List className={mobile ? "h-4 w-4" : "h-3.5 w-3.5"} />
        {mobile ? "List" : "View All"}
      </Link>
    </div>
  );
}
