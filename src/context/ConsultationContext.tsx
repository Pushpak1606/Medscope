import React, { createContext, useContext, useState, ReactNode } from "react";
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import PatientVideoCallModal from "@/components/patient-dashboard/consultations/PatientVideoCallModal";

export type ConsultationType = "Video" | "Audio" | "Chat" | "Clinic";
export type ConsultationStatus = "upcoming" | "completed" | "cancelled";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  nextSlot: string;
  img: string;
}

export interface Consultation {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: ConsultationType;
  status: ConsultationStatus;
  doctorImg: string;
  diagnosis?: string;
  startsInMins?: number;
}

/* =========================================================================
   SHARED SYNCHRONIZED CONSULTATION SESSION MODEL (FRONTEND REAL-TIME STATE)
   ========================================================================= */

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "started" | "vitals" | "diagnosis" | "rx_edited" | "rx_added" | "lab_uploaded" | "lifestyle" | "followup" | "completed";
  actor: "doctor" | "patient" | "system";
  title: string;
  description: string;
}

export interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  mealTiming: "Before Meal" | "After Meal" | "With Food" | "At Bedtime" | "Anytime";
  instructions: string;
  warnings?: string;
  aiSafetyChecked?: boolean;
}

export interface ReportItem {
  id: string;
  title: string;
  type: string;
  date: string;
  summary: string;
  url?: string;
}

export interface FollowupPlan {
  nextAppointmentDate: string;
  reason: string;
  instructions: string;
}

export interface DietPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  waterIntake: string;
  specialInstructions: string;
  isFollowing?: boolean;
}

export interface LiveConsultationSession {
  sessionId: string;
  status: "scheduled" | "doctor_available" | "in-progress" | "completed" | "cancelled";
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    bloodGroup: string;
    allergies: string[];
    vitals: { bp: string; hr: number; spo2: number; temp: string };
  };
  doctor: {
    id: string;
    name: string;
    title: string;
    specialty: string;
    hospital: string;
    licenseNumber: string;
  };
  diagnosis: string;
  prescriptionDraft: PrescriptionItem[];
  prescriptionFinalized: boolean;
  soapNotes: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  uploadedReports: ReportItem[];
  lifestyleRecommendations: string[];
  dietPlan: DietPlan;
  shareDoctorNotesWithPatient: boolean;
  followupPlan: FollowupPlan;
  sessionTimeline: TimelineEvent[];
  liveStatusMessage: string;
}

