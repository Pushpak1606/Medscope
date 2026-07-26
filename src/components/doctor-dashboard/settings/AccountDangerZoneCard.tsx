import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { HelpCircle, ShieldAlert, LogOut, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AccountDangerZoneCard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("medscope-")) {
        localStorage.removeItem(key);
      }
    });
    toast.success("Doctor session closed securely.");
    navigate("/auth/select-role");
  };

  const handleDeactivate = () => {
    toast.error("Deactivation request requires Medical Board administrative approval.");
  };

  return (
    <section aria-label="Account & Support Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Account Management & Clinical Support"
          subtitle="Access practitioner support, Medscope platform details or sign out securely."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl space-y-2">
            <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-primary" />
              <span>Clinical Help Desk & Technical Support</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              24/7 dedicated physician support for EHR connectivity, telemetry integration & chart troubleshooting.
            </p>
            <Button
              onClick={() => toast.info("Opening 24/7 Physician Help Desk ticket...")}
              variant="outline"
              className="mt-2 rounded-xl border-border/60 text-xs font-semibold h-8 px-3"
            >
              Contact Support
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl space-y-2">
            <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
              <Info className="h-4 w-4 text-emerald-500" />
              <span>About Medscope Platform v4.2</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              AI-powered clinical decision support engine certified for cardiology, internal medicine & primary care.
            </p>
            <div className="text-[10px] font-mono text-muted-foreground pt-1">
              Build #2026.07.26 • Core Engine v4.2
            </div>
          </div>
        </div>

        {/* Danger Zone Actions */}
        <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-9 px-4 gap-1.5"
          >
            <LogOut className="h-4 w-4 text-primary" />
            <span>Sign Out of Doctor Session</span>
          </Button>

          <Button
            onClick={handleDeactivate}
            variant="outline"
            className="rounded-xl border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold h-9 px-4 gap-1.5"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Deactivate Practitioner Account</span>
          </Button>
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default AccountDangerZoneCard;
