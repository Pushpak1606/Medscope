import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useConsultation } from "@/context/ConsultationContext";
import { MOCK_PATIENT_DIRECTORY } from "@/components/doctor-dashboard/patients-directory/PatientDirectoryGrid";
import DoctorLayout from "@/components/doctor-dashboard/DoctorLayout";
import DoctorPageContainer from "@/components/doctor-dashboard/DoctorPageContainer";
import PageTransition from "@/components/doctor-dashboard/PageTransition";

import PatientWorkspaceHero from "@/components/doctor-dashboard/patient-workspace/PatientWorkspaceHero";
import ClinicalAiSummary from "@/components/doctor-dashboard/patient-workspace/ClinicalAiSummary";
import UnifiedMedicalTimeline from "@/components/doctor-dashboard/patient-workspace/UnifiedMedicalTimeline";
import MedicationHistorySection from "@/components/doctor-dashboard/patient-workspace/MedicationHistorySection";
import ConsultationNotesSOAP from "@/components/doctor-dashboard/patient-workspace/ConsultationNotesSOAP";
import LabReportsSection from "@/components/doctor-dashboard/patient-workspace/LabReportsSection";
import MentalHealthInsightsSection from "@/components/doctor-dashboard/patient-workspace/MentalHealthInsightsSection";
import QuickClinicalActionsBar from "@/components/doctor-dashboard/patient-workspace/QuickClinicalActionsBar";

export const PatientWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { startNewConsultationSession } = useConsultation();

  const activePatient = MOCK_PATIENT_DIRECTORY.find((p) => p.id === id) || MOCK_PATIENT_DIRECTORY[0];

  const handleStartDirectConsultation = () => {
    startNewConsultationSession(activePatient);
    navigate("/doctor/consultations");
  };

  return (
    <DoctorLayout
      doctorName="Dr. Sarah Jenkins"
      specialty="Cardiology & Internal Medicine"
      onPrimaryAction={handleStartDirectConsultation}
    >
      <DoctorPageContainer maxWidth="wide">
        <PageTransition className="space-y-8">
          
          {/* SECTION 1: PATIENT HERO */}
          <PatientWorkspaceHero />

          {/* SECTION 8: QUICK CLINICAL ACTIONS BAR */}
          <QuickClinicalActionsBar />

          {/* SECTION 2: CLINICAL AI SUMMARY */}
          <ClinicalAiSummary />

          {/* SECTION 5: CURRENT CONSULTATION NOTES (SOAP EDITOR) */}
          <ConsultationNotesSOAP />

          {/* 2-COLUMN GRID FOR TIMELINE, LABS, RX & MENTAL HEALTH INSIGHTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN (7 COLS): TIMELINE & LAB REPORTS */}
            <div className="lg:col-span-7 space-y-8">
              {/* SECTION 3: UNIFIED MEDICAL TIMELINE */}
              <UnifiedMedicalTimeline />

              {/* SECTION 6: LAB REPORTS & PDF PREVIEWS */}
              <LabReportsSection />
            </div>

            {/* RIGHT COLUMN (5 COLS): MEDICATION HISTORY & MENTAL HEALTH */}
            <div className="lg:col-span-5 space-y-8">
              {/* SECTION 4: MEDICATION HISTORY & RX CARDS */}
              <MedicationHistorySection />

              {/* SECTION 7: MENTAL HEALTH & JOURNAL INSIGHTS */}
              <MentalHealthInsightsSection />
            </div>

          </div>

        </PageTransition>
      </DoctorPageContainer>
    </DoctorLayout>
  );
};

export default PatientWorkspacePage;
