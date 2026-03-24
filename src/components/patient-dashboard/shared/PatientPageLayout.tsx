import { ReactNode } from "react";
import AnimatedBackground from "@/components/ui/animated-background";
import DashboardHeader from "@/components/patient-dashboard/DashboardHeader";
import MobileNavDock from "@/components/patient-dashboard/MobileNavDock";
import { usePatient } from "@/context/PatientContext";

interface PatientPageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PatientPageLayout = ({ children, className }: PatientPageLayoutProps) => {
  const { profile } = usePatient(); // to pass to header

  return (
    <div className={`min-h-screen bg-surface relative flex justify-center pb-24 sm:pb-8 overflow-x-hidden ${className || ''}`}>
      {/* Shared Animated Background */}
      <AnimatedBackground variant="patient" className="opacity-30 fixed inset-0 pointer-events-none" />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex flex-col gap-6 sm:gap-8">
        {/* Shared Dashboard Header */}
        <DashboardHeader profile={profile} />

        {/* Page Content */}
        <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Shared Mobile Navigation */}
      <MobileNavDock />
    </div>
  );
};

export default PatientPageLayout;
