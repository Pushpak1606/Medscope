import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import { Sparkles, Calendar, Clock, Stethoscope, CheckCircle2, UserCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export interface ScheduleHeroProps {
  doctorName?: string;
  shiftHours?: string;
  consultationCount?: number;
  followupCount?: number;
  pendingTasksCount?: number;
}

export const ScheduleHero: React.FC<ScheduleHeroProps> = ({
  doctorName = "Dr. Sarah Jenkins",
  shiftHours = "08:00 AM - 04:00 PM • Active Shift",
  consultationCount = 8,
  followupCount = 3,
  pendingTasksCount = 4,
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DoctorGlassCard
      variant="glow"
      glowColor="primary"
      padding="lg"
      className="border-primary/30 relative overflow-hidden bg-gradient-to-r from-card/90 via-card/70 to-primary/5"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Date, Doctor & Shift Details */}
        <div className="space-y-2 max-w-2xl min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {currentDate}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {shiftHours}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground tracking-tight truncate">
            Clinical Command Center
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
            Good morning, {doctorName}. You have <strong className="text-foreground">{consultationCount} consultations</strong>, <strong className="text-foreground">{followupCount} follow-ups</strong>, and <strong className="text-foreground">{pendingTasksCount} clinical tasks</strong> scheduled today.
          </p>
        </div>

        {/* Right Side: Key Metrics Pill Counters */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 pt-2 md:pt-0">
          <div className="px-4 py-3 rounded-2xl bg-card/80 border border-border/50 backdrop-blur-md text-center">
            <div className="text-2xl font-extrabold font-heading text-primary">{consultationCount}</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Consultations</div>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-card/80 border border-border/50 backdrop-blur-md text-center">
            <div className="text-2xl font-extrabold font-heading text-amber-500">{followupCount}</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Follow-ups</div>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-card/80 border border-border/50 backdrop-blur-md text-center">
            <div className="text-2xl font-extrabold font-heading text-violet-500">{pendingTasksCount}</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tasks</div>
          </div>
        </div>

      </div>
    </DoctorGlassCard>
  );
};

export default ScheduleHero;
