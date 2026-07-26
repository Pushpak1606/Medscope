import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import {
  Clock,
  Stethoscope,
  Pill,
  FileText,
  Building2,
  BookOpen,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

export interface ConsultationTimelineItem {
  id: string;
  date: string;
  time: string;
  type: "consultation" | "medication" | "lab" | "vitals" | "journal" | "hospital";
  title: string;
  summary: string;
}

const MOCK_EVENTS: ConsultationTimelineItem[] = [
  {
    id: "ct-1",
    date: "July 26, 2026",
    time: "08:30 AM",
    type: "consultation",
    title: "Live Telehealth Exam — Marcus Vance",
    summary: "Active consultation session evaluating chest pressure & V2-V4 ST elevation.",
  },
  {
    id: "ct-2",
    date: "July 26, 2026",
    time: "08:20 AM",
    type: "lab",
    title: "Troponin T Lab Uploaded",
    summary: "Result: 0.14 ng/mL (Elevated cardiac biomarker).",
  },
  {
    id: "ct-3",
    date: "July 26, 2026",
    time: "08:15 AM",
    type: "vitals",
    title: "Emergency Vitals Telemetry",
    summary: "BP 148/92 mmHg, HR 94 bpm, SpO2 95%, Temp 98.6°F.",
  },
  {
    id: "ct-4",
    date: "July 20, 2026",
    time: "02:30 PM",
    type: "medication",
    title: "Atorvastatin Dosage Adjustment",
    summary: "Increased from 20mg to 40mg daily.",
  },
  {
    id: "ct-5",
    date: "July 12, 2026",
    time: "09:45 PM",
    type: "journal",
    title: "Patient Journal Log: Chest Tightness",
    summary: '"Felt exertional chest pressure during evening walk. Used Nitroglycerin SL with relief."',
  },
  {
    id: "ct-6",
    date: "June 10, 2026",
    time: "11:00 AM",
    type: "hospital",
    title: "Outpatient Cardiology Visit",
    summary: "Routine PCI stent check with Dr. Sarah Jenkins.",
  },
];

const typeIcons: Record<ConsultationTimelineItem["type"], React.ElementType> = {
  consultation: Stethoscope,
  medication: Pill,
  lab: FileText,
  vitals: Activity,
  journal: BookOpen,
  hospital: Building2,
};

export const ClinicalTimelineWidget: React.FC = () => {
  return (
    <section aria-label="Clinical Timeline Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Clinical Timeline"
          subtitle="Chronological sequence of consultations, Rx adjustments, labs & vitals."
        />

        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
          {MOCK_EVENTS.map((evt, idx) => {
            const IconComponent = typeIcons[evt.type];

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative group"
              >
                <div className="absolute -left-[31px] top-1.5 h-5 w-5 rounded-full border-2 border-primary/40 bg-card flex items-center justify-center text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>

                <div className="p-4 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/50 backdrop-blur-xl transition-all duration-200 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <IconComponent className="h-3.5 w-3.5" />
                      <span>{evt.title}</span>
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {evt.date} • {evt.time}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                    {evt.summary}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ClinicalTimelineWidget;
