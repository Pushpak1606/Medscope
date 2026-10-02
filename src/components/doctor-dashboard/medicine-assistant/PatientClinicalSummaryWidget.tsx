import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import PriorityBadge from "../PriorityBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Droplet,
  ShieldAlert,
  Activity,
  FileText,
  Target,
  Pill,
  CheckCircle2,
  Clock,
} from "lucide-react";

export interface ClinicalSummaryData {
  patientName: string;
  age: number;
  gender: string;
  avatarUrl?: string;
  bloodGroup: string;
  diagnosis: string;
  allergies: string[];
  currentMedsCount: number;
  labsSummary: string;
  treatmentGoals: string[];
}

const MOCK_SUMMARY: ClinicalSummaryData = {
  patientName: "Marcus Vance",
  age: 54,
  gender: "Male",
  bloodGroup: "O Positive (O+)",
  diagnosis: "Subacute Coronary Syndrome • Coronary Artery Disease (CAD)",
  allergies: ["Penicillin (Severe Anaphylaxis)", "Shellfish (Urticaria)"],
  currentMedsCount: 5,
  labsSummary: "Troponin T: 0.14 ng/mL (Elevated) • LDL: 112 mg/dL • HbA1c: 6.8%",
  treatmentGoals: [
    "Target LDL reduction < 70 mg/dL (High-intensity statin)",
    "Dual Antiplatelet Therapy (DAPT) post-ACS protocol",
    "BP control target < 130/80 mmHg",
    "Prevent GI bleeding while on oral anticoagulation",
  ],
};

export const PatientClinicalSummaryWidget: React.FC = () => {
  return (
    <section aria-label="Patient Clinical Summary Section">
      <DoctorGlassCard
        variant="glow"
        glowColor="primary"
        padding="lg"
        className="border-primary/30 space-y-6 bg-gradient-to-r from-card/90 via-card/70 to-primary/5"
      >
        <SectionHeader
          title="Patient Details & Summary"
          subtitle="Patient overview: Details, vitals telemetry, diagnostic biomarkers & treatment goals."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              Exam Room 3B • Active Chart
            </span>
          }
        />

        {/* Patient Profile Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-4 border-b border-border/40">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl border-2 border-primary/40 shadow-xl shrink-0">
              <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${MOCK_SUMMARY.patientName}`} alt={MOCK_SUMMARY.patientName} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl rounded-3xl">MV</AvatarFallback>
            </Avatar>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground tracking-tight truncate">
                  {MOCK_SUMMARY.patientName}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
                  {MOCK_SUMMARY.age} yrs • {MOCK_SUMMARY.gender}
                </span>
                <PriorityBadge priority="stat" label="STAT CLINICAL REVIEW" />
              </div>

              <p className="text-xs sm:text-sm font-semibold text-primary flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-rose-500 shrink-0" />
                <span>{MOCK_SUMMARY.diagnosis}</span>
              </p>

              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <Droplet className="h-3.5 w-3.5 text-rose-500" /> Blood: <strong className="text-foreground">{MOCK_SUMMARY.bloodGroup}</strong>
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> Allergies: <strong className="text-rose-500">{MOCK_SUMMARY.allergies.join(", ")}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Labs & Treatment Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-card/50 border border-border/50 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>Recent Diagnostic Laboratory Summary</span>
            </span>
            <p className="text-xs text-foreground font-medium bg-background/50 p-2.5 rounded-xl border border-border/30">
              {MOCK_SUMMARY.labsSummary}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card/50 border border-border/50 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
              <Target className="h-4 w-4" />
              <span>Active Treatment Goals</span>
            </span>
            <ul className="space-y-1 text-xs text-foreground font-medium">
              {MOCK_SUMMARY.treatmentGoals.map((goal, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default PatientClinicalSummaryWidget;
