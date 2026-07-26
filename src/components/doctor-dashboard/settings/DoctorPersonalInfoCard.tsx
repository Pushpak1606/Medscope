import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { User, Mail, Phone, Calendar, Globe, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useDoctor } from "@/context/DoctorContext";

export const DoctorPersonalInfoCard: React.FC = () => {
  const { doctorProfile, updateDoctorProfile } = useDoctor();
  const [formData, setFormData] = useState({
    fullName: doctorProfile.fullName,
    email: doctorProfile.email,
    phone: doctorProfile.phone,
    gender: doctorProfile.gender,
    dob: doctorProfile.dob,
    languages: doctorProfile.languages,
    biography: doctorProfile.biography,
  });

  const handleSave = () => {
    updateDoctorProfile(formData);
    toast.success("Personal information updated & saved!");
  };

  return (
    <section aria-label="Personal Information Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Personal Demographic & Professional Bio"
          subtitle="Manage your personal contact details, demographic profile & clinician biography."
          action={
            <Button
              onClick={handleSave}
              className="rounded-xl bg-primary text-primary-foreground text-xs font-semibold h-9 px-4 gap-1.5 shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>Save Info</span>
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Full Name & Credentials</label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="rounded-xl bg-background border-border/60 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Professional Email</label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-xl bg-background border-border/60 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Direct Phone Line</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="rounded-xl bg-background border-border/60 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Spoken Languages</label>
            <Input
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              className="rounded-xl bg-background border-border/60 text-xs font-semibold"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Clinician Biography & Summary</label>
            <Textarea
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              rows={3}
              className="rounded-xl bg-background border-border/60 text-xs font-medium"
            />
          </div>
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default DoctorPersonalInfoCard;
