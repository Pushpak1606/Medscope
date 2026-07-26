import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface DoctorGlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "glow" | "subtle" | "bordered" | "interactive";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  hoverEffect?: boolean;
  className?: string;
  glowColor?: "primary" | "emerald" | "amber" | "violet" | "rose" | "none";
}

const variantStyles: Record<NonNullable<DoctorGlassCardProps["variant"]>, string> = {
  default:
    "bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5 dark:shadow-black/40",
  elevated:
    "bg-card/80 backdrop-blur-2xl border border-border/70 shadow-xl shadow-black/10 dark:shadow-black/50",
  glow:
    "bg-card/70 backdrop-blur-2xl border border-primary/20 shadow-2xl shadow-primary/5 dark:shadow-primary/10",
  subtle:
    "bg-card/30 backdrop-blur-md border border-border/30 shadow-sm",
  bordered:
    "bg-card/50 backdrop-blur-xl border-2 border-primary/15 shadow-md",
  interactive:
    "bg-card/60 backdrop-blur-xl border border-border/50 shadow-md hover:bg-card/80 hover:border-primary/30 transition-all duration-300 cursor-pointer",
};

const paddingStyles: Record<NonNullable<DoctorGlassCardProps["padding"]>, string> = {
  none: "p-0",
  xs: "p-3 sm:p-4",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6 md:p-7",
  lg: "p-6 sm:p-8 md:p-9",
  xl: "p-8 sm:p-10 md:p-12",
};

const glowStyles: Record<NonNullable<DoctorGlassCardProps["glowColor"]>, string> = {
  none: "",
  primary: "before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:bg-primary/5 before:blur-xl",
  emerald: "before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:bg-emerald-500/5 before:blur-xl",
  amber: "before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:bg-amber-500/5 before:blur-xl",
  violet: "before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:bg-violet-500/5 before:blur-xl",
  rose: "before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:bg-rose-500/5 before:blur-xl",
};

export const DoctorGlassCard: React.FC<DoctorGlassCardProps> = ({
  children,
  variant = "default",
  padding = "md",
  hoverEffect = false,
  glowColor = "none",
  className,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative rounded-3xl overflow-hidden transition-all duration-300",
        variantStyles[variant],
        paddingStyles[padding],
        glowStyles[glowColor],
        hoverEffect && "hover:-translate-y-1 hover:shadow-2xl hover:border-primary/30",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default DoctorGlassCard;
