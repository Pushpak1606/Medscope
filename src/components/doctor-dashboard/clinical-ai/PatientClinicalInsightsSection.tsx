import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import PriorityBadge, { PriorityLevel } from "../PriorityBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, Pill, Activity, UserCheck, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface PatientAiInsight {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  avatarUrl?: string;
  priority: PriorityLevel;
  clinicalSummary: string;
  riskObservations: string;
  medicationAdherence: string;
  suggestedFollowup: string;
}

const MOCK_PATIENT_INSIGHTS: PatientAiInsight[] = [
  {
    id: "ins-1",
    patientId: "pat-101",
    patientName: "Marcus Vance",
    age: 54,
    gender: "Male",
    priority: "stat",
    clinicalSummary: "Acute substernal chest tightness & exertional dyspnea. Troponin T elevated at 0.14 ng/mL. 12-Lead ECG ST elevation in V2-V4.",
    riskObservations: "Cardiac Risk Index 0.84 (STAT). Severe allergy to Penicillin. Dual therapy bleed risk.",
    medicationAdherence: "94% High Adherence",
    suggestedFollowup: "Repeat serial Troponin T at 2h + emergent Interventional Cardiology consult for primary PCI.",
  },
  {
    id: "ins-2",
    patientId: "pat-102",
    patientName: "Eleanor Vance",
    age: 62,
    gender: "Female",
    priority: "high",
    clinicalSummary: "Post-PCI coronary stent 3-month follow-up. Telemetry vitals stable.",
    riskObservations: "Warfarin + Amiodarone co-prescription drug interaction warning (CYP2C9 inhibition).",
    medicationAdherence: "98% High Adherence",
    suggestedFollowup: "Recheck INR in 72 hours and adjust Warfarin dose by 30%.",
  },
];

export const PatientClinicalInsightsSection: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenWorkspace = (patientId: string, name: string) => {
    toast.info(`Opening Patient Workspace for ${name}...`);
    navigate(`/doctor/patients/${patientId}`);
  };

  return (
    <section aria-label="Patient Clinical Insights Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Patient Clinical Insights (AI Triage & Synthesis)"
          subtitle="Real-time clinical intelligence cards highlighting patient risk flags, Rx compliance & follow-up recommendations."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20">
              2 Active High-Risk Patients
            </span>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {MOCK_PATIENT_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className="p-5 rounded-3xl bg-card/60 hover:bg-card/80 border border-border/60 hover:border-violet-500/30 backdrop-blur-xl transition-all duration-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 rounded-2xl border border-primary/30 shrink-0">
                      <AvatarImage
                        src={insight.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${insight.patientName}`}
                        alt={insight.patientName}
                      />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {insight.patientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h4 className="text-base font-bold font-heading text-foreground truncate">
                        {insight.patientName}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium">
                        {insight.age} yrs • {insight.gender}
                      </p>
                    </div>
                  </div>

                  <PriorityBadge priority={insight.priority} size="sm" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-background/40 p-3 rounded-xl border border-border/30 space-y-1">
                    <span className="font-bold uppercase tracking-wider text-primary text-[10px]">Clinical Summary:</span>
                    <p className="text-foreground/90 font-medium leading-relaxed">{insight.clinicalSummary}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-0.5">
                      <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Risk Observation
                      </span>
                      <p className="text-[11px] font-medium leading-tight">{insight.riskObservations}</p>
                    </div>

                    <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-0.5">
                      <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <Pill className="h-3 w-3" /> Rx Adherence
                      </span>
                      <p className="text-[11px] font-bold">{insight.medicationAdherence}</p>
                    </div>
                  </div>

                  <div className="bg-violet-500/10 p-3 rounded-xl border border-violet-500/20 text-violet-600 dark:text-violet-300 space-y-0.5">
                    <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-violet-500" /> AI Suggested Follow-up
                    </span>
                    <p className="text-xs font-medium leading-relaxed text-foreground">{insight.suggestedFollowup}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/30">
                <Button
                  onClick={() => handleOpenWorkspace(insight.patientId, insight.patientName)}
                  variant="outline"
                  className="w-full rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-9 gap-1.5"
                >
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Open Patient Workspace</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default PatientClinicalInsightsSection;