/* INITIAL MOCK SESSION STATE */
const INITIAL_LIVE_SESSION: LiveConsultationSession = {
  sessionId: "session-98421",
  status: "doctor_available",
  patient: {
    id: "pat-101",
    name: "Marcus Vance",
    age: 54,
    gender: "Male",
    bloodGroup: "O Positive (O+)",
    allergies: ["Penicillin (Anaphylaxis)", "Shellfish"],
    vitals: { bp: "148/92", hr: 94, spo2: 95, temp: "98.6°F" },
  },
  doctor: {
    id: "doc-1",
    name: "Dr. Sarah Jenkins, MD",
    title: "Senior Attending Physician",
    specialty: "Cardiology & Internal Medicine",
    hospital: "St. Jude Medical Center • Cath Lab 2",
    licenseNumber: "MD-98421",
  },
  diagnosis: "Subacute Coronary Syndrome • Coronary Artery Disease (CAD)",
  prescriptionDraft: [
    {
      id: "rx-1",
      name: "Clopidogrel Bisulfate",
      dosage: "75 mg",
      frequency: "Once Daily",
      duration: "12 Months",
      mealTiming: "After Meal",
      instructions: "Take daily post-morning meal to prevent stent thrombosis.",
    },
    {
      id: "rx-2",
      name: "Atorvastatin Calcium",
      dosage: "80 mg",
      frequency: "Once Daily",
      duration: "Ongoing",
      mealTiming: "At Bedtime",
      instructions: "High-intensity statin for plaque stabilization.",
    },
  ],
  prescriptionFinalized: false,
  soapNotes: {
    subjective: "Patient presents with 2-hour onset of substernal chest tightness on exertion. Rates pain 6/10.",
    objective: "BP 148/92, HR 94, SpO2 95%. Troponin T: 0.14 ng/mL. 12-lead ECG shows ST elevation in V2-V4.",
    assessment: "Subacute Coronary Syndrome (ACS) with elevated Troponin T biomarkers. Penicillin allergy noted.",
    plan: "Initiate Dual Antiplatelet Therapy (DAPT). Schedule primary PCI angiography within 2 hours.",
  },
  uploadedReports: [
    { id: "rep-1", title: "Troponin T Cardiac Biomarker Panel", type: "Laboratory PDF", date: "Today, 08:15 AM", summary: "Troponin T elevated at 0.14 ng/mL (Normal < 0.01 ng/mL)." },
    { id: "rep-2", title: "12-Lead Electrocardiogram (ECG)", type: "Telemetry Trace", date: "Today, 08:20 AM", summary: "ST elevation in anterolateral leads V2-V4." },
  ],
  lifestyleRecommendations: [
    "Sodium restriction < 2,000 mg/day (less than 1 tsp salt).",
    "Restricted strenuous activity pending Cath Lab evaluation.",
    "Monitor daily weight and report > 2lb sudden gain.",
  ],
  dietPlan: {
    breakfast: "Oatmeal with fresh blueberries, 1 tbsp flaxseed, 1 glass skim milk (or almond milk).",
    lunch: "Grilled Mediterranean chicken salad with olive oil dressing, quinoa, and avocado.",
    dinner: "Steamed wild salmon, roasted asparagus, and 1/2 cup wild rice.",
    snacks: "Handful of raw unsalted almonds and 1 green apple.",
    waterIntake: "8-10 glasses daily (2.5 Liters).",
    specialInstructions: "Strict low-sodium (< 1,500mg/day). Avoid grapefruit due to statin interaction.",
    isFollowing: true,
  },
  shareDoctorNotesWithPatient: true,
  followupPlan: {
    nextAppointmentDate: "August 10, 2026",
    reason: "Post-PCI stent patency check & serial INR titration.",
    instructions: "Continue DAPT regimen daily. Emergency Cath Lab contact: 1-800-MED-CARD.",
  },
  sessionTimeline: [
    { id: "t-1", timestamp: "08:30 AM", type: "started", actor: "system", title: "Consultation Started", description: "Dr. Sarah Jenkins connected to Exam Room 3B session." },
    { id: "t-2", timestamp: "08:32 AM", type: "vitals", actor: "system", title: "Vitals Telemetry Synced", description: "BP 148/92, HR 94 bpm, SpO2 95% received." },
    { id: "t-3", timestamp: "08:35 AM", type: "diagnosis", actor: "doctor", title: "Diagnosis Updated", description: "Subacute Coronary Syndrome • CAD added to chart." },
  ],
  liveStatusMessage: "Consultation in progress. Dr. Sarah Jenkins is reviewing clinical notes.",
};

/* CONTEXT INTERFACE */
interface ConsultationContextType {
  upcomingConsultations: Consultation[];
  pastConsultations: Consultation[];
  availableDoctors: Doctor[];
  bookConsultation: (doctorId: string, type: ConsultationType, date: string, time: string) => void;
  cancelConsultation: (consultationId: string) => void;
  rescheduleConsultation: (consultationId: string, newDate: string, newTime: string) => void;
  callJoined: boolean;
  setDoctorAvailable: (available: boolean) => void;
  joinConsultation: (consultationId: string) => void;
  endCall: () => void;
  isCallActive: boolean;
  activeCallDoctor: { name: string; specialty: string; avatarSeed: string } | null;

