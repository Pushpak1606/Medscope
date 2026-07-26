import React from "react";
import { cn } from "@/lib/utils";
import { Users, Clock } from "lucide-react";

export interface QueueBadgeProps {
  position?: number;
  waitTime?: string;
  isNext?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-[11px] gap-1 rounded-full",
  md: "px-2.5 py-1 text-xs gap-1.5 rounded-full",
  lg: "px-3 py-1.5 text-sm gap-2 rounded-full",
};

export const QueueBadge: React.FC<QueueBadgeProps> = ({
  position,
  waitTime,
  isNext = false,
  size = "md",
  className,
}) => {
  if (isNext) {
    return (
      <span
        className={cn(
          "inline-flex items-center font-bold bg-gradient-to-r from-primary/20 to-indigo-500/20 text-primary border border-primary/30 shadow-sm backdrop-blur-md shrink-0 select-none",
          sizeStyles[size],
          className
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <span>NEXT PATIENT</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium bg-card/80 text-foreground border border-border/60 backdrop-blur-md shadow-sm shrink-0 select-none gap-2",
        sizeStyles[size],
        className
      )}
    >
      {position !== undefined && (
        <span className="flex items-center gap-1 text-muted-foreground font-semibold">
          <Users className="h-3 w-3 text-primary" />
          <span>#{position} in Queue</span>
        </span>
      )}
      {waitTime && (
        <span className="flex items-center gap-1 text-amber-500 font-medium">
          <Clock className="h-3 w-3" />
          <span>{waitTime}</span>
        </span>
      )}
    </span>
  );
};

export default QueueBadge;
