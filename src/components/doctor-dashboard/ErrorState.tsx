import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";
import DoctorGlassCard from "./DoctorGlassCard";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Clinical Data Connection Error",
  message = "Unable to sync workspace details right now. Please check your network connection or try again.",
  onRetry,
  className,
}) => {
  return (
    <DoctorGlassCard
      variant="bordered"
      padding="lg"
      className={cn(
        "flex flex-col items-center justify-center text-center space-y-4 my-4 border-rose-500/20 bg-rose-500/5",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-inner">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h3 className="text-base font-bold text-foreground font-heading">{title}</h3>
        <p className="text-xs font-medium text-muted-foreground leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-2 rounded-xl border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 gap-2 font-semibold text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Connection</span>
        </Button>
      )}
    </DoctorGlassCard>
  );
};

export default ErrorState;
