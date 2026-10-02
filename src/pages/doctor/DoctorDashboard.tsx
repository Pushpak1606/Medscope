import React from "react";
import DoctorLayout from "@/components/doctor-dashboard/DoctorLayout";
import DoctorPageContainer from "@/components/doctor-dashboard/DoctorPageContainer";
import WorkspaceHero from "@/components/doctor-dashboard/home/WorkspaceHero";
import PatientQueueSection from "@/components/doctor-dashboard/home/PatientQueueSection";
import ScheduleTimelineSection from "@/components/doctor-dashboard/home/ScheduleTimelineSection";
import QuickActionsSection from "@/components/doctor-dashboard/home/QuickActionsSection";
import AvailabilityStatusWidget from "@/components/doctor-dashboard/schedule/AvailabilityStatusWidget";
import PageTransition from "@/components/doctor-dashboard/PageTransition";

export const DoctorDashboard: React.FC = () => {
  return (
    <DoctorLayout>
      <DoctorPageContainer maxWidth="wide">
        <PageTransition className="space-y-8">
          
          {/* SECTION 1: WORKSPACE HERO */}
          <WorkspaceHero />

          {/* SECTION 2: PRACTITIONER AVAILABILITY STATUS */}
          <AvailabilityStatusWidget />

          {/* QUICK ACTIONS */}
          <QuickActionsSection />

          {/* PATIENT QUEUE (Heart of Workspace) */}
          <PatientQueueSection />

          {/* TODAY'S SCHEDULE TIMELINE */}
          <ScheduleTimelineSection />

        </PageTransition>
      </DoctorPageContainer>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
