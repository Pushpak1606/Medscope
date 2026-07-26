import React from "react";
import { cn } from "@/lib/utils";

export type ClinicalStatus =
  | "active"
  | "waiting"
  | "in-consultation"
  | "completed"
  | "cancelled"
  | "pending"
  | "review";

export interface StatusBadgeProps {
  status: ClinicalStatus | string;
  label?: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

const statusConfig: Record<
  string,
  { label: string; bgClass: string; textClass: string; dotClass: string }
> = {
  active: {
    label: "Active",
    bgClass: "bg-emerald-500/10 border-emerald-500/20",
    textClass: "text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  "in-consultation": {
    label: "In Consultation",
    bgClass: "bg-primary/10 border-primary/20",
    textClass: "text-primary dark:text-primary",
    dotClass: "bg-primary",
  },
  waiting: {
    label: "Waiting",
    bgClass: "bg-amber-500/10 border-amber-500/20",
    textClass: "text-amber-600 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    bgClass: "bg-blue-500/10 border-blue-500/20",
    textClass: "text-blue-600 dark:text-blue-400",
    dotClass: "bg-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    bgClass: "bg-rose-500/10 border-rose-500/20",
    textClass: "text-rose-600 dark:text-rose-400",
    dotClass: "bg-rose-500",
  },
  pending: {
    label: "Pending",
    bgClass: "bg-slate-500/10 border-slate-500/20",
    textClass: "text-slate-600 dark:text-slate-400",
    dotClass: "bg-slate-400",
  },
  review: {
    label: "Needs Review",
    bgClass: "bg-violet-500/10 border-violet-500/20",
    textClass: "text-violet-600 dark:text-violet-400",
    dotClass: "bg-violet-500",
  },
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[11px] font-medium gap-1.5 rounded-full border",
  md: "px-2.5 py-1 text-xs font-semibold gap-2 rounded-full border",
  lg: "px-3.5 py-1.5 text-sm font-semibold gap-2.5 rounded-full border",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = "md",
  pulse = true,
  className,
}) => {
  const normalizedKey = status.toLowerCase().replace(/\s+/g, "-");
  const config = statusConfig[normalizedKey] || {
    label: label || status,
    bgClass: "bg-muted border-border/50",
    textClass: "text-muted-foreground",
    dotClass: "bg-muted-foreground",
  };

  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center backdrop-blur-md shrink-0 select-none",
        sizeStyles[size],
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {pulse && (normalizedKey === "waiting" || normalizedKey === "in-consultation" || normalizedKey === "active") && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              config.dotClass
            )}
          />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", config.dotClass)} />
      </span>
      <span>{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;
