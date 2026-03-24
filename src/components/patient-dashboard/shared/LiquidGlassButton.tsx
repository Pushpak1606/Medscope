import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LiquidGlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "success";
}

const LiquidGlassButton = ({ 
  children, 
  className, 
  variant = "primary",
  ...props 
}: LiquidGlassButtonProps) => {
  
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-muted/50 border-border/50 text-foreground hover:bg-muted focus-visible:ring-muted-foreground";
      case "danger":
        return "bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20 hover:border-red-500/30 focus-visible:ring-red-500";
      case "success":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 hover:border-emerald-500/30 focus-visible:ring-emerald-500";
      case "primary":
      default:
        return "bg-primary/90 border-primary/50 text-primary-foreground hover:bg-primary hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] focus-visible:ring-primary";
    }
  };

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center gap-2",
        "rounded-2xl px-6 py-3.5 font-bold text-sm transition-all duration-300",
        "backdrop-blur-md border shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:opacity-50 disabled:pointer-events-none",
        getVariantStyles(),
        className
      )}
      {...props}
    >
      {/* Glossy liquid highlight layer */}
      <span className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 pointer-events-none rounded-2xl" />
      
      {/* Optional shine reflection */}
      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      
      <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
        {children}
      </span>
    </motion.button>
  );
};

export default LiquidGlassButton;
