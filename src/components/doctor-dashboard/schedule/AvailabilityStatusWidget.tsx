import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Signal, UserCheck, Coffee, Power, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useDoctor } from "@/context/DoctorContext";

export type DoctorStatusMode = "online" | "consulting" | "break" | "offline";

export interface AvailabilityStatusWidgetProps {
  initialStatus?: DoctorStatusMode;
}

const statusOptions: {
  mode: DoctorStatusMode;
  label: string;
  desc: string;
  icon: React.ElementType;
  colorClass: string;
  activeClass: string;
}[] = [
  {
    mode: "online",
    label: "Online & Available",
    desc: "Ready for on-demand consultations",
    icon: Signal,
    colorClass: "text-emerald-500",
    activeClass: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20",
  },
  {
    mode: "consulting",
    label: "In Consultation",
    desc: "Currently conducting patient exam",
    icon: UserCheck,
    colorClass: "text-primary",
    activeClass: "bg-primary text-white shadow-lg shadow-primary/20",
  },
  {
    mode: "break",
    label: "On Break",
    desc: "Resting or charting notes",
    icon: Coffee,
    colorClass: "text-amber-500",
    activeClass: "bg-amber-500 text-white shadow-lg shadow-amber-500/20",
  },
  {
    mode: "offline",
    label: "Offline",
    desc: "Shift completed",
    icon: Power,
    colorClass: "text-slate-400",
    activeClass: "bg-slate-700 text-white shadow-lg",
  },
];

export const AvailabilityStatusWidget: React.FC<AvailabilityStatusWidgetProps> = ({
  initialStatus = "consulting",
}) => {
  const { setAvailabilityStatus } = useDoctor();
  const [currentStatus, setCurrentStatus] = useState<DoctorStatusMode>(initialStatus);

  const handleStatusChange = (mode: DoctorStatusMode, label: string) => {
    const formatted = (mode.charAt(0).toUpperCase() + mode.slice(1)) as any;
    setAvailabilityStatus(formatted);
    setCurrentStatus(mode);
    toast.success(`Doctor Availability updated to: ${label}`);
  };

  const activeOption = statusOptions.find((o) => o.mode === currentStatus);

  return (
    <section aria-label="Availability Status Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-4">
        <SectionHeader
          title="Practitioner Availability Status"
          subtitle="Real-time status broadcasted to Patient Portal & Telehealth Queue."
          badge={
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
              currentStatus === "online"
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : currentStatus === "consulting"
                ? "bg-primary/10 text-primary border-primary/20"
                : currentStatus === "break"
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
            }`}>
              <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
              <span>Current Status: {activeOption?.label}</span>
            </span>
          }
        />

        {/* Segmented Control Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {statusOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = currentStatus === option.mode;

            return (
              <button
                key={option.mode}
                onClick={() => handleStatusChange(option.mode, option.label)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3 select-none cursor-pointer ${
                  isSelected
                    ? `${option.activeClass} border-transparent scale-[1.02]`
                    : "bg-card/60 hover:bg-card border-border/60 text-foreground"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl border shrink-0 ${
                    isSelected
                      ? "bg-white/20 text-white border-white/20"
                      : `bg-card border-border/40 ${option.colorClass}`
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold font-heading truncate">{option.label}</div>
                  <div className={`text-[10px] font-medium truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                    {option.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default AvailabilityStatusWidget;
