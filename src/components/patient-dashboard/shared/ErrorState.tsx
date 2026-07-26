import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import LiquidGlassButton from "./LiquidGlassButton";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  message = "An error occurred while connecting to the platform. Please verify your connection or try again.",
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[2.5rem] bg-red-500/5 border border-red-500/20 backdrop-blur-sm w-full space-y-4",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
        <AlertCircle className="h-8 w-8" />
      </div>

      <div className="max-w-sm space-y-1">
        <h3 className="text-lg font-bold font-heading text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <div className="pt-2">
          {/* TODO (Backend Team): Wire retry callback to API re-fetch function */}
          <LiquidGlassButton variant="secondary" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
          </LiquidGlassButton>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
