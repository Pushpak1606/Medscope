import React from "react";
import DoctorLayout from "@/components/doctor-dashboard/DoctorLayout";
import DoctorPageContainer from "@/components/doctor-dashboard/DoctorPageContainer";
import PageTransition from "@/components/doctor-dashboard/PageTransition";

import PatientClinicalSummaryWidget from "@/components/doctor-dashboard/medicine-assistant/PatientClinicalSummaryWidget";
import CurrentMedicationsWidget from "@/components/doctor-dashboard/medicine-assistant/CurrentMedicationsWidget";
import PrescriptionBuilderWidget from "@/components/doctor-dashboard/medicine-assistant/PrescriptionBuilderWidget";
import ClinicalAiPrescribingSupport from "@/components/doctor-dashboard/medicine-assistant/ClinicalAiPrescribingSupport";
import DrugInteractionReviewWidget from "@/components/doctor-dashboard/medicine-assistant/DrugInteractionReviewWidget";
import FinalPrescriptionPreview from "@/components/doctor-dashboard/medicine-assistant/FinalPrescriptionPreview";

export const DoctorMedicineAssistantPage: React.FC = () => {
  return (
    <DoctorLayout doctorName="Dr. Sarah Jenkins" specialty="Cardiology & Internal Medicine">
      <DoctorPageContainer maxWidth="wide">
        <PageTransition className="space-y-8">
          
          {/* SECTION 1: PATIENT CLINICAL SUMMARY */}
          <PatientClinicalSummaryWidget />

          {/* SECTION 2: CURRENT MEDICATION REGIMEN */}
          <CurrentMedicationsWidget />

          {/* SECTION 4: CLINICAL DECISION SUPPORT (AI PRESCRIBING GUIDANCE) */}
          <ClinicalAiPrescribingSupport />

          {/* SECTION 5: DRUG INTERACTION REVIEW (SAFETY MATRIX) */}
          <DrugInteractionReviewWidget />

          {/* SECTION 3: PRESCRIPTION BUILDER (INTERACTIVE RX COMPOSER) */}
          <PrescriptionBuilderWidget />

          {/* SECTION 6: FINAL PRESCRIPTION PREVIEW & SIGNATURE */}
          <FinalPrescriptionPreview />

        </PageTransition>
      </DoctorPageContainer>
    </DoctorLayout>
  );
};

export default DoctorMedicineAssistantPage;
