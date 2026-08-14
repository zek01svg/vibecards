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
      <div className="border-border bg-muted/40 flex h-9 w-[102px] items-center rounded-md border p-0.5 opacity-50" />
    );
  }

  const themes = [
    { id: "light", icon: Sun, label: "Light" },
    { id: "system", icon: Monitor, label: "System" },
    { id: "dark", icon: Moon, label: "Dark" },
  ] as const;

  return (
    <div className="border-border bg-muted/40 flex items-center gap-0.5 rounded-md border p-0.5">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;

        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-sm transition-all duration-200 outline-none",
              isActive
                ? "bg-primary text-primary-foreground shadow-paper"
                : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
            )}
            aria-label={`${t.label} theme`}
            title={t.label}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
