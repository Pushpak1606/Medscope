import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, ArrowDown, Clock } from "lucide-react";

export type PriorityLevel = "stat" | "urgent" | "high" | "medium" | "low" | "routine";

export interface PriorityBadgeProps {
  priority: PriorityLevel | string;
  label?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const priorityConfig: Record<
  string,
  { label: string; bgClass: string; textClass: string; icon: React.ElementType }
> = {
  stat: {
    label: "STAT Urgent",
    bgClass: "bg-rose-500/15 border-rose-500/30 dark:bg-rose-500/20 dark:border-rose-500/40 animate-pulse",
    textClass: "text-rose-600 dark:text-rose-400 font-bold",
    icon: AlertCircle,
  },
  urgent: {
    label: "Urgent",
    bgClass: "bg-red-500/15 border-red-500/30 dark:bg-red-500/20 dark:border-red-500/40",
    textClass: "text-red-600 dark:text-red-400 font-bold",
    icon: AlertCircle,
  },
  high: {
    label: "High Priority",
    bgClass: "bg-amber-500/15 border-amber-500/30 dark:bg-amber-500/20 dark:border-amber-500/40",
    textClass: "text-amber-600 dark:text-amber-400 font-semibold",
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium",
    bgClass: "bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/15 dark:border-blue-500/30",
    textClass: "text-blue-600 dark:text-blue-400 font-medium",
    icon: Clock,
  },
  low: {
    label: "Low",
    bgClass: "bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/15 dark:border-emerald-500/30",
    textClass: "text-emerald-600 dark:text-emerald-400 font-medium",
    icon: ArrowDown,
  },
  routine: {
    label: "Routine",
    bgClass: "bg-slate-500/10 border-slate-500/20 dark:bg-slate-500/15 dark:border-slate-500/30",
    textClass: "text-slate-600 dark:text-slate-400 font-medium",
    icon: Clock,
  },
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[10px] gap-1 rounded-md border",
  md: "px-2.5 py-1 text-xs gap-1.5 rounded-lg border",
  lg: "px-3 py-1.5 text-sm gap-2 rounded-xl border",
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  label,
  size = "md",
  showIcon = true,
  className,
}) => {
  const normalizedKey = priority.toLowerCase().replace(/\s+/g, "");
  const config = priorityConfig[normalizedKey] || {
    label: label || priority,
    bgClass: "bg-muted border-border/50",
    textClass: "text-muted-foreground",
    icon: Clock,
  };

  const IconComponent = config.icon;
  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center backdrop-blur-md uppercase tracking-wider shrink-0 select-none",
        sizeStyles[size],
        config.bgClass,
        config.textClass,
        className
      )}
    >
      {showIcon && <IconComponent className="h-3 w-3 shrink-0" />}
      <span>{displayLabel}</span>
    </span>
  );
};

export default PriorityBadge;
