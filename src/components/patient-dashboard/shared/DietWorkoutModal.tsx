import React, { useState, useMemo } from "react";
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
  BotMessageSquare,
  ShieldCheck,
  ShieldAlert,
  Droplets,
  HeartPulse,
  ChevronRight,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getPersonalizedDietAndWorkout } from "@/lib/dietWorkoutPlans";

interface DietWorkoutModalProps {
  trigger: React.ReactNode;
}

export const DietWorkoutModal = ({ trigger }: DietWorkoutModalProps) => {
  const { profile, addReminder } = usePatient();
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState("07");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  
  // Custom Generation State
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false);
  const [dietPrompt, setDietPrompt] = useState("");
  const [dietResponse, setDietResponse] = useState<string | null>(null);

  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
  const [workoutPrompt, setWorkoutPrompt] = useState("");
  const [workoutResponse, setWorkoutResponse] = useState<string | null>(null);

  // Dynamically resolve hardcoded clinical diet & workout based on onboarding inputs
  const { dietPlan, workoutPlan, matchReasons, personalizedSummary } = useMemo(
    () => getPersonalizedDietAndWorkout(profile),
    [profile]
  );

  const handleSetReminder = () => {
    const formattedTime = `${hour}:${minute} ${period}`;

    addReminder({
      title: workoutPlan.title,
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

  const handleAddAllMealsToCarePlan = () => {
    addReminder({
      title: `Breakfast: ${dietPlan.meals.breakfast.name}`,
      time: "08:30 AM",
      type: "Meals",
      status: "upcoming",
      repeat: "Daily",
      iconName: "Utensils",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    });

    addReminder({
      title: `Lunch: ${dietPlan.meals.lunch.name}`,
      time: "01:15 PM",
      type: "Meals",
      status: "upcoming",
      repeat: "Daily",
      iconName: "Utensils",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    });

    addReminder({
      title: `Dinner: ${dietPlan.meals.dinner.name}`,
      time: "07:45 PM",
      type: "Meals",
      status: "upcoming",
      repeat: "Daily",
      iconName: "Utensils",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    });

    toast.success("All 3 meals added to Today's Care Plan reminders!");
    setIsOpen(false);
  };

  const handleGenerateDiet = () => {
    if (!dietPrompt.trim()) return;
    setIsGeneratingDiet(true);
    setDietResponse(null);
    
    setTimeout(() => {
      setDietResponse(
        `Tailored Diet Recommendation for: "${dietPrompt}"\n\n` +
        `• Morning: Chia Flax Berry Bowl (360 kcal | 18g Protein)\n` +
        `• Lunch: Warm Lentil & Quinoa Salad with Roasted Pumpkin Seeds (480 kcal | 26g Protein)\n` +
        `• Dinner: Steamed Greens & Low-Sodium Herb Broth with Tofu or Salmon (440 kcal | 32g Protein)\n` +
        `• Clinical Tip: Keep sodium under 1,500mg and pair meals with 500ml water.`
      );
      setIsGeneratingDiet(false);
    }, 1500);
  };

  const handleAddCustomDietToPlan = () => {
    addReminder({
      title: "AI Custom Diet Plan",
      time: "08:00 AM",
      type: "Meals",
      status: "upcoming",
      repeat: "Daily",
      iconName: "Utensils",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    });
    toast.success("Custom diet plan added to Today's Care Plan!");
    setDietResponse(null);
    setDietPrompt("");
    setIsOpen(false);
  };

  const handleGenerateWorkout = () => {
    if (!workoutPrompt.trim()) return;
    setIsGeneratingWorkout(true);
    setWorkoutResponse(null);
    
    setTimeout(() => {
      setWorkoutResponse(
        `Personalized Routine for: "${workoutPrompt}"\n\n` +
        `• Warmup (5 mins): Arm circles, cat-cow spine waves, light jog\n` +
        `• Main Circuit (20 mins):\n` +
        `   - 3x12 Chair Squats with 2s pause\n` +
        `   - 3x10 Incline Push-Ups\n` +
        `   - 3x30s Forearm Plank Holds\n` +
        `• Cooldown (5 mins): Child's pose & diaphragmatic breathing.`
      );
      setIsGeneratingWorkout(false);
    }, 1500);
  };

  const handleAddCustomWorkoutToPlan = () => {
    addReminder({
      title: "Custom Workout Routine",
      time: "07:30 AM",
      type: "Wellness",
      status: "upcoming",
      repeat: "Daily",
      iconName: "Dumbbell",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    });
    toast.success("Workout plan added to Today's Care Plan!");
    setWorkoutResponse(null);
    setWorkoutPrompt("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[94vw] max-w-3xl rounded-[2rem] p-5 sm:p-8 border-border/50 bg-card/95 backdrop-blur-2xl shadow-2xl h-[90vh] overflow-y-auto hide-scrollbar focus:outline-none">
        
        {/* Header */}
        <DialogHeader className="mb-4 text-left">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                <Activity className="h-5 w-5" />
              </div>
              <span>Clinical Care Matrix</span>
            </DialogTitle>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Onboarding-Synchronized</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
            {personalizedSummary}
          </p>

          {/* Onboarding Match Badges */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {matchReasons.map((reason, i) => (
              <span key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-muted text-foreground/80 border border-border/60 flex items-center gap-1">
                <Check className="h-3 w-3 text-emerald-500" />
                <span>{reason}</span>
              </span>
            ))}
          </div>
        </DialogHeader>

        {/* Tabs for Diet and Workout */}
        <Tabs defaultValue="diet" className="w-full mt-2">
          <TabsList className="flex w-full mb-6 bg-muted/60 p-1.5 rounded-2xl border border-border/50 h-13">
            <TabsTrigger
              value="diet"
              className="flex-1 flex items-center justify-center rounded-xl data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md font-bold text-xs sm:text-sm h-full transition-all"
            >
              <Apple className="w-4 h-4 mr-2 text-emerald-500" /> Personalized Diet
            </TabsTrigger>
            <TabsTrigger
              value="workout"
              className="flex-1 flex items-center justify-center rounded-xl data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md font-bold text-xs sm:text-sm h-full transition-all"
            >
              <Dumbbell className="w-4 h-4 mr-2 text-blue-500" /> Personalized Workout
            </TabsTrigger>
          </TabsList>

          {/* ─────────────────────────────────────────────────────────── */}
          {/* DIET TAB */}
          {/* ─────────────────────────────────────────────────────────── */}
          <TabsContent value="diet" className="space-y-6 focus-visible:outline-none">
            
            {/* Diet Plan Overview Card */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-card to-emerald-500/5 border border-emerald-500/20 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                    {dietPlan.category} Protocol
                  </span>
                  <h3 className="text-xl font-extrabold text-foreground mt-1.5">
                    {dietPlan.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Target: {dietPlan.targetGoal}
                  </p>
                </div>

                <div className="bg-background/80 border border-border/60 rounded-2xl p-3 text-right shrink-0">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Calorie Target</span>
                  <span className="text-lg font-black text-foreground">{dietPlan.caloriesTarget}</span>
                </div>
              </div>

              {/* Macro Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-background/60 border border-border/50 text-center">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Protein</span>
                  <span className="text-xs font-black text-emerald-500">{dietPlan.macroRatio.protein}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-background/60 border border-border/50 text-center">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Complex Carbs</span>
                  <span className="text-xs font-black text-blue-500">{dietPlan.macroRatio.carbs}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-background/60 border border-border/50 text-center">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Healthy Fats</span>
                  <span className="text-xs font-black text-amber-500">{dietPlan.macroRatio.fats}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-background/60 border border-border/50 text-center">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Dietary Fiber</span>
                  <span className="text-xs font-black text-purple-500">{dietPlan.macroRatio.fiber}</span>
                </div>
              </div>

              {/* Medical Rationale */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground leading-relaxed flex items-start gap-2.5">
                <Info className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">Clinical Rationale: </span>
                  {dietPlan.medicalRationale}
                </div>
              </div>
            </div>

            {/* Daily Meals Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-emerald-500" />
                  <span>Curated Daily Meal Schedule</span>
                </h4>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Droplets className="h-3.5 w-3.5 text-blue-400" />
                  <span>Hydration: {dietPlan.hydrationGoal}</span>
                </span>
              </div>

              {/* Breakfast */}
              <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-500 flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5" /> Breakfast (08:30 AM)
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600">
                    {dietPlan.meals.breakfast.calories} kcal
                  </span>
                </div>
                <h5 className="text-sm font-bold text-foreground">{dietPlan.meals.breakfast.name}</h5>
                <p className="text-xs text-muted-foreground">Portion: {dietPlan.meals.breakfast.portion}</p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>P: {dietPlan.meals.breakfast.protein} • C: {dietPlan.meals.breakfast.carbs} • F: {dietPlan.meals.breakfast.fat}</span>
                  <span className="italic text-foreground/70">{dietPlan.meals.breakfast.notes}</span>
                </div>
              </div>

              {/* Mid-Morning Snack */}
              {dietPlan.meals.midMorningSnack && (
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Mid-Morning (11:00 AM)
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                      {dietPlan.meals.midMorningSnack.calories} kcal
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-foreground">{dietPlan.meals.midMorningSnack.name}</h5>
                  <p className="text-xs text-muted-foreground">Portion: {dietPlan.meals.midMorningSnack.portion}</p>
                  <p className="text-[11px] text-foreground/70 italic border-t border-border/40 pt-1">
                    {dietPlan.meals.midMorningSnack.notes}
                  </p>
                </div>
              )}

              {/* Lunch */}
              <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                    <Apple className="h-3.5 w-3.5" /> Lunch (01:15 PM)
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                    {dietPlan.meals.lunch.calories} kcal
                  </span>
                </div>
                <h5 className="text-sm font-bold text-foreground">{dietPlan.meals.lunch.name}</h5>
                <p className="text-xs text-muted-foreground">Portion: {dietPlan.meals.lunch.portion}</p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>P: {dietPlan.meals.lunch.protein} • C: {dietPlan.meals.lunch.carbs} • F: {dietPlan.meals.lunch.fat}</span>
                  <span className="italic text-foreground/70">{dietPlan.meals.lunch.notes}</span>
                </div>
              </div>

              {/* Evening Snack */}
              {dietPlan.meals.eveningSnack && (
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-500 flex items-center gap-1.5">
                      <History className="h-3.5 w-3.5" /> Evening Snack (05:00 PM)
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600">
                      {dietPlan.meals.eveningSnack.calories} kcal
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-foreground">{dietPlan.meals.eveningSnack.name}</h5>
                  <p className="text-xs text-muted-foreground">Portion: {dietPlan.meals.eveningSnack.portion}</p>
                  <p className="text-[11px] text-foreground/70 italic border-t border-border/40 pt-1">
                    {dietPlan.meals.eveningSnack.notes}
                  </p>
                </div>
              )}

              {/* Dinner */}
              <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-500 flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5" /> Dinner (07:45 PM)
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                    {dietPlan.meals.dinner.calories} kcal
                  </span>
                </div>
                <h5 className="text-sm font-bold text-foreground">{dietPlan.meals.dinner.name}</h5>
                <p className="text-xs text-muted-foreground">Portion: {dietPlan.meals.dinner.portion}</p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>P: {dietPlan.meals.dinner.protein} • C: {dietPlan.meals.dinner.carbs} • F: {dietPlan.meals.dinner.fat}</span>
                  <span className="italic text-foreground/70">{dietPlan.meals.dinner.notes}</span>
                </div>
              </div>
            </div>

            {/* Foods to Emphasize & Avoid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <h6 className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Foods to Emphasize
                </h6>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {dietPlan.foodsToEmphasize.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                <h6 className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                  <X className="h-4 w-4" /> Foods to Limit
                </h6>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {dietPlan.foodsToLimit.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Add to Care Plan Button */}
            <Button
              onClick={handleAddAllMealsToCarePlan}
              className="w-full h-12 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 text-sm gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Sync All Meals to Today's Care Plan</span>
            </Button>

            {/* Custom AI Diet Request Accordion */}
            <div className="p-4 rounded-2xl bg-background/60 border border-border/50 space-y-3">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                <span>Want an alternative variation? Request AI custom recipe</span>
              </span>
              <div className="flex gap-2">
                <Input
                  placeholder="E.g. Low sodium Indian breakfast without oats..."
                  value={dietPrompt}
                  onChange={(e) => setDietPrompt(e.target.value)}
                  className="h-10 text-xs rounded-xl bg-card border-border/60"
                />
                <Button
                  onClick={handleGenerateDiet}
                  disabled={isGeneratingDiet || !dietPrompt.trim()}
                  className="h-10 px-4 rounded-xl text-xs font-bold bg-emerald-600 text-white"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>

              {dietResponse && (
                <div className="p-3.5 rounded-xl bg-card border border-emerald-500/30 text-xs whitespace-pre-line leading-relaxed text-foreground space-y-2">
                  <p>{dietResponse}</p>
                  <Button
                    onClick={handleAddCustomDietToPlan}
                    size="sm"
                    className="rounded-lg text-xs bg-emerald-600 text-white"
                  >
                    Add This Custom Meal to Plan
                  </Button>
                </div>
              )}
            </div>

          </TabsContent>

          {/* ─────────────────────────────────────────────────────────── */}
          {/* WORKOUT TAB */}
          {/* ─────────────────────────────────────────────────────────── */}
          <TabsContent value="workout" className="space-y-6 focus-visible:outline-none">
            
            {/* Workout Plan Overview Card */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/10 via-card to-blue-500/5 border border-blue-500/20 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                    {workoutPlan.intensity}
                  </span>
                  <h3 className="text-xl font-extrabold text-foreground mt-1.5">
                    {workoutPlan.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    Focus: {workoutPlan.targetGoal}
                  </p>
                </div>

                <div className="bg-background/80 border border-border/60 rounded-2xl p-3 text-right shrink-0">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Duration & Frequency</span>
                  <span className="text-sm font-black text-foreground">{workoutPlan.duration} • {workoutPlan.frequency}</span>
                </div>
              </div>

              {/* Target / Benefits */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-foreground leading-relaxed flex items-start gap-2.5">
                <HeartPulse className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-700 dark:text-blue-300">Physiological Benefit: </span>
                  {workoutPlan.physiologicalBenefit}
                </div>
              </div>
            </div>

            {/* Warm-Up Section */}
            <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" /> Dynamic Warm-Up ({workoutPlan.warmup.duration})
              </span>
              <ul className="text-xs text-muted-foreground space-y-1 pl-1">
                {workoutPlan.warmup.movements.map((m, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Exercise Circuit */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-blue-500" />
                <span>Prescribed Clinical Circuit</span>
              </h4>

              {workoutPlan.mainCircuit.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-card border border-border/60 hover:border-blue-500/40 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-600 flex items-center justify-center text-[10px] font-black">
                        {idx + 1}
                      </span>
                      <span>{ex.name}</span>
                    </h5>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                      {ex.setsReps}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/80">Target: {ex.targetArea}</span>
                    <span>•</span>
                    <span className="text-blue-500 font-semibold">{ex.rest}</span>
                  </div>

                  <p className="text-[11px] text-foreground/80 italic border-t border-border/40 pt-1.5">
                    <span className="font-semibold text-foreground">Form Cue: </span>
                    {ex.formCue}
                  </p>
                </div>
              ))}
            </div>

            {/* Cooldown Section */}
            <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Cool-Down & Flexibility ({workoutPlan.cooldown.duration})
              </span>
              <ul className="text-xs text-muted-foreground space-y-1 pl-1">
                {workoutPlan.cooldown.movements.map((m, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Set Daily Workout Reminder Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-500" /> Schedule Daily Workout Reminder
              </h5>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="flex flex-1 items-center bg-background rounded-xl border border-border/60 px-3 py-1">
                  <Select value={hour} onValueChange={setHour}>
                    <SelectTrigger className="w-16 h-8 border-none font-bold text-xs">
                      <SelectValue placeholder="Hr" />
                    </SelectTrigger>
                    <SelectContent>
                      {["05", "06", "07", "08", "09", "10", "16", "17", "18", "19", "20"].map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="font-bold">:</span>
                  <Select value={minute} onValueChange={setMinute}>
                    <SelectTrigger className="w-16 h-8 border-none font-bold text-xs">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {["00", "15", "30", "45"].map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-16 h-8 border-none font-bold text-xs text-blue-600">
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSetReminder}
                  className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs px-6 h-10 shadow-md"
                >
                  Set Daily Reminder
                </Button>
              </div>
            </div>

            {/* Custom AI Workout Request */}
            <div className="p-4 rounded-2xl bg-background/60 border border-border/50 space-y-3">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                <span>Need a travel or hotel room modification?</span>
              </span>
              <div className="flex gap-2">
                <Input
                  placeholder="E.g. 15m no equipment hotel room workout..."
                  value={workoutPrompt}
                  onChange={(e) => setWorkoutPrompt(e.target.value)}
                  className="h-10 text-xs rounded-xl bg-card border-border/60"
                />
                <Button
                  onClick={handleGenerateWorkout}
                  disabled={isGeneratingWorkout || !workoutPrompt.trim()}
                  className="h-10 px-4 rounded-xl text-xs font-bold bg-blue-600 text-white"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>

              {workoutResponse && (
                <div className="p-3.5 rounded-xl bg-card border border-blue-500/30 text-xs whitespace-pre-line leading-relaxed text-foreground space-y-2">
                  <p>{workoutResponse}</p>
                  <Button
                    onClick={handleAddCustomWorkoutToPlan}
                    size="sm"
                    className="rounded-lg text-xs bg-blue-600 text-white"
                  >
                    Add Custom Workout to Timeline
                  </Button>
                </div>
              )}
            </div>

          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DietWorkoutModal;
