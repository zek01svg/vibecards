
import * as React from "react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="border-border bg-muted/50 flex h-9 w-[110px] items-center rounded-full border p-1 opacity-50" />
    );
  }

  const themes = [
    { id: "light", icon: Sun, label: "Light" },
    { id: "system", icon: Monitor, label: "System" },
    { id: "dark", icon: Moon, label: "Dark" },
  ] as const;

  return (
    <div className="border-border bg-muted/50 relative inline-flex items-center gap-1 rounded-full border p-1 shadow-inner">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;

        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id as any)}
            className={cn(
              "relative flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 outline-none",
              isActive
                ? "bg-background text-primary z-10 scale-110 shadow-sm"
                : "text-muted-foreground hover:bg-background/40 hover:text-foreground",
            )}
            aria-label={`${t.label} theme`}
            title={t.label}
          >
            <Icon
              size={14}
              className={cn("transition-transform", isActive && "scale-110")}
            />
          </button>
        );
      })}
    </div>
  );
}
