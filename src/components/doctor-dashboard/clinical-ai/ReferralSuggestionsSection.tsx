import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import PriorityBadge, { PriorityLevel } from "../PriorityBadge";
import { Share2, UserCheck, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface ReferralItem {
  id: string;
  patientName: string;
  suggestedSpecialist: string;
  specialty: string;
  facility: string;
  reason: string;
  urgency: PriorityLevel;
  expectedFollowup: string;
}

const MOCK_REFERRALS: ReferralItem[] = [
  {
    id: "ref-1",
    patientName: "Marcus Vance",
    suggestedSpecialist: "Dr. Robert Chen, MD",
    specialty: "Interventional Cardiology & Cardiac Catheterization",
    facility: "St. Jude Heart Institute • Cath Lab 2",
    reason: "Emergent Primary PCI evaluation & diagnostic coronary angiography for ST-segment elevation myocardial infarction (STEMI).",
    urgency: "stat",
    expectedFollowup: "Within 2 Hours (Emergent)",
  },
  {
    id: "ref-2",
    patientName: "Sarah Miller",
    suggestedSpecialist: "Dr. Maya Lin, MD",
    specialty: "Clinical Cardiac Electrophysiology",
    facility: "Arrhythmia & Pacemaker Clinic",
    reason: "Evaluation of 24-hour Holter monitoring data showing non-sustained ventricular tachycardia runs.",
    urgency: "high",
    expectedFollowup: "Within 5 Days",
  },
];

export const ReferralSuggestionsSection: React.FC = () => {
  const handleInitiateReferral = (specialist: string, patientName: string) => {
    toast.success(`Referral request created for ${patientName} -> ${specialist}`);
  };

  return (
    <section aria-label="Referral Suggestions Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Specialist Referral Recommendations (AI Triage)"
          subtitle="AI-driven specialist referral suggestions based on diagnostic severity & guideline thresholds."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20 flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-violet-500" />
              <span>2 Suggested Referrals</span>
            </span>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {MOCK_REFERRALS.map((ref) => (
            <div
              key={ref.id}
              className="p-5 rounded-3xl bg-card/60 hover:bg-card/80 border border-border/60 hover:border-violet-500/30 backdrop-blur-xl transition-all duration-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Patient: {ref.patientName}
                    </span>
                    <h4 className="text-base font-bold font-heading text-foreground">
                      {ref.suggestedSpecialist}
                    </h4>
                    <p className="text-xs text-primary font-semibold">{ref.specialty}</p>
                  </div>

                  <PriorityBadge priority={ref.urgency} size="sm" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-background/40 p-3 rounded-xl border border-border/30 space-y-1">
                    <span className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                      Referral Indication & Rationale:
                    </span>
                    <p className="text-foreground/90 font-medium leading-relaxed">{ref.reason}</p>
                  </div>

                  <div className="flex items-center justify-between bg-background/50 p-2.5 rounded-xl border border-border/30">
                    <span className="text-muted-foreground">Facility & Clinic:</span>
                    <strong className="text-foreground">{ref.facility}</strong>
                  </div>

                  <div className="flex items-center justify-between bg-violet-500/10 p-2.5 rounded-xl border border-violet-500/20 text-violet-600 dark:text-violet-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-violet-500" /> Expected Window:
                    </span>
                    <span>{ref.expectedFollowup}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/30">
                <Button
                  onClick={() => handleInitiateReferral(ref.suggestedSpecialist, ref.patientName)}
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-9 gap-1.5 shadow-md"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Initiate Specialist Referral</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ReferralSuggestionsSection;
