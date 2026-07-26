import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Inbox } from "lucide-react";
import DoctorGlassCard from "./DoctorGlassCard";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
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
    <DoctorGlassCard
      variant="subtle"
      padding="xl"
      className={cn(
        "flex flex-col items-center justify-center text-center space-y-4 my-4 border-dashed border-border/60 min-h-[240px]",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h3 className="text-lg font-bold font-heading text-foreground">{title}</h3>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-md shadow-primary/20"
        >
          {actionLabel}
        </Button>
      )}
    </DoctorGlassCard>
  );
};

export default EmptyState;
