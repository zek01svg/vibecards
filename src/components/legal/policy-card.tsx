import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PolicyCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  children: React.ReactNode;
  className?: string;
}

export function PolicyCard({
  title,
  description,
  icon: Icon,
  iconColorClass = "text-primary",
  iconBgClass = "bg-primary/10 border-primary/20",
  children,
  className,
}: PolicyCardProps) {
  return (
    <Card
      className={cn(
        "border-border/50 bg-card/50 shadow-primary/5 overflow-hidden rounded-4xl shadow-xl",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-8">
        <div className={cn("rounded-2xl border p-3", iconBgClass)}>
          <Icon className={cn("h-6 w-6", iconColorClass)} />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="text-muted-foreground px-8 pb-8 leading-relaxed">
        {children}
      </CardContent>
    </Card>
  );
}
