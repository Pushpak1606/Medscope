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
      
      {/* Primary Blob */}
      <div
        className={cn(
          "absolute -left-32 -top-32 w-[600px] h-[600px] rounded-full mix-blend-screen opacity-30 md:opacity-40 blur-[100px] md:blur-[130px] animate-blob-drift",
          isDoctor ? "bg-indigo-600/30" : "bg-primary/30",
          !isPatient && !isDoctor && "bg-cyan-500/30"
        )}
        style={{ willChange: "transform" }}
      />
      
      {/* Secondary Blob - Opposite side, spinning slow */}
      <div
        className={cn(
          "absolute -right-40 top-20 w-[500px] h-[500px] rounded-full mix-blend-screen opacity-25 md:opacity-30 blur-[90px] md:blur-[120px] animate-blob-spin-slow",
          isDoctor ? "bg-violet-600/30" : "bg-teal-500/20",
          !isPatient && !isDoctor && "bg-blue-600/30"
        )}
        style={{ willChange: "transform", animationDelay: "2s" }}
      />

      {/* Tertiary Blob - Hidden on small screens to save performance */}
      <div
        className={cn(
          "hidden sm:block absolute left-1/4 -bottom-40 w-[700px] h-[500px] rounded-full mix-blend-screen opacity-20 blur-[100px] md:blur-[140px] animate-blob-spin-slow-reverse",
          isDoctor ? "bg-slate-500/20" : "bg-emerald-500/10",
          !isPatient && !isDoctor && "bg-indigo-500/20"
        )}
        style={{ willChange: "transform", animationDelay: "4s" }}
      />

      {/* Optional grid overlay for extra texture (optional but adds premium healthcare-tech feel) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-10 opacity-70"></div>
    </div>
  );
});

AnimatedBackground.displayName = "AnimatedBackground";

export default AnimatedBackground;
