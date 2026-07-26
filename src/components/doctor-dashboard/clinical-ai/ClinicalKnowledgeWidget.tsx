import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { BookOpen, Pill, Activity, ShieldCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export interface KnowledgeReference {
  id: string;
  category: "guideline" | "drug-update" | "disease-summary" | "reminder";
  title: string;
  source: string;
  summary: string;
  date: string;
}

const MOCK_KNOWLEDGE: KnowledgeReference[] = [
  {
    id: "kn-1",
    category: "guideline",
    title: "2026 ACC/AHA STEMI Revascularization Guidelines",
    source: "American College of Cardiology Journal",
    summary: "Door-to-balloon time target remains <90 mins for primary PCI. Dual antiplatelet loading (Aspirin + Clopidogrel/Ticagrelor) recommended immediately upon ER arrival.",
    date: "Updated July 2026",
  },
  {
    id: "kn-2",
    category: "drug-update",
    title: "Warfarin & DOAC Co-administration Safety Bulletin",
    source: "FDA Drug Safety Communication",
    summary: "Mandatory INR monitoring required when CYP2C9 inhibitor drugs (e.g. Amiodarone, Fluconazole) are co-prescribed. Reduce Warfarin dose by 30-50%.",
    date: "Updated June 2026",
  },
  {
    id: "kn-3",
    category: "disease-summary",
    title: "Subacute Coronary Syndrome (ACS) Triage Protocol",
    source: "Medscope Clinical Knowledge Base",
    summary: "Troponin T levels > 0.04 ng/mL combined with chest tightness on exertion require continuous 12-lead ECG telemetry & serial biomarkers at 0h, 2h, and 6h.",
    date: "Updated May 2026",
  },
  {
    id: "kn-4",
    category: "reminder",
    title: "Renal Function Dosing Reminders (CrCl < 30 mL/min)",
    source: "Nephrology Clinical Guidance",
    summary: "Dose adjustment required for Enoxaparin, Metformin, and Dabigatran in patients with eGFR < 30 mL/min/1.73m².",
    date: "Updated July 2026",
  },
];

const categoryBadgeStyles = {
  guideline: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "drug-update": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "disease-summary": "bg-violet-500/10 text-violet-500 border-violet-500/20",
  reminder: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export const ClinicalKnowledgeWidget: React.FC = () => {
  const handleOpenGuideline = (title: string) => {
    toast.info(`Opening reference article: ${title}`);
  };

  return (
    <section aria-label="Clinical Knowledge Reference Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Clinical Knowledge & Guideline References"
          subtitle="Evidence-based guidelines, FDA drug safety updates & diagnostic summaries."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
              4 Peer-Reviewed References
            </span>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_KNOWLEDGE.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/60 hover:border-primary/30 backdrop-blur-xl transition-all duration-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${categoryBadgeStyles[item.category]}`}>
                    {item.category.replace("-", " ").toUpperCase()}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">{item.date}</span>
                </div>

                <h4 className="text-sm font-bold font-heading text-foreground">{item.title}</h4>
                <p className="text-[11px] font-semibold text-primary">{item.source}</p>

                <p className="text-xs text-foreground/90 font-medium leading-relaxed bg-background/50 p-3 rounded-xl border border-border/30">
                  {item.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-border/40">
                <button
                  onClick={() => handleOpenGuideline(item.title)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Read Full Guideline Article</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ClinicalKnowledgeWidget;
