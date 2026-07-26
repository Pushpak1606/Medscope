import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Edit3, Award, Globe, Building, Stethoscope, CheckCircle2 } from "lucide-react";

import { useDoctor } from "@/context/DoctorContext";

export interface DoctorSettingsHeroProps {
  doctorName?: string;
  specialty?: string;
  hospital?: string;
  licenseNumber?: string;
  experienceYears?: string;
  languages?: string;
  availabilityStatus?: string;
  onEditProfile?: () => void;
}

export const DoctorSettingsHero: React.FC<DoctorSettingsHeroProps> = ({
  doctorName: overrideName,
  specialty: overrideSpecialty,
  hospital: overrideHospital,
  licenseNumber: overrideLicense,
  experienceYears: overrideExp,
  languages: overrideLang,
  availabilityStatus: overrideStatus,
  onEditProfile,
}) => {
  const { doctorProfile } = useDoctor();
  const doctorName = overrideName || doctorProfile.fullName;
  const specialty = overrideSpecialty || doctorProfile.specialty;
  const hospital = overrideHospital || doctorProfile.hospital;
  const licenseNumber = overrideLicense || `${doctorProfile.licenseNumber} (${doctorProfile.registrationNumber})`;
  const experienceYears = overrideExp || doctorProfile.experienceYears;
  const languages = overrideLang || doctorProfile.languages;
  const availabilityStatus = overrideStatus || doctorProfile.availabilityStatus;
  return (
    <DoctorGlassCard
      variant="glow"
      glowColor="primary"
      padding="lg"
      className="border-primary/30 relative overflow-hidden bg-gradient-to-r from-card/90 via-card/70 to-primary/5 space-y-6"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Avatar, Name & Professional Badges */}
        <div className="flex items-start sm:items-center gap-5 min-w-0 flex-1">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl border-2 border-primary/40 shadow-xl shrink-0">
            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${doctorName}`} alt={doctorName} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-2xl rounded-3xl">SJ</AvatarFallback>
          </Avatar>

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Verified Clinician • {licenseNumber}</span>
              </span>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Status: {availabilityStatus}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight truncate">
              {doctorName}
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-primary flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4 shrink-0" />
              <span>{specialty}</span>
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-primary" /> <strong className="text-foreground">{hospital}</strong>
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-amber-500" /> {experienceYears}
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-indigo-400" /> {languages}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Edit Profile Button */}
        <div className="shrink-0 pt-2 lg:pt-0">
          <Button
            onClick={onEditProfile}
            className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-10 px-4 gap-2 shadow-md shadow-primary/20"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Doctor Profile</span>
          </Button>
        </div>

      </div>
    </DoctorGlassCard>
  );
};

export default DoctorSettingsHero;