  /* REAL-TIME SYNCHRONIZED CONSULTATION SESSION STATE & MUTATOR APIS */
  session: LiveConsultationSession;
  updateDiagnosis: (newDiagnosis: string) => void;
  addPrescriptionItem: (item: PrescriptionItem) => void;
  updatePrescriptionItem: (id: string, updated: Partial<PrescriptionItem>) => void;
  removePrescriptionItem: (id: string) => void;
  finalizePrescription: () => void;
  updateSOAPNotes: (field: keyof LiveConsultationSession["soapNotes"], text: string) => void;
  toggleShareDoctorNotes: () => void;
  updateDietPlan: (diet: Partial<DietPlan>) => void;
  togglePatientFollowingDiet: () => void;
  addUploadedReport: (report: ReportItem) => void;
  deleteUploadedReport: (reportId: string) => void;
  updateLifestyleRecommendations: (recs: string[]) => void;
  updateFollowupPlan: (plan: Partial<FollowupPlan>) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, "id">) => void;
  startNewConsultationSession: (patientData: any) => void;
  scheduleFollowup: (plan: FollowupPlan) => void;
  completeConsultation: () => void;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

const INITIAL_DOCTORS: Doctor[] = [
  { id: "doc-1", name: "Dr. Sarah Jenkins", specialty: "Cardiology", rating: 4.9, nextSlot: "Today, 2:30 PM", img: "SJ" },
  { id: "doc-2", name: "Dr. Mike Ross", specialty: "General Practice", rating: 4.8, nextSlot: "Tomorrow, 10:00 AM", img: "MR" },
  { id: "doc-3", name: "Dr. Emily Chen", specialty: "Neurology", rating: 5.0, nextSlot: "Wed, 4:15 PM", img: "EC" },
  { id: "doc-4", name: "Dr. Robert Fox", specialty: "Orthopedics", rating: 4.7, nextSlot: "Thu, 1:00 PM", img: "RF" },
];

const todayFormatted = format(new Date(), "'Today, 'MMM d");
const pastDate1 = format(subDays(new Date(), 14), "MMM d, yyyy");

const INITIAL_UPCOMING: Consultation[] = [
  {
    id: "cons-1",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    specialty: "Senior Cardiologist",
    date: todayFormatted,
    time: "08:30 AM",
    type: "Video",
    status: "upcoming",
    doctorImg: "SJ",
    startsInMins: 0,
  },
];

const INITIAL_PAST: Consultation[] = [
  { id: "cons-101", doctorId: "doc-1", doctorName: "Dr. Sarah Jenkins", specialty: "Cardiology", date: pastDate1, time: "2:00 PM", type: "Video", status: "completed", doctorImg: "SJ", diagnosis: "Routine Checkup" },
];

