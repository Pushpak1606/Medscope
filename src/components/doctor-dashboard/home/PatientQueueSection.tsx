import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import PriorityBadge, { PriorityLevel } from "../PriorityBadge";
import StatusBadge from "../StatusBadge";
import QueueBadge from "../QueueBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  Sparkles,
  ArrowRight,
  Stethoscope,
  UserCheck,
  ChevronRight,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export interface QueuePatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatarUrl?: string;
  appointmentTime: string;
  priority: PriorityLevel;
  status: "waiting" | "in-consultation" | "active" | "next";
  isNext?: boolean;
  queuePosition?: number;
  chiefComplaint: string;
  vitals: {
    bp: string;
    hr: number;
    spo2: number;
    temp: string;
  };
  aiSummary: string;
}

const MOCK_QUEUE: QueuePatient[] = [
  {
    id: "pat-101",
    name: "Marcus Vance",
    age: 54,
    gender: "Male",
    appointmentTime: "08:30 AM",
    priority: "stat",
    status: "waiting",
    isNext: true,
    queuePosition: 1,
    chiefComplaint:
      "Sudden onset substernal chest tightness & exertional dyspnea radiating to left shoulder for 2 hours.",
    vitals: {
      bp: "148/92",
      hr: 94,
      spo2: 95,
      temp: "98.6°F",
    },
    aiSummary:
      "AI Clinical Note: Elevated cardiac risk index (0.84). Pre-checkin ECG indicates anterior ST displacement. Allergy: Penicillin.",
  },
  {
    id: "pat-102",
    name: "Eleanor Vance",
    age: 62,
    gender: "Female",
    appointmentTime: "09:15 AM",
    priority: "high",
    status: "waiting",
    queuePosition: 2,
    chiefComplaint:
      "Post-coronary stent 3-month follow-up evaluation and mild exertional fatigue review.",
    vitals: {
      bp: "124/78",
      hr: 72,
      spo2: 98,
      temp: "98.4°F",
    },
    aiSummary:
      "AI Clinical Note: Telemetry vitals stable over 7 days. INR test: 2.4 (therapeutic target range). No drug interactions flagged.",
  },
  {
    id: "pat-103",
    name: "David Chen",
    age: 41,
    gender: "Male",
    appointmentTime: "10:00 AM",
    priority: "routine",
    status: "waiting",
    queuePosition: 3,
    chiefComplaint:
      "Type 2 Diabetes medication renewal & mild bilateral ankle edema assessment.",
    vitals: {
      bp: "128/82",
      hr: 68,
      spo2: 99,
      temp: "98.2°F",
    },
    aiSummary:
      "AI Clinical Note: Recent HbA1c 6.8% (on target). Metformin 500mg daily. Adherence score 96%.",
  },
];

import { useConsultation } from "@/context/ConsultationContext";
import { useNavigate } from "react-router-dom";

export const PatientQueueSection: React.FC = () => {
  const navigate = useNavigate();
  const { startNewConsultationSession } = useConsultation();

  const handleOpenWorkspace = (patientId: string) => {
    navigate(`/doctor/patients/${patientId}`);
  };

  const handleStartConsultation = (patientItem: any) => {
    startNewConsultationSession(patientItem);
    navigate("/doctor/consultations");
  };

  return (
    <section aria-label="Patient Queue Section" className="space-y-6">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Patient Queue"
          subtitle="Triage queue prioritized by clinical urgency & appointment timing."
          badge={<StatusBadge status="waiting" label="3 Waiting in Queue" />}
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" /> Live Queue Active
              </span>
            </div>
          }
        />

        {/* Patient Queue Cards Container */}
        <div className="space-y-5">
          {MOCK_QUEUE.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 border backdrop-blur-xl ${
                patient.priority === "stat"
                  ? "bg-gradient-to-r from-rose-500/10 via-card/70 to-card/50 border-rose-500/30 shadow-lg shadow-rose-500/5 hover:border-rose-500/50"
                  : "bg-card/60 hover:bg-card/80 border-border/60 hover:border-primary/30 shadow-md"
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Main Left Block: Avatar, Name, Metadata, Badges */}
                <div className="flex items-start gap-4 min-w-0 w-full lg:w-auto">
                  <Avatar className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border border-primary/30 shadow-md shrink-0">
                    <AvatarImage
                      src={
                        patient.avatarUrl ||
                        `https://api.dicebear.com/7.x/notionists/svg?seed=${patient.name}`
                      }
                      alt={patient.name}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {patient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-foreground tracking-tight truncate">
                        {patient.name}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/50">
                        {patient.age} yrs • {patient.gender}
                      </span>
                      <PriorityBadge priority={patient.priority} size="sm" />
                      <QueueBadge
                        isNext={patient.isNext}
                        position={patient.queuePosition}
                        size="sm"
                      />
                    </div>

                    {/* Appointment Time & Chief Complaint */}
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-primary flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Scheduled: {patient.appointmentTime}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                        <span className="font-semibold text-muted-foreground">Chief Complaint: </span>
                        "{patient.chiefComplaint}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vitals Pills Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto shrink-0 bg-background/50 p-2.5 rounded-2xl border border-border/40 backdrop-blur-md">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-card/60">
                    <Heart className="h-4 w-4 text-rose-500 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">BP</div>
                      <div className="text-xs font-bold text-foreground">{patient.vitals.bp}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-card/60">
                    <Activity className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">HR</div>
                      <div className="text-xs font-bold text-foreground">{patient.vitals.hr} <span className="text-[10px] font-normal">bpm</span></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-card/60">
                    <Wind className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">SpO2</div>
                      <div className="text-xs font-bold text-foreground">{patient.vitals.spo2}%</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-card/60">
                    <Thermometer className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Temp</div>
                      <div className="text-xs font-bold text-foreground">{patient.vitals.temp}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* One-Line AI Clinical Insight Bar */}
              <div className="mt-4 pt-3 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-violet-600 dark:text-violet-300 bg-violet-500/10 px-3 py-1.5 rounded-xl border border-violet-500/20 w-full sm:w-auto">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                  <span className="truncate">{patient.aiSummary}</span>
                </div>

                {/* Queue Card Action Buttons */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
                  <Button
                    onClick={() => handleOpenWorkspace(patient.id)}
                    variant="outline"
                    className="rounded-xl border-border/60 text-foreground hover:bg-muted font-semibold text-xs h-9 px-3.5 gap-1.5 flex-1 sm:flex-none"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    <span>Open Patient Workspace</span>
                  </Button>

                  <Button
                    onClick={() => handleStartConsultation(patient)}
                    className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-4 gap-2 shadow-md shadow-primary/20 hover:scale-105 transition-transform flex-1 sm:flex-none"
                  >
                    <Stethoscope className="h-3.5 w-3.5" />
                    <span>Start Consultation</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default PatientQueueSection;
