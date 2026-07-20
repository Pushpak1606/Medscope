import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePatient, PatientProfile, calculateProfileCompleteness } from "@/context/PatientContext";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import { CheckCircle, UserCircle, Activity, Heart, ShieldAlert, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const EditProfile = () => {
  const { profile, updateProfile } = usePatient();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Local drafted state
  const [draft, setDraft] = useState<PatientProfile>({
    fullName: profile.fullName || "",
    age: profile.age || "",
    gender: profile.gender || "",
    bloodGroup: profile.bloodGroup || "",
    height: profile.height || "",
    weight: profile.weight || "",
    conditions: profile.conditions || [],
    allergies: profile.allergies || "",
    medications: profile.medications || "",
    surgeries: profile.surgeries || "",
    familyHistory: profile.familyHistory || "",
    activityLevel: profile.activityLevel || "",
    sleepQuality: profile.sleepQuality || "",
    stressLevel: profile.stressLevel || "",
    waterIntake: profile.waterIntake || "",
    diet: profile.diet || "",
    smokes: profile.smokes || false,
    alcohol: profile.alcohol || false,
    emergencyName: profile.emergencyName || "",
    emergencyPhone: profile.emergencyPhone || "",
    city: profile.city || ""
  });

  const handleChange = (field: keyof PatientProfile, value: any) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    const newCompleteness = calculateProfileCompleteness(draft);
    
    updateProfile({ ...draft, profileCompleteness: newCompleteness });

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile saved and updated across Medscope!");
      navigate("/patient/profile");
    }, 600);
  };

  return (
    <PatientPageLayout className="w-full">
      <div className="w-full space-y-6 lg:space-y-8 pb-12">
        
        {/* --- PAGE HEADER --- */}
        <PageHeader
          title="Edit Medical Profile"
          subtitle="Update your vitals, conditions, lifestyle habits, and emergency contacts."
        >
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="rounded-full shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 h-10 text-xs sm:text-sm gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Profile"}</span>
          </Button>
        </PageHeader>

        {/* --- FORM SECTIONS --- */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Section 1: Demographics */}
          <GlassCard className="p-6 sm:p-8 space-y-6 bg-card/60 backdrop-blur-xl border-border/50">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <UserCircle className="w-5 h-5 text-primary" />
              <span>Demographics & Vitals</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="space-y-2">
                <Label className="font-semibold">Full Name</Label>
                <Input value={draft.fullName} onChange={e => handleChange("fullName", e.target.value)} className="bg-card rounded-xl h-10 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">City</Label>
                <Input value={draft.city} onChange={e => handleChange("city", e.target.value)} className="bg-card rounded-xl h-10 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Age</Label>
                <Input value={draft.age} onChange={e => handleChange("age", e.target.value)} className="bg-card rounded-xl h-10 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Gender</Label>
                <Select value={draft.gender} onValueChange={v => handleChange("gender", v)}>
                  <SelectTrigger className="bg-card rounded-xl h-10 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Blood Group</Label>
                <Input value={draft.bloodGroup} onChange={e => handleChange("bloodGroup", e.target.value)} placeholder="e.g. O+" className="bg-card rounded-xl h-10 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Height (cm) / Weight (kg)</Label>
                <div className="flex gap-2">
                  <Input value={draft.height} onChange={e => handleChange("height", e.target.value)} placeholder="cm" className="bg-card rounded-xl h-10 text-xs" />
                  <Input value={draft.weight} onChange={e => handleChange("weight", e.target.value)} placeholder="kg" className="bg-card rounded-xl h-10 text-xs" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section 2: Health Conditions */}
          <GlassCard className="p-6 sm:p-8 space-y-6 bg-card/60 backdrop-blur-xl border-border/50">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Medical History & Allergies</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <Label className="font-semibold">Known Conditions (comma separated)</Label>
                <Input 
                  value={draft.conditions?.join(", ")} 
                  onChange={e => handleChange("conditions", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} 
                  placeholder="e.g. Asthma, Hypertension" 
                  className="bg-card rounded-xl h-10 text-xs" 
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Allergies (comma separated)</Label>
                <Input value={draft.allergies} onChange={e => handleChange("allergies", e.target.value)} placeholder="e.g. Penicillin, Peanuts" className="bg-card rounded-xl h-10 text-xs" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="font-semibold">Current Medications</Label>
                <Textarea value={draft.medications} onChange={e => handleChange("medications", e.target.value)} placeholder="List any daily prescriptions..." className="bg-card rounded-xl text-xs min-h-[80px]" />
              </div>
            </div>
          </GlassCard>

          {/* Section 3: Emergency & Lifestyle */}
          <GlassCard className="p-6 sm:p-8 space-y-6 bg-card/60 backdrop-blur-xl border-border/50">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Emergency Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <Label className="font-semibold">Emergency Contact Name</Label>
                <Input value={draft.emergencyName} onChange={e => handleChange("emergencyName", e.target.value)} className="bg-card rounded-xl h-10 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Emergency Contact Phone</Label>
                <Input value={draft.emergencyPhone} onChange={e => handleChange("emergencyPhone", e.target.value)} className="bg-card rounded-xl h-10 text-xs" />
              </div>
            </div>
          </GlassCard>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="h-11 px-8 rounded-full bg-primary font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 gap-2">
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving Profile..." : "Save Changes"}</span>
            </Button>
          </div>

        </motion.div>

      </div>
    </PatientPageLayout>
  );
};

export default EditProfile;
