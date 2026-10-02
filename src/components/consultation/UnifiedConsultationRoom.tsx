import React, { useState, useEffect } from "react";
import { useConsultation, PrescriptionItem } from "@/context/ConsultationContext";
import { usePatient } from "@/context/PatientContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Video,
  Mic,
  Monitor,
  PhoneOff,
  ShieldCheck,
  Clock,
  Pill,
  Plus,
  Trash2,
  Calendar,
  Download,
  Bell,
  CheckCircle2,
  UserCheck,
  FileCheck,
  Lock,
  Printer,
  Play,
  PenLine,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface UnifiedConsultationRoomProps {
  role: "doctor" | "patient";
}

const MEAL_TIMINGS: PrescriptionItem["mealTiming"][] = [
  "Before Meal",
  "After Meal",
  "With Food",
  "At Bedtime",
  "Anytime",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const UnifiedConsultationRoom: React.FC<UnifiedConsultationRoomProps> = ({ role }) => {
  const isDoctor = role === "doctor";
  const {
    session,
    joinConsultation,
    isCallActive: _isCallActive,
    callJoined,
    setDoctorAvailable,
    updateDiagnosis,
    addPrescriptionItem,
    removePrescriptionItem,
    finalizePrescription,
    completeConsultation,
  } = useConsultation();

  const { addReminder } = usePatient();

  // Timer
  const [durationSeconds, setDurationSeconds] = useState(0);

  // Modal state
  const [isAddRxOpen, setIsAddRxOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Add-medicine form
  const [newRx, setNewRx] = useState({
    name: "",
    dosage: "",
    frequency: "Once Daily",
    duration: "7 Days",
    mealTiming: "After Meal" as PrescriptionItem["mealTiming"],
    instructions: "",
  });

  const isCompleted = session.status === "completed";
  const isDoctorAvailable = session.status === "doctor_available" || session.status === "in-progress";
  const isLiveMeetingActive = (session.status === "in-progress" || callJoined) && !isCompleted;

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isLiveMeetingActive) {
      timer = setInterval(() => setDurationSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isLiveMeetingActive]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  /* ─── Doctor: prescribing ─── */

  const handleAddMedicineSubmit = () => {
    if (!newRx.name.trim() || !newRx.dosage.trim()) {
      toast.error("Please provide medicine name and dosage");
      return;
    }

    addPrescriptionItem({
      id: `rx-${Date.now()}`,
      name: newRx.name.trim(),
      dosage: newRx.dosage.trim(),
      frequency: newRx.frequency.trim() || "Once Daily",
      duration: newRx.duration.trim() || "7 Days",
      mealTiming: newRx.mealTiming,
      instructions: newRx.instructions.trim() || "Take as directed by physician.",
    });

    setIsAddRxOpen(false);
    setNewRx({ name: "", dosage: "", frequency: "Once Daily", duration: "7 Days", mealTiming: "After Meal", instructions: "" });
  };

  const handleFinalizePrescription = () => {
    if (session.prescriptionDraft.length === 0) {
      toast.error("Add at least one medicine before finalizing the prescription");
      return;
    }
    finalizePrescription();
  };

  /* ─── Lifecycle ─── */

  const handleEndConsultation = () => {
    // Sync prescribed medicines to the patient's daily reminders
    session.prescriptionDraft.forEach((rx) => {
      addReminder({
        title: `${rx.name} (${rx.dosage})`,
        time: "08:00 AM",
        type: "Medicines",
        status: "upcoming",
        repeat: rx.frequency,
        iconName: "Pill",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      });
    });
    completeConsultation();
  };

  /* ─── Patient actions ─── */

  const handleAddMedicineToReminders = (rx: PrescriptionItem) => {
    addReminder({
      title: `${rx.name} (${rx.dosage})`,
      time: "08:00 AM",
      type: "Medicines",
      status: "upcoming",
      repeat: rx.frequency,
      iconName: "Pill",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    });
    toast.success(`Added ${rx.name} to your Daily Reminders!`, {
      description: `Schedule set to ${rx.frequency} (${rx.mealTiming}).`,
    });
  };

  const handleDownloadPdf = () => {
    setIsPdfModalOpen(true);
  };

  /* ─────────────────── RENDER ─────────────────── */

  return (
    <div className="w-full space-y-6">
      {/* ─── 1. CONSULTATION HEADER ─── */}
      <div className="rounded-[2.5rem] bg-card/70 border border-border/50 backdrop-blur-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-violet-500 to-emerald-500" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              {isCompleted ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCheck className="h-4 w-4" />
                  <span>Consultation Completed</span>
                </span>
              ) : isLiveMeetingActive ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Live Video Meeting Active</span>
                </span>
              ) : isDoctorAvailable ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Doctor is Available</span>
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Scheduled • Waiting for Doctor</span>
                </span>
              )}

              <Badge variant="outline" className="text-xs font-semibold border-border/60">
                Session ID: {session.sessionId}
              </Badge>

              {isDoctor ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Doctor Workspace</span>
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30 flex items-center gap-1.5">
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>Patient Synchronized View</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
              Consultation: {session.doctor.name} & {session.patient.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" /> Scheduled: Today, 02:30 PM
              </span>
              <span>•</span>
              {isLiveMeetingActive ? (
                <span className="flex items-center gap-1.5 font-mono font-bold text-foreground">
                  <Clock className="h-4 w-4 text-rose-500 animate-pulse" /> Live Duration: {formatDuration(durationSeconds)}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Video Consultation
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto flex-wrap">
            {isCompleted ? (
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <Badge variant="outline" className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border-emerald-500/30 py-2 px-3 gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Meeting Closed
                </Badge>
                <Button
                  onClick={handleDownloadPdf}
                  className="rounded-2xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-white font-bold text-xs h-11 px-5 shadow-lg shadow-primary/20 gap-2 cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Export Prescription PDF</span>
                </Button>
              </div>
            ) : isLiveMeetingActive ? (
              <div className="flex items-center gap-2 w-full lg:w-auto">
                {isDoctor && (
                  <Button
                    onClick={handleEndConsultation}
                    className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-11 px-5 shadow-lg shadow-rose-600/20 gap-2 cursor-pointer"
                  >
                    <PhoneOff className="h-4 w-4" />
                    <span>End Consultation</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full lg:w-auto">
                {isDoctor && !isDoctorAvailable && (
                  <Button
                    onClick={() => setDoctorAvailable(true)}
                    variant="outline"
                    className="rounded-2xl border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10 font-bold text-xs h-11 px-4 gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Mark Doctor Available</span>
                  </Button>
                )}

                <Button
                  disabled={!isDoctorAvailable}
                  onClick={() => joinConsultation(session.sessionId)}
                  className={`rounded-2xl font-bold text-xs h-11 px-6 gap-2 shadow-xl transition-all ${
                    isDoctorAvailable
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 cursor-pointer"
                      : "bg-muted text-muted-foreground border border-border/50 cursor-not-allowed opacity-60"
                  }`}
                >
                  <Play className="h-4 w-4" />
                  <span>{isDoctorAvailable ? "Join Consultation Now" : "Waiting for Doctor..."}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/40 flex items-center text-xs font-medium text-muted-foreground">
          <span className="text-foreground font-semibold">{session.liveStatusMessage}</span>
        </div>
      </div>

      {/* ─── 2. MAIN AREA: VIDEO + PRESCRIPTION ─── */}
      <div className={`grid grid-cols-1 gap-6 ${isLiveMeetingActive ? "lg:grid-cols-5" : ""}`}>
        {/* Video Meeting (live only) */}
        <AnimatePresence>
          {isLiveMeetingActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-3 rounded-[2.5rem] bg-slate-950 border border-border/80 overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4 self-start"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                  <h3 className="text-sm font-bold text-white font-heading">Live Video Meeting</h3>
                </div>
                <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/40 bg-emerald-500/10">
                  Encrypted Session
                </Badge>
              </div>

              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 min-h-[320px] sm:min-h-[400px] flex flex-col justify-between p-6">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-[90px] pointer-events-none" />

                {/* Remote stream (the other participant) */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto space-y-4">
                  <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />
                    <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border-4 border-primary/50 shadow-2xl relative z-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${isDoctor ? session.patient.name : session.doctor.name}`}
                        alt={isDoctor ? session.patient.name : session.doctor.name}
                      />
                      <AvatarFallback className="bg-primary text-white font-bold text-2xl">
                        {getInitials(isDoctor ? session.patient.name : session.doctor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 border border-primary/40 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>{isDoctor ? `${session.patient.name} (Patient)` : `${session.doctor.name}`}</span>
                    </div>
                  </motion.div>

                  <div className="space-y-1 z-10">
                    <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
                      {isDoctor ? session.patient.name : session.doctor.name}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      {isDoctor ? `${session.patient.age} yrs • ${session.patient.gender} • ${session.patient.bloodGroup}` : `${session.doctor.specialty} • ${session.doctor.hospital}`}
                    </p>
                  </div>
                </div>

                {/* Self view PiP */}
                <div className="absolute bottom-16 right-4 sm:bottom-20 sm:right-6 w-32 sm:w-40 h-24 sm:h-28 rounded-2xl bg-slate-950/90 border-2 border-primary/40 overflow-hidden shadow-2xl z-20 flex flex-col items-center justify-center text-center">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border border-white/20">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${isDoctor ? session.doctor.name : session.patient.name}`}
                      alt={isDoctor ? session.doctor.name : session.patient.name}
                    />
                    <AvatarFallback className="bg-primary/40 text-white text-xs font-bold">
                      {getInitials(isDoctor ? session.doctor.name : session.patient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[10px] text-slate-300 font-bold mt-1">You</span>
                </div>

                {/* Control bar */}
                <div className="relative z-30 pt-4 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 gap-1.5">
                      <Mic className="h-4 w-4 text-emerald-400" />
                      <span>Mic Active</span>
                    </Button>
                    <Button size="sm" className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 gap-1.5">
                      <Video className="h-4 w-4 text-emerald-400" />
                      <span>Camera Active</span>
                    </Button>
                    <Button size="sm" className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 gap-1.5 hidden sm:flex">
                      <Monitor className="h-4 w-4 text-white" />
                      <span>Share Screen</span>
                    </Button>
                  </div>

                  {isDoctor && (
                    <Button
                      onClick={handleEndConsultation}
                      size="sm"
                      className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs gap-1.5 shadow-lg"
                    >
                      <PhoneOff className="h-4 w-4" />
                      <span>End Consultation</span>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── 3. PRESCRIPTION PANEL ─── */}
        <div className={`${isLiveMeetingActive ? "lg:col-span-2" : ""} rounded-[2.5rem] bg-card/70 border border-border/50 backdrop-blur-2xl p-6 sm:p-7 shadow-xl space-y-5 self-start`}>
          <div className="space-y-3 border-b border-border/40 pb-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-lg font-extrabold font-heading text-foreground tracking-tight flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                <span>Prescription</span>
              </h2>
              <div className="flex items-center gap-2">
                {session.prescriptionFinalized && (
                  <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold text-[10px] gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Finalized
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5">
                  {session.prescriptionDraft.length} {session.prescriptionDraft.length === 1 ? "Medicine" : "Medicines"}
                </Badge>
              </div>
            </div>

            {/* Diagnosis row */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                Diagnosis
              </span>
              {isDoctor && !isCompleted ? (
                <Input
                  value={session.diagnosis}
                  onChange={(e) => updateDiagnosis(e.target.value)}
                  placeholder="e.g. Stage 2 Essential Hypertension"
                  className="text-xs bg-background/60 border-border/50 rounded-xl h-9"
                />
              ) : (
                <p className="text-sm font-semibold text-foreground bg-background/40 px-3 py-2 rounded-xl border border-border/40">
                  {session.diagnosis}
                </p>
              )}
            </div>

            {/* Panel actions */}
            {isDoctor && !isCompleted ? (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsAddRxOpen(true)}
                  className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs h-9 px-3.5 gap-1.5 shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Medicine</span>
                </Button>
                <Button
                  onClick={handleFinalizePrescription}
                  disabled={session.prescriptionFinalized}
                  variant="outline"
                  className="rounded-xl border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10 font-bold text-xs h-9 px-3.5 gap-1.5 disabled:opacity-50"
                >
                  <PenLine className="h-4 w-4" />
                  <span>{session.prescriptionFinalized ? "Signed" : "Finalize & Sign"}</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleDownloadPdf}
                variant="outline"
                className="w-full rounded-xl border-border/60 text-xs font-semibold h-9 gap-1.5"
              >
                <Download className="h-4 w-4 text-primary" />
                <span>Download Rx PDF</span>
              </Button>
            )}
          </div>

          {/* Medicines list */}
          <div className={`space-y-3 ${isLiveMeetingActive ? "max-h-[480px] overflow-y-auto pr-1" : ""}`}>
            {session.prescriptionDraft.map((rx) => (
              <div
                key={rx.id}
                className="p-4 rounded-2xl bg-card/50 border border-border/60 space-y-2.5 relative hover:border-primary/40 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-foreground font-heading">{rx.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                        {rx.dosage}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">{rx.frequency}</span>
                      <span className="text-xs font-semibold text-muted-foreground">• {rx.duration}</span>
                    </div>
                  </div>

                  {isDoctor && !isCompleted ? (
                    <Button
                      onClick={() => removePrescriptionItem(rx.id)}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleAddMedicineToReminders(rx)}
                      size="sm"
                      className="rounded-lg bg-primary/15 text-primary hover:bg-primary hover:text-white font-bold text-[10px] h-7 px-2.5 gap-1 transition-all border border-primary/30 shrink-0"
                    >
                      <Bell className="h-3 w-3" />
                      <span>Remind Me</span>
                    </Button>
                  )}
                </div>

                <p className="text-xs text-foreground/90 font-medium bg-background/50 p-2 rounded-xl border border-border/30">
                  <strong className="text-muted-foreground">Timing: </strong>{rx.mealTiming} • {rx.instructions}
                </p>
              </div>
            ))}

            {session.prescriptionDraft.length === 0 && (
              <div className="py-8 text-center text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-card/30 px-4">
                <Pill className="h-8 w-8 mx-auto mb-2 opacity-40 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">No medications prescribed yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isDoctor
                    ? "Click 'Add Medicine' to prescribe medication for this patient."
                    : "Prescribed medications will appear here once issued by your doctor."}
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <p className="text-[10px] text-muted-foreground pt-1 border-t border-border/40">
            {isCompleted
              ? "Prescription signed and automatically added to the patient's daily reminders."
              : isDoctor
              ? "Medicines you add here appear on the patient's view in real time. Finalize to sign."
              : "Official prescription issued by your attending physician."}
          </p>
        </div>
      </div>

      {/* ─── DIALOGS ─── */}

      {/* Add Medicine (Doctor) */}
      <Dialog open={isAddRxOpen} onOpenChange={setIsAddRxOpen}>
        <DialogContent className="rounded-3xl border-border/60 bg-card/95 backdrop-blur-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-lg">Add Medicine to Prescription</DialogTitle>
            <DialogDescription className="text-xs">
              Set dosage and administration instructions for {session.patient.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Medicine Name</label>
              <Input
                placeholder="e.g. Amoxicillin Trihydrate"
                value={newRx.name}
                onChange={(e) => setNewRx({ ...newRx, name: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold block mb-1">Dosage</label>
                <Input
                  placeholder="e.g. 500 mg"
                  value={newRx.dosage}
                  onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })}
                  className="rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Frequency</label>
                <Input
                  placeholder="e.g. Twice Daily"
                  value={newRx.frequency}
                  onChange={(e) => setNewRx({ ...newRx, frequency: e.target.value })}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold block mb-1">Duration</label>
                <Input
                  placeholder="e.g. 7 Days"
                  value={newRx.duration}
                  onChange={(e) => setNewRx({ ...newRx, duration: e.target.value })}
                  className="rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Meal Timing</label>
                <Select
                  value={newRx.mealTiming}
                  onValueChange={(v) => setNewRx({ ...newRx, mealTiming: v as PrescriptionItem["mealTiming"] })}
                >
                  <SelectTrigger className="rounded-xl text-xs h-9">
                    <SelectValue placeholder="Select timing" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAL_TIMINGS.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="font-semibold block mb-1">Instructions</label>
              <Textarea
                placeholder="e.g. Take with a full glass of water after food."
                value={newRx.instructions}
                onChange={(e) => setNewRx({ ...newRx, instructions: e.target.value })}
                className="rounded-xl text-xs h-20 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddMedicineSubmit} className="w-full rounded-2xl bg-primary text-white font-bold text-xs h-10">
              Add Medicine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prescription PDF Export */}
      <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
        <DialogContent className="rounded-3xl border-border/60 bg-card/98 backdrop-blur-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-xl flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" />
              <span>Official Prescription (PDF Export)</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Clinical record for {session.patient.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 rounded-2xl bg-white text-slate-900 space-y-6 text-xs shadow-inner">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 font-heading">MEDSCOPE HEALTH PLATFORM</h2>
                <p className="text-[10px] text-slate-500 font-medium">Digital Prescription Record</p>
                <p className="text-[10px] text-slate-500">{session.doctor.hospital}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">{session.doctor.name}</p>
                <p className="text-[10px] text-slate-500">{session.doctor.specialty}</p>
                <p className="text-[10px] text-slate-500">License: {session.doctor.licenseNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Patient Information</p>
                <p className="font-bold text-slate-900 text-sm">{session.patient.name}</p>
                <p className="text-[11px] text-slate-600">
                  Age: {session.patient.age} • Gender: {session.patient.gender} • Blood Group: {session.patient.bloodGroup}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Session Details</p>
                <p className="font-bold text-slate-900 text-sm">Session ID: {session.sessionId}</p>
                <p className="text-[11px] text-slate-600">Date: Today, 02:30 PM</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">Diagnosis</h3>
              <p className="font-semibold text-slate-800">{session.diagnosis}</p>
            </div>

            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">Prescribed Medications</h3>
              <div className="space-y-2">
                {session.prescriptionDraft.map((rx, idx) => (
                  <div key={rx.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-900">{idx + 1}. {rx.name} — {rx.dosage}</p>
                    <p className="text-[11px] text-slate-600">
                      Frequency: {rx.frequency} | Duration: {rx.duration} | Timing: {rx.mealTiming}
                    </p>
                    <p className="text-[11px] text-slate-600 italic">Instructions: {rx.instructions}</p>
                  </div>
                ))}
                {session.prescriptionDraft.length === 0 && (
                  <p className="text-slate-500 italic">No medications prescribed.</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <div className="text-[10px] text-slate-400">
                Generated by Medscope Consultation Room
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400">Physician Signature</p>
                <p className="font-serif italic font-bold text-slate-900 text-sm">{session.doctor.name}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                window.print();
                setIsPdfModalOpen(false);
              }}
              className="w-full rounded-2xl bg-primary text-white font-bold text-xs h-10 gap-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save PDF File</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnifiedConsultationRoom;
