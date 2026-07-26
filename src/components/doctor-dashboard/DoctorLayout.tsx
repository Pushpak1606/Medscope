import React, { useState } from "react";
import DoctorSidebar from "./DoctorSidebar";
import DoctorTopbar from "./DoctorTopbar";
import AnimatedBackground from "@/components/ui/animated-background";
import { cn } from "@/lib/utils";
import { useDoctor } from "@/context/DoctorContext";
import NewConsultationModal from "./consultation/NewConsultationModal";

export interface DoctorLayoutProps {
  children: React.ReactNode;
  doctorName?: string;
  specialty?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  className?: string;
}

export const DoctorLayout: React.FC<DoctorLayoutProps> = ({
  children,
  doctorName: overrideName,
  specialty: overrideSpecialty,
  primaryActionLabel,
  onPrimaryAction,
  className,
}) => {
  const { doctorProfile } = useDoctor();
  const doctorName = overrideName || doctorProfile.fullName;
  const specialty = overrideSpecialty || doctorProfile.specialty;
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNewConsultationOpen, setIsNewConsultationOpen] = useState(false);

  const handlePrimaryAction = onPrimaryAction || (() => setIsNewConsultationOpen(true));

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Ambient Glass background lighting */}
      <AnimatedBackground variant="doctor" className="opacity-30 fixed inset-0 pointer-events-none" />

      {/* Reusable Doctor Sidebar */}
      <DoctorSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area Offset by Sidebar Width */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          collapsed ? "lg:pl-20" : "lg:pl-64 sm:lg:pl-72"
        )}
      >
        {/* Reusable Doctor Topbar */}
        <DoctorTopbar
          doctorName={doctorName}
          specialty={specialty}
          primaryActionLabel={primaryActionLabel}
          onPrimaryAction={handlePrimaryAction}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
        />

        {/* Page Content Shell */}
        <main className={cn("flex-1 w-full relative z-10", className)}>
          {children}
        </main>
      </div>

      {/* Shared New Consultation Modal */}
      <NewConsultationModal
        isOpen={isNewConsultationOpen}
        onClose={() => setIsNewConsultationOpen(false)}
      />
    </div>
  );
};

export default DoctorLayout;
