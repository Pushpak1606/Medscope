import React from "react";
import { LiquidGlass } from "@liquidglass/react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  backHref = "/patient/dashboard",
  backLabel = "Back",
  children,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
      <div className="flex flex-col gap-2">
        <Link to={backHref} className="w-fit mb-4 liquid-glass-wrapper">
          <LiquidGlass>
            <div className="flex items-center px-4 py-2 text-sm font-semibold text-foreground bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              {backLabel}
            </div>
          </LiquidGlass>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
};

export default PageHeader;

