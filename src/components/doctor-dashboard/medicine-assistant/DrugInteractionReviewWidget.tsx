import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { AlertCircle, AlertTriangle, ShieldCheck, ArrowRightLeft, Pill } from "lucide-react";

export interface DrugInteraction {
  id: string;
  medicationA: string;
  medicationB: string;
  severity: "high" | "moderate" | "mild";
  mechanism: string;
  recommendation: string;
}

const MOCK_INTERACTIONS: DrugInteraction[] = [
  {
    id: "int-1",
    medicationA: "Warfarin Sodium (5mg)",
    medicationB: "Aspirin EC (81mg)",
    severity: "high",
    mechanism: "Synergistic anticoagulant + antiplatelet effect significantly increases GI & systemic bleeding risk.",
    recommendation: "Prescribe concomitant Gastroprotection (Omeprazole 20mg) & monitor INR target strictly at 2.0 - 2.5.",
  },
  {
    id: "int-2",
    medicationA: "Warfarin Sodium (5mg)",
    medicationB: "Amiodarone ER (200mg)",
    severity: "moderate",
    mechanism: "Amiodarone inhibits CYP2C9 metabolism of Warfarin, causing unexpected elevation in prothrombin time / INR.",
    recommendation: "Reduce Warfarin dose by 30-50% if Amiodarone is initiated; perform serial INR check in 72 hours.",
  },
  {
    id: "int-3",
    medicationA: "Atorvastatin Calcium (40mg)",
    medicationB: "Metoprolol Succinate (50mg)",
    severity: "mild",
    mechanism: "No metabolic interference or adverse pharmacodynamic cross-reactivity detected.",
    recommendation: "Safe baseline cardioprotective synergy. Continue standard lipid & heart rate monitoring.",
  },
];

const severityConfig = {
  high: {
    cardBg: "bg-rose-500/10 border-rose-500/30",
    badgeBg: "bg-rose-500/20 text-rose-500 border-rose-500/40",
    icon: AlertCircle,
    label: "HIGH BLEED RISK",
  },
  moderate: {
    cardBg: "bg-amber-500/10 border-amber-500/30",
    badgeBg: "bg-amber-500/20 text-amber-500 border-amber-500/40",
    icon: AlertTriangle,
    label: "MODERATE INTERACTION",
  },
  mild: {
    cardBg: "bg-emerald-500/10 border-emerald-500/30",
    badgeBg: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
    icon: ShieldCheck,
    label: "SAFE SYNERGY",
  },
};

export const DrugInteractionReviewWidget: React.FC = () => {
  return (
    <section aria-label="Drug Interaction Review Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Drug Interaction Review (Safety Analysis)"
          subtitle="AI-checked interaction matrix evaluating cross-reactivity, metabolic warnings & clinical recommendations."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              3 Interaction Checks Logged
            </span>
          }
        />

        <div className="space-y-4">
          {MOCK_INTERACTIONS.map((item) => {
            const config = severityConfig[item.severity];
            const IconComponent = config.icon;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-200 space-y-3 ${config.cardBg}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
                      <Pill className="h-4 w-4 text-primary shrink-0" />
                      <span>{item.medicationA}</span>
                    </div>

                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground shrink-0" />

                    <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
                      <Pill className="h-4 w-4 text-primary shrink-0" />
                      <span>{item.medicationB}</span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 border flex items-center gap-1.5 ${config.badgeBg}`}>
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{config.label}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1 bg-background/40 p-3 rounded-xl border border-border/30">
                    <span className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                      Interaction Mechanism:
                    </span>
                    <p className="text-foreground/90 font-medium leading-relaxed">
                      {item.mechanism}
                    </p>
                  </div>

                  <div className="space-y-1 bg-background/40 p-3 rounded-xl border border-border/30">
                    <span className="font-bold uppercase tracking-wider text-primary text-[10px]">
                      Clinical Recommendation:
                    </span>
                    <p className="text-foreground/90 font-medium leading-relaxed">
                      {item.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default DrugInteractionReviewWidget;
