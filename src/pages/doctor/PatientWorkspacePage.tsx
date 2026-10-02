import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useConsultation } from "@/context/ConsultationContext";
import { MOCK_PATIENT_DIRECTORY } from "@/components/doctor-dashboard/patients-directory/PatientDirectoryGrid";
import { getPatientProfile } from "@/services/firebaseService";
import { getStoredAuthUser } from "@/services/authService";
import DoctorLayout from "@/components/doctor-dashboard/DoctorLayout";
import DoctorPageContainer from "@/components/doctor-dashboard/DoctorPageContainer";
import PageTransition from "@/components/doctor-dashboard/PageTransition";

import PatientWorkspaceHero from "@/components/doctor-dashboard/patient-workspace/PatientWorkspaceHero";
import MedicationHistorySection from "@/components/doctor-dashboard/patient-workspace/MedicationHistorySection";
import ConsultationNotesSOAP from "@/components/doctor-dashboard/patient-workspace/ConsultationNotesSOAP";
import LabReportsSection from "@/components/doctor-dashboard/patient-workspace/LabReportsSection";
import QuickClinicalActionsBar from "@/components/doctor-dashboard/patient-workspace/QuickClinicalActionsBar";
import ClinicalAiSummary from "@/components/doctor-dashboard/patient-workspace/ClinicalAiSummary";
import UnifiedMedicalTimeline from "@/components/doctor-dashboard/patient-workspace/UnifiedMedicalTimeline";
import JournalTrendsTab from "@/components/doctor-dashboard/patient-workspace/JournalTrendsTab";
import ScreeningHistoryTab from "@/components/doctor-dashboard/patient-workspace/ScreeningHistoryTab";
import PatientDetailsCard from "@/components/doctor-dashboard/patient-workspace/PatientDetailsCard";
import RegisteredPatientsSection from "@/components/doctor-dashboard/patient-workspace/RegisteredPatientsSection";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Activity,
  Pill,
  TrendingUp,
  Video,
  Brain,
} from "lucide-react";

