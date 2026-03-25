import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePatient } from "@/context/PatientContext";
import { 
  Camera, Edit3, ShieldAlert, Activity, Heart, 
  Droplets, Moon, Dumbbell, MapPin, Phone, Mail, UserCircle
} from "lucide-react";

import AnimatedBackground from "@/components/ui/animated-background";
import DashboardHeader from "@/components/patient-dashboard/DashboardHeader";
import MobileNavDock from "@/components/patient-dashboard/MobileNavDock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const PatientProfile = () => {
  const { profile } = usePatient();

  // Derive display values with fallbacks
  const fullName = profile.fullName || "Patient";
  const displayName = fullName.split(" ")[0];
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

  const consultationType = profile.consultationType ? profile.consultationType.charAt(0).toUpperCase() + profile.consultationType.slice(1) : "Not set";

  return (
    <div className="min-h-screen bg-surface relative flex justify-center pb-24 sm:pb-8 overflow-x-hidden">
      <AnimatedBackground variant="patient" className="opacity-30 fixed inset-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-[1400px] flex flex-col px-4 sm:px-8 py-8 md:py-10 min-h-screen gap-8">
        <DashboardHeader profile={{ name: displayName, profileCompleteness: completeness }} />

        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-6 sm:p-10 shadow-sm relative overflow-hidden mt-4"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 blur-[60px] rounded-full pointer-events-none"></div>

          <div className="relative group shrink-0">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${fullName}`} alt={fullName} />
              <AvatarFallback className="text-3xl">{fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-4 border-background shadow-md hover:scale-105 transition-transform">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            <div>
              <h1 className="text-3xl font-extrabold font-heading text-foreground">{fullName}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{healthFocus}</Badge>
                <Badge variant="outline" className="border-border/60 text-muted-foreground"><MapPin className="h-3 w-3 mr-1" />{city}</Badge>
              </div>
            </div>

            <div className="bg-background/50 rounded-xl p-4 border border-border/50 max-w-md">
              <div className="flex items-center justify-between text-sm font-bold mb-2">
                <span className="text-muted-foreground">Profile Completeness</span>
                <span className="text-primary">{completeness}%</span>
              </div>
              <Progress value={completeness} className="h-2 bg-muted/60" />
            </div>
          </div>
          
          <div className="w-full md:w-auto mt-4 md:mt-0">
             <Button variant="outline" className="w-full rounded-xl border-border/60 hover:bg-muted font-bold h-11">
               <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
             </Button>
          </div>
        </motion.div>

        {/* INFO GRIDS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* SECTION 1: Personal Details */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-6 sm:p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" /> Personal Details
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
               <div><p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Age / Gender</p><p className="font-bold text-foreground">{age} yrs • {gender}</p></div>
               <div><p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Blood Group</p><p className="font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md inline-block">{bloodGroup}</p></div>
               <div><p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Height</p><p className="font-bold text-foreground">{height}</p></div>
               <div><p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Weight</p><p className="font-bold text-foreground">{weight}</p></div>
               <div className="col-span-2"><p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Phone Number</p><p className="font-bold text-foreground flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground"/> {phone}</p></div>
               <div className="col-span-2"><p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Email</p><p className="font-bold text-foreground flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground"/> {email}</p></div>
            </div>
          </div>

          {/* SECTION 2: Health Info */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-6 sm:p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" /> Health Information
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {conditions.length > 0 ? conditions.map((c, i) => <Badge key={i} variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">{c}</Badge>) : <span className="text-sm text-muted-foreground">None reported</span>}
                </div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase mb-2 flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5 text-red-500" /> Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {allergies.length > 0 ? allergies.map((a, i) => <Badge key={i} variant="outline" className="border-red-500/30 text-red-500 bg-red-500/5">{a}</Badge>) : <span className="text-sm text-muted-foreground">None reported</span>}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Current Medications</p>
                {medications.length > 0 ? (
                  <ul className="list-disc list-inside text-sm font-semibold text-foreground space-y-1">
                    {medications.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                ) : <span className="text-sm text-muted-foreground">None</span>}
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Past Surgeries / Family History</p>
                <p className="text-sm font-semibold text-foreground">{surgeries}</p>
                <p className="text-sm text-muted-foreground mt-1 text-xs">Family: {familyHistory}</p>
              </div>
            </div>
          </div>

          {/* SECTION 3: Lifestyle & Wellness */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-6 sm:p-8 flex flex-col h-full md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" /> Lifestyle & Wellness
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-background/50 p-4 rounded-2xl border border-border/60">
                <Dumbbell className="h-5 w-5 text-primary mb-2" />
                <p className="text-xs text-muted-foreground font-semibold uppercase">Activity</p>
                <p className="font-bold text-sm text-foreground mt-1">{activityLevel}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-2xl border border-border/60">
                <Moon className="h-5 w-5 text-indigo-500 mb-2" />
                <p className="text-xs text-muted-foreground font-semibold uppercase">Sleep</p>
                <p className="font-bold text-sm text-foreground mt-1">{sleepQuality}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-2xl border border-border/60">
                <Droplets className="h-5 w-5 text-blue-400 mb-2" />
                <p className="text-xs text-muted-foreground font-semibold uppercase">Hydration</p>
                <p className="font-bold text-sm text-foreground mt-1">{waterIntake}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-2xl border border-border/60">
                <Activity className="h-5 w-5 text-orange-500 mb-2" />
                <p className="text-xs text-muted-foreground font-semibold uppercase">Stress</p>
                <p className="font-bold text-sm text-foreground mt-1">{stressLevel}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-border/50">
               <Badge variant="outline" className={`px-3 py-1 text-sm ${!profile.smokes ? "border-green-500/30 text-green-500 bg-green-500/5" : "border-orange-500/30 text-orange-500 bg-orange-500/5"}`}>
                 Smoking: {profile.smokes ? "Yes" : "No"}
               </Badge>
               <Badge variant="outline" className={`px-3 py-1 text-sm ${!profile.alcohol ? "border-green-500/30 text-green-500 bg-green-500/5" : "border-orange-500/30 text-orange-500 bg-orange-500/5"}`}>
                 Alcohol: {profile.alcohol ? "Yes" : "No"}
               </Badge>
               <Badge variant="secondary" className="px-3 py-1 text-sm bg-muted text-foreground">
                 Diet: {diet}
               </Badge>
            </div>
          </div>

          {/* SECTION 4: Emergency */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-6 sm:p-8 flex flex-col h-full md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-heading text-red-500 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" /> Emergency Contact
              </h2>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 mt-auto">
               <p className="font-bold text-lg text-foreground mb-1">{profile.emergencyName || "Not set"}</p>
               <p className="text-sm font-semibold text-muted-foreground mb-4">Phone: {profile.emergencyPhone || "Not set"}</p>
               {profile.emergencyPhone && (
                 <a href={`tel:${profile.emergencyPhone}`} className="inline-flex items-center justify-center w-full bg-red-500 text-white shadow-md shadow-red-500/20 font-bold h-11 rounded-xl hover:bg-red-600 transition-colors">
                   Call Emergency Contact
                 </a>
               )}
            </div>
          </div>

          {/* SECTION 5: Preferences */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-6 sm:p-8 flex flex-col h-full md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" /> Preferences
              </h2>
            </div>
            <div className="space-y-4 flex-1">
               <div className="flex justify-between items-center py-2 border-b border-border/40">
                 <span className="text-sm font-semibold text-muted-foreground">Consultation</span>
                 <span className="text-sm font-bold text-foreground">{consultationType}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-border/40">
                 <span className="text-sm font-semibold text-muted-foreground">Health Focus</span>
                 <span className="text-sm font-bold text-foreground">{healthFocus}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-border/40">
                 <span className="text-sm font-semibold text-muted-foreground">Language</span>
                 <span className="text-sm font-bold text-foreground">{profile.language ? profile.language.charAt(0).toUpperCase() + profile.language.slice(1) : "English"}</span>
               </div>
            </div>
            <Button asChild variant="outline" className="w-full rounded-xl border-border/60 hover:bg-muted font-bold h-11 mt-6">
              <Link to="/patient/settings">Manage full settings</Link>
            </Button>
          </div>

        </motion.div>
      </div>

      <MobileNavDock />
    </div>
  );
};

export default PatientProfile;
