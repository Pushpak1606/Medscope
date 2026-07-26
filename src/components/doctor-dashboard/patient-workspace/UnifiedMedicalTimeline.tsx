import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import StatusBadge from "../StatusBadge";
import {
  Calendar,
  Stethoscope,
  Pill,
  FileText,
  Building2,
  BookOpen,
  Filter,
  ChevronDown,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

export type EventCategory =
  | "all"
  | "consultation"
  | "prescription"
  | "lab"
  | "medication"
  | "journal"
  | "hospital";

export interface UnifiedTimelineEvent {
  id: string;
  date: string;
  time?: string;
  category: EventCategory;
  title: string;
  subtitle: string;
  provider?: string;
  details: string;
  badge?: string;
}

const MOCK_EVENTS: UnifiedTimelineEvent[] = [
  {
    id: "tl-1",
    date: "July 26, 2026",
    time: "08:15 AM",
    category: "hospital",
    title: "Emergency Department Presentation",
    subtitle: "St. Jude ER • Triage Room 2",
    provider: "Dr. Marcus Reed (ER Attending)",
    details: "Patient presented with 2-hour history of severe chest pressure radiating to left shoulder. Troponin T: 0.14 ng/mL. ECG: Anterior ST displacement.",
    badge: "STAT ER VISIT",
  },
  {
    id: "tl-2",
    date: "July 20, 2026",
    time: "02:30 PM",
    category: "medication",
    title: "Medication Adjustment — Atorvastatin",
    subtitle: "Cardiology Outpatient Clinic",
    provider: "Dr. Sarah Jenkins, MD",
    details: "Increased Atorvastatin dosage from 20mg daily to 40mg daily for intensive lipid control. Patient counselled on hepatic safety.",
    badge: "RX DOSAGE INCREASE",
  },
  {
    id: "tl-3",
    date: "July 15, 2026",
    time: "10:00 AM",
    category: "lab",
    title: "Lab Report: Lipid Panel & Troponin Baseline",
    subtitle: "Quest Diagnostics Lab",
    provider: "Central Diagnostics",
    details: "LDL Cholesterol: 112 mg/dL. HDL: 42 mg/dL. Triglycerides: 168 mg/dL. Troponin T baseline: 0.01 ng/mL.",
    badge: "LAB REPORT",
  },
  {
    id: "tl-4",
    date: "July 12, 2026",
    time: "09:45 PM",
    category: "journal",
    title: "Patient Journal Log — Anxiety & Fluttering",
    subtitle: "Medscope Patient Portal App",
    provider: "Self-Reported by Marcus Vance",
    details: '"Felt short of breath during evening walk. Noticed brief chest tightness lasting 5 minutes. Took sublingual nitroglycerin with partial relief."',
    badge: "PATIENT JOURNAL",
  },
  {
    id: "tl-5",
    date: "June 10, 2026",
    time: "11:00 AM",
    category: "consultation",
    title: "Outpatient Cardiology Consultation",
    subtitle: "Clinic Suite 304",
    provider: "Dr. Sarah Jenkins, MD",
    details: "Routine 6-month post-PCI follow-up. Stent patent. BP 130/84 mmHg. Recommended exercise stress test.",
    badge: "CONSULTATION",
  },
];

const categoryIcons: Record<Exclude<EventCategory, "all">, React.ElementType> = {
  consultation: Stethoscope,
  prescription: Pill,
  lab: FileText,
  medication: Pill,
  journal: BookOpen,
  hospital: Building2,
};

const categoryColors: Record<Exclude<EventCategory, "all">, string> = {
  consultation: "text-primary border-primary/40 bg-primary/10",
  prescription: "text-emerald-500 border-emerald-500/40 bg-emerald-500/10",
  lab: "text-blue-500 border-blue-500/40 bg-blue-500/10",
  medication: "text-amber-500 border-amber-500/40 bg-amber-500/10",
  journal: "text-violet-500 border-violet-500/40 bg-violet-500/10",
  hospital: "text-rose-500 border-rose-500/40 bg-rose-500/10",
};

export const UnifiedMedicalTimeline: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<EventCategory>("all");

  const filteredEvents =
    filterCategory === "all"
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter((e) => e.category === filterCategory);

  return (
    <section aria-label="Unified Medical Timeline Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Visit History & Health Timeline"
          subtitle="Chronological record of consultations, prescriptions, lab results, and patient journal notes."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              5 Events Documented
            </span>
          }
          action={
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {/* Category Filter Pills */}
              <span className="text-xs font-medium text-muted-foreground mr-1 hidden sm:inline">Filter:</span>
              {(["all", "consultation", "lab", "medication", "journal", "hospital"] as EventCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                    filterCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          }
        />

        {/* Timeline Container */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
          {filteredEvents.map((evt, idx) => {
            const IconComponent = categoryIcons[evt.category];
            const colorClass = categoryColors[evt.category];

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="relative group"
              >
                {/* Timeline Dot Node */}
                <div className={`absolute -left-[31px] top-1.5 h-5 w-5 rounded-full border-2 flex items-center justify-center bg-card ${colorClass}`}>
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>

                {/* Timeline Item Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/60 hover:border-primary/30 backdrop-blur-xl transition-all duration-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`p-1.5 rounded-lg border ${colorClass}`}>
                        <IconComponent className="h-3.5 w-3.5" />
                      </span>
                      <h4 className="text-sm sm:text-base font-bold font-heading text-foreground">
                        {evt.title}
                      </h4>
                      {evt.badge && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                          {evt.badge}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{evt.date} {evt.time && `• ${evt.time}`}</span>
                    </div>
                  </div>

                  <div className="text-xs text-primary font-medium">{evt.subtitle} — <span className="text-muted-foreground">{evt.provider}</span></div>

                  <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed bg-background/40 p-3 rounded-xl border border-border/30">
                    {evt.details}
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

export default UnifiedMedicalTimeline;
