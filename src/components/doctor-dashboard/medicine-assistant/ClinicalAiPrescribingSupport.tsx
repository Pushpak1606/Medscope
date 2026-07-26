import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Sparkles, Pill, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export interface PrescribingSuggestion {
  id: string;
  category: "suggested" | "alternative" | "contraindication" | "reasoning";
  title: string;
  drugName?: string;
  rationale: string;
  actionText: string;
}

const MOCK_SUGGESTIONS: PrescribingSuggestion[] = [
  {
    id: "sug-1",
    category: "suggested",
    title: "AI Primary Recommendation: Dual Antiplatelet Therapy",
    drugName: "Clopidogrel 75mg Daily + Aspirin 81mg Daily",
    rationale: "Class I ACC/AHA recommendation post-coronary stent & ACS presentation to prevent acute stent thrombosis.",
    actionText: "+ Add DAPT Regimen to Draft",
  },
  {
    id: "sug-2",
    category: "alternative",
    title: "Second-Line Alternative Option: Ticagrelor",
    drugName: "Ticagrelor 90mg Twice Daily",
    rationale: "Consider Ticagrelor if patient exhibits resistance or poor response to Clopidogrel (CYP2C19 loss-of-function allele).",
    actionText: "Switch to Ticagrelor",
  },
  {
    id: "sug-3",
    category: "contraindication",
    title: "Contraindication Alert: Penicillin Antibiotic Class",
    drugName: "Amoxicillin / Penicillin V / Ampicillin",
    rationale: "Patient profile flags severe anaphylactic reaction to Penicillin. Use Azithromycin or Ciprofloxacin if antibiotic needed.",
    actionText: "Flag Penicillin Class as Contraindicated",
  },
  {
    id: "sug-4",
    category: "reasoning",
    title: "Clinical Reasoning: High-Intensity Statin Benefit",
    drugName: "Atorvastatin 80mg Daily",
    rationale: "Increasing Atorvastatin from 40mg to 80mg aims for >50% LDL reduction to achieve target LDL < 50 mg/dL for secondary prevention.",
    actionText: "Apply High-Statin Protocol",
  },
];

const categoryStyles = {
  suggested: {
    cardBg: "bg-emerald-500/10 border-emerald-500/30",
    iconBg: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
    badgeText: "PRIMARY SUGGESTION",
  },
  alternative: {
    cardBg: "bg-blue-500/10 border-blue-500/30",
    iconBg: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    badgeText: "SECOND-LINE ALTERNATIVE",
  },
  contraindication: {
    cardBg: "bg-rose-500/10 border-rose-500/30",
    iconBg: "bg-rose-500/20 text-rose-500 border-rose-500/30",
    badgeText: "CONTRAINDICATION FLAG",
  },
  reasoning: {
    cardBg: "bg-violet-500/10 border-violet-500/30",
    iconBg: "bg-violet-500/20 text-violet-500 border-violet-500/30",
    badgeText: "CLINICAL RATIONALE",
  },
};

export const ClinicalAiPrescribingSupport: React.FC = () => {
  const handleApplySuggestion = (action: string) => {
    toast.success(`Applied to prescription draft: ${action}`);
  };

  return (
    <section aria-label="Clinical AI Prescribing Support Section">
      <DoctorGlassCard
        variant="glow"
        glowColor="violet"
        padding="lg"
        className="border-violet-500/30 space-y-6"
      >
        <SectionHeader
          title="AI Suggestions & Prescribing Guide"
          subtitle="Medication suggestions, second-line options, allergy warnings, and safety guidance."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-pulse" />
              <span>AI Guidance Active</span>
            </span>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_SUGGESTIONS.map((item) => {
            const style = categoryStyles[item.category];

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-200 flex flex-col justify-between space-y-3 ${style.cardBg}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      {style.badgeText}
                    </span>
                    {item.category === "contraindication" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/40">
                        CRITICAL SAFETY
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold font-heading text-foreground">{item.title}</h4>

                  {item.drugName && (
                    <div className="text-xs font-semibold text-primary flex items-center gap-1.5 bg-background/60 p-2 rounded-xl border border-border/40">
                      <Pill className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{item.drugName}</span>
                    </div>
                  )}

                  <p className="text-xs text-foreground/90 font-medium leading-relaxed bg-background/30 p-2.5 rounded-xl border border-border/30">
                    {item.rationale}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <button
                    onClick={() => handleApplySuggestion(item.title)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ClinicalAiPrescribingSupport;
