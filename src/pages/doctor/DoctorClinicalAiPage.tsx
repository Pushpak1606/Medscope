import React from "react";
import DoctorLayout from "@/components/doctor-dashboard/DoctorLayout";
import DoctorPageContainer from "@/components/doctor-dashboard/DoctorPageContainer";
import PageTransition from "@/components/doctor-dashboard/PageTransition";

import ClinicalAiHero from "@/components/doctor-dashboard/clinical-ai/ClinicalAiHero";
import PatientClinicalInsightsSection from "@/components/doctor-dashboard/clinical-ai/PatientClinicalInsightsSection";
import TreatmentDraftsSection from "@/components/doctor-dashboard/clinical-ai/TreatmentDraftsSection";
import ClinicalKnowledgeWidget from "@/components/doctor-dashboard/clinical-ai/ClinicalKnowledgeWidget";
import PatientEducationGeneratorSection from "@/components/doctor-dashboard/clinical-ai/PatientEducationGeneratorSection";
import ReferralSuggestionsSection from "@/components/doctor-dashboard/clinical-ai/ReferralSuggestionsSection";
import AiClinicalPanel from "@/components/doctor-dashboard/clinical-ai/AiClinicalPanel";

export const DoctorClinicalAiPage: React.FC = () => {
  return (
    <DoctorLayout doctorName="Dr. Sarah Jenkins" specialty="Cardiology & Internal Medicine">
      <DoctorPageContainer maxWidth="wide">
        <PageTransition className="space-y-8">
          
          {/* SECTION 1: ASSISTANT DOCTOR HERO */}
          <ClinicalAiHero />

          {/* SECTION 2: PATIENT CLINICAL INSIGHTS */}
          <PatientClinicalInsightsSection />

          {/* SECTION 3: TREATMENT DRAFTS (REVIEW & APPROVE) */}
          <TreatmentDraftsSection />

          {/* SECTION 6: SPECIALIST REFERRAL SUGGESTIONS */}
          <ReferralSuggestionsSection />

          {/* SECTION 5: PATIENT EDUCATION GENERATOR */}
          <PatientEducationGeneratorSection />

          {/* 2-COLUMN GRID FOR KNOWLEDGE REFERENCES & EMBEDDED AI DIALOGUE PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* SECTION 4: CLINICAL KNOWLEDGE GUIDELINES (7 COLS) */}
            <div className="lg:col-span-7 space-y-8">
              <ClinicalKnowledgeWidget />
            </div>

            {/* SECTION 7: CLINICAL WORKSPACE EMBEDDED AI PANEL (5 COLS) */}
            <div className="lg:col-span-5 space-y-8">
              <AiClinicalPanel />
            </div>
          </div>

        </PageTransition>
      </DoctorPageContainer>
    </DoctorLayout>
  );
};

export default DoctorClinicalAiPage;
