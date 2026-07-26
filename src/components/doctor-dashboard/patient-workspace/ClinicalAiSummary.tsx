import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import PriorityBadge from "../PriorityBadge";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Pill,
  Smile,
  Activity,
  ArrowRight,
  TrendingUp,
  ActivitySquare,
} from "lucide-react";
import { toast } from "sonner";

export interface ClinicalAiSummaryProps {
  patientName?: string;
}

export const ClinicalAiSummary: React.FC<ClinicalAiSummaryProps> = ({
  patientName = "Marcus Vance",
}) => {
  return (
    <section aria-label="Clinical AI Summary Section">
      <DoctorGlassCard
        variant="glow"
        glowColor="violet"
        padding="lg"
        className="border-violet-500/30 space-y-6"
      >
        <SectionHeader
          title="Patient Summary & AI Insights"
          subtitle="Synthesized summary based on telemetry, medical history, drug interactions & patient logs."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-pulse" />
              <span>AI Copilot Active</span>
            </span>
          }
        />

        {/* 5 Clinical Summary Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* 1. Patient Summary */}
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-500 uppercase tracking-wider">
              <Activity className="h-4 w-4" />
              <span>Patient Overview</span>
            </div>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              54yo male presented with chest pressure & shortness of breath on exertion. History of Subacute Coronary Syndrome (2024). Troponin T elevated (0.14 ng/mL). ECG reveals V2-V4 ST displacement.
            </p>
          </div>

          {/* 2. Medicine History */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider">
                <Pill className="h-4 w-4" />
                <span>Medication Adherence</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                94% High
              </span>
            </div>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              Consistent daily logging on Medscope Rx Companion. Missed 1 dose of Atorvastatin on July 14 due to travel. No refill delay issues.
            </p>
          </div>

          {/* 3. Risk Observations */}
          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4" />
              <span>Risk Observations</span>
            </div>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              Cardiovascular Risk Score 0.84 (STAT). Severe allergy to Penicillin. Moderate risk of drug interaction between current Warfarin & suggested Amiodarone.
            </p>
          </div>

          {/* 4. Mood & Psychological Summary */}
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
              <Smile className="h-4 w-4" />
              <span>Mood & Mental Health</span>
            </div>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              Patient logged "elevated health anxiety" in journal over past 48 hours. Sleep score 6.4 hrs average. Stress score 6/10 due to chest discomfort.
            </p>
          </div>

          {/* 5. Lifestyle & Telemetry Summary */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
              <TrendingUp className="h-4 w-4" />
              <span>Lifestyle Telemetry</span>
            </div>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              Non-smoker. Average daily step count 6,800 steps. Low-sodium diet compliance 88%. Telemetry BP average over 7 days: 138/88 mmHg.
            </p>
          </div>

          {/* 6. Suggested Follow-Up & Action */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 backdrop-blur-xl space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" />
                <span>Suggested Clinical Follow-up</span>
              </div>
              <p className="text-xs text-foreground font-medium leading-relaxed pt-1">
                Repeat serial Troponin T in 2 hours. Order 2D Echocardiogram. Evaluate for emergent Cardiac Catheterization consult.
              </p>
            </div>
            <button
              onClick={() => toast.success("AI clinical recommendation accepted for patient chart.")}
              className="mt-2 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Accept AI Recommendations into Plan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ClinicalAiSummary;
