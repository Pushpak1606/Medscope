import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import PriorityBadge, { PriorityLevel } from "../PriorityBadge";
import StatusBadge from "../StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Video,
  UserCheck,
  Stethoscope,
  ChevronRight,
  FileText,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface AppointmentCardData {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  avatarUrl?: string;
  time: string;
  duration: string;
  mode: "Virtual Telehealth" | "In-Person Exam";
  location: string;
  priority: PriorityLevel;
  status: "waiting" | "in-consultation" | "active" | "completed" | "pending";
  quickNote: string;
}

const MOCK_APPOINTMENTS: AppointmentCardData[] = [
  {
    id: "apt-101",
    patientId: "pat-101",
    patientName: "Marcus Vance",
    age: 54,
    gender: "Male",
    time: "08:30 AM",
    duration: "30 min",
    mode: "Virtual Telehealth",
    location: "Exam Room 3B (Virtual)",
    priority: "stat",
    status: "waiting",
    quickNote: "Acute chest pressure on exertion for 2 hours. Troponin T: 0.14 ng/mL. ECG ST elevation V2-V4.",
  },
  {
    id: "apt-102",
    patientId: "pat-102",
    patientName: "Eleanor Vance",
    age: 62,
    gender: "Female",
    time: "09:15 AM",
    duration: "30 min",
    mode: "In-Person Exam",
    location: "Building A, Exam Room 2",
    priority: "high",
    status: "pending",
    quickNote: "Post-PCI coronary stent 3-month follow-up evaluation. INR test: 2.4.",
  },
  {
    id: "apt-103",
    patientId: "pat-103",
    patientName: "David Chen",
    age: 41,
    gender: "Male",
    time: "10:00 AM",
    duration: "20 min",
    mode: "Virtual Telehealth",
    location: "Virtual Room 1",
    priority: "routine",
    status: "pending",
    quickNote: "Type 2 Diabetes Rx renewal & mild ankle edema assessment. HbA1c: 6.8%.",
  },
  {
    id: "apt-104",
    patientId: "pat-104",
    patientName: "Sarah Miller",
    age: 49,
    gender: "Female",
    time: "11:30 AM",
    duration: "30 min",
    mode: "Virtual Telehealth",
    location: "Virtual Room 2",
    priority: "high",
    status: "pending",
    quickNote: "24-hour ambulatory Holter monitor telemetry review. 4 non-sustained ventricular runs.",
  },
  {
    id: "apt-105",
    patientId: "pat-105",
    patientName: "Robert Garcia",
    age: 58,
    gender: "Male",
    time: "01:30 PM",
    duration: "30 min",
    mode: "In-Person Exam",
    location: "Building A, Exam Room 1",
    priority: "routine",
    status: "pending",
    quickNote: "Essential hypertension medication titration follow-up. BP telemetry average 136/84.",
  },
];

import { useConsultation } from "@/context/ConsultationContext";

export const TodayTimelineSection: React.FC = () => {
  const navigate = useNavigate();
  const { startNewConsultationSession } = useConsultation();

  const handleOpenWorkspace = (patientId: string, name: string) => {
    toast.info(`Opening Patient Workspace for ${name}...`);
    navigate(`/doctor/patients/${patientId}`);
  };

  const handleStartConsultation = (patientId: string, name: string) => {
    startNewConsultationSession({ id: patientId, name });
    navigate("/doctor/consultations");
  };

  return (
    <section aria-label="Today's Timeline Section" className="space-y-6">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Today's Appointment Timeline"
          subtitle="Spacious clinical timeline of today's scheduled consultations & in-person exams."
          badge={<StatusBadge status="active" label="5 Appointments Remaining" />}
        />

        {/* Spacious Appointment Cards Container */}
        <div className="space-y-5">
          {MOCK_APPOINTMENTS.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 border backdrop-blur-xl ${
                apt.priority === "stat"
                  ? "bg-gradient-to-r from-rose-500/10 via-card/70 to-card/50 border-rose-500/30 shadow-lg hover:border-rose-500/50"
                  : "bg-card/60 hover:bg-card/80 border-border/60 hover:border-primary/30 shadow-md"
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                {/* Left Block: Time, Avatar, Name & Mode */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border/50 text-center shrink-0 min-w-[80px]">
                    <div className="text-sm font-extrabold font-heading text-primary">{apt.time}</div>
                    <div className="text-[10px] font-semibold text-muted-foreground">{apt.duration}</div>
                  </div>

                  <Avatar className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border border-primary/30 shadow-md shrink-0">
                    <AvatarImage
                      src={apt.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${apt.patientName}`}
                      alt={apt.patientName}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {apt.patientName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-foreground tracking-tight truncate">
                        {apt.patientName}
                      </h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/50">
                        {apt.age} yrs • {apt.gender}
                      </span>
                      <PriorityBadge priority={apt.priority} size="sm" />
                      <StatusBadge status={apt.status} size="sm" />
                    </div>

                    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1 text-primary font-semibold">
                        {apt.mode === "Virtual Telehealth" ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                        {apt.mode}
                      </span>
                      <span>•</span>
                      <span>{apt.location}</span>
                    </div>

                    {/* Quick Note */}
                    <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed bg-background/40 p-2.5 rounded-xl border border-border/30">
                      <strong className="text-muted-foreground font-semibold">Quick Note: </strong>
                      "{apt.quickNote}"
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2.5 w-full lg:w-auto shrink-0 justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-border/40">
                  <Button
                    onClick={() => handleOpenWorkspace(apt.patientId, apt.patientName)}
                    variant="outline"
                    className="rounded-xl border-border/60 text-foreground hover:bg-muted font-semibold text-xs h-9 px-3.5 gap-1.5 flex-1 lg:flex-none"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    <span>Open Patient Workspace</span>
                  </Button>

                  <Button
                    onClick={() => handleStartConsultation(apt.patientId, apt.patientName)}
                    className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-4 gap-2 shadow-md shadow-primary/20 hover:scale-105 transition-transform flex-1 lg:flex-none"
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

export default TodayTimelineSection;
