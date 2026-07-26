import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import { Sparkles, ShieldCheck, BrainCircuit, Activity, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export interface ClinicalAiHeroProps {
  engineVersion?: string;
  insightsTodayCount?: number;
}

export const ClinicalAiHero: React.FC<ClinicalAiHeroProps> = ({
  engineVersion = "Medscope Clinical AI v4.2 • Active",
  insightsTodayCount = 12,
}) => {
  return (
    <DoctorGlassCard
      variant="glow"
      glowColor="violet"
      padding="lg"
      className="border-violet-500/30 relative overflow-hidden bg-gradient-to-r from-card/90 via-card/70 to-violet-500/5"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Assistant Doctor Status & Description */}
        <div className="space-y-2 max-w-3xl min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-pulse" />
              <span>{engineVersion}</span>
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Clinical Copilot Engine</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground tracking-tight truncate">
            Assistant Doctor AI Workspace
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
            Intelligent clinical copilot designed to synthesize patient telemetry, draft evidence-based treatment plans, generate patient education materials, and highlight risk alerts.
          </p>

          <div className="pt-2 text-xs font-semibold text-violet-600 dark:text-violet-300 bg-violet-500/10 p-3 rounded-2xl border border-violet-500/20 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-violet-500" />
            <span>
              <strong>Clinical Guardrail:</strong> AI supports and accelerates clinical decision-making. The attending physician retains full authority over all diagnostic and treatment decisions.
            </span>
          </div>
        </div>

        {/* Right Side: Today's Insights Counter */}
        <div className="flex items-center gap-4 shrink-0 pt-2 lg:pt-0">
          <div className="px-5 py-4 rounded-3xl bg-card/80 border border-violet-500/30 backdrop-blur-md text-center shadow-lg shadow-violet-500/5">
            <div className="text-3xl font-extrabold font-heading text-violet-500">{insightsTodayCount}</div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">AI Insights Today</div>
          </div>
        </div>

      </div>
    </DoctorGlassCard>
  );
};

export default ClinicalAiHero;
