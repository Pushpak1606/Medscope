import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import PriorityBadge from "../PriorityBadge";
import StatusBadge from "../StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Heart,
  AlertTriangle,
  Phone,
  UserCheck,
  Stethoscope,
  Pill,
  FileText,
  Calendar,
  ShieldAlert,
  Droplet,
} from "lucide-react";
import { toast } from "sonner";

export interface PatientHeroData {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatarUrl?: string;
  bloodGroup: string;
  primaryDiagnosis: string;
  riskLevel: "stat" | "high" | "medium" | "low";
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  primaryPhysician: string;
}

const DEFAULT_PATIENT: PatientHeroData = {
  id: "pat-101",
  name: "Marcus Vance",
  age: 54,
  gender: "Male",
  bloodGroup: "O Positive (O+)",
  primaryDiagnosis: "Subacute Coronary Syndrome • Coronary Artery Disease",
  riskLevel: "stat",
  allergies: ["Penicillin (Severe Anaphylaxis)", "Shellfish (Urticaria)"],
  emergencyContact: {
    name: "Sarah Vance",
    relationship: "Wife",
    phone: "+1 (555) 234-5678",
  },
  primaryPhysician: "Dr. Sarah Jenkins, MD (Cardiology)",
};

export interface PatientWorkspaceHeroProps {
  patient?: PatientHeroData;
  onStartConsultation?: () => void;
  onWritePrescription?: () => void;
}

export const PatientWorkspaceHero: React.FC<PatientWorkspaceHeroProps> = ({
  patient = DEFAULT_PATIENT,
  onStartConsultation,
  onWritePrescription,
}) => {
  return (
    <DoctorGlassCard
      variant="glow"
      glowColor="primary"
      padding="lg"
      className="border-primary/30 relative overflow-hidden bg-gradient-to-r from-card/90 via-card/70 to-primary/5"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Avatar & Demographics */}
        <div className="flex items-start sm:items-center gap-5 min-w-0 flex-1">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl border-2 border-primary/40 shadow-2xl shrink-0">
            <AvatarImage
              src={patient.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${patient.name}`}
              alt={patient.name}
            />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-2xl rounded-3xl">
              MV
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground tracking-tight truncate">
                {patient.name}
              </h1>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted/80 text-muted-foreground border border-border/50">
                {patient.age} yrs • {patient.gender}
              </span>
              <PriorityBadge priority={patient.riskLevel} label="HIGH CLINICAL RISK" />
              <StatusBadge status="in-consultation" label="Exam Room 3B" />
            </div>

            <div className="text-xs sm:text-sm font-semibold text-primary flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500 shrink-0" />
              <span className="truncate">{patient.primaryDiagnosis}</span>
            </div>

            {/* Demographics & Emergency Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-xl border border-border/40">
                <Droplet className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span className="font-medium">Blood: <strong className="text-foreground">{patient.bloodGroup}</strong></span>
              </div>

              <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-xl border border-border/40">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="font-medium truncate">Allergies: <strong className="text-rose-500">{patient.allergies.join(", ")}</strong></span>
              </div>

              <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-xl border border-border/40">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-medium truncate">ICE: <strong className="text-foreground">{patient.emergencyContact.name} ({patient.emergencyContact.phone})</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Actions for Hero */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
          <Button
            onClick={onStartConsultation || (() => toast.success(`Starting live consultation session with ${patient.name}`))}
            className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 h-11 shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <Stethoscope className="h-4 w-4" />
            <span>Start Consultation</span>
          </Button>

          <Button
            onClick={onWritePrescription || (() => toast.info(`Opening Rx prescription module for ${patient.name}`))}
            variant="outline"
            className="rounded-2xl border-border/60 hover:bg-muted text-foreground font-semibold px-4 h-10 flex items-center justify-center gap-2 text-xs"
          >
            <Pill className="h-4 w-4 text-primary" />
            <span>Add Medicine</span>
          </Button>
        </div>

      </div>
    </DoctorGlassCard>
  );
};

export default PatientWorkspaceHero;
