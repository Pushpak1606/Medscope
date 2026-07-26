import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { ShieldCheck, Lock, Key, Smartphone, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const PrivacySecurityCard: React.FC = () => {
  const [twoFactor, setTwoFactor] = useState(true);

  const handleExportData = () => {
    toast.success("Preparing secure export of practitioner clinical logs & records...");
  };

  const handlePasswordChange = () => {
    toast.info("Password update modal opened.");
  };

  return (
    <section aria-label="Privacy & Security Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Privacy, Security & Data Governance"
          subtitle="Manage multi-factor authentication, active practitioner sessions & HIPAA compliance data exports."
        />

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl">
              <div className="space-y-0.5">
                <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span>Two-Factor Authentication (2FA)</span>
                </div>
                <div className="text-[10px] text-muted-foreground">Mandatory for clinical chart access</div>
              </div>
              <Switch checked={twoFactor} onCheckedChange={(val) => setTwoFactor(val)} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl">
              <div className="space-y-0.5">
                <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <Key className="h-4 w-4 text-amber-500" />
                  <span>Practitioner Account Password</span>
                </div>
                <div className="text-[10px] text-muted-foreground">Last updated 45 days ago</div>
              </div>
              <Button
                onClick={handlePasswordChange}
                variant="outline"
                className="rounded-xl border-border/60 text-xs font-semibold h-8 px-3"
              >
                Change
              </Button>
            </div>
          </div>

          {/* Active Sessions Box */}
          <div className="p-4 rounded-2xl bg-background/50 border border-border/40 space-y-2">
            <span className="font-bold text-muted-foreground uppercase text-[10px]">Active Practitioner Login Sessions:</span>
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-foreground">MacBook Pro 16" • Chrome 126.0 (This Device)</div>
                <div className="text-[10px] text-muted-foreground">St. Jude Hospital Secure Network • IP 192.168.1.42</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                ACTIVE NOW
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/40 flex justify-end">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-9 px-4 gap-1.5"
            >
              <Download className="h-4 w-4 text-primary" />
              <span>Export Professional Data (HIPAA Encrypted)</span>
            </Button>
          </div>
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default PrivacySecurityCard;
