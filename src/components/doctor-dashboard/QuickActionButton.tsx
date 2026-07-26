import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export interface QuickActionButtonProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  shortcut?: string;
  variant?: "primary" | "glass" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const variantStyles = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/30 shadow-lg shadow-primary/20",
  glass:
    "bg-card/60 backdrop-blur-xl border border-border/50 text-foreground hover:bg-card/90 hover:border-primary/40 shadow-sm",
  outline:
    "bg-transparent border border-border text-foreground hover:bg-muted/50 hover:border-foreground/30",
  ghost:
    "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent",
  accent:
    "bg-gradient-to-r from-primary/10 via-indigo-500/10 to-violet-500/10 border border-primary/30 text-primary hover:border-primary/60 shadow-sm",
};

const sizeStyles = {
  sm: "p-2.5 rounded-2xl text-xs gap-2.5",
  md: "p-3.5 rounded-2xl text-sm gap-3.5",
  lg: "p-4.5 rounded-3xl text-base gap-4",
};

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  title,
  subtitle,
  shortcut,
  variant = "glass",
  size = "md",
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex items-center justify-between w-full font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none text-left cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "p-2 rounded-xl shrink-0 transition-transform group-hover:scale-110",
            variant === "primary"
              ? "bg-white/20 text-white"
              : "bg-primary/10 text-primary border border-primary/20"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="truncate">
          <div className="font-semibold leading-snug truncate">{title}</div>
          {subtitle && (
            <div className="text-xs text-muted-foreground font-normal truncate mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {shortcut && (
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-muted/60 text-muted-foreground border border-border/40 shrink-0 ml-2">
          {shortcut}
        </span>
      )}
    </motion.button>
  );
};

export default QuickActionButton;
