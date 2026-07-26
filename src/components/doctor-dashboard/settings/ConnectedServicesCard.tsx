import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Link2, CheckCircle2, Calendar, Video, Building, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface ServiceIntegration {
  id: string;
  name: string;
  category: "Calendar" | "Telehealth" | "EHR / Standards";
  status: "connected" | "disconnected";
  icon: string;
  desc: string;
}

const INITIAL_SERVICES: ServiceIntegration[] = [
  { id: "s-1", name: "Google Calendar", category: "Calendar", status: "connected", icon: "Calendar", desc: "Sync shift schedule & follow-ups" },
  { id: "s-2", name: "Microsoft Outlook", category: "Calendar", status: "connected", icon: "Calendar", desc: "Hospital department email & schedule sync" },
  { id: "s-3", name: "Zoom Healthcare Telehealth", category: "Telehealth", status: "connected", icon: "Video", desc: "HIPAA-compliant video consultation stream" },
  { id: "s-4", name: "Microsoft Teams", category: "Telehealth", status: "disconnected", icon: "Video", desc: "Clinical team collaboration channel" },
  { id: "s-5", name: "Hospital Information System (HIS)", category: "EHR / Standards", status: "connected", icon: "Building", desc: "St. Jude Epic / Cerner EHR integration" },
  { id: "s-6", name: "HL7 / FHIR API Gateway", category: "EHR / Standards", status: "connected", icon: "RefreshCw", desc: "Interoperable health data telemetry exchange" },
];

export const ConnectedServicesCard: React.FC = () => {
  const [services, setServices] = useState<ServiceIntegration[]>(INITIAL_SERVICES);

  const handleToggleService = (id: string, name: string, currentStatus: "connected" | "disconnected") => {
    const next = currentStatus === "connected" ? "disconnected" : "connected";
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: next } : s))
    );
    toast.success(
      next === "connected" ? `Connected to ${name}` : `Disconnected ${name}`
    );
  };

  return (
    <section aria-label="Connected Services Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Connected Services & EHR Integration"
          subtitle="Hospital Information Systems (Epic/Cerner), FHIR/HL7 gateways, calendars & telehealth platforms."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {srv.category}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      srv.status === "connected"
                        ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                        : "bg-muted text-muted-foreground border-border/40"
                    }`}
                  >
                    {srv.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-heading text-foreground pt-1">{srv.name}</h4>
                <p className="text-[11px] text-muted-foreground font-medium">{srv.desc}</p>
              </div>

              <div className="pt-2 border-t border-border/30">
                <Button
                  onClick={() => handleToggleService(srv.id, srv.name, srv.status)}
                  variant="outline"
                  className="w-full rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-8 gap-1.5"
                >
                  <Link2 className="h-3.5 w-3.5 text-primary" />
                  <span>{srv.status === "connected" ? "Manage Integration" : "Connect Service"}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ConnectedServicesCard;
