import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Video,
  Calendar,
  Clock,
  Heart,
  ShieldAlert,
  CheckCircle2,
  Stethoscope,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useConsultation } from "@/context/ConsultationContext";
import { motion, AnimatePresence } from "framer-motion";

export interface PatientDirectoryCardItem {
  id: string;
  medicalId: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  primaryDiagnosis: string;
  treatmentStatus: string;
  lastConsultation: string;
  nextAppointment: string;
  riskLevel: "HIGH RISK" | "STABLE" | "MONITOR";
  assignedDoctor: string;
  vitals: { bp: string; hr: number; spo2: number };
}

export const MOCK_PATIENT_DIRECTORY: PatientDirectoryCardItem[] = [
  {
    id: "pat-101",
    medicalId: "PAT-101",
    name: "Marcus Vance",
    age: 54,
    gender: "Male",
    bloodGroup: "O Positive (O+)",
    phone: "+1 (555) 984-2091",
    primaryDiagnosis: "Subacute Coronary Syndrome • CAD",
    treatmentStatus: "Post-PCI Stent Rehab • DAPT Regimen",
    lastConsultation: "Today, 08:30 AM",
    nextAppointment: "August 10, 2026",
    riskLevel: "HIGH RISK",
    assignedDoctor: "Dr. Sarah Jenkins, MD",
    vitals: { bp: "148/92", hr: 94, spo2: 95 },
  },
  {
    id: "pat-102",
    medicalId: "PAT-102",
    name: "Elena Rostova",
    age: 48,
    gender: "Female",
    bloodGroup: "A Positive (A+)",
    phone: "+1 (555) 482-1092",
    primaryDiagnosis: "Hypertensive Crisis • Refractory BP",
    treatmentStatus: "Dual Antihypertensive Titration",
    lastConsultation: "Today, 10:00 AM",
    nextAppointment: "August 04, 2026",
    riskLevel: "HIGH RISK",
    assignedDoctor: "Dr. Sarah Jenkins, MD",
    vitals: { bp: "164/102", hr: 88, spo2: 97 },
  },
  {
    id: "pat-103",
    medicalId: "PAT-103",
    name: "David Kim",
    age: 62,
    gender: "Male",
    bloodGroup: "B Positive (B+)",
    phone: "+1 (555) 391-8420",
    primaryDiagnosis: "Paroxysmal Atrial Fibrillation",
    treatmentStatus: "Rate Control & Anticoagulation",
    lastConsultation: "Yesterday, 02:15 PM",
    nextAppointment: "August 18, 2026",
    riskLevel: "MONITOR",
    assignedDoctor: "Dr. Sarah Jenkins, MD",
    vitals: { bp: "132/84", hr: 78, spo2: 98 },
  },
  {
    id: "pat-104",
    medicalId: "PAT-104",
    name: "Sophia Patel",
    age: 39,
    gender: "Female",
    bloodGroup: "AB Positive (AB+)",
    phone: "+1 (555) 902-3148",
    primaryDiagnosis: "Post-STEMI Cardiac Rehabilitation",
    treatmentStatus: "Lipid Lowering & Exercise Titration",
    lastConsultation: "July 24, 2026",
    nextAppointment: "August 12, 2026",
    riskLevel: "STABLE",
    assignedDoctor: "Dr. Sarah Jenkins, MD",
    vitals: { bp: "120/78", hr: 72, spo2: 99 },
  },
  {
    id: "pat-105",
    medicalId: "PAT-105",
    name: "Robert Martinez",
    age: 67,
    gender: "Male",
    bloodGroup: "O Negative (O-)",
    phone: "+1 (555) 201-9482",
    primaryDiagnosis: "Decompensated Heart Failure (HFrEF)",
    treatmentStatus: "Diuretic Titration & Telemetry Sync",
    lastConsultation: "July 22, 2026",
    nextAppointment: "August 02, 2026",
    riskLevel: "HIGH RISK",
    assignedDoctor: "Dr. Sarah Jenkins, MD",
    vitals: { bp: "138/88", hr: 82, spo2: 94 },
  },
  {
    id: "pat-106",
    medicalId: "PAT-106",
    name: "Amara Johnson",
    age: 41,
    gender: "Female",
    bloodGroup: "A Negative (A-)",
    phone: "+1 (555) 782-4910",
    primaryDiagnosis: "Mitral Valve Prolapse • Regurgitation",
    treatmentStatus: "Echocardiogram Surveillance",
    lastConsultation: "July 20, 2026",
    nextAppointment: "September 01, 2026",
    riskLevel: "STABLE",
    assignedDoctor: "Dr. Sarah Jenkins, MD",
    vitals: { bp: "118/74", hr: 68, spo2: 99 },
  },
];

