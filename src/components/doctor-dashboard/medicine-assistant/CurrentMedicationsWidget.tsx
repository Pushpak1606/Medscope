import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import StatusBadge from "../StatusBadge";
import { Pill, ShieldCheck, Clock, Activity, AlertCircle } from "lucide-react";

export interface ActiveMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: "active" | "discontinued";
  purpose: string;
}

const MOCK_ACTIVE_MEDS: ActiveMedication[] = [
  {
    id: "active-1",
    name: "Atorvastatin Calcium",
    dosage: "40 mg",
    frequency: "Once Daily (Bedtime)",
    duration: "6 Months",
    status: "active",
    purpose: "Lipid-lowering statin therapy & plaque stabilization",
  },
  {
    id: "active-2",
    name: "Aspirin EC",
    dosage: "81 mg",
    frequency: "Once Daily (Morning)",
    duration: "Ongoing",
    status: "active",
    purpose: "Antiplatelet therapy for coronary artery disease",
  },
  {
    id: "active-3",
    name: "Warfarin Sodium",
    dosage: "5 mg",
    frequency: "Once Daily (Evening)",
    duration: "3 Months",
    status: "active",
    purpose: "Oral anticoagulation (Target INR: 2.0 - 3.0)",
  },
  {
    id: "active-4",
    name: "Metoprolol Succinate ER",
    dosage: "50 mg",
    frequency: "Once Daily",
    duration: "Ongoing",
    status: "active",
    purpose: "Beta-blocker for heart rate control & post-MI risk reduction",
  },
  {
    id: "active-5",
    name: "Nitroglycerin Sublingual",
    dosage: "0.4 mg",
    frequency: "PRN as needed",
    duration: "PRN Emergency",
    status: "active",
    purpose: "Acute chest pain (anginal relief)",
  },
];

export const CurrentMedicationsWidget: React.FC = () => {
  return (
    <section aria-label="Current Medication Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Active Patient Regimen (Current Medications)"
          subtitle="Overview of patient's current daily drug regimen, dosages, frequency & clinical indication."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              5 Active Medications
            </span>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_ACTIVE_MEDS.map((med) => (
            <div
              key={med.id}
              className="p-4 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/60 hover:border-primary/30 backdrop-blur-xl transition-all duration-200 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold font-heading text-foreground flex items-center gap-1.5">
                    <Pill className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{med.name}</span>
                  </h4>
                  <StatusBadge status={med.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-background/50 p-2 rounded-xl border border-border/30">
                  <div>
                    <span className="text-muted-foreground">Dose: </span>
                    <strong className="text-foreground">{med.dosage}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Freq: </span>
                    <strong className="text-foreground">{med.frequency}</strong>
                  </div>
                </div>

                <p className="text-xs text-foreground/90 font-medium bg-background/30 p-2 rounded-xl border border-border/20">
                  <strong className="text-muted-foreground">Purpose: </strong>
                  {med.purpose}
                </p>
              </div>

              <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 border-t border-border/30 pt-2">
                <Clock className="h-3 w-3 text-primary" />
                <span>Duration: {med.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default CurrentMedicationsWidget;