export const ConsultationProvider = ({ children }: { children: ReactNode }) => {
  const [upcomingConsultations, setUpcomingConsultations] = useState<Consultation[]>(INITIAL_UPCOMING);
  const [pastConsultations, setPastConsultations] = useState<Consultation[]>(INITIAL_PAST);
  const [availableDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [isCallActive, setIsCallActive] = useState(false);
  const [activeCallDoctor, setActiveCallDoctor] = useState<{ name: string; specialty: string; avatarSeed: string } | null>(null);

  /* SHARED LIVE CONSULTATION SESSION STATE */
  const [session, setSession] = useState<LiveConsultationSession>(INITIAL_LIVE_SESSION);

  /* Helper to record timeline event & live status message */
  const appendTimelineEvent = (
    type: TimelineEvent["type"],
    title: string,
    description: string,
    liveMessage: string,
    updater: (prev: LiveConsultationSession) => LiveConsultationSession
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newEvent: TimelineEvent = {
      id: `t-${Date.now()}`,
      timestamp: timeStr,
      type,
      actor: "doctor",
      title,
      description,
    };

    /* ====================================================================
       BACKEND INTEGRATION POINT:
       When WebSockets / WebRTC API synchronization is connected,
       dispatch socket event here:
       socket.emit("consultation_event", { sessionId: session.sessionId, newEvent, payload });
       ==================================================================== */

    setSession((prev) => {
      const updated = updater(prev);
      return {
        ...updated,
        sessionTimeline: [...updated.sessionTimeline, newEvent],
        liveStatusMessage: liveMessage,
      };
    });
  };

  /* MUTATOR METHOD 1: Update Diagnosis */
  const updateDiagnosis = (newDiagnosis: string) => {
    appendTimelineEvent(
      "diagnosis",
      "Diagnosis Updated",
      `Diagnosis updated to: ${newDiagnosis}`,
      `Doctor updated diagnosis to: ${newDiagnosis}`,
      (prev) => ({ ...prev, diagnosis: newDiagnosis })
    );
    toast.success("Diagnosis updated & synced with patient");
  };

  /* MUTATOR METHOD 2: Add Prescription Item */
  const addPrescriptionItem = (item: PrescriptionItem) => {
    appendTimelineEvent(
      "rx_added",
      "Medicine Added to Prescription",
      `Added ${item.name} (${item.dosage}, ${item.frequency})`,
      `Doctor added ${item.name} ${item.dosage} to prescription.`,
      (prev) => ({
        ...prev,
        prescriptionDraft: [...prev.prescriptionDraft, item],
      })
    );
    toast.success(`Added ${item.name} to real-time prescription draft`);
  };

  /* MUTATOR METHOD 3: Update Prescription Item */
  const updatePrescriptionItem = (id: string, updated: Partial<PrescriptionItem>) => {
    appendTimelineEvent(
      "rx_edited",
      "Prescription Item Updated",
      `Modified dosage/frequency parameters for prescribed drug`,
      `Doctor updated prescription details...`,
      (prev) => ({
        ...prev,
        prescriptionDraft: prev.prescriptionDraft.map((item) =>
          item.id === id ? { ...item, ...updated } : item
        ),
      })
    );
  };

  /* MUTATOR METHOD 4: Remove Prescription Item */
  const removePrescriptionItem = (id: string) => {
    const itemToRemove = session.prescriptionDraft.find((i) => i.id === id);
    appendTimelineEvent(
      "rx_edited",
      "Medicine Removed from Prescription",
      `Removed ${itemToRemove?.name || "medicine"} from prescription draft`,
      `Doctor removed medicine from draft.`,
      (prev) => ({
        ...prev,
        prescriptionDraft: prev.prescriptionDraft.filter((item) => item.id !== id),
      })
    );
    toast.info("Removed medicine from prescription draft");
  };

  /* MUTATOR METHOD 5: Finalize Prescription */
  const finalizePrescription = () => {
    appendTimelineEvent(
      "rx_edited",
      "Prescription Finalized",
      `Official prescription signed & approved by ${session.doctor.name}`,
      "Prescription finalized. Ready for download & patient reminder sync.",
      (prev) => ({
        ...prev,
        prescriptionFinalized: true,
        status: "in-progress",
      })
    );
    toast.success("Prescription finalized & synchronized with patient portal");
  };

  /* MUTATOR METHOD 6: Update SOAP Notes */
  const updateSOAPNotes = (field: keyof LiveConsultationSession["soapNotes"], text: string) => {
    setSession((prev) => ({
      ...prev,
      soapNotes: {
        ...prev.soapNotes,
        [field]: text,
      },
    }));
  };

  const toggleShareDoctorNotes = () => {
    setSession((prev) => {
      const nextState = !prev.shareDoctorNotesWithPatient;
      toast.info(nextState ? "Doctor notes shared with patient view." : "Doctor notes hidden from patient view.");
      return { ...prev, shareDoctorNotesWithPatient: nextState };
    });
  };

  const updateDietPlan = (dietUpdate: Partial<DietPlan>) => {
    appendTimelineEvent(
      "lifestyle",
      "Diet & Nutrition Plan Updated",
      "Doctor updated breakfast, lunch, dinner & special diet instructions.",
      "Doctor updated your personalized diet & nutrition plan.",
      (prev) => ({
        ...prev,
        dietPlan: { ...prev.dietPlan, ...dietUpdate },
      })
    );
    toast.success("Diet plan updated and synchronized with patient");
  };

  const togglePatientFollowingDiet = () => {
    setSession((prev) => {
      const nextState = !prev.dietPlan.isFollowing;
      toast.success(nextState ? "Marked as following doctor's diet plan!" : "Status updated.");
      return {
        ...prev,
        dietPlan: { ...prev.dietPlan, isFollowing: nextState },
      };
    });
  };

  /* MUTATOR METHOD 7: Add Uploaded Report */
  const addUploadedReport = (report: ReportItem) => {
    appendTimelineEvent(
      "lab_uploaded",
      "Lab Report Uploaded",
      `Uploaded ${report.title} (${report.type})`,
      `Doctor attached new report: ${report.title}`,
      (prev) => ({
        ...prev,
        uploadedReports: [...prev.uploadedReports, report],
      })
    );
    toast.success(`Attached ${report.title} to consultation chart`);
  };

  const deleteUploadedReport = (reportId: string) => {
    setSession((prev) => {
      const report = prev.uploadedReports.find((r) => r.id === reportId);
      toast.info(`Removed ${report?.title || "report"} from chart`);
      return {
        ...prev,
        uploadedReports: prev.uploadedReports.filter((r) => r.id !== reportId),
      };
    });
  };

  /* MUTATOR METHOD 8: Update Lifestyle Recommendations */
  const updateLifestyleRecommendations = (recs: string[]) => {
    appendTimelineEvent(
      "lifestyle",
      "Lifestyle Plan Updated",
      "Updated patient diet, exercise & rest recommendations",
      "Doctor updated lifestyle & cardiac rehab protocol.",
      (prev) => ({
        ...prev,
        lifestyleRecommendations: recs,
      })
    );
  };

  /* MUTATOR METHOD 9: Schedule Follow-up */
  const updateFollowupPlan = (planUpdate: Partial<FollowupPlan>) => {
    appendTimelineEvent(
      "followup",
      "Follow-up Plan Updated",
      `Follow-up updated: ${planUpdate.nextAppointmentDate || session.followupPlan.nextAppointmentDate}`,
      "Doctor updated follow-up instructions and schedule.",
      (prev) => ({
        ...prev,
        followupPlan: { ...prev.followupPlan, ...planUpdate },
      })
    );
    toast.success("Follow-up plan updated and synchronized");
  };

  const scheduleFollowup = (plan: FollowupPlan) => {
    updateFollowupPlan(plan);
  };

  const addTimelineEvent = (event: Omit<TimelineEvent, "id">) => {
    const newEvt: TimelineEvent = {
      ...event,
      id: `t-${Date.now()}`,
    };
    setSession((prev) => ({
      ...prev,
      sessionTimeline: [...prev.sessionTimeline, newEvt],
    }));
  };

  const [callJoined, setCallJoined] = useState(false);

  const setDoctorAvailable = (available: boolean) => {
    setSession((prev) => ({
      ...prev,
      status: available ? "doctor_available" : "scheduled",
      liveStatusMessage: available
        ? "Doctor is available. Ready to join consultation."
        : "Scheduled consultation. Waiting for doctor to become available.",
    }));
    if (available) {
      toast.success("Doctor status set to Available! Patient can now join session.");
    }
  };

  /* MUTATOR METHOD 10: Complete Consultation */
  const startNewConsultationSession = (patientData: any) => {
    const patientName = patientData.name || "Marcus Vance";
    const patientAge = patientData.age || 54;
    const patientGender = patientData.gender || "Male";
    const patientBloodGroup = patientData.bloodGroup || "O Positive (O+)";
    const patientVitals = patientData.vitals || { bp: "148/92", hr: 94, spo2: 95, temp: "98.6°F" };
    const patientDiagnosis = patientData.primaryDiagnosis || patientData.diagnosis || "Subacute Coronary Syndrome • CAD";
    const patientId = patientData.id || patientData.medicalId || `pat-${Date.now()}`;

    setSession((prev) => ({
      ...prev,
      sessionId: `session-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "doctor_available",
      patient: {
        id: patientId,
        name: patientName,
        age: Number(patientAge),
        gender: patientGender,
        bloodGroup: patientBloodGroup,
        allergies: patientData.allergies || ["Penicillin (Anaphylaxis)", "Shellfish"],
        vitals: {
          bp: patientVitals.bp || "120/80",
          hr: Number(patientVitals.hr || 75),
          spo2: Number(patientVitals.spo2 || 98),
          temp: patientVitals.temp || "98.6°F",
        },
      },
      diagnosis: patientDiagnosis,
      liveStatusMessage: `Doctor is available. Ready to join consultation with ${patientName}`,
      sessionTimeline: [
        {
          id: `t-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "started",
          actor: "doctor",
          title: "Session Initialized",
          description: `Dr. Sarah Jenkins prepared consultation workspace for ${patientName}.`,
        },
      ],
    }));
    setIsCallActive(false);
    setCallJoined(false);

    toast.success(`Consultation Initialized for ${patientName}`, {
      description: "Doctor is available. Click Join Consultation to start live meeting.",
    });
  };

  const completeConsultation = () => {
    setSession((prev) => ({
      ...prev,
      status: "completed",
      prescriptionFinalized: true,
      shareDoctorNotesWithPatient: true,
      liveStatusMessage: "Consultation completed. Summary and prescriptions ready.",
      sessionTimeline: [
        ...prev.sessionTimeline,
        {
          id: `t-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "completed",
          actor: "doctor",
          title: "Consultation Completed",
          description: `Dr. Sarah Jenkins finalized clinical consultation and closed video room.`,
        },
      ],
    }));
    setIsCallActive(false);
    setCallJoined(false);
    toast.success("Consultation completed! Video meeting closed. Summary ready for patient and doctor.");
  };

  const bookConsultation = (doctorId: string, type: ConsultationType, date: string, time: string) => {
    const doctor = availableDoctors.find((d) => d.id === doctorId);
    if (!doctor) return;

    const newConsultation: Consultation = {
      id: `cons-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date,
      time,
      type,
      status: "upcoming",
      doctorImg: doctor.img,
      startsInMins: 120,
    };

    setUpcomingConsultations((prev) => [...prev, newConsultation]);
    toast.success(`Successfully booked ${type} consultation with ${doctor.name}`);
  };

  const cancelConsultation = (consultationId: string) => {
    setUpcomingConsultations((prev) => prev.filter((c) => c.id !== consultationId));
    toast.info("Consultation cancelled.");
  };

  const rescheduleConsultation = (consultationId: string, newDate: string, newTime: string) => {
    setUpcomingConsultations((prev) =>
      prev.map((c) => (c.id === consultationId ? { ...c, date: newDate, time: newTime } : c))
    );
    toast.success("Consultation rescheduled successfully.");
  };

  const joinConsultation = (consultationId: string) => {
    if (session.status === "completed") {
      toast.error("This consultation session has ended. To start another meeting, create a new consultation session.");
      return;
    }
    const consult = upcomingConsultations.find((c) => c.id === consultationId);
    const doctorName = consult?.doctorName || session.doctor.name || "Dr. Sarah Jenkins";
    const specialty = consult?.specialty || session.doctor.specialty || "Cardiology & Internal Medicine";

    setActiveCallDoctor({
      name: doctorName,
      specialty: specialty,
      avatarSeed: doctorName,
    });
    setSession((prev) => ({
      ...prev,
      status: "in-progress",
      liveStatusMessage: `Live consultation in progress with ${doctorName}`,
    }));
    setIsCallActive(true);
    setCallJoined(true);
    toast.success("Joined live video consultation room!");
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallJoined(false);
  };

  return (
    <ConsultationContext.Provider
      value={{
        upcomingConsultations,
        pastConsultations,
        availableDoctors,
        bookConsultation,
        cancelConsultation,
        rescheduleConsultation,
        callJoined,
        setDoctorAvailable,
        joinConsultation,
        endCall,
        isCallActive,
        activeCallDoctor,

        /* SHARED SESSION STATE & MUTATOR APIS */
        session,
        updateDiagnosis,
        addPrescriptionItem,
        updatePrescriptionItem,
        removePrescriptionItem,
        finalizePrescription,
        updateSOAPNotes,
        toggleShareDoctorNotes,
        updateDietPlan,
        togglePatientFollowingDiet,
        addUploadedReport,
        deleteUploadedReport,
        updateLifestyleRecommendations,
        updateFollowupPlan,
        addTimelineEvent,
        startNewConsultationSession,
        scheduleFollowup,
        completeConsultation,
      }}
    >
      {children}
      <PatientVideoCallModal />
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error("useConsultation must be used within a ConsultationProvider");
  }
  return context;
};

export default ConsultationContext;
