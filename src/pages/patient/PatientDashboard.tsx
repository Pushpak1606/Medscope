import React from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/ui/animated-background";
import DashboardHeader from "@/components/patient-dashboard/DashboardHeader";
import MobileNavDock from "@/components/patient-dashboard/MobileNavDock";
import { usePatient } from "@/context/PatientContext";
import { GlobalCommand } from "@/components/ui/global-command";

// Widgets
import HealthOverviewWidget from "@/components/patient-dashboard/widgets/HealthOverviewWidget";
import HealthProgressWidget from "@/components/patient-dashboard/widgets/HealthProgressWidget";
import AccordionInfoWidget from "@/components/patient-dashboard/widgets/AccordionInfoWidget";
import DailyTasksWidget from "@/components/patient-dashboard/widgets/DailyTasksWidget";
import ConsultationWidget from "@/components/patient-dashboard/widgets/ConsultationWidget";
import QuickActionsWidget from "@/components/patient-dashboard/widgets/QuickActionsWidget";
import MentalWellnessWidget from "@/components/patient-dashboard/widgets/MentalWellnessWidget";

const PatientDashboard = () => {
  const { profile } = usePatient();
  const displayName = profile.fullName?.split(" ")[0] || "Patient";
  const completeness = profile.profileCompleteness ?? 85;

  return (
    <div className="min-h-screen bg-surface relative flex justify-center pb-24 sm:pb-8 overflow-x-hidden">
      {/* Dynamic Background */}
      <AnimatedBackground variant="patient" className="opacity-30 fixed inset-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1400px] flex flex-col px-4 sm:px-8 py-8 md:py-10 min-h-screen gap-8">
        
        {/* Header (Top Navigation) */}
        <DashboardHeader profile={{ name: displayName, profileCompleteness: completeness }} />

        {/* Hero Area / Master Widget */}
        <HealthOverviewWidget />

        {/* Top Priority — Smart Actions Full Width */}
        <QuickActionsWidget />

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 xl:gap-8 auto-rows-max items-start">
          
          {/* Left Column (Health Metrics) */}
          <div className="flex flex-col gap-6 xl:gap-8 md:col-span-1 xl:col-span-3">
            <HealthProgressWidget />
            <MentalWellnessWidget />
          </div>

          {/* Center Column (Timeline Care Plan) */}
          <div className="flex flex-col gap-6 xl:gap-8 md:col-span-1 xl:col-span-5 lg:row-span-2">
            <DailyTasksWidget />
          </div>

          {/* Right Column (Consultations & Info) */}
          <div className="flex flex-col gap-6 xl:gap-8 md:col-span-2 xl:col-span-4">
            <ConsultationWidget />
            <AccordionInfoWidget />
          </div>

        </div>
      </div>

      {/* Mobile Nav & Global Controls */}
      <MobileNavDock />
      <GlobalCommand />
    </div>
  );
};

export default PatientDashboard;
