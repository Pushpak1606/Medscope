import React from "react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  lines?: number;
  className?: string;
  variant?: "card" | "list" | "table";
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  lines = 3,
  className,
  variant = "card",
}) => {
  if (variant === "list") {
    return (
      <div className={cn("space-y-3 w-full animate-pulse", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl bg-card/60 border border-border/40"
          >
            <div className="h-10 w-10 rounded-xl bg-muted/60 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted/60 rounded-md w-1/3" />
              <div className="h-3 bg-muted/40 rounded-md w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[2.5rem] bg-card/80 backdrop-blur-xl border border-border/50 p-6 sm:p-8 shadow-sm space-y-4 animate-pulse w-full",
        className
      )}
    >
      <div className="h-6 bg-muted/60 rounded-lg w-1/4 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-muted/40 rounded-md"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
