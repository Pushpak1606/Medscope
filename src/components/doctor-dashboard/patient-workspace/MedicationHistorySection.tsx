import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import StatusBadge from "../StatusBadge";
import { Pill, AlertTriangle, ShieldCheck, Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface MedicationItem {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  status: "active" | "discontinued" | "review";
  duration: string;
  prescribedBy: string;
  warnings?: string;
  interactionFlag?: {
    severity: "high" | "moderate" | "safe";
    text: string;
  };
}

const MOCK_MEDICATIONS: MedicationItem[] = [
  {
    id: "med-1",
    name: "Atorvastatin Calcium",
    genericName: "Atorvastatin 40mg Tab",
    dosage: "40 mg",
    frequency: "Once Daily (Bedtime)",
    status: "active",
    duration: "Ongoing (Dosage increased July 20)",
    prescribedBy: "Dr. Sarah Jenkins, MD",
    warnings: "Monitor ALT/AST liver panel annually.",
    interactionFlag: {
      severity: "safe",
      text: "AI Checked: No major interaction flags",
    },
  },
  {
    id: "med-2",
    name: "Aspirin EC",
    genericName: "Acetylsalicylic Acid 81mg",
    dosage: "81 mg",
    frequency: "Once Daily (Morning with meal)",
    status: "active",
    duration: "Ongoing (Cardioprotective)",
    prescribedBy: "Dr. Sarah Jenkins, MD",
    warnings: "Take with food to minimize GI distress.",
    interactionFlag: {
      severity: "moderate",
      text: "Co-therapy with Warfarin: Monitor INR closely",
    },
  },
  {
    id: "med-3",
    name: "Warfarin Sodium",
    genericName: "Warfarin 5mg Tab",
    dosage: "5 mg",
    frequency: "Once Daily (Evening at 6 PM)",
    status: "active",
    duration: "3 Months (Target INR: 2.0 - 3.0)",
    prescribedBy: "Dr. Sarah Jenkins, MD",
    warnings: "Black Box: Bleeding risk. Avoid OTC NSAIDs & Vitamin K surges.",
    interactionFlag: {
      severity: "high",
      text: "Flag: Moderate interaction if Amiodarone added",
    },
  },
  {
    id: "med-4",
    name: "Metoprolol Succinate ER",
    genericName: "Metoprolol 50mg Extended Release",
    dosage: "50 mg",
    frequency: "Once Daily (Morning)",
    status: "active",
    duration: "Ongoing (Beta-Blocker therapy)",
    prescribedBy: "Dr. Sarah Jenkins, MD",
    warnings: "Do not abruptly discontinue. Monitor resting heart rate.",
    interactionFlag: {
      severity: "safe",
      text: "AI Checked: Safe baseline synergy",
    },
  },
  {
    id: "med-5",
    name: "Nitroglycerin Sublingual",
    genericName: "Nitroglycerin 0.4mg SL Tab",
    dosage: "0.4 mg",
    frequency: "PRN (Sublingual for acute chest pain)",
    status: "active",
    duration: "As needed (PRN Emergency)",
    prescribedBy: "Dr. Sarah Jenkins, MD",
    warnings: "Contraindicated with PDE-5 inhibitors (Sildenafil/Tadalafil).",
    interactionFlag: {
      severity: "high",
      text: "Contraindication Warning: PDE-5 inhibitor prohibition",
    },
  },
];

export const MedicationHistorySection: React.FC = () => {
  return (
    <section aria-label="Medication History Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Medicine History & Prescriptions"
          subtitle="Current medications, dosages, warnings, and AI safety checks."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              5 Active Medicines
            </span>
          }
          action={
            <Button
              onClick={() => toast.info("Opening AI Prescription Writer...")}
              className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Add Medicine</span>
            </Button>
          }
        />

        {/* Medication Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_MEDICATIONS.map((med) => (
            <div
              key={med.id}
              className="p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/60 hover:border-primary/30 backdrop-blur-xl transition-all duration-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                      <Pill className="h-4 w-4 text-primary shrink-0" />
                      <span>{med.name}</span>
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium">{med.genericName}</p>
                  </div>
                  <StatusBadge status={med.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-background/50 p-2.5 rounded-xl border border-border/40">
                  <div>
                    <span className="text-muted-foreground">Dosage: </span>
                    <strong className="text-foreground">{med.dosage}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Frequency: </span>
                    <strong className="text-foreground">{med.frequency}</strong>
                  </div>
                </div>

                {med.warnings && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{med.warnings}</span>
                  </p>
                )}
              </div>

              {/* Interaction Flag Pill */}
              {med.interactionFlag && (
                <div
                  className={`pt-2 text-xs font-semibold flex items-center gap-1.5 ${
                    med.interactionFlag.severity === "high"
                      ? "text-rose-500"
                      : med.interactionFlag.severity === "moderate"
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {med.interactionFlag.severity === "high" ? (
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  ) : med.interactionFlag.severity === "moderate" ? (
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span>{med.interactionFlag.text}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default MedicationHistorySection;
