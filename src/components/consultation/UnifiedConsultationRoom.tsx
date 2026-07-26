import React, { useState, useEffect } from "react";
import { useConsultation, PrescriptionItem, ReportItem } from "@/context/ConsultationContext";
import { usePatient } from "@/context/PatientContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  ShieldCheck,
  Clock,
  Sparkles,
  Pill,
  Plus,
  Trash2,
  FileText,
  Calendar,
  Utensils,
  Download,
  Bell,
  CheckCircle2,
  Eye,
  Activity,
  AlertCircle,
  FileCheck,
  UserCheck,
  Lock,
  Printer,
  Flame,
  Droplets,
  Maximize2,
  Play,
  RotateCcw,
  Check,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface UnifiedConsultationRoomProps {
  role: "doctor" | "patient";
}

export const UnifiedConsultationRoom: React.FC<UnifiedConsultationRoomProps> = ({ role }) => {
  const isDoctor = role === "doctor";
  const {
    session,
    joinConsultation,
    endCall,
    isCallActive,
    callJoined,
    setDoctorAvailable,
    updateDiagnosis,
    addPrescriptionItem,
    removePrescriptionItem,
    finalizePrescription,
    updateSOAPNotes,
    toggleShareDoctorNotes,
    updateDietPlan,
    togglePatientFollowingDiet,
    addUploadedReport,
    deleteUploadedReport,
    updateFollowupPlan,
    addTimelineEvent,
    completeConsultation,
  } = useConsultation();

  const { addReminder, addDoctorRecord } = usePatient();

  // Local state for modals & forms
  const [durationSeconds, setDurationSeconds] = useState(255);
  const [isAddRxOpen, setIsAddRxOpen] = useState(false);
  const [isUploadReportOpen, setIsUploadReportOpen] = useState(false);
  const [isPreviewReportOpen, setIsPreviewReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  // Form states
  const [newRx, setNewRx] = useState({
    name: "",
    dosage: "",
    frequency: "Once Daily",
    duration: "7 Days",
    mealTiming: "After Meal" as const,
    instructions: "",
  });

  const [newReport, setNewReport] = useState({
    title: "",
    type: "Laboratory PDF",
    summary: "",
  });

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
  });

  const [dietForm, setDietForm] = useState(session.dietPlan);
  const [followupForm, setFollowupForm] = useState(session.followupPlan);

  // Status flags
  const isCompleted = session.status === "completed";
  const isDoctorAvailable = session.status === "doctor_available" || session.status === "in-progress";
  const isLiveMeetingActive = (session.status === "in-progress" || callJoined) && !isCompleted;

  // Timer counter
  useEffect(() => {
    let timer: any;
    if (isLiveMeetingActive) {
      timer = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLiveMeetingActive]);

  // Sync form state when context changes
  useEffect(() => {
    setDietForm(session.dietPlan);
  }, [session.dietPlan]);

  useEffect(() => {
    setFollowupForm(session.followupPlan);
  }, [session.followupPlan]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Doctor Action Handlers
  const handleAddMedicineSubmit = () => {
    if (!newRx.name.trim() || !newRx.dosage.trim()) {
      toast.error("Please provide medicine name and dosage");
      return;
    }
    addPrescriptionItem({
      id: `rx-${Date.now()}`,
      name: newRx.name,
      dosage: newRx.dosage,
      frequency: newRx.frequency,
      duration: newRx.duration,
      mealTiming: newRx.mealTiming,
      instructions: newRx.instructions || "Take as directed by physician.",
      aiSafetyChecked: true,
    });
    setIsAddRxOpen(false);
    setNewRx({ name: "", dosage: "", frequency: "Once Daily", duration: "7 Days", mealTiming: "After Meal", instructions: "" });
  };

  const handleUploadReportSubmit = () => {
    if (!newReport.title.trim()) {
      toast.error("Please provide report title");
      return;
    }
    const reportItem: ReportItem = {
      id: `rep-${Date.now()}`,
      title: newReport.title,
      type: newReport.type,
      date: "Today, Just now",
      summary: newReport.summary || "Clinical diagnostic document attached during consultation.",
    };
    addUploadedReport(reportItem);

    // Auto-sync to Patient Health Records
    addDoctorRecord({
      title: reportItem.title,
      type: reportItem.type,
      category: "Cardiology",
      date: reportItem.date,
      summary: reportItem.summary,
    });

    setIsUploadReportOpen(false);
    setNewReport({ title: "", type: "Laboratory PDF", summary: "" });
  };

  const handleSaveDietPlan = () => {
    updateDietPlan(dietForm);
  };

  const handleSaveFollowupPlan = () => {
    updateFollowupPlan(followupForm);
  };

  const handleAddMilestoneSubmit = () => {
    if (!newMilestone.title.trim()) return;
    addTimelineEvent({
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "diagnosis",
      actor: "doctor",
      title: newMilestone.title,
      description: newMilestone.description || "Clinical milestone documented by doctor.",
    });
    setIsTimelineModalOpen(false);
    setNewMilestone({ title: "", description: "" });
    toast.success("Timeline milestone added");
  };

  const handleEndConsultation = () => {
    // Automatically auto-add medicines to patient reminders on completion
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

    // Auto-add follow-up appointment to patient calendar
    if (session.followupPlan.nextAppointmentDate) {
      addReminder({
        title: `Follow-up: ${session.doctor.name}`,
        time: "10:00 AM",
        type: "Appointments",
        status: "upcoming",
        repeat: "One-time",
        iconName: "Calendar",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      });
    }

    completeConsultation();
  };

  // Patient Action Handlers
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

  const handleAddFollowupToCalendar = () => {
    addReminder({
      title: `Follow-up: ${session.doctor.name}`,
      time: "10:00 AM",
      type: "Appointments",
      status: "upcoming",
      repeat: "One-time",
      iconName: "Calendar",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    });
    toast.success("Follow-up appointment added to your Medscope Calendar!", {
      description: `Date: ${session.followupPlan.nextAppointmentDate}`,
    });
  };

  const handleDownloadPdf = () => {
    toast.success("Generating Official Consultation Summary PDF...");
    setIsPdfModalOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* ─── 1. CONSULTATION HEADER & LIFECYCLE STATUS ─── */}
      <div className="rounded-[2.5rem] bg-card/70 border border-border/50 backdrop-blur-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-violet-500 to-emerald-500" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            {/* Status Badges Row */}
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

            {/* Title & Participants */}
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
              Consultation Room: {session.doctor.name} & {session.patient.name}
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
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> HIPAA 1080p Encrypted Telehealth
                </span>
              )}
            </div>
          </div>

          {/* Action Area: Join Consultation / Export Summary */}
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
                  <span>Export Consultation PDF</span>
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
                <Button
                  onClick={handleDownloadPdf}
                  variant="outline"
                  className="rounded-2xl border-border/60 font-semibold text-xs h-11 px-4 gap-2"
                >
                  <Printer className="h-4 w-4 text-primary" />
                  <span>Summary PDF</span>
                </Button>
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
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 cursor-pointer animate-pulse-subtle"
                      : "bg-muted text-muted-foreground border border-border/50 cursor-not-allowed opacity-60"
                  }`}
                >
                  <Play className="h-4 w-4" />
                  <span>
                    {isDoctorAvailable ? "Join Consultation Now" : "Waiting for Doctor..."}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Status Lifecycle Message Banner */}
        <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse shrink-0" />
            <span className="text-foreground font-semibold">{session.liveStatusMessage}</span>
          </div>

          {!isCompleted && !isLiveMeetingActive && (
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Video meeting interface will open automatically upon joining session.
            </span>
          )}
        </div>
      </div>

      {/* ─── 2. VIDEO MEETING INTERFACE (EXISTS ONLY DURING ACTIVE CONSULTATION) ─── */}
      <AnimatePresence>
        {isLiveMeetingActive && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="rounded-[2.5rem] bg-slate-950 border border-border/80 overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                <h3 className="text-sm font-bold text-white font-heading">
                  1080p HD Encrypted WebRTC Video Meeting
                </h3>
              </div>
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/40 bg-emerald-500/10">
                Exam Room 3B • Live Stream
              </Badge>
            </div>

            {/* Video Canvas Container */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 min-h-[360px] sm:min-h-[420px] flex flex-col justify-between p-6">
              {/* Ambient Glows */}
              <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-[90px] pointer-events-none" />

              {/* Doctor Video Stream (Main View) */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto space-y-4">
                <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />
                  <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border-4 border-primary/50 shadow-2xl relative z-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${session.doctor.name}`} alt={session.doctor.name} />
                    <AvatarFallback className="bg-primary text-white font-bold text-2xl">DS</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 border border-primary/40 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Dr. Jenkins Live</span>
                  </div>
                </motion.div>

                <div className="space-y-1 z-10">
                  <h2 className="text-lg sm:text-xl font-bold text-white font-heading">{session.doctor.name}</h2>
                  <p className="text-xs text-slate-400 font-medium">{session.doctor.specialty} • {session.doctor.hospital}</p>
                </div>
              </div>

              {/* Patient Picture-in-Picture (PiP) Stream */}
              <div className="absolute bottom-16 right-4 sm:bottom-20 sm:right-6 w-32 sm:w-40 h-24 sm:h-28 rounded-2xl bg-slate-950/90 border-2 border-primary/40 overflow-hidden shadow-2xl z-20 flex flex-col items-center justify-center text-center">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border border-white/20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${session.patient.name}`} alt={session.patient.name} />
                  <AvatarFallback className="bg-primary/40 text-white text-xs font-bold">MV</AvatarFallback>
                </Avatar>
                <span className="text-[10px] text-slate-300 font-bold mt-1">{session.patient.name} (Patient)</span>
              </div>

              {/* Video Control Bar */}
              <div className="relative z-30 pt-4 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 gap-1.5"
                  >
                    <Mic className="h-4 w-4 text-emerald-400" />
                    <span>Mic Active</span>
                  </Button>

                  <Button
                    size="sm"
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 gap-1.5"
                  >
                    <Video className="h-4 w-4 text-emerald-400" />
                    <span>Camera Active</span>
                  </Button>

                  <Button
                    size="sm"
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 gap-1.5 hidden sm:flex"
                  >
                    <Monitor className="h-4 w-4 text-white" />
                    <span>Share Screen</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 3. PRESCRIPTION PANEL (SYNCHRONIZED & FINALIZED UPON COMPLETION) ─── */}
      <div className="rounded-[2.5rem] bg-card/70 border border-border/50 backdrop-blur-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold font-heading text-foreground tracking-tight flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                <span>Digital Prescription & Pharmacotherapy</span>
              </h2>
              {isCompleted && (
                <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold text-xs gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Prescription Ready
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              {isCompleted
                ? "Finalized digital prescription signed by attending physician. Automatically added to your daily reminders."
                : isDoctor
                ? "Author and modify prescribed medications. Saved changes update patient dashboard."
                : "Official prescription issued by your attending doctor."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-semibold px-3 py-1">
              {session.prescriptionDraft.length} Medicines Prescribed
            </Badge>

            {isDoctor && !isCompleted ? (
              <Button
                onClick={() => setIsAddRxOpen(true)}
                className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs h-9 px-3.5 gap-1.5 shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>Add Medicine</span>
              </Button>
            ) : (
              <Button
                onClick={handleDownloadPdf}
                variant="outline"
                className="rounded-xl border-border/60 text-xs font-semibold h-9 px-3.5 gap-1.5"
              >
                <Download className="h-4 w-4 text-primary" />
                <span>Download Rx PDF</span>
              </Button>
            )}
          </div>
        </div>

        {/* Medicines List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {session.prescriptionDraft.map((rx) => (
            <div
              key={rx.id}
              className="p-5 rounded-2xl bg-card/50 border border-border/60 backdrop-blur-md space-y-3 relative overflow-hidden group hover:border-primary/40 transition-all shadow-sm"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-base text-foreground font-heading">{rx.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                      {rx.dosage}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">{rx.frequency}</span>
                    <span className="text-xs font-semibold text-muted-foreground">• {rx.duration}</span>
                  </div>
                </div>

                {/* Role Specific Actions */}
                {isDoctor && !isCompleted ? (
                  <Button
                    onClick={() => removePrescriptionItem(rx.id)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleAddMedicineToReminders(rx)}
                    size="sm"
                    className="rounded-xl bg-primary/15 text-primary hover:bg-primary hover:text-white font-bold text-xs h-8 px-3 gap-1.5 transition-all border border-primary/30"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    <span>Add to Reminder</span>
                  </Button>
                )}
              </div>

              <p className="text-xs text-foreground/90 font-medium bg-background/50 p-2.5 rounded-xl border border-border/30">
                <strong className="text-muted-foreground">Timing: </strong>{rx.mealTiming} • {rx.instructions}
              </p>

              {rx.aiSafetyChecked && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-500 pt-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>AI Interaction Safety Verified</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── 4. DIET PLAN PANEL ─── */}
      <div className="rounded-[2.5rem] bg-card/70 border border-border/50 backdrop-blur-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold font-heading text-foreground tracking-tight flex items-center gap-2">
                <Utensils className="h-5 w-5 text-orange-500" />
                <span>Personalized Clinical Diet & Nutrition Plan</span>
              </h2>
              {isCompleted && (
                <Badge className="bg-orange-500/15 text-orange-500 border-orange-500/30 font-bold text-xs gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Diet Plan Ready
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              {isDoctor
                ? "Configure meal plans and dietary restrictions. Saved changes update patient dashboard."
                : "Customized nutrition protocol prescribed by your clinical team."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isDoctor && !isCompleted ? (
              <Button
                onClick={handleSaveDietPlan}
                className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-md"
              >
                <FileCheck className="h-4 w-4" />
                <span>Save & Sync Diet Plan</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={togglePatientFollowingDiet}
                  variant={session.dietPlan.isFollowing ? "secondary" : "default"}
                  className="rounded-xl text-xs font-bold h-9 px-3.5 gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{session.dietPlan.isFollowing ? "Following Plan" : "Mark as Following Plan"}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Diet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Breakfast */}
          <div className="p-4 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <h3 className="text-xs font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="h-4 w-4" /> Breakfast
            </h3>
            {isDoctor && !isCompleted ? (
              <Textarea
                value={dietForm.breakfast}
                onChange={(e) => setDietForm({ ...dietForm, breakfast: e.target.value })}
                className="text-xs bg-background/60 border-border/50 rounded-xl resize-none h-20"
              />
            ) : (
              <p className="text-xs text-foreground font-medium leading-relaxed bg-background/30 p-3 rounded-xl border border-border/30 min-h-[70px]">
                {session.dietPlan.breakfast}
              </p>
            )}
          </div>

          {/* Lunch */}
          <div className="p-4 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="h-4 w-4" /> Lunch
            </h3>
            {isDoctor && !isCompleted ? (
              <Textarea
                value={dietForm.lunch}
                onChange={(e) => setDietForm({ ...dietForm, lunch: e.target.value })}
                className="text-xs bg-background/60 border-border/50 rounded-xl resize-none h-20"
              />
            ) : (
              <p className="text-xs text-foreground font-medium leading-relaxed bg-background/30 p-3 rounded-xl border border-border/30 min-h-[70px]">
                {session.dietPlan.lunch}
              </p>
            )}
          </div>

          {/* Dinner */}
          <div className="p-4 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="h-4 w-4" /> Dinner
            </h3>
            {isDoctor && !isCompleted ? (
              <Textarea
                value={dietForm.dinner}
                onChange={(e) => setDietForm({ ...dietForm, dinner: e.target.value })}
                className="text-xs bg-background/60 border-border/50 rounded-xl resize-none h-20"
              />
            ) : (
              <p className="text-xs text-foreground font-medium leading-relaxed bg-background/30 p-3 rounded-xl border border-border/30 min-h-[70px]">
                {session.dietPlan.dinner}
              </p>
            )}
          </div>

          {/* Snacks */}
          <div className="p-4 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <h3 className="text-xs font-bold text-purple-500 uppercase tracking-wider">Healthy Snacks</h3>
            {isDoctor && !isCompleted ? (
              <Input
                value={dietForm.snacks}
                onChange={(e) => setDietForm({ ...dietForm, snacks: e.target.value })}
                className="text-xs bg-background/60 border-border/50 rounded-xl"
              />
            ) : (
              <p className="text-xs text-foreground font-medium bg-background/30 p-3 rounded-xl border border-border/30">
                {session.dietPlan.snacks}
              </p>
            )}
          </div>

          {/* Water Intake */}
          <div className="p-4 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="h-4 w-4" /> Water Intake Target
            </h3>
            {isDoctor && !isCompleted ? (
              <Input
                value={dietForm.waterIntake}
                onChange={(e) => setDietForm({ ...dietForm, waterIntake: e.target.value })}
                className="text-xs bg-background/60 border-border/50 rounded-xl"
              />
            ) : (
              <p className="text-xs text-foreground font-medium bg-background/30 p-3 rounded-xl border border-border/30">
                {session.dietPlan.waterIntake}
              </p>
            )}
          </div>

          {/* Special Instructions */}
          <div className="p-4 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" /> Restrictions & Notes
            </h3>
            {isDoctor && !isCompleted ? (
              <Input
                value={dietForm.specialInstructions}
                onChange={(e) => setDietForm({ ...dietForm, specialInstructions: e.target.value })}
                className="text-xs bg-background/60 border-border/50 rounded-xl"
              />
            ) : (
              <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                {session.dietPlan.specialInstructions}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── 5. DOCTOR NOTES ─── */}
      <div className="rounded-[2.5rem] bg-card/70 border border-border/50 backdrop-blur-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold font-heading text-foreground tracking-tight flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              <span>Doctor Clinical Notes & Recommendations</span>
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              {isDoctor
                ? "SOAP documentation. Toggle sharing to make notes visible on patient portal."
                : "Official notes and clinical observations from Dr. Jenkins."}
            </p>
          </div>

          {isDoctor && !isCompleted && (
            <div className="flex items-center gap-3 bg-background/50 p-2 px-3 rounded-2xl border border-border/50">
              <span className="text-xs font-bold text-foreground">Share with Patient:</span>
              <Switch checked={session.shareDoctorNotesWithPatient} onCheckedChange={toggleShareDoctorNotes} />
            </div>
          )}
        </div>

        {isDoctor && !isCompleted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subjective Notes</label>
              <Textarea
                value={session.soapNotes.subjective}
                onChange={(e) => updateSOAPNotes("subjective", e.target.value)}
                className="text-xs bg-background/60 border-border/50 rounded-xl h-24"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Objective Telemetry</label>
              <Textarea
                value={session.soapNotes.objective}
                onChange={(e) => updateSOAPNotes("objective", e.target.value)}
                className="text-xs bg-background/60 border-border/50 rounded-xl h-24"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Clinical Assessment</label>
              <Textarea
                value={session.soapNotes.assessment}
                onChange={(e) => updateSOAPNotes("assessment", e.target.value)}
                className="text-xs bg-background/60 border-border/50 rounded-xl h-24"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Treatment Plan</label>
              <Textarea
                value={session.soapNotes.plan}
                onChange={(e) => updateSOAPNotes("plan", e.target.value)}
                className="text-xs bg-background/60 border-border/50 rounded-xl h-24"
              />
            </div>
          </div>
        ) : (
          <div>
            {session.shareDoctorNotesWithPatient || isCompleted ? (
              <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Clinical Assessment</h4>
                  <p className="text-sm font-semibold text-foreground">{session.soapNotes.assessment}</p>
                </div>
                <div className="border-t border-indigo-500/20 pt-3 space-y-1">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Treatment & Follow-up Plan</h4>
                  <p className="text-xs text-foreground/90 font-medium leading-relaxed">{session.soapNotes.plan}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-card/40 border border-dashed border-border/60 text-center space-y-2">
                <Lock className="h-6 w-6 text-muted-foreground mx-auto" />
                <p className="text-xs font-semibold text-muted-foreground">
                  Doctor notes are currently being updated by Dr. Jenkins. Shared summary will display once finalized.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── 6. UPLOADED REPORTS ─── */}
      <div className="rounded-[2.5rem] bg-card/70 border border-border/50 backdrop-blur-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold font-heading text-foreground tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span>Lab Reports & Diagnostic Telemetry</span>
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              {isDoctor
                ? "Upload or replace clinical lab results and ECG traces."
                : "Diagnostic reports attached to this session. Automatically saved to your Medscope Health Records."}
            </p>
          </div>

          {isDoctor && !isCompleted && (
            <Button
              onClick={() => setIsUploadReportOpen(true)}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Report</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {session.uploadedReports.map((rep) => (
            <div
              key={rep.id}
              className="p-5 rounded-2xl bg-card/40 border border-border/60 backdrop-blur-md space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-sm text-foreground font-heading">{rep.title}</h3>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {rep.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rep.summary}</p>
                <span className="text-[10px] text-muted-foreground font-mono block">{rep.date}</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <Button
                  onClick={() => {
                    setSelectedReport(rep);
                    setIsPreviewReportOpen(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl text-xs font-semibold h-8 gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>Preview Report</span>
                </Button>

                <Button
                  onClick={() => toast.success(`Downloading ${rep.title}...`)}
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl text-xs font-semibold h-8 gap-1.5"
                >
                  <Download className="h-3.5 w-3.5 text-primary" />
                  <span>Download</span>
                </Button>

                {isDoctor && !isCompleted && (
                  <Button
                    onClick={() => deleteUploadedReport(rep.id)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 7. FOLLOW-UP PLAN ─── */}
      <div className="rounded-[2.5rem] bg-card/70 border border-border/50 backdrop-blur-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold font-heading text-foreground tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-500" />
              <span>Follow-up Schedule & Special Instructions</span>
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              {isDoctor
                ? "Schedule next review appointment date and clinical check conditions."
                : "Your scheduled follow-up appointment date and preparation guidelines."}
            </p>
          </div>

          {isDoctor && !isCompleted ? (
            <Button
              onClick={handleSaveFollowupPlan}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-md"
            >
              <FileCheck className="h-4 w-4" />
              <span>Update Follow-up Schedule</span>
            </Button>
          ) : (
            <Button
              onClick={handleAddFollowupToCalendar}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-md"
            >
              <Calendar className="h-4 w-4" />
              <span>Add Follow-up to Calendar</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <label className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Next Appointment Date</label>
            {isDoctor && !isCompleted ? (
              <Input
                value={followupForm.nextAppointmentDate}
                onChange={(e) => setFollowupForm({ ...followupForm, nextAppointmentDate: e.target.value })}
                className="text-xs bg-background/60 border-border/50 rounded-xl"
              />
            ) : (
              <p className="text-base font-extrabold text-foreground font-heading bg-background/30 p-3 rounded-xl border border-border/30">
                {session.followupPlan.nextAppointmentDate}
              </p>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <label className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Review Reason</label>
            {isDoctor && !isCompleted ? (
              <Input
                value={followupForm.reason}
                onChange={(e) => setFollowupForm({ ...followupForm, reason: e.target.value })}
                className="text-xs bg-background/60 border-border/50 rounded-xl"
              />
            ) : (
              <p className="text-xs text-foreground font-semibold bg-background/30 p-3 rounded-xl border border-border/30">
                {session.followupPlan.reason}
              </p>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-card/40 border border-border/50 space-y-2">
            <label className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Special Instructions</label>
            {isDoctor && !isCompleted ? (
              <Input
                value={followupForm.instructions}
                onChange={(e) => setFollowupForm({ ...followupForm, instructions: e.target.value })}
                className="text-xs bg-background/60 border-border/50 rounded-xl"
              />
            ) : (
              <p className="text-xs text-foreground font-medium bg-background/30 p-3 rounded-xl border border-border/30">
                {session.followupPlan.instructions}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── 8. CONSULTATION TIMELINE ─── */}
      <div className="rounded-[2.5rem] bg-card/70 border border-border/50 backdrop-blur-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold font-heading text-foreground tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Synchronized Clinical Activity Timeline</span>
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              Real-time chronological events documented during this session.
            </p>
          </div>

          {isDoctor && !isCompleted && (
            <Button
              onClick={() => setIsTimelineModalOpen(true)}
              variant="outline"
              className="rounded-xl border-border/60 text-xs font-bold h-9 px-3.5 gap-1.5"
            >
              <Plus className="h-4 w-4 text-primary" />
              <span>Add Timeline Milestone</span>
            </Button>
          )}
        </div>

        {/* Timeline Events */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
          {session.sessionTimeline.map((evt) => (
            <div key={evt.id} className="relative space-y-1">
              <div className="absolute -left-[19px] top-1 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background shadow-sm" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{evt.title}</span>
                <span className="text-[10px] font-mono text-muted-foreground">({evt.timestamp})</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">{evt.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── DIALOG MODALS ─── */}

      {/* Add Medicine Modal (Doctor) */}
      <Dialog open={isAddRxOpen} onOpenChange={setIsAddRxOpen}>
        <DialogContent className="rounded-3xl border-border/60 bg-card/95 backdrop-blur-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-lg">Add Medicine to Prescription</DialogTitle>
            <DialogDescription className="text-xs">
              Formulate medicine dosage and administration instructions.
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
            <div>
              <label className="font-semibold block mb-1">Duration & Timing</label>
              <Input
                placeholder="e.g. 7 Days (After Meal)"
                value={newRx.duration}
                onChange={(e) => setNewRx({ ...newRx, duration: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Instructions</label>
              <Textarea
                placeholder="e.g. Take with full glass of water after food."
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

      {/* Upload Report Modal (Doctor) */}
      <Dialog open={isUploadReportOpen} onOpenChange={setIsUploadReportOpen}>
        <DialogContent className="rounded-3xl border-border/60 bg-card/95 backdrop-blur-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-lg">Upload Diagnostic Report</DialogTitle>
            <DialogDescription className="text-xs">
              Attach lab result or telemetry trace to session chart.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Report Title</label>
              <Input
                placeholder="e.g. Complete Blood Count (CBC)"
                value={newReport.title}
                onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Document Category</label>
              <Input
                placeholder="e.g. Laboratory PDF / Imaging / Telemetry"
                value={newReport.type}
                onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Clinical Summary / Findings</label>
              <Textarea
                placeholder="Key clinical values & doctor interpretation..."
                value={newReport.summary}
                onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                className="rounded-xl text-xs h-20 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUploadReportSubmit} className="w-full rounded-2xl bg-blue-600 text-white font-bold text-xs h-10">
              Upload Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Report Modal */}
      <Dialog open={isPreviewReportOpen} onOpenChange={setIsPreviewReportOpen}>
        <DialogContent className="rounded-3xl border-border/60 bg-card/95 backdrop-blur-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-lg">{selectedReport?.title}</DialogTitle>
            <DialogDescription className="text-xs">{selectedReport?.type} • {selectedReport?.date}</DialogDescription>
          </DialogHeader>
          <div className="p-6 rounded-2xl bg-slate-950 text-white space-y-4 text-xs font-mono">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">DOCUMENT ID:</span>
              <span className="text-emerald-400">{selectedReport?.id}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block">CLINICAL FINDINGS:</span>
              <p className="text-slate-200 leading-relaxed font-sans">{selectedReport?.summary}</p>
            </div>
            <div className="pt-4 border-t border-white/10 text-center text-slate-400 text-[10px]">
              Verified by Medscope Clinical Telemetry Network
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewReportOpen(false)} className="w-full rounded-2xl bg-primary text-white font-bold text-xs h-10">
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Export Modal */}
      <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
        <DialogContent className="rounded-3xl border-border/60 bg-card/98 backdrop-blur-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-xl flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" />
              <span>Official Consultation Summary (PDF Export)</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Full synchronized clinical record for {session.patient.name}.
            </DialogDescription>
          </DialogHeader>

          {/* Printable Document View */}
          <div className="p-6 rounded-2xl bg-white text-slate-900 space-y-6 text-xs shadow-inner">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 font-heading">MEDSCOPE HEALTH PLATFORM</h2>
                <p className="text-[10px] text-slate-500 font-medium">Digital Health & Clinical Telehealth Summary</p>
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
                <p className="text-[11px] text-slate-600">Age: {session.patient.age} • Gender: {session.patient.gender} • Blood Group: {session.patient.bloodGroup}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Session Details</p>
                <p className="font-bold text-slate-900 text-sm">Session ID: {session.sessionId}</p>
                <p className="text-[11px] text-slate-600">Date: Today, 02:30 PM</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">Primary Diagnosis</h3>
              <p className="font-semibold text-slate-800">{session.diagnosis}</p>
            </div>

            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">Prescribed Medications</h3>
              <div className="space-y-2">
                {session.prescriptionDraft.map((rx, idx) => (
                  <div key={rx.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-900">{idx + 1}. {rx.name} — {rx.dosage}</p>
                    <p className="text-[11px] text-slate-600">Frequency: {rx.frequency} | Duration: {rx.duration} | Timing: {rx.mealTiming}</p>
                    <p className="text-[11px] text-slate-600 italic">Instructions: {rx.instructions}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">Diet & Nutrition Plan</h3>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <p><strong>Breakfast:</strong> {session.dietPlan.breakfast}</p>
                <p><strong>Lunch:</strong> {session.dietPlan.lunch}</p>
                <p><strong>Dinner:</strong> {session.dietPlan.dinner}</p>
                <p><strong>Snacks:</strong> {session.dietPlan.snacks}</p>
              </div>
              <p className="text-[11px] text-rose-700 font-semibold mt-2">Special Restrictions: {session.dietPlan.specialInstructions}</p>
            </div>

            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">Doctor Clinical Notes</h3>
              <p className="text-slate-700 leading-relaxed">{session.soapNotes.plan}</p>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">Next Follow-up Appointment:</p>
                <p className="text-slate-600">{session.followupPlan.nextAppointmentDate} — {session.followupPlan.reason}</p>
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
