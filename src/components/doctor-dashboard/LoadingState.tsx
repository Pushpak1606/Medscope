import React from "react";
import { cn } from "@/lib/utils";
import DoctorGlassCard from "./DoctorGlassCard";
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  label?: string;
  variant?: "card" | "inline" | "full";
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = "Loading clinical workspace data...",
  variant = "card",
  className,
}) => {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-3 text-muted-foreground p-4", className)}>
        <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    );
  }

  return (
    <DoctorGlassCard
      variant="subtle"
      padding="lg"
      className={cn(
        "flex flex-col items-center justify-center text-center space-y-4 py-12 min-h-[200px]",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-50" />
        <div className="w-12 h-12 rounded-2xl bg-card border border-primary/30 flex items-center justify-center text-primary shadow-lg backdrop-blur-xl z-10">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
      <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground animate-pulse">
        {label}
      </p>
    </DoctorGlassCard>
  );
};

export default LoadingState;
