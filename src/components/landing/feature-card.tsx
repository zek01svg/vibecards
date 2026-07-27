import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: "primary" | "purple" | "emerald" | "orange";
  className?: string;
}

const variants = {
  primary: {
    border: "hover:border-primary/50",
    shadow: "hover:shadow-primary/5",
    iconBg:
      "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground",
    rotation: "group-hover:rotate-12",
  },
  purple: {
    border: "hover:border-purple-500/50",
    shadow: "hover:shadow-purple-500/5",
    iconBg:
      "bg-purple-500/10 text-purple-500 border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white",
    rotation: "group-hover:-rotate-12",
  },
  emerald: {
    border: "hover:border-emerald-500/50",
    shadow: "hover:shadow-emerald-500/5",
    iconBg:
      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white",
    rotation: "group-hover:rotate-12",
  },
  orange: {
    border: "hover:border-orange-500/50",
    shadow: "hover:shadow-orange-500/5",
    iconBg:
      "bg-orange-500/10 text-orange-500 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white",
    rotation: "group-hover:-rotate-12",
  },
};

export function FeatureCard({
  title,
  description,
  icon: Icon,
  variant = "primary",
  className,
}: FeatureCardProps) {
  const v = variants[variant];

  return (
    <div
      className={cn(
        "group border-border/50 bg-card/40 relative overflow-hidden rounded-4xl border p-8 backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-2xl",
        v.border,
        v.shadow,
        className,
      )}
    >
      <div
        className={cn(
          "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110",
          v.iconBg,
          v.rotation,
        )}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
