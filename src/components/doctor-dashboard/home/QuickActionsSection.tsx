import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import QuickActionButton from "../QuickActionButton";
import { Stethoscope, Search, Pill, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import NewConsultationModal from "../consultation/NewConsultationModal";

export const QuickActionsSection: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = (actionName: string, path?: string) => {
    toast.success(`Action launched: ${actionName}`);
    if (path) {
      navigate(path);
    }
  };

  return (
    <section aria-label="Quick Actions Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-5">
        <SectionHeader
          title="Quick Actions"
          subtitle="Fast clinical triggers for immediate patient care."
        />

        {/* Strictly 4 Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            icon={Stethoscope}
            title="New Consultation"
            subtitle="Launch virtual exam room"
            variant="primary"
            onClick={() => setIsModalOpen(true)}
          />

          <QuickActionButton
            icon={Search}
            title="Find Patient"
            subtitle="Search medical records"
            variant="glass"
            onClick={() => handleAction("Find Patient", "/doctor/patients")}
          />

          <QuickActionButton
            icon={Pill}
            title="Write Prescription"
            subtitle="AI safety checked Rx"
            variant="glass"
            onClick={() => handleAction("Write Prescription", "/doctor/medicine-assistant")}
          />

          <QuickActionButton
            icon={AlertCircle}
            title="Emergency Consultation"
            subtitle="Immediate priority triage"
            variant="accent"
            onClick={() => handleAction("Emergency Consultation", "/doctor/consultations")}
          />
        </div>
      </DoctorGlassCard>

      <NewConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default QuickActionsSection;
