import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePatient, PatientProfile } from "@/context/PatientContext";
import { ChevronLeft, CheckCircle, UserCircle, Activity, Heart, ShieldAlert } from "lucide-react";
import AnimatedBackground from "@/components/ui/animated-background";
import DashboardHeader from "@/components/patient-dashboard/DashboardHeader";
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

const EditProfile = () => {
  const { profile, updateProfile } = usePatient();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

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
  });

  const handleChange = (field: keyof PatientProfile, value: any) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleConditionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert comma string to array
    const arr = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
    setDraft(prev => ({ ...prev, conditions: arr }));
  };

  const calculateCompleteness = (data: PatientProfile) => {
    const fields = ['fullName', 'age', 'gender', 'bloodGroup', 'height', 'weight', 'activityLevel', 'sleepQuality', 'waterIntake', 'diet', 'emergencyName', 'emergencyPhone'];
    let filled = 0;
    fields.forEach(field => {
      //@ts-ignore
      if (data[field] && String(data[field]).length > 0) filled++;
    });
    return Math.round((filled / fields.length) * 100);
  };

  const handleSave = () => {
    setIsSaving(true);
    const newCompleteness = calculateCompleteness(draft);
    
    // Auto-commit to global state
    updateProfile({ ...draft, profileCompleteness: newCompleteness });

    setTimeout(() => {
      setIsSaving(false);
      setSavedStatus(true);
      setTimeout(() => {
         setSavedStatus(false);
         navigate("/patient/profile");
      }, 1000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface relative flex justify-center pb-24 sm:pb-8 overflow-x-hidden">
      <AnimatedBackground variant="patient" className="opacity-30 fixed inset-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col px-4 sm:px-8 py-8 md:py-10 min-h-screen gap-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/patient/profile")} className="rounded-xl font-bold -ml-4">
             <ChevronLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="rounded-xl shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
          >
            {isSaving ? "Saving..." : savedStatus ? <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Saved</span> : "Save Profile"}
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          {/* Section 1 */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none"></div>
             <h2 className="text-xl font-bold font-heading text-foreground mb-6 flex items-center gap-2">
               <UserCircle className="text-primary h-6 w-6" /> Basic Information
             </h2>
             <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-semibold">Full Name</Label>
                  <Input value={draft.fullName} onChange={(e) => handleChange("fullName", e.target.value)} className="bg-background rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Age</Label>
                  <Input value={draft.age} type="number" onChange={(e) => handleChange("age", e.target.value)} className="bg-background rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Gender</Label>
                  <Select value={draft.gender} onValueChange={(val) => handleChange("gender", val)}>
                    <SelectTrigger className="w-full rounded-xl bg-background border-border/60 h-11">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="male" className="rounded-lg">Male</SelectItem>
                      <SelectItem value="female" className="rounded-lg">Female</SelectItem>
                      <SelectItem value="other" className="rounded-lg">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Blood Group</Label>
                  <Select value={draft.bloodGroup} onValueChange={(val) => handleChange("bloodGroup", val)}>
                    <SelectTrigger className="w-full rounded-xl bg-background border-border/60 h-11">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <SelectItem key={bg} value={bg} className="rounded-lg">{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Height (cm)</Label>
                  <Input value={draft.height} type="number" onChange={(e) => handleChange("height", e.target.value)} className="bg-background rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Weight (kg)</Label>
                  <Input value={draft.weight} type="number" onChange={(e) => handleChange("weight", e.target.value)} className="bg-background rounded-xl h-11" />
                </div>
             </div>
          </div>

          {/* Section 2 */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
             <h2 className="text-xl font-bold font-heading text-foreground mb-6 flex items-center gap-2">
               <Activity className="text-blue-500 h-6 w-6" /> Medical History
             </h2>
             <div className="grid gap-6">
                <div className="space-y-2">
                  <Label className="font-semibold">Chronic Conditions (Comma separated)</Label>
                  <Input value={draft.conditions?.join(", ")} onChange={handleConditionsChange} placeholder="Diabetes, Hypertension..." className="bg-background rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold flex items-center gap-1"><ShieldAlert className="h-4 w-4 text-red-500"/> Allergies (Comma separated)</Label>
                  <Input value={draft.allergies} onChange={(e) => handleChange("allergies", e.target.value)} placeholder="Peanuts, Penicillin..." className="bg-background rounded-xl h-11 border-red-500/30" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Current Medications (Comma separated)</Label>
                  <Textarea value={draft.medications} onChange={(e) => handleChange("medications", e.target.value)} placeholder="Lisinopril 10mg, Metformin..." className="bg-background rounded-xl min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Past Surgeries</Label>
                  <Input value={draft.surgeries} onChange={(e) => handleChange("surgeries", e.target.value)} className="bg-background rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Family Medical History</Label>
                  <Input value={draft.familyHistory} onChange={(e) => handleChange("familyHistory", e.target.value)} className="bg-background rounded-xl h-11" />
                </div>
             </div>
          </div>

          {/* Section 3 */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
             <h2 className="text-xl font-bold font-heading text-foreground mb-6 flex items-center gap-2">
               <Heart className="text-pink-500 h-6 w-6" /> Lifestyle & Wellness
             </h2>
             <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-semibold">Activity Level</Label>
                  <Select value={draft.activityLevel} onValueChange={(val) => handleChange("activityLevel", val)}>
                    <SelectTrigger className="w-full rounded-xl bg-background border-border/60 h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="low" className="rounded-lg">Low (Sedentary)</SelectItem>
                      <SelectItem value="moderate" className="rounded-lg">Moderate (3x/week)</SelectItem>
                      <SelectItem value="active" className="rounded-lg">Active (5x/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Sleep Quality</Label>
                  <Select value={draft.sleepQuality} onValueChange={(val) => handleChange("sleepQuality", val)}>
                    <SelectTrigger className="w-full rounded-xl bg-background border-border/60 h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="poor" className="rounded-lg">Poor</SelectItem>
                      <SelectItem value="average" className="rounded-lg">Fair (6-7 hrs)</SelectItem>
                      <SelectItem value="good" className="rounded-lg">Good (7+ hrs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Water Intake</Label>
                  <Select value={draft.waterIntake} onValueChange={(val) => handleChange("waterIntake", val)}>
                    <SelectTrigger className="w-full rounded-xl bg-background border-border/60 h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="less-4" className="rounded-lg">{"< 4 glasses"}</SelectItem>
                      <SelectItem value="4-6" className="rounded-lg">4-6 glasses</SelectItem>
                      <SelectItem value="6-8" className="rounded-lg">6-8 glasses</SelectItem>
                      <SelectItem value="more-8" className="rounded-lg">8+ glasses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Diet Type</Label>
                  <Select value={draft.diet} onValueChange={(val) => handleChange("diet", val)}>
                    <SelectTrigger className="w-full rounded-xl bg-background border-border/60 h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="vegetarian" className="rounded-lg">Vegetarian</SelectItem>
                      <SelectItem value="non-vegetarian" className="rounded-lg">Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan" className="rounded-lg">Vegan</SelectItem>
                      <SelectItem value="mixed" className="rounded-lg">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                  <Label className="font-semibold">Do you smoke?</Label>
                  <Switch checked={draft.smokes} onCheckedChange={(val) => handleChange("smokes", val)} className="data-[state=checked]:bg-orange-500" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                  <Label className="font-semibold">Do you consume alcohol?</Label>
                  <Switch checked={draft.alcohol} onCheckedChange={(val) => handleChange("alcohol", val)} className="data-[state=checked]:bg-orange-500" />
                </div>
             </div>
          </div>

          {/* Section 4 */}
          <div className="bg-card/80 backdrop-blur-xl border border-red-500/20 rounded-[2rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
             <h2 className="text-xl font-bold font-heading text-red-500 mb-6 flex items-center gap-2">
               <ShieldAlert className="text-red-500 h-6 w-6" /> Emergency Contact
             </h2>
             <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-semibold">Emergency Contact Name</Label>
                  <Input value={draft.emergencyName} onChange={(e) => handleChange("emergencyName", e.target.value)} className="bg-background rounded-xl h-11 border-red-500/30" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Emergency Phone Number</Label>
                  <Input value={draft.emergencyPhone} onChange={(e) => handleChange("emergencyPhone", e.target.value)} className="bg-background rounded-xl h-11 border-red-500/30" />
                </div>
             </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
