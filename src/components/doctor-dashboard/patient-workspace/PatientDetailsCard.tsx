import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Pill,
  ShieldAlert,
  User,
  Phone,
  MapPin,
  Mail,
  Droplet,
  Ruler,
  Scale,
  CalendarDays,
  Cigarette,
  Wine,
  ClipboardList,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface PatientDetailsCardProps {
  record: Record<string, any> | null;
  status: "loading" | "loaded" | "missing";
  fallback?: {
    name: string;
    primaryDiagnosis: string;
    treatmentStatus: string;
  };
}

const Row = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) => {
  if (!value || !String(value).trim()) return null;
  return (
    <div className="flex items-start gap-2.5 text-xs">
      <Icon className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
      <div className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="block font-semibold text-foreground break-words">{value}</span>
      </div>
    </div>
  );
};

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary">
    {children}
  </span>
);

/**
 * Full patient onboarding record (Firestore patients/{uid}) shown to the
 * doctor: identity, vitals basics, conditions, medication, allergies,
 * lifestyle, and emergency contact. Shows a clear message when the
 * selected patient has no onboarding record yet.
 */
export const PatientDetailsCard: React.FC<PatientDetailsCardProps> = ({ record, status, fallback }) => {
  if (status === "loading") {
    return (
      <DoctorGlassCard variant="default" padding="lg" className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 animate-pulse text-primary" />
          Loading patient onboarding record from Firestore...
        </div>
      </DoctorGlassCard>
    );
  }

  if (!record) {
    return (
      <DoctorGlassCard variant="default" padding="lg" className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          No onboarding record found in Firestore
        </div>
        <p className="text-xs text-muted-foreground">
          {fallback?.name} has no completed onboarding yet. Showing demo clinical data below. When the patient
          completes onboarding, their details appear here automatically.
        </p>
      </DoctorGlassCard>
    );
  }

  const conditions: string[] = Array.isArray(record.conditions) ? record.conditions : [];
  const allergies: string[] = Array.isArray(record.allergiesList) ? record.allergiesList : [];
  const allergiesText = allergies.length
    ? allergies.join(", ")
    : typeof record.allergies === "string" && record.allergies
    ? record.allergies
    : "";
  const interests: string[] = Array.isArray(record.interests) ? record.interests : [];

  return (
    <DoctorGlassCard variant="default" padding="lg" className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
            Patient Onboarding Details
          </h3>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold shadow-none">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Synced from Firestore
        </Badge>
      </div>

      {/* Identity Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-1">
        <Row icon={User} label="Full Name" value={record.fullName} />
        <Row icon={CalendarDays} label="Age" value={record.age ? `${record.age} yrs` : ""} />
        <Row icon={User} label="Gender" value={record.gender ? record.gender.charAt(0).toUpperCase() + record.gender.slice(1) : ""} />
        <Row icon={Droplet} label="Blood Group" value={record.bloodGroup} />
        <Row icon={Phone} label="Phone" value={record.phone} />
        <Row icon={Mail} label="Email" value={record.email} />
        <Row icon={MapPin} label="City" value={record.city} />
        <Row icon={Ruler} label="Height" value={record.height ? `${record.height} cm` : ""} />
        <Row icon={Scale} label="Weight" value={record.weight ? `${record.weight} kg` : ""} />
      </div>

      {/* Conditions */}
      {conditions.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-rose-500" /> Known Conditions
          </span>
          <div className="flex flex-wrap gap-2">
            {conditions.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </div>
      )}

      {/* Health Grid: medication, allergies, surgeries, family history */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Row icon={Pill} label="Current Medication" value={record.hasMedications ? record.medications : "None reported"} />
        <Row
          icon={ShieldAlert}
          label="Allergies"
          value={
            allergiesText
              ? allergiesText
              : record.hasAllergies
              ? "Reported, details pending"
              : "None reported"
          }
        />
        <Row icon={ClipboardList} label="Surgeries" value={record.hasSurgeries ? record.surgeriesDetails : "None reported"} />
        <Row icon={Users} label="Family History" value={record.familyMedicalHistory} />
      </div>

      {/* Lifestyle Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-1 border-t border-border/40 pt-4">
        <Row icon={Activity} label="Activity" value={record.activityLevel} />
        <Row icon={ClipboardList} label="Sleep" value={record.sleepQuality} />
        <Row icon={Activity} label="Stress" value={record.stressLevel} />
        <Row icon={Droplet} label="Water Intake" value={record.dailyWaterIntake} />
        <Row icon={ClipboardList} label="Diet" value={record.foodPreference} />
        <Row icon={Cigarette} label="Smoking" value={record.smokes ? "Yes" : "No"} />
        <Row icon={Wine} label="Alcohol" value={record.consumesAlcohol ? "Yes" : "No"} />
        <Row icon={Heart} label="Health Focus" value={record.healthFocus} />
      </div>

      {/* Emergency Contact */}
      <div className="rounded-2xl bg-rose-500/5 border border-rose-500/20 p-4 space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5" /> Emergency Contact
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <span className="font-semibold text-foreground">{record.emergencyContactName || "Not provided"}</span>
          <span className="text-muted-foreground">{record.emergencyContactRelation || "—"}</span>
          <span className="font-mono text-foreground">{record.emergencyContactPhone || "Not provided"}</span>
        </div>
      </div>

      {/* Wellness interests */}
      {interests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {interests.map((i) => (
            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted/70 border border-border/50 text-[11px] font-semibold text-muted-foreground">
              {i}
            </span>
          ))}
        </div>
      )}
    </DoctorGlassCard>
  );
};

export default PatientDetailsCard;
