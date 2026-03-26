import { ReactNode } from "react";
import AnimatedBackground from "@/components/ui/animated-background";
import DashboardHeader from "@/components/patient-dashboard/DashboardHeader";
import MobileNavDock from "@/components/patient-dashboard/MobileNavDock";
import { usePatient } from "@/context/PatientContext";
import { GlobalCommand } from "@/components/ui/global-command";

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
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <main className="relative z-10 w-full max-w-[1400px] flex flex-col px-4 sm:px-8 py-8 md:py-10 min-h-screen gap-8">
        {/* Shared Dashboard Header */}
        <DashboardHeader profile={profile} />

        {/* Page Content */}
        <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Shared Mobile Navigation */}
      <MobileNavDock />
      <GlobalCommand />
    </div>
  );
};

export default PatientPageLayout;
