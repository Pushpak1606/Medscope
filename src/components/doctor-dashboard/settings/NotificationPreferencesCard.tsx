import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Bell, MessageSquare, AlertTriangle, Sparkles, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const NotificationPreferencesCard: React.FC = () => {
  const [prefs, setPrefs] = useState({
    appointments: true,
    patientMessages: true,
    communityActivity: true,
    aiSuggestions: true,
    emergencyAlerts: true,
    labReports: true,
  });

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success("Notification preferences updated");
      return next;
    });
  };

  return (
    <section aria-label="Notification Preferences Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Clinical Notification & Alert Channels"
          subtitle="Configure real-time push alerts, emergency notifications & diagnostic laboratory updates."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            { key: "emergencyAlerts", label: "STAT Emergency Call Alerts", desc: "Urgent telemetry & acute chest pain calls", icon: AlertTriangle, color: "text-rose-500" },
            { key: "appointments", label: "Appointment & Schedule Reminders", desc: "Upcoming consultation & follow-up alerts", icon: Bell, color: "text-primary" },
            { key: "labReports", label: "Diagnostic Lab & Biomarker Reports", desc: "Troponin T & ECG report upload notifications", icon: FileText, color: "text-emerald-500" },
            { key: "aiSuggestions", label: "AI Prescribing & Safety Insights", desc: "Drug-drug interaction & DAPT alerts", icon: Sparkles, color: "text-violet-500" },
            { key: "patientMessages", label: "Patient Messages & Follow-up Q&A", desc: "Direct patient portal messages", icon: MessageSquare, color: "text-indigo-400" },
            { key: "communityActivity", label: "Community Moderation Flags", desc: "Flagged posts & member reports", icon: Bell, color: "text-amber-500" },
          ].map((item) => {
            const IconComponent = item.icon;
            const isChecked = prefs[item.key as keyof typeof prefs];

            return (
              <div
                key={item.key}
                className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-card border border-border/40 shrink-0 ${item.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-foreground text-xs">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                  </div>
                </div>

                <Switch checked={isChecked} onCheckedChange={() => handleToggle(item.key as keyof typeof prefs)} />
              </div>
            );
          })}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default NotificationPreferencesCard;
