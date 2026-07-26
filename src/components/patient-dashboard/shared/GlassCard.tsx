import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "subtle" | "highlight";
  onClick?: () => void;
}

const GlassCard = ({ children, className, variant = "default", onClick }: GlassCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "highlight":
        return "bg-card/90 backdrop-blur-2xl border-primary/25 shadow-xl shadow-primary/5 dark:shadow-primary/10";
      case "subtle":
        return "bg-card/40 backdrop-blur-md border border-border/30 shadow-none";
      case "default":
      default:
        return "bg-card/70 backdrop-blur-2xl border border-border/50 shadow-lg shadow-black/5 dark:shadow-black/40";
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 transition-all duration-300",
        getVariantStyles(),
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
