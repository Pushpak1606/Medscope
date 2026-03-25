import { memo } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  variant?: "default" | "patient" | "doctor";
  className?: string;
}

const AnimatedBackground = memo(({ variant = "default", className }: AnimatedBackgroundProps) => {
  const isDoctor = variant === "doctor";
  const isPatient = variant === "patient";

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none z-0", className)}>
      {/* Subtle base gradient overlay */}
      <div className="absolute inset-0 bg-background/80 mix-blend-overlay z-10" />
      
      {/* Primary Blob - Radial Gradient replacing excessive Blur Filter */}
      <div
        className="absolute -left-32 -top-32 w-[600px] h-[600px] rounded-full animate-blob-drift"
        style={{ 
          background: `radial-gradient(circle, ${isDoctor ? 'rgba(79, 70, 229, 0.15)' : 'rgba(var(--primary), 0.15)'} 0%, transparent 70%)` 
        }}
      />
      
      {/* Secondary Blob - Opposite side, spinning slow */}
      <div
        className="absolute -right-40 top-20 w-[500px] h-[500px] rounded-full animate-blob-spin-slow"
        style={{ 
          background: `radial-gradient(circle, ${isDoctor ? 'rgba(124, 58, 237, 0.12)' : 'rgba(20, 184, 166, 0.12)'} 0%, transparent 70%)`,
          animationDelay: "2s" 
        }}
      />

      {/* Tertiary Blob - Hidden on small screens to save performance */}
      <div
        className="hidden sm:block absolute left-1/4 -bottom-40 w-[700px] h-[500px] rounded-full animate-blob-spin-slow-reverse"
        style={{ 
          background: `radial-gradient(circle, ${isDoctor ? 'rgba(100, 116, 139, 0.1)' : 'rgba(16, 185, 129, 0.08)'} 0%, transparent 70%)`,
          animationDelay: "4s" 
        }}
      />
    </div>
  );
});

AnimatedBackground.displayName = "AnimatedBackground";

export default AnimatedBackground;