export interface PatientDirectoryGridProps {
  patients: PatientDirectoryCardItem[];
}

export const PatientDirectoryGrid: React.FC<PatientDirectoryGridProps> = ({ patients }) => {
  const navigate = useNavigate();
  const { startNewConsultationSession } = useConsultation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AnimatePresence>
        {patients.map((patient) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <DoctorGlassCard
              variant="default"
              padding="lg"
              className="space-y-4 hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between h-full"
            >
              {/* Header: Avatar, Name, Medical ID & Risk Badge */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <Avatar className="h-14 w-14 rounded-2xl border-2 border-primary/30 shrink-0 shadow-md">
                      <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${patient.name}`} alt={patient.name} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">MV</AvatarFallback>
                    </Avatar>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold font-mono text-muted-foreground uppercase px-2 py-0.5 rounded-md bg-muted/60">
                          {patient.medicalId}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">{patient.bloodGroup}</span>
                      </div>

                      <h3 className="text-lg font-extrabold font-heading text-foreground truncate group-hover:text-primary transition-colors">
                        {patient.name}
                      </h3>

                      <p className="text-xs text-muted-foreground font-medium">
                        {patient.age}yo {patient.gender} • Phone: {patient.phone}
                      </p>
                    </div>
                  </div>

                  {/* Risk Badge */}
                  <Badge
                    variant="outline"
                    className={`text-xs font-bold shrink-0 ${
                      patient.riskLevel === "HIGH RISK"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                        : patient.riskLevel === "MONITOR"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                    }`}
                  >
                    {patient.riskLevel}
                  </Badge>
                </div>

                {/* Primary Diagnosis Banner */}
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    Primary Clinical Diagnosis:
                  </span>
                  <div className="text-xs font-bold text-primary truncate flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span>{patient.primaryDiagnosis}</span>
                  </div>
                </div>

                {/* Current Treatment Status & Vitals Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-background/50 border border-border/40 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Regimen / Status:</span>
                    <div className="font-semibold text-foreground truncate">{patient.treatmentStatus}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-background/50 border border-border/40 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Telemetry Vitals:</span>
                    <div className="font-mono text-foreground font-bold truncate">
                      BP {patient.vitals.bp} • HR {patient.vitals.hr}
                    </div>
                  </div>
                </div>

                {/* Consult & Follow-up Dates */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/30 flex-wrap gap-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Last: <strong className="text-foreground">{patient.lastConsultation}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-emerald-500" /> Next: <strong className="text-foreground">{patient.nextAppointment}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                <Button
                  onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-3 gap-1.5 shadow-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Workspace</span>
                </Button>

                <Button
                  onClick={() => {
                    startNewConsultationSession(patient);
                    navigate("/doctor/consultations");
                  }}
                  variant="outline"
                  className="rounded-xl border-border/60 hover:bg-muted text-foreground font-semibold text-xs h-9 px-3 gap-1.5"
                >
                  <Video className="h-3.5 w-3.5 text-primary" />
                  <span>Start Consultation</span>
                </Button>
              </div>
            </DoctorGlassCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PatientDirectoryGrid;
