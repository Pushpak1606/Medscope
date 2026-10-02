import React from "react";
import DoctorLayout from "@/components/doctor-dashboard/DoctorLayout";
import DoctorPageContainer from "@/components/doctor-dashboard/DoctorPageContainer";
import PageTransition from "@/components/doctor-dashboard/PageTransition";

import ScheduleHero from "@/components/doctor-dashboard/schedule/ScheduleHero";
import AvailabilityStatusWidget from "@/components/doctor-dashboard/schedule/AvailabilityStatusWidget";
import TodayTimelineSection from "@/components/doctor-dashboard/schedule/TodayTimelineSection";
import WeeklyOverviewSection from "@/components/doctor-dashboard/schedule/WeeklyOverviewSection";
import PendingFollowupsSection from "@/components/doctor-dashboard/schedule/PendingFollowupsSection";
import TodayTasksChecklistSection from "@/components/doctor-dashboard/schedule/TodayTasksChecklistSection";

export const DoctorSchedulePage: React.FC = () => {
  return (
    <DoctorLayout>
      <DoctorPageContainer maxWidth="wide">
        <PageTransition className="space-y-8">
          
          {/* SECTION 1: SCHEDULE HERO */}
          <ScheduleHero />

          {/* SECTION 6: AVAILABILITY STATUS CONTROLLER */}
          <AvailabilityStatusWidget />

          {/* SECTION 3: WEEKLY OVERVIEW PLANNER */}
          <WeeklyOverviewSection />

          {/* SECTION 2: TODAY'S APPOINTMENT TIMELINE (Heart of Workspace) */}
          <TodayTimelineSection />

          {/* 2-COLUMN GRID FOR PENDING FOLLOW-UPS & TASKS CHECKLIST */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* SECTION 4: PENDING CLINICAL FOLLOW-UPS (7 COLS) */}
            <div className="lg:col-span-7 space-y-8">
              <PendingFollowupsSection />
            </div>

            {/* SECTION 5: TODAY'S CLINICAL TASKS CHECKLIST (5 COLS) */}
            <div className="lg:col-span-5 space-y-8">
              <TodayTasksChecklistSection />
            </div>
          </div>

        </PageTransition>
      </DoctorPageContainer>
    </DoctorLayout>
  );
};

export default DoctorSchedulePage;
