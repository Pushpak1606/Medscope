import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePatient } from "@/context/PatientContext";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import { 
  Camera, Edit3, ShieldAlert, Activity, Heart, 
  Droplets, Moon, Dumbbell, MapPin, Phone, Mail, UserCircle
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const PatientProfile = () => {
  const { profile } = usePatient();

  const fullName = profile.fullName || "Patient";
  const age = profile.age || "—";
  const gender = profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "—";
  const bloodGroup = profile.bloodGroup || "—";
  const height = profile.height ? `${profile.height} cm` : "—";
  const weight = profile.weight ? `${profile.weight} kg` : "—";
  const city = profile.city || "Not set";
  const phone = profile.phone || "Not set";
  const email = profile.email || "Not set";
  const healthFocus = profile.healthFocus === "physical" ? "Physical Care" : profile.healthFocus === "mental" ? "Mental Wellness" : "Balanced Wellness";
  const completeness = profile.profileCompleteness ?? 0;

  const conditions = profile.conditions?.filter(c => c !== "None") || [];
  const allergies = profile.allergies ? profile.allergies.split(",").map(s => s.trim()).filter(Boolean) : [];
  const medications = profile.medications ? profile.medications.split(",").map(s => s.trim()).filter(Boolean) : [];
  const surgeries = profile.surgeries || "None";
  const familyHistory = profile.familyHistory || "Not provided";

  const activityMap: Record<string, string> = { low: "Low", moderate: "Moderate (3x/week)", active: "Active (5x+/week)" };
  const sleepMap: Record<string, string> = { poor: "Poor", average: "Fair (6-7 hrs)", good: "Good (7+ hrs)" };
  const stressMap: Record<string, string> = { low: "Low", moderate: "Moderate", high: "High" };
  const waterMap: Record<string, string> = { "less-4": "< 4 glasses", "4-6": "4-6 glasses", "6-8": "6-8 glasses", "more-8": "8+ glasses" };
  const dietMap: Record<string, string> = { vegetarian: "Vegetarian", "non-vegetarian": "Non-Veg", vegan: "Vegan", mixed: "Mixed" };

  const activityLevel = activityMap[profile.activityLevel || ""] || "Not set";
  const sleepQuality = sleepMap[profile.sleepQuality || ""] || "Not set";
  const stressLevel = stressMap[profile.stressLevel || ""] || "Not set";
  const waterIntake = waterMap[profile.waterIntake || ""] || "Not set";
  const diet = dietMap[profile.diet || ""] || "Not set";

  const handleAvatarChange = () => {
    toast.info("Avatar selection mode active.");
  };

  return (
    <PatientPageLayout className="w-full">
      <div className="w-full space-y-6 lg:space-y-8 pb-12">
        
        {/* --- PAGE HEADER --- */}
        <PageHeader
          title="Patient Medical Profile"
          subtitle="View and manage your personal health record, vitals, and emergency preferences."
        >
          <Button asChild className="rounded-full shadow-lg shadow-primary/20 bg-primary text-primary-foreground font-bold px-6 h-10 text-xs sm:text-sm gap-2">
            <Link to="/patient/profile/edit">
              <Edit3 className="h-4 w-4" /> Edit Profile
            </Link>
          </Button>
        </PageHeader>

        {/* --- HERO PROFILE CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="flex flex-col md:flex-row items-center md:items-start gap-8 p-6 sm:p-10 relative overflow-hidden bg-card/60 backdrop-blur-xl border-border/50">
            <div className="relative group shrink-0">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${fullName}`} alt={fullName} />
                <AvatarFallback className="text-3xl font-extrabold">{fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <button 
                onClick={handleAvatarChange}
                className="absolute bottom-0 right-0 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-4 border-background shadow-md hover:scale-105 transition-transform"
                title="Change avatar"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4 w-full">
              <div>
                <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">{fullName}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{healthFocus}</Badge>
                  <Badge variant="outline" className="border-border/60 text-muted-foreground"><MapPin className="h-3 w-3 mr-1" />{city}</Badge>
                </div>
              </div>

              <div className="bg-card/40 rounded-2xl p-4 border border-border/40 max-w-md">
                <div className="flex items-center justify-between text-sm font-bold mb-2">
                  <span className="text-muted-foreground">Profile Completeness</span>
                  <span className="text-primary">{completeness}%</span>
                </div>
                <Progress value={completeness} className="h-2 bg-muted/60" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* --- GRID DETAILS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Vitals & Basic Details */}
          <GlassCard className="p-6 space-y-4 bg-card/60 backdrop-blur-xl border-border/50">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" />
              <span>Vitals & Demographics</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-card/40 border border-border/40">
                <span className="text-muted-foreground block font-medium">Age</span>
                <span className="font-extrabold text-sm text-foreground">{age} yrs</span>
              </div>
              <div className="p-3 rounded-2xl bg-card/40 border border-border/40">
                <span className="text-muted-foreground block font-medium">Gender</span>
                <span className="font-extrabold text-sm text-foreground">{gender}</span>
              </div>
              <div className="p-3 rounded-2xl bg-card/40 border border-border/40">
                <span className="text-muted-foreground block font-medium">Blood Group</span>
                <span className="font-extrabold text-sm text-rose-400">{bloodGroup}</span>
              </div>
              <div className="p-3 rounded-2xl bg-card/40 border border-border/40">
                <span className="text-muted-foreground block font-medium">Height / Weight</span>
                <span className="font-extrabold text-sm text-foreground">{height} / {weight}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> {email}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {phone}</p>
            </div>
          </GlassCard>

          {/* Health Conditions */}
          <GlassCard className="p-6 space-y-4 bg-card/60 backdrop-blur-xl border-border/50">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Medical Conditions & Allergies</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground font-bold block mb-1.5">Known Conditions:</span>
                {conditions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {conditions.map((c, i) => (
                      <Badge key={i} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{c}</Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">None reported</span>
                )}
              </div>

              <div>
                <span className="text-muted-foreground font-bold block mb-1.5">Allergies:</span>
                {allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {allergies.map((a, i) => (
                      <Badge key={i} className="bg-rose-500/10 text-rose-400 border border-rose-500/20">{a}</Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">No known allergies</span>
                )}
              </div>

              <div>
                <span className="text-muted-foreground font-bold block mb-1.5">Current Medications:</span>
                {medications.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {medications.map((m, i) => (
                      <Badge key={i} className="bg-blue-500/10 text-blue-400 border border-blue-500/20">{m}</Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">No active prescriptions</span>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Emergency & Lifestyle */}
          <GlassCard className="p-6 space-y-4 bg-card/60 backdrop-blur-xl border-border/50">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Emergency Contact</span>
            </h3>
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1.5 text-xs">
              <span className="text-muted-foreground block font-bold">Primary Contact</span>
              <p className="font-extrabold text-sm text-foreground">{profile.emergencyName || "Not set"}</p>
              <p className="text-rose-400 font-bold">{profile.emergencyPhone || "Not set"}</p>
            </div>

            <div className="pt-2 space-y-2 text-xs">
              <span className="text-muted-foreground font-bold block">Lifestyle Habits:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-card/40 border border-border/40">Activity: {activityLevel}</div>
                <div className="p-2 rounded-xl bg-card/40 border border-border/40">Sleep: {sleepQuality}</div>
                <div className="p-2 rounded-xl bg-card/40 border border-border/40">Stress: {stressLevel}</div>
                <div className="p-2 rounded-xl bg-card/40 border border-border/40">Diet: {diet}</div>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>
    </PatientPageLayout>
  );
};

export default PatientProfile;
