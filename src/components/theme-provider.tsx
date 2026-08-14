import * as React from "react";

type Theme = "dark" | "light" | "system";
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};
const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined);
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vibecards-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem(storageKey);
    if (stored === "dark" || stored === "light" || stored === "system") {
      return stored;
    }
    return defaultTheme;
  });
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);
  const value = {
    theme,
    setTheme: (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme);
      setTheme(nextTheme);
    },
  };
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
export const useTheme = (): ThemeProviderState => {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
