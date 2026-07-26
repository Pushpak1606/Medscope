import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import QuickActionButton from "../QuickActionButton";
import { Stethoscope, Pill, FileText, Calendar, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useConsultation } from "@/context/ConsultationContext";
import { useNavigate } from "react-router-dom";

export interface QuickClinicalActionsBarProps {
  patientName?: string;
}

export const QuickClinicalActionsBar: React.FC<QuickClinicalActionsBarProps> = ({
  patientName = "Marcus Vance",
}) => {
  const navigate = useNavigate();
  const { startNewConsultationSession } = useConsultation();

  const handleAction = (actionName: string) => {
    toast.success(`Action initiated for ${patientName}: ${actionName}`);
  };

  const handleStartConsultation = () => {
    startNewConsultationSession({ name: patientName });
    navigate("/doctor/consultations");
  };

  return (
    <section aria-label="Quick Clinical Actions Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-5">
        <SectionHeader
          title="Quick Clinical Actions"
          subtitle="Fast clinical triggers for direct patient care execution."
        />

        {/* 5 Quick Clinical Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <QuickActionButton
            icon={Stethoscope}
            title="Start Consultation"
            subtitle="Virtual exam room"
            variant="primary"
            onClick={handleStartConsultation}
          />

          <QuickActionButton
            icon={Pill}
            title="Write Prescription"
            subtitle="AI Rx generator"
            variant="glass"
            onClick={() => handleAction("Write Prescription")}
          />

          <QuickActionButton
            icon={FileText}
            title="Order Tests"
            subtitle="Labs & Telemetry"
            variant="glass"
            onClick={() => handleAction("Order Lab Tests")}
          />

          <QuickActionButton
            icon={Calendar}
            title="Schedule Follow-up"
            subtitle="Set next visit date"
            variant="glass"
            onClick={() => handleAction("Schedule Follow-up")}
          />

          <QuickActionButton
            icon={Share2}
            title="Refer Specialist"
            subtitle="Send referral request"
            variant="accent"
            onClick={() => handleAction("Refer Specialist")}
          />
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default QuickClinicalActionsBar;