export const PatientWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { startNewConsultationSession } = useConsultation();
  const [activeTab, setActiveTab] = useState("overview");

  /*
   * Resolve the patient: registered Firestore patients (patients/{uid})
   * first, then the demo directory. onboardingRecord holds the raw
   * Firestore document so the hero can show real stored details.
   */
  const mockPatient = MOCK_PATIENT_DIRECTORY.find((p) => p.id === id) || MOCK_PATIENT_DIRECTORY[0];
  const [onboardingRecord, setOnboardingRecord] = useState<Record<string, any> | null>(null);
  const [recordStatus, setRecordStatus] = useState<"loading" | "loaded" | "missing">("loading");

  useEffect(() => {
    let cancelled = false;
    setOnboardingRecord(null);
    setRecordStatus("loading");
    (async () => {
      const candidates = [id, getStoredAuthUser()?.uid].filter(Boolean) as string[];
      for (const uid of candidates) {
        const record = await getPatientProfile(uid);
        if (record && !cancelled) {
          setOnboardingRecord(record);
          setRecordStatus("loaded");
          return;
        }
      }
      if (!cancelled) setRecordStatus("missing");
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const hasOnboardingRecord = Boolean(onboardingRecord);
  const patientAge = Number(onboardingRecord?.age) || mockPatient.age;

  const activePatient = {
    id: hasOnboardingRecord ? (onboardingRecord as any).uid : mockPatient.id,
    name: hasOnboardingRecord ? (onboardingRecord as any).fullName : mockPatient.name,
    age: patientAge,
    gender: hasOnboardingRecord
      ? ((onboardingRecord as any).gender || "Not specified").charAt(0).toUpperCase() +
        ((onboardingRecord as any).gender || "").slice(1)
      : mockPatient.gender,
    bloodGroup: hasOnboardingRecord ? (onboardingRecord as any).bloodGroup || "Unknown" : mockPatient.bloodGroup,
    phone: hasOnboardingRecord ? (onboardingRecord as any).phone || "Not provided" : mockPatient.phone,
    conditions: hasOnboardingRecord ? (onboardingRecord as any).conditions || [] : [],
    allergies: hasOnboardingRecord ? (onboardingRecord as any).allergiesList || [] : [],
    medications: hasOnboardingRecord ? (onboardingRecord as any).medications || "" : "",
    city: hasOnboardingRecord ? (onboardingRecord as any).city || "" : "",
    email: hasOnboardingRecord ? (onboardingRecord as any).email || "" : "",
    emergency: hasOnboardingRecord
      ? {
          name: (onboardingRecord as any).emergencyContactName || "Not provided",
          relation: (onboardingRecord as any).emergencyContactRelation || "—",
          phone: (onboardingRecord as any).emergencyContactPhone || "Not provided",
        }
      : null,
  };

  const handleStartDirectConsultation = () => {
    startNewConsultationSession({
      id: activePatient.id,
      name: activePatient.name,
      age: activePatient.age,
      gender: activePatient.gender,
      bloodGroup: activePatient.bloodGroup,
      allergies: (activePatient.allergies as string[]).length
        ? activePatient.allergies
        : undefined,
    });
    navigate("/doctor/consultations");
  };

  return (
    <DoctorLayout
      doctorName={undefined}
      specialty={undefined}
      onPrimaryAction={handleStartDirectConsultation}
    >
      <DoctorPageContainer maxWidth="wide">
        <PageTransition className="space-y-6">

          {/* TOP HERO: REAL PATIENT DETAILS FROM FIRESTORE ONBOARDING */}
          <PatientWorkspaceHero
            patient={{
              id: activePatient.id as string,
              name: activePatient.name as string,
              age: activePatient.age as number,
              gender: activePatient.gender as string,
              bloodGroup: activePatient.bloodGroup as string,
              primaryDiagnosis:
                (activePatient.conditions as string[]).length
                  ? (activePatient.conditions as string[]).join(" • ")
                  : mockPatient.primaryDiagnosis,
              riskLevel: "medium",
              allergies:
                (activePatient.allergies as string[]).length
                  ? (activePatient.allergies as string[])
                  : ["None recorded"],
              emergencyContact: activePatient.emergency || {
                name: "Not provided",
                relationship: "—",
                phone: "Not provided",
              },
              primaryPhysician: mockPatient.assignedDoctor,
            }}
            onStartConsultation={handleStartDirectConsultation}
          />

          {/* FULL ONBOARDING DETAILS + REGISTRY STATUS */}
          <PatientDetailsCard
            record={onboardingRecord}
            status={recordStatus}
            fallback={{
              name: mockPatient.name,
              primaryDiagnosis: mockPatient.primaryDiagnosis,
              treatmentStatus: mockPatient.treatmentStatus,
            }}
          />

          {/* OTHER REGISTERED PATIENTS (patients collection) */}
          <RegisteredPatientsSection />

          {/* QUICK CLINICAL ACTIONS BAR */}
          <QuickClinicalActionsBar />

          {/* 5-TAB WORKSPACE NAVIGATION (Medscope Section 4.4 & Figure 4.3) */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full h-auto p-1.5 rounded-2xl bg-card/80 border border-border/60 gap-1">
              <TabsTrigger
                value="overview"
                className="py-2.5 rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                <span>1. Overview</span>
              </TabsTrigger>

              <TabsTrigger
                value="medications"
                className="py-2.5 rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center gap-2"
              >
                <Pill className="w-4 h-4" />
                <span>2. Medications</span>
              </TabsTrigger>

              <TabsTrigger
                value="journal-trends"
                className="py-2.5 rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>3. Journal Trends</span>
              </TabsTrigger>

              <TabsTrigger
                value="consultations"
                className="py-2.5 rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>4. Consultations</span>
              </TabsTrigger>

              <TabsTrigger
                value="screening-history"
                className="py-2.5 rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center gap-2 col-span-2 sm:col-span-1"
              >
                <Brain className="w-4 h-4" />
                <span>5. Screening History</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW (Diagnostics, Labs) */}
            <TabsContent value="overview" className="space-y-6">
              <ClinicalAiSummary patientName={String(activePatient.name)} />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <LabReportsSection />
                </div>
                <div className="lg:col-span-5 space-y-6">
                  <UnifiedMedicalTimeline />
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: MEDICATIONS (Polypharmacy, Refill Schedule, Interactions) */}
            <TabsContent value="medications" className="space-y-6">
              <MedicationHistorySection />
            </TabsContent>

            {/* TAB 3: JOURNAL TRENDS (14-day Recharts & Free Text Stream) */}
            <TabsContent value="journal-trends" className="space-y-6">
              <JournalTrendsTab />
            </TabsContent>

            {/* TAB 4: CONSULTATIONS (SOAP Notes & Consultation History) */}
            <TabsContent value="consultations" className="space-y-6">
              <ConsultationNotesSOAP />
              <UnifiedMedicalTimeline />
            </TabsContent>

            {/* TAB 5: SCREENING HISTORY (PHQ-9, GAD-7, PSS-10 Psychometrics) */}
            <TabsContent value="screening-history" className="space-y-6">
              <ScreeningHistoryTab />
            </TabsContent>
          </Tabs>

        </PageTransition>
      </DoctorPageContainer>
    </DoctorLayout>
  );
};

export default PatientWorkspacePage;
