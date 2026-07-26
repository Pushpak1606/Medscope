import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import PriorityBadge from "../PriorityBadge";
import { Sparkles, AlertTriangle, Pill, BrainCircuit, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export interface BriefingItem {
  id: string;
  category: "alert" | "warning" | "suggestion" | "followup";
  patientName: string;
  title: string;
  summary: string;
  badgeText: string;
  actionText: string;
}

const MOCK_BRIEFING_ITEMS: BriefingItem[] = [
  {
    id: "ai-1",
    category: "alert",
    patientName: "Marcus Vance",
    title: "Critical Lab Flag • Troponin T",
    summary: "Pre-consultation Troponin T (0.14 ng/mL) & ECG ST-segment displacement detected. Bedside evaluation recommended upon arrival.",
    badgeText: "IMMEDIATE ATTENTION",
    actionText: "Review ECG & Vitals",
  },
  {
    id: "ai-2",
    category: "warning",
    patientName: "Eleanor Vance",
    title: "Drug Interaction Warning",
    summary: "Warfarin + Amiodarone co-prescription flag. Latest INR is 2.4. Verify dosage alignment before renewing therapy.",
    badgeText: "MEDICATION CHECK",
    actionText: "Check Rx Safety",
  },
  {
    id: "ai-3",
    category: "suggestion",
    patientName: "David Chen",
    title: "Glycemic Target Optimization",
    summary: "Patient's 90-day average blood glucose is 118 mg/dL. AI suggests reviewing Metformin dosage adjustment for glycemic stability.",
    badgeText: "CLINICAL INSIGHT",
    actionText: "View Glucose Telemetry",
  },
  {
    id: "ai-4",
    category: "followup",
    patientName: "Sarah Miller",
    title: "Holter Monitor Telemetry Ready",
    summary: "24-hour ambulatory ECG recording analysis complete. 4 short non-sustained ventricular runs logged.",
    badgeText: "HOLTER TELEMETRY",
    actionText: "Open Holter Traces",
  },
];

const categoryStyles = {
  alert: {
    cardBg: "bg-rose-500/10 border-rose-500/30 dark:bg-rose-500/15",
    iconBg: "bg-rose-500/20 text-rose-500 border-rose-500/30",
    icon: AlertTriangle,
    badgeColor: "rose",
  },
  warning: {
    cardBg: "bg-amber-500/10 border-amber-500/30 dark:bg-amber-500/15",
    iconBg: "bg-amber-500/20 text-amber-500 border-amber-500/30",
    icon: Pill,
    badgeColor: "amber",
  },
  suggestion: {
    cardBg: "bg-violet-500/10 border-violet-500/30 dark:bg-violet-500/15",
    iconBg: "bg-violet-500/20 text-violet-500 border-violet-500/30",
    icon: BrainCircuit,
    badgeColor: "violet",
  },
  followup: {
    cardBg: "bg-blue-500/10 border-blue-500/30 dark:bg-blue-500/15",
    iconBg: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    icon: CheckCircle2,
    badgeColor: "blue",
  },
};

export const ClinicalAiBriefingSection: React.FC = () => {
  const handleAction = (title: string) => {
    toast.info(`Opening AI recommendation detail: ${title}`);
  };

  return (
    <section aria-label="Clinical AI Briefing Section" className="h-full">
      <DoctorGlassCard
        variant="glow"
        glowColor="violet"
        padding="lg"
        className="border-violet-500/30 space-y-6 h-full flex flex-col justify-between"
      >
        <div className="space-y-6">
          <SectionHeader
            title="Clinical AI Briefing"
            subtitle="Automated intelligence briefing highlighting patient risk flags, drug interactions & telemetry."
            badge={
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-pulse" />
                <span>AI Briefing Active</span>
              </span>
            }
          />

          {/* Briefing Items Grid */}
          <div className="space-y-4">
            {MOCK_BRIEFING_ITEMS.map((item, idx) => {
              const style = categoryStyles[item.category];
              const IconComponent = style.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${style.cardBg}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${style.iconBg}`}>
                      <IconComponent className="h-4 w-4 stroke-[2]" />
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                          {item.badgeText} • {item.patientName}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold font-heading text-foreground">
                        {item.title}
                      </h4>

                      <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                        {item.summary}
                      </p>

                      <div className="pt-1">
                        <button
                          onClick={() => handleAction(item.title)}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <span>{item.actionText}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="pt-4 border-t border-violet-500/20 text-[11px] text-muted-foreground font-medium text-center">
          Clinical AI supports—but never replaces—practitioner judgment. Verified with Medscope Clinical Safety Model v4.2.
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ClinicalAiBriefingSection;
