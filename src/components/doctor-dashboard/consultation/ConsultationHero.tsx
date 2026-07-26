import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import PriorityBadge from "../PriorityBadge";
import StatusBadge from "../StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Video,
  Clock,
  Droplet,
  Phone,
  ShieldCheck,
  Zap,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export interface ConsultationHeroProps {
  patientName?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  diagnosis?: string;
  appointmentTime?: string;
  sessionDuration?: string;
  physician?: string;
}

export const ConsultationHero: React.FC<ConsultationHeroProps> = ({
  patientName = "Marcus Vance",
  age = 54,
  gender = "Male",
  bloodGroup = "O Positive (O+)",
  diagnosis = "Subacute Coronary Syndrome • Coronary Artery Disease",
  appointmentTime = "08:30 AM Today",
  sessionDuration = "00:14:32",
  physician = "Dr. Sarah Jenkins, MD",
}) => {
  return (
    <DoctorGlassCard
      variant="glow"
      glowColor="primary"
      padding="lg"
      className="border-primary/30 relative overflow-hidden bg-gradient-to-r from-card/90 via-card/70 to-primary/5"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Avatar & Consultation Metadata */}
        <div className="flex items-start sm:items-center gap-5 min-w-0 flex-1">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl border-2 border-primary/40 shadow-2xl shrink-0">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${patientName}`}
              alt={patientName}
            />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-2xl rounded-3xl">
              MV
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight truncate">
                {patientName}
              </h1>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted/80 text-muted-foreground border border-border/50">
                {age} yrs • {gender}
              </span>
              <PriorityBadge priority="stat" label="STAT URGENT" />
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-1.5 animate-pulse">
                <Video className="h-3.5 w-3.5" />
                <span>LIVE TELEHEALTH</span>
              </span>
            </div>

            <div className="text-xs sm:text-sm font-semibold text-primary flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500 shrink-0" />
              <span className="truncate">{diagnosis}</span>
            </div>

            {/* Session Info & Demographics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-xl border border-border/40">
                <Droplet className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span className="font-medium">Blood: <strong className="text-foreground">{bloodGroup}</strong></span>
              </div>

              <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-xl border border-border/40">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-medium">Appt: <strong className="text-foreground">{appointmentTime}</strong></span>
              </div>

              <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-xl border border-border/40">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="font-medium truncate">Physician: <strong className="text-foreground">{physician}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Telehealth Timer & Quick Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
          <div className="px-4 py-2 rounded-2xl bg-card/80 border border-primary/30 backdrop-blur-md flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Duration:</span>
            <span className="text-base font-mono font-bold text-foreground">{sessionDuration}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={() => toast.info("Opening patient full medical record...")}
              variant="outline"
              className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-9 px-3 gap-1.5"
            >
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span>Full Medical Chart</span>
            </Button>
          </div>
        </div>

      </div>
    </DoctorGlassCard>
  );
};

export default ConsultationHero;
