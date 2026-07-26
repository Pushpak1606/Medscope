import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Building, MapPin, Video, DollarSign, PhoneCall, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { useDoctor } from "@/context/DoctorContext";

export const PracticeInformationCard: React.FC = () => {
  const { doctorProfile, updateDoctorProfile } = useDoctor();
  const [hospital, setHospital] = useState(doctorProfile.hospital);
  const [dept, setDept] = useState(doctorProfile.department);
  const [address, setAddress] = useState(doctorProfile.clinicAddress);
  const [fee, setFee] = useState(doctorProfile.consultationFee);
  const [emergencyAvailable, setEmergencyAvailable] = useState(doctorProfile.emergencyAvailable);

  const handleSave = () => {
    updateDoctorProfile({
      hospital,
      department: dept,
      clinicAddress: address,
      consultationFee: fee,
      emergencyAvailable,
    });
    toast.success("Practice information updated & saved!");
  };

  return (
    <section aria-label="Practice Information Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Practice Location & Telehealth Settings"
          subtitle="Manage primary hospital affiliation, clinic address, consultation fee & emergency call availability."
          action={
            <Button
              onClick={handleSave}
              className="rounded-xl bg-primary text-primary-foreground text-xs font-semibold h-9 px-4 gap-1.5 shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>Save Practice Info</span>
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Primary Hospital Affiliation</label>
            <Input
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="rounded-xl bg-background border-border/60 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Department & Wing</label>
            <Input
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="rounded-xl bg-background border-border/60 text-xs font-semibold"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Clinic & Exam Room Address</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-xl bg-background border-border/60 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Consultation Fee ($ USD)</label>
            <Input
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="150"
              className="rounded-xl bg-background border-border/60 text-xs font-semibold"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl">
            <div className="space-y-0.5">
              <div className="font-bold text-foreground text-xs">Emergency Call Availability</div>
              <div className="text-[10px] text-muted-foreground">Accept urgent STAT telehealth triage calls</div>
            </div>
            <Switch
              checked={emergencyAvailable}
              onCheckedChange={(val) => {
                setEmergencyAvailable(val);
                toast.info(`Emergency Call availability set to ${val ? "ON" : "OFF"}`);
              }}
            />
          </div>
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default PracticeInformationCard;
