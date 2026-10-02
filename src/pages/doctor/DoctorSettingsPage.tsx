import React from "react";
import DoctorLayout from "@/components/doctor-dashboard/DoctorLayout";
import DoctorPageContainer from "@/components/doctor-dashboard/DoctorPageContainer";
import PageTransition from "@/components/doctor-dashboard/PageTransition";

import DoctorSettingsHero from "@/components/doctor-dashboard/settings/DoctorSettingsHero";
import AvailabilityStatusWidget from "@/components/doctor-dashboard/schedule/AvailabilityStatusWidget";
import DoctorPersonalInfoCard from "@/components/doctor-dashboard/settings/DoctorPersonalInfoCard";
import MedicalCredentialsCard from "@/components/doctor-dashboard/settings/MedicalCredentialsCard";
import PracticeInformationCard from "@/components/doctor-dashboard/settings/PracticeInformationCard";
import ConsultationPreferencesCard from "@/components/doctor-dashboard/settings/ConsultationPreferencesCard";
import WorkingHoursScheduleCard from "@/components/doctor-dashboard/settings/WorkingHoursScheduleCard";
import NotificationPreferencesCard from "@/components/doctor-dashboard/settings/NotificationPreferencesCard";
import DoctorAppearanceCard from "@/components/doctor-dashboard/settings/DoctorAppearanceCard";
import PrivacySecurityCard from "@/components/doctor-dashboard/settings/PrivacySecurityCard";
import ConnectedServicesCard from "@/components/doctor-dashboard/settings/ConnectedServicesCard";
import AccountDangerZoneCard from "@/components/doctor-dashboard/settings/AccountDangerZoneCard";

export const DoctorSettingsPage: React.FC = () => {
  return (
    <DoctorLayout>
      <DoctorPageContainer maxWidth="wide">
        <PageTransition className="space-y-8">
          
          {/* SECTION 1: PROFESSIONAL PROFILE HERO */}
          <DoctorSettingsHero />

          {/* SECTION 7: AVAILABILITY STATUS CONTROLLER */}
          <AvailabilityStatusWidget />

          {/* SECTION 2: PERSONAL DEMOGRAPHICS & BIO */}
          <DoctorPersonalInfoCard />

          {/* SECTION 3: MEDICAL CREDENTIALS & BOARD VERIFICATION */}
          <MedicalCredentialsCard />

          {/* SECTION 4: PRACTICE LOCATION & TELEHEALTH SETTINGS */}
          <PracticeInformationCard />

          {/* 2-COLUMN GRID FOR CONSULTATION PREFERENCES, WORKING HOURS, NOTIFICATIONS & APPEARANCE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN (7 COLS): CONSULTATION PREFERENCES & WORKING HOURS */}
            <div className="lg:col-span-7 space-y-8">
              {/* SECTION 5: CONSULTATION PREFERENCES */}
              <ConsultationPreferencesCard />

              {/* SECTION 6: WORKING HOURS & SHIFT SCHEDULE */}
              <WorkingHoursScheduleCard />
            </div>

            {/* RIGHT COLUMN (5 COLS): NOTIFICATION PREFERENCES & APPEARANCE */}
            <div className="lg:col-span-5 space-y-8">
              {/* SECTION 8: NOTIFICATION & ALERT CHANNELS */}
              <NotificationPreferencesCard />

              {/* SECTION 9: WORKSPACE APPEARANCE & THEME */}
              <DoctorAppearanceCard />
            </div>
          </div>

          {/* SECTION 10: PRIVACY, SECURITY & DATA GOVERNANCE */}
          <PrivacySecurityCard />

          {/* SECTION 11: CONNECTED SERVICES & EHR INTEGRATION */}
          <ConnectedServicesCard />

          {/* SECTION 12: ACCOUNT MANAGEMENT & DANGER ZONE */}
          <AccountDangerZoneCard />

        </PageTransition>
      </DoctorPageContainer>
    </DoctorLayout>
  );
};

export default DoctorSettingsPage;
