import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { usePatient } from "@/context/PatientContext";
import {
  Activity,
  Apple,
  Clock,
  Dumbbell,
  History,
  Info,
  Flame,
  Utensils,
  CheckCircle2,
  Sparkles,
  Send,
  BotMessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DietWorkoutModalProps {
  trigger: React.ReactNode;
}

export const DietWorkoutModal = ({ trigger }: DietWorkoutModalProps) => {
  const { profile, addReminder } = usePatient();
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState("07");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  
  // AI Generation State
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false);
  const [dietPrompt, setDietPrompt] = useState("");
  const [dietResponse, setDietResponse] = useState<string | null>(null);

  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
  const [workoutPrompt, setWorkoutPrompt] = useState("");
  const [workoutResponse, setWorkoutResponse] = useState<string | null>(null);

  // Derive basic recommendations from profile
  const activityLevel = profile.activityLevel || "Moderate";
  const dietPref = profile.diet || "Balanced";
  const hasConditions = profile.conditions && profile.conditions.length > 0;

  const handleSetReminder = () => {
    const formattedTime = `${hour}:${minute} ${period}`;

    addReminder({
      title: "Custom Workout",
      time: formattedTime,
      type: "Wellness",
      status: "upcoming",
      repeat: "Daily",
      iconName: "Dumbbell",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    });

    toast.success(`Workout reminder set for ${formattedTime}`);
    setIsOpen(false);
  };

  const handleGenerateDiet = () => {
    if (!dietPrompt.trim()) return;
    setIsGeneratingDiet(true);
    setDietResponse(null);
    
    setTimeout(() => {
      setDietResponse(`Here is a beautifully tailored diet plan based on: "${dietPrompt}"\n\n• Breakfast: Berry Protein Smoothie Bowl (350 kcal)\n• Lunch: Quinoa & Roasted Veggie Salad with Tahini (450 kcal)\n• Dinner: Lemon Herb Grilled Chicken with Asparagus (500 kcal)\n• Snack: Handful of almonds & green tea.`);
      setIsGeneratingDiet(false);
    }, 2000);
  };

  const handleAddDietToPlan = () => {
    addReminder({
      title: "AI Custom Diet Plan",
      time: "08:00 AM", // default morning
      type: "Meals",
      status: "upcoming",
      repeat: "Daily",
      iconName: "Utensils",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    });
    toast.success("Diet plan added to Today's Care Plan!");
    setDietResponse(null);
    setDietPrompt("");
  };

  const handleGenerateWorkout = () => {
    if (!workoutPrompt.trim()) return;
    setIsGeneratingWorkout(true);
    setWorkoutResponse(null);
    
    setTimeout(() => {
      setWorkoutResponse(`Customized workout routine for: "${workoutPrompt}"\n\n• Warmup (5 mins): Jumping jacks & dynamic stretching\n• Main Circuit (20 mins):\n   - 4x15 Pushups\n   - 3x20 Squats\n   - 60s Plank holds\n• Cooldown (5 mins): Deep breathing & child's pose.`);
      setIsGeneratingWorkout(false);
    }, 2000);
  };

  const handleAddWorkoutToPlan = () => {
    addReminder({
      title: "AI Custom Workout",
      time: "05:00 PM", // default evening
      type: "Wellness",
      status: "upcoming",
      repeat: "Daily",
      iconName: "Flame",
      color: "text-red-500",
      bg: "bg-red-500/10",
    });
    toast.success("Workout plan added to Today's Care Plan!");
    setWorkoutResponse(null);
    setWorkoutPrompt("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[92vw] max-w-2xl rounded-[2rem] p-5 sm:p-8 border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl h-[85vh] overflow-y-auto hide-scrollbar focus:outline-none">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Activity className="h-6 w-6" />
            </div>
            Smart Plan Generator
          </DialogTitle>
          <p className="text-muted-foreground mt-2 font-medium">
            AI-generated recommendations based on your health profile.
          </p>
        </DialogHeader>

        <Tabs defaultValue="diet" className="w-full mt-2">
          <TabsList className="flex w-full mb-6 bg-muted/50 p-1.5 rounded-2xl border border-border/40 h-14">
            <TabsTrigger
              value="diet"
              className="flex-1 flex items-center justify-center rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm sm:text-base h-full transition-all"
            >
              <Apple className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Diet
            </TabsTrigger>
            <TabsTrigger
              value="workout"
              className="flex-1 flex items-center justify-center rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm sm:text-base h-full transition-all"
            >
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Workout
            </TabsTrigger>
          </TabsList>

          {/* ──────────────── DIET TAB ──────────────── */}
          <TabsContent
            value="diet"
            className="space-y-6 focus-visible:outline-none focus:ring-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {/* Custom AI Generation - DIET */}
            <div className="mb-2 rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/10 p-5 sm:p-6 shadow-sm">
              <h4 className="font-bold text-lg text-emerald-600 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-500" /> Create Custom Diet
              </h4>
              
              {!dietResponse && !isGeneratingDiet ? (
                <div className="flex gap-2">
                  <Input 
                    placeholder="E.g., Low carb, high protein for muscle gain..."
                    value={dietPrompt}
                    onChange={(e) => setDietPrompt(e.target.value)}
                    className="flex-1 h-12 bg-background/50 border-emerald-500/20 hover:border-emerald-500/40 rounded-xl focus-visible:ring-emerald-500/50 text-foreground transition-colors"
                  />
                  <Button 
                    onClick={handleGenerateDiet}
                    disabled={!dietPrompt.trim()}
                    className="h-12 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-md px-5"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : isGeneratingDiet ? (
                <div className="bg-emerald-500/5 rounded-xl p-4 flex items-center gap-3 text-sm text-emerald-600 font-medium animate-pulse border border-emerald-500/20">
                  <BotMessageSquare className="h-5 w-5 animate-bounce" />
                  AI is crafting your tailored diet...
                </div>
              ) : (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(16,185,129,0.05)]">
                  <div className="flex gap-3 mb-6">
                    <div className="shrink-0 mt-0.5">
                      <div className="bg-emerald-500 text-white rounded-lg p-1.5 shadow-sm">
                        <BotMessageSquare className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-sm text-foreground whitespace-pre-line leading-relaxed font-medium">
                      {dietResponse}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setDietResponse(null)}
                      className="flex-1 rounded-xl text-sm font-bold border-border/60 hover:bg-muted"
                    >
                      Regenerate
                    </Button>
                    <Button 
                      onClick={handleAddDietToPlan}
                      className="flex-1 flex-[2] rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Add to Care Plan
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px w-full bg-border/40"></div>

            {/* Recommended Section */}
            <div className="rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/10 p-5 sm:p-6 shadow-sm">
              <h3 className="font-bold text-lg text-emerald-600 flex items-center gap-2 mb-4">
                <Utensils className="h-5 w-5" /> Recommended for You
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Based on your {dietPref.toLowerCase()} diet preference and{" "}
                {activityLevel.toLowerCase()} activity level
                {hasConditions ? " (adapted for your health conditions)" : ""}.
              </p>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 bg-background rounded-2xl p-4 shadow-sm border border-border/40">
                    <h4 className="font-bold mb-1 text-foreground flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" /> Breakfast
                    </h4>
                    <p className="text-sm text-muted-foreground">Oatmeal with almonds & mixed berries</p>
                  </div>
                  <div className="flex-1 bg-background rounded-2xl p-4 shadow-sm border border-border/40">
                    <h4 className="font-bold mb-1 text-foreground flex items-center gap-2">
                      <Apple className="w-4 h-4 text-green-500" /> Lunch
                    </h4>
                    <p className="text-sm text-muted-foreground">Grilled chicken salad with olive oil dressing</p>
                  </div>
                </div>
                <div className="bg-background rounded-2xl p-4 shadow-sm border border-border/40">
                  <h4 className="font-bold mb-1 text-foreground flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-500" /> Dinner
                  </h4>
                  <p className="text-sm text-muted-foreground">Baked salmon with steamed broccoli and quinoa</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ──────────────── WORKOUT TAB ──────────────── */}
          <TabsContent
            value="workout"
            className="space-y-6 focus-visible:outline-none focus:ring-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {/* Custom AI Generation - WORKOUT */}
            <div className="mb-2 rounded-[1.5rem] bg-blue-500/5 border border-blue-500/10 p-5 sm:p-6 shadow-sm">
              <h4 className="font-bold text-lg text-blue-600 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" /> Create Custom Workout
              </h4>
              
              {!workoutResponse && !isGeneratingWorkout ? (
                <div className="flex gap-2">
                  <Input 
                    placeholder="E.g., 20m home workout no equipment..."
                    value={workoutPrompt}
                    onChange={(e) => setWorkoutPrompt(e.target.value)}
                    className="flex-1 h-12 bg-background/50 border-blue-500/20 hover:border-blue-500/40 rounded-xl focus-visible:ring-blue-500/50 text-foreground transition-colors"
                  />
                  <Button 
                    onClick={handleGenerateWorkout}
                    disabled={!workoutPrompt.trim()}
                    className="h-12 rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md px-5"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : isGeneratingWorkout ? (
                <div className="bg-blue-500/5 rounded-xl p-4 flex items-center gap-3 text-sm text-blue-600 font-medium animate-pulse border border-blue-500/20">
                  <BotMessageSquare className="h-5 w-5 animate-bounce" />
                  AI is crafting your tailored workout...
                </div>
              ) : (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(59,130,246,0.05)]">
                  <div className="flex gap-3 mb-6">
                    <div className="shrink-0 mt-0.5">
                      <div className="bg-blue-500 text-white rounded-lg p-1.5 shadow-sm">
                        <BotMessageSquare className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-sm text-foreground whitespace-pre-line leading-relaxed font-medium">
                      {workoutResponse}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setWorkoutResponse(null)}
                      className="flex-1 rounded-xl text-sm font-bold border-border/60 hover:bg-muted"
                    >
                      Regenerate
                    </Button>
                    <Button 
                      onClick={handleAddWorkoutToPlan}
                      className="flex-1 flex-[2] rounded-xl text-sm font-bold bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Add to Care Plan
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px w-full bg-border/40"></div>

            {/* Reminder Setup Section */}
            <div className="rounded-[1.5rem] bg-card border border-border/50 p-5 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <h3 className="font-bold text-lg text-foreground mb-1 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" /> Daily Sync Reminder
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Set a time to be reminded about your workout. This will instantly sync with your dashboard timeline.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-1 items-center justify-between sm:justify-start bg-background rounded-xl border border-border/50 py-1.5 px-3 sm:px-4 focus-within:ring-2 focus-within:ring-blue-500/50 transition-shadow">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-1 sm:mr-2" />
                    <Select value={hour} onValueChange={setHour}>
                      <SelectTrigger className="w-[60px] sm:w-[65px] h-9 border-none bg-transparent shadow-none font-bold text-foreground focus:ring-0 px-1">
                        <SelectValue placeholder="Hr" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[220px] rounded-xl border-border/50 bg-card/95 backdrop-blur-xl">
                        {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((h) => (
                          <SelectItem key={h} value={h} className="rounded-lg">{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <span className="text-muted-foreground font-extrabold mx-0.5">:</span>
                    
                    <Select value={minute} onValueChange={setMinute}>
                      <SelectTrigger className="w-[60px] sm:w-[65px] h-9 border-none bg-transparent shadow-none font-bold text-foreground focus:ring-0 px-1">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[220px] rounded-xl border-border/50 bg-card/95 backdrop-blur-xl">
                        {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                          <SelectItem key={m} value={m} className="rounded-lg">{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-px h-6 bg-border/50 mx-1 sm:mx-3"></div>
                  
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[65px] sm:w-[70px] h-9 border-none bg-transparent shadow-none font-extrabold text-blue-500 hover:text-blue-600 focus:ring-0 px-1">
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 bg-card/95 backdrop-blur-xl">
                      <SelectItem value="AM" className="rounded-lg font-bold">AM</SelectItem>
                      <SelectItem value="PM" className="rounded-lg font-bold">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSetReminder}
                  className="rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md active:scale-[0.98] py-6 sm:py-3"
                >
                  Set Reminder
                </Button>
              </div>
            </div>

            {/* Recommended Section */}
            <div className="rounded-[1.5rem] bg-blue-500/5 border border-blue-500/10 p-5 sm:p-6 shadow-sm">
              <h3 className="font-bold text-lg text-blue-600 flex items-center gap-2 mb-4">
                <Dumbbell className="h-5 w-5" /> Recommended Routine
              </h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                A tailored {activityLevel.toLowerCase()}-intensity workout suitable for your current profile.
              </p>

              <div className="space-y-4">
                {/* Exercise 1 */}
                <div className="bg-background rounded-2xl p-4 sm:p-5 shadow-sm border border-border/40 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="h-16 w-16 text-blue-500" />
                  </div>
                  <h4 className="font-bold text-foreground text-base mb-1">Morning Mobility Focus</h4>
                  <p className="text-sm font-medium text-blue-500 mb-3">15 mins • Low Impact</p>
                  
                  <ul className="space-y-2 mb-3">
                    <li className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      5 mins Cat-Cow stretches
                    </li>
                    <li className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      5 mins Hip bridges
                    </li>
                    <li className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      5 mins Light brisk walking
                    </li>
                  </ul>
                  
                  <div className="bg-blue-500/10 text-blue-600 rounded-xl p-3 text-xs font-semibold flex items-center gap-2 mt-4">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Benefit: Opens up tight joints and boosts early morning energy without spiking cortisol.
                  </div>
                </div>

                {/* Exercise 2 */}
                {activityLevel === "Active" || activityLevel === "Very Active" ? (
                  <div className="bg-background rounded-2xl p-4 sm:p-5 shadow-sm border border-border/40 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Flame className="h-16 w-16 text-orange-500" />
                    </div>
                    <h4 className="font-bold text-foreground text-base mb-1">HIIT Core Protocol</h4>
                    <p className="text-sm font-medium text-orange-500 mb-3">20 mins • High Impact</p>
                    <ul className="space-y-2 mb-3">
                      <li className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>40s Mountain Climbers / 20s Rest
                      </li>
                      <li className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>40s Plank Holds / 20s Rest
                      </li>
                      <li className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>40s Jump Squats / 20s Rest
                      </li>
                    </ul>
                    <div className="bg-orange-500/10 text-orange-600 rounded-xl p-3 text-xs font-semibold flex items-center gap-2 mt-4">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      Benefit: Max cardiovascular efficiency and core strengthening.
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DietWorkoutModal;
