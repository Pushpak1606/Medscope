import React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import LiquidGlassButton from "./LiquidGlassButton";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[2.5rem] bg-card/40 border border-dashed border-border/60 backdrop-blur-sm w-full space-y-4",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
        <Icon className="h-8 w-8" />
      </div>

      <div className="max-w-sm space-y-1">
        <h3 className="text-lg font-bold font-heading text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <LiquidGlassButton onClick={onAction}>
            {actionLabel}
          </LiquidGlassButton>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
