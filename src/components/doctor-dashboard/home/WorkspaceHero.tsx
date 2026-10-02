import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Calendar, Clock, Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useDoctor } from "@/context/DoctorContext";

export interface WorkspaceHeroProps {
  doctorName?: string;
  specialization?: string;
  hospital?: string;
  shiftHours?: string;
  avatarUrl?: string;
}

export const WorkspaceHero: React.FC<WorkspaceHeroProps> = ({
  doctorName,
  specialization,
  hospital,
  shiftHours = "08:00 AM - 04:00 PM • Active Shift",
  avatarUrl,
}) => {
  // Real signed-in doctor profile (hydrated from doctors/{uid} in Firestore)
  const { doctorProfile } = useDoctor();
  const name = doctorName || doctorProfile.fullName;
  const parts = [doctorProfile.subSpecialty, doctorProfile.specialty].filter(
    (s, i, arr) => s && s.trim() && arr.findIndex((o) => o.toLowerCase() === s.toLowerCase()) === i
  );
  const spec = specialization || parts.join(" • ");
  const hosp = hospital || doctorProfile.hospital;
  const initials = name
    .replace(/^Dr\.\s*/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  // Format current date cleanly (e.g., "Sunday, July 26, 2026")
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <DoctorGlassCard
      variant="glow"
      glowColor="primary"
      padding="lg"
      className="border-primary/25 relative overflow-hidden bg-gradient-to-r from-card/80 via-card/60 to-primary/5"
    >
      {/* Decorative subtle background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Side: Avatar & Doctor Info */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary to-indigo-500 blur-md opacity-40 animate-pulse" />
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl border-2 border-primary/40 shadow-xl relative z-10">
              <AvatarImage
                src={avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${name}`}
                alt={name}
              />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl rounded-3xl">
                {initials || "DR"}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center text-[10px] text-white z-20">
              <CheckCircle2 className="h-3 w-3" />
            </span>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3 text-primary" /> {currentDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground tracking-tight truncate">
              {greetingTime}, {name}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {spec}
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground/90 pt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                {hosp}
              </span>
              <span className="hidden sm:inline text-border">•</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <Clock className="h-3.5 w-3.5" />
                {shiftHours}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Shift Status Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-card/70 border border-border/60 backdrop-blur-md flex items-center gap-2 text-xs font-semibold text-foreground shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Clinic Shift Active</span>
          </div>
        </div>

      </div>
    </DoctorGlassCard>
  );
};

export default WorkspaceHero;
