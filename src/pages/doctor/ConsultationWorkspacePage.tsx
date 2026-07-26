import React from "react";
import DoctorLayout from "@/components/doctor-dashboard/DoctorLayout";
import DoctorPageContainer from "@/components/doctor-dashboard/DoctorPageContainer";
import PageTransition from "@/components/doctor-dashboard/PageTransition";
import UnifiedConsultationRoom from "@/components/consultation/UnifiedConsultationRoom";

export const ConsultationWorkspacePage: React.FC = () => {
  return (
    <DoctorLayout doctorName="Dr. Sarah Jenkins" specialty="Cardiology & Internal Medicine">
      <DoctorPageContainer maxWidth="wide">
        <PageTransition className="space-y-8">
          <UnifiedConsultationRoom role="doctor" />
        </PageTransition>
      </DoctorPageContainer>
    </DoctorLayout>
  );
};

export default ConsultationWorkspacePage;
