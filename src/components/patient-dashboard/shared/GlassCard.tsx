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
        return "bg-card/95 border-primary/20 shadow-lg shadow-primary/5";
      case "subtle":
        return "bg-muted/30 border-border/30 shadow-none";
      case "default":
      default:
        return "bg-card/80 backdrop-blur-xl border border-border/50 shadow-sm";
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
