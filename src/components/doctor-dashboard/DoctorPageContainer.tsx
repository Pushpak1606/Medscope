import React from "react";
import { cn } from "@/lib/utils";
import PageTransition from "./PageTransition";

export interface DoctorPageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  maxWidth?: "normal" | "wide" | "full";
  className?: string;
}

const maxWidthStyles = {
  normal: "max-w-7xl",
  wide: "max-w-[1500px]",
  full: "max-w-none",
};

export const DoctorPageContainer: React.FC<DoctorPageContainerProps> = ({
  children,
  title,
  subtitle,
  action,
  maxWidth = "wide",
  className,
}) => {
  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 space-y-8">
      <div className={cn("mx-auto w-full space-y-8", maxWidthStyles[maxWidth], className)}>
        {(title || subtitle || action) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
            <div className="space-y-1">
              {title && (
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-3xl leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
          </div>
        )}

        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
};

export default DoctorPageContainer;
