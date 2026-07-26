import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import PriorityBadge from "../PriorityBadge";
import {
  Sparkles,
  AlertTriangle,
  Pill,
  BookOpen,
  CheckCircle2,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export interface DecisionSupportItem {
  id: string;
  category: "diagnosis" | "interaction" | "recommendation" | "guideline";
  title: string;
  badge: string;
  description: string;
  actionText: string;
}

const MOCK_DECISIONS: DecisionSupportItem[] = [
  {
    id: "cds-1",
    category: "diagnosis",
    title: "Suggested Primary Diagnosis: Acute Anterior STEMI",
    badge: "AI DIFFERENTIAL",
    description: "Match score 94%: Exertional chest pain + 1.5mm ST elevation in V2-V4 + Troponin T 0.14 ng/mL meets ACC/AHA STEMI diagnostic criteria.",
    actionText: "Accept STEMI Diagnosis",
  },
  {
    id: "cds-2",
    category: "interaction",
    title: "Medication Interaction Flag: Warfarin + Amiodarone",
    badge: "DRUG INTERACTION",
    description: "Co-administration of Amiodarone with Warfarin increases INR bleed risk by up to 50%. Suggest reducing Warfarin dose by 30-50% if Amiodarone initiated.",
    actionText: "Adjust Warfarin Dose",
  },
  {
    id: "cds-3",
    category: "recommendation",
    title: "Recommended Follow-up: Repeat Serial Biomarkers",
    badge: "CLINICAL PROTOCOL",
    description: "Protocol recommends repeating hs-Troponin T at 2 hours post-presentation to establish cardiac biomarker kinetics.",
    actionText: "Order 2h Troponin Test",
  },
  {
    id: "cds-4",
    category: "guideline",
    title: "2026 ACC/AHA STEMI Guideline Note",
    badge: "EVIDENCE GUIDELINE",
    description: "Door-to-Balloon time target: <90 minutes for primary PCI in STEMI patients. Dual Antiplatelet Therapy (DAPT) loading recommended immediately.",
    actionText: "View Guideline Summary",
  },
];

const categoryStyles = {
  diagnosis: {
    cardBg: "bg-rose-500/10 border-rose-500/30",
    iconBg: "bg-rose-500/20 text-rose-500 border-rose-500/30",
    icon: BrainCircuit,
  },
  interaction: {
    cardBg: "bg-amber-500/10 border-amber-500/30",
    iconBg: "bg-amber-500/20 text-amber-500 border-amber-500/30",
    icon: Pill,
  },
  recommendation: {
    cardBg: "bg-violet-500/10 border-violet-500/30",
    iconBg: "bg-violet-500/20 text-violet-500 border-violet-500/30",
    icon: CheckCircle2,
  },
  guideline: {
    cardBg: "bg-blue-500/10 border-blue-500/30",
    iconBg: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    icon: BookOpen,
  },
};

export const ClinicalDecisionSupport: React.FC = () => {
  const handleAction = (title: string) => {
    toast.info(`Accepted clinical decision support: ${title}`);
  };

  return (
    <section aria-label="Clinical Decision Support Section">
      <DoctorGlassCard
        variant="glow"
        glowColor="violet"
        padding="lg"
        className="border-violet-500/30 space-y-6"
      >
        <SectionHeader
          title="Clinical Decision Support (AI Intelligence)"
          subtitle="Real-time clinical suggestions, drug interaction alerts & evidence-based ACC/AHA guideline notes."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-pulse" />
              <span>Decision Copilot Active</span>
            </span>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_DECISIONS.map((item) => {
            const style = categoryStyles[item.category];
            const IconComponent = style.icon;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-200 flex flex-col justify-between space-y-3 ${style.cardBg}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl border shrink-0 ${style.iconBg}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      {item.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold font-heading text-foreground">{item.title}</h4>

                  <p className="text-xs text-foreground/90 font-medium leading-relaxed bg-background/40 p-2.5 rounded-xl border border-border/30">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <button
                    onClick={() => handleAction(item.title)}
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

        <div className="text-[11px] text-muted-foreground font-medium text-center pt-2">
          Clinical Decision Support is powered by Medscope Evidence Engine v4.2. Practitioner oversight required.
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ClinicalDecisionSupport;
