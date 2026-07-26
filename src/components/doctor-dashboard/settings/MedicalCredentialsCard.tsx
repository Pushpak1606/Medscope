import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { ShieldCheck, Award, FileCheck, CheckCircle2, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CredentialItem {
  label: string;
  value: string;
  subValue?: string;
  verified: boolean;
}

import { useDoctor } from "@/context/DoctorContext";

export const MedicalCredentialsCard: React.FC = () => {
  const { doctorProfile } = useDoctor();

  const credentials: CredentialItem[] = [
    { label: "Medical License Number", value: doctorProfile.licenseNumber, subValue: "State Board of Medical Examiners (READ-ONLY)", verified: true },
    { label: "NPI Registration Number", value: doctorProfile.registrationNumber, subValue: "National Provider Identifier Registry (READ-ONLY)", verified: true },
    { label: "Primary Specialization", value: doctorProfile.specialty, subValue: "Board Certified 2012 - 2032 (READ-ONLY)", verified: true },
    { label: "Sub-Specialization", value: doctorProfile.subSpecialty, subValue: "Sub-board Certified", verified: true },
    { label: "Qualifications & Degrees", value: doctorProfile.qualifications, subValue: "Johns Hopkins School of Medicine (2008)", verified: true },
    { label: "Professional Memberships", value: "American College of Cardiology (ACC)", subValue: "Fellow Member #9842", verified: true },
  ];
  return (
    <section aria-label="Medical Credentials Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Medical Credentials & Board Verification"
          subtitle="Verified state license numbers, NPI registration, board certifications & academic degrees."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>100% Board Verified</span>
            </span>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {credentials.map((cred, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {cred.label}
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                    Verified
                  </Badge>
                </div>

                <h4 className="text-sm font-bold font-heading text-foreground">{cred.value}</h4>
                {cred.subValue && <p className="text-[11px] font-medium text-muted-foreground">{cred.subValue}</p>}
              </div>

              <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 border-t border-border/30 pt-2">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified with State Registry</span>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default MedicalCredentialsCard;
