import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import StatusBadge from "../StatusBadge";
import { Clock, Calendar, Stethoscope, Users, Coffee, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export interface TimelineEvent {
  id: string;
  time: string;
  duration: string;
  title: string;
  patientName?: string;
  type: "consultation" | "meeting" | "break" | "rounds" | "followup";
  status: "in-consultation" | "waiting" | "completed" | "active" | "pending";
  isCurrent?: boolean;
}

const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: "evt-1",
    time: "08:30 AM",
    duration: "30 min",
    title: "Urgent Consultation — Marcus Vance",
    patientName: "Marcus Vance",
    type: "consultation",
    status: "waiting",
    isCurrent: true,
  },
  {
    id: "evt-2",
    time: "09:15 AM",
    duration: "30 min",
    title: "Post-PCI Follow-up — Eleanor Vance",
    patientName: "Eleanor Vance",
    type: "followup",
    status: "pending",
  },
  {
    id: "evt-3",
    time: "10:00 AM",
    duration: "20 min",
    title: "Diabetes Medication Renewal — David Chen",
    patientName: "David Chen",
    type: "consultation",
    status: "pending",
  },
  {
    id: "evt-4",
    time: "11:00 AM",
    duration: "60 min",
    title: "Cardiology Multidisciplinary Case Conference",
    patientName: "Department Team",
    type: "meeting",
    status: "pending",
  },
  {
    id: "evt-5",
    time: "12:30 PM",
    duration: "45 min",
    title: "Clinical Rest Break & Electronic Charting",
    type: "break",
    status: "pending",
  },
  {
    id: "evt-6",
    time: "01:30 PM",
    duration: "60 min",
    title: "Inpatient Ward Rounds & Cardiac Telemetry Review",
    patientName: "Ward 4B Inpatients",
    type: "rounds",
    status: "pending",
  },
];

const typeIcons: Record<TimelineEvent["type"], React.ElementType> = {
  consultation: Stethoscope,
  followup: CheckCircle2,
  meeting: Users,
  break: Coffee,
  rounds: Calendar,
};

export const ScheduleTimelineSection: React.FC = () => {
  return (
    <section aria-label="Today's Schedule Section" className="h-full">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6 h-full flex flex-col justify-between">
        <div className="space-y-6">
          <SectionHeader
            title="Today's Schedule"
            subtitle="Vertical timeline of consultations, ward rounds, and case meetings."
            badge={
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                6 Events Scheduled
              </span>
            }
          />

          {/* Vertical Timeline Container */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
            {MOCK_TIMELINE.map((event, idx) => {
              const IconComponent = typeIcons[event.type];
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="relative group"
                >
                  {/* Timeline Dot Node */}
                  <div
                    className={`absolute -left-[31px] top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      event.isCurrent
                        ? "bg-primary border-primary shadow-md shadow-primary/30 ring-4 ring-primary/20"
                        : "bg-card border-border/80 group-hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        event.isCurrent ? "bg-white animate-pulse" : "bg-muted-foreground/40"
                      }`}
                    />
                  </div>

                  {/* Timeline Content Block */}
                  <div
                    className={`p-4 rounded-2xl border backdrop-blur-md transition-all duration-200 ${
                      event.isCurrent
                        ? "bg-primary/10 border-primary/30 shadow-md"
                        : "bg-card/40 border-border/40 hover:bg-card/70 hover:border-border/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{event.time}</span>
                          <span className="text-muted-foreground font-normal">({event.duration})</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold font-heading text-foreground truncate">
                          {event.title}
                        </h4>
                        {event.patientName && (
                          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <IconComponent className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span>{event.patientName}</span>
                          </p>
                        )}
                      </div>

                      <StatusBadge status={event.status} size="sm" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <span>Synced with Hospital EHR System</span>
          <button className="text-primary font-semibold hover:underline flex items-center gap-1">
            <span>View Full Week</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ScheduleTimelineSection;
