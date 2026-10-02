import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePatient } from "@/context/PatientContext";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Smile,
  Meh,
  Frown,
  Activity,
  Wind,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  MessageCircle,
  Users,
  Calendar,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Flame,
  ShieldAlert,
  Send,
  RefreshCw,
  Sun,
  Apple,
  Dumbbell,
  Utensils,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getPersonalizedDietAndWorkout } from "@/lib/dietWorkoutPlans";
import { DietWorkoutModal } from "@/components/patient-dashboard/shared/DietWorkoutModal";

// --- Motivational Affirmations Data ---
const MOTIVATIONAL_QUOTES = [
  { id: "q-1", text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay", tag: "Courage" },
  { id: "q-2", text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman", tag: "Mindfulness" },
  { id: "q-3", text: "There is hope, even when your brain tells you there isn't.", author: "John Green", tag: "Hope" },
  { id: "q-4", text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein", tag: "Growth" },
  { id: "q-5", text: "Peace comes from within. Do not seek it without.", author: "Buddha", tag: "Inner Peace" },
];

// --- Ambient Soundscapes Data ---
interface Soundtrack {
  id: string;
  title: string;
  category: string;
  duration: string;
  gradient: string;
  iconColor: string;
}

// TODO (Backend Team):
// Connect audio streaming service / HLS audio endpoints for ambient soundscapes.
const SOUNDSCAPES: Soundtrack[] = [
  { id: "snd-1", title: "Rain & Gentle Thunder", category: "Sleep & Calm", duration: "Infinite", gradient: "from-blue-500/10 via-cyan-500/5 to-transparent", iconColor: "text-cyan-400" },
  { id: "snd-2", title: "Deep Focus Lo-Fi Beats", category: "Concentration", duration: "Infinite", gradient: "from-purple-500/10 via-indigo-500/5 to-transparent", iconColor: "text-purple-400" },
  { id: "snd-3", title: "Ocean Waves & Soft Breeze", category: "Stress Relief", duration: "Infinite", gradient: "from-teal-500/10 via-emerald-500/5 to-transparent", iconColor: "text-emerald-400" },
  { id: "snd-4", title: "Forest Solitude & Birds", category: "Mindfulness", duration: "Infinite", gradient: "from-amber-500/10 via-orange-500/5 to-transparent", iconColor: "text-amber-400" },
];

// --- 4-7-8 Breathing Phases ---
type BreathingPhase = "Ready" | "Inhale" | "Hold" | "Exhale";

const PHASE_CONFIG: Record<BreathingPhase, { duration: number; label: string; color: string; scale: number; text: string }> = {
  Ready: { duration: 0, label: "Ready", color: "text-primary border-primary/30 bg-primary/10", scale: 1, text: "Click Start to begin 4-7-8 relaxation" },
  Inhale: { duration: 4, label: "Inhale Slowly", color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10", scale: 1.4, text: "Breathe in deeply through your nose" },
  Hold: { duration: 7, label: "Hold Breath", color: "text-purple-400 border-purple-500/40 bg-purple-500/10", scale: 1.4, text: "Hold gently and remain calm" },
  Exhale: { duration: 8, label: "Exhale Completely", color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10", scale: 1, text: "Release smoothly through your mouth" },
};

const fadeInOptions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function WellnessPage() {
  const { profile, addMoodLog, toggleQuoteFavorite } = usePatient();

  // Dynamically resolve hardcoded clinical diet & workout from onboarding profile
  const { dietPlan, workoutPlan, matchReasons } = useMemo(
    () => getPersonalizedDietAndWorkout(profile),
    [profile]
  );

  // --- Quote Rotation State ---
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = MOTIVATIONAL_QUOTES[currentQuoteIndex];
  const isQuoteSaved = profile.savedQuotes?.includes(currentQuote.id);

  const handleSaveQuote = () => {
    toggleQuoteFavorite(currentQuote.id);
    toast.success(isQuoteSaved ? "Affirmation removed from bookmarks" : "Affirmation saved to your favorites!");
  };

  // --- Mood Tracker State ---
  const [selectedMood, setSelectedMood] = useState<{ label: string; score: number } | null>(null);

  const handleLogMood = (label: string, score: number) => {
    setSelectedMood({ label, score });
    addMoodLog({ date: new Date().toISOString(), mood: label, score });
    toast.success(`Logged mood as "${label}"! Keep up your daily check-in streak.`);
  };

  // --- 4-7-8 Breathing Trainer State ---
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>("Ready");
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (breathingActive) {
      if (breathingPhase === "Ready") {
        setBreathingPhase("Inhale");
        setPhaseSecondsLeft(4);
      } else if (phaseSecondsLeft > 1) {
        timer = setTimeout(() => setPhaseSecondsLeft((prev) => prev - 1), 1000);
      } else {
        // Transition to next phase
        if (breathingPhase === "Inhale") {
          setBreathingPhase("Hold");
          setPhaseSecondsLeft(7);
        } else if (breathingPhase === "Hold") {
          setBreathingPhase("Exhale");
          setPhaseSecondsLeft(8);
        } else if (breathingPhase === "Exhale") {
          setCompletedCycles((c) => c + 1);
          setBreathingPhase("Inhale");
          setPhaseSecondsLeft(4);
          toast.success("Cycle completed! Excellent deep breathing.");
        }
      }
    }

    return () => clearTimeout(timer);
  }, [breathingActive, breathingPhase, phaseSecondsLeft]);

  const toggleBreathing = () => {
    if (breathingActive) {
      setBreathingActive(false);
      setBreathingPhase("Ready");
      setPhaseSecondsLeft(0);
    } else {
      setBreathingActive(true);
      setBreathingPhase("Inhale");
      setPhaseSecondsLeft(4);
    }
  };

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathingPhase("Ready");
    setPhaseSecondsLeft(0);
    setCompletedCycles(0);
  };

  // --- Ambient Soundscape State ---
  const [activeSoundtrackId, setActiveSoundtrackId] = useState<string | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const toggleSoundtrack = (id: string) => {
    if (activeSoundtrackId === id && isPlayingSound) {
      setIsPlayingSound(false);
    } else {
      setActiveSoundtrackId(id);
      setIsPlayingSound(true);
      const track = SOUNDSCAPES.find((s) => s.id === id);
      toast.success(`Now playing: ${track?.title}`);
    }
  };

  // --- Quick Gratitude Entry State ---
  const [gratitudeNote, setGratitudeNote] = useState("");
  const handleSaveGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitudeNote.trim()) return;
    toast.success("Saved to your gratitude journal!");
    setGratitudeNote("");
  };

  // Mood history data for Recharts chart
  const moodHistory = profile.moodLogs && profile.moodLogs.length > 0 
    ? profile.moodLogs.slice(-7)
    : [
        { date: new Date(Date.now() - 6 * 86400000).toISOString(), score: 3, mood: "Okay" },
        { date: new Date(Date.now() - 5 * 86400000).toISOString(), score: 4, mood: "Good" },
        { date: new Date(Date.now() - 4 * 86400000).toISOString(), score: 3, mood: "Okay" },
        { date: new Date(Date.now() - 3 * 86400000).toISOString(), score: 5, mood: "Great" },
        { date: new Date(Date.now() - 2 * 86400000).toISOString(), score: 4, mood: "Good" },
        { date: new Date(Date.now() - 1 * 86400000).toISOString(), score: 4, mood: "Good" },
        { date: new Date().toISOString(), score: 5, mood: "Great" },
      ];

  return (
    <PatientPageLayout className="w-full">
      <motion.div 
        className="w-full space-y-8 lg:space-y-10 pb-12"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* --- PAGE HEADER WITH NAVIGATION ACCESS --- */}
        <motion.div variants={fadeInOptions}>
          <PageHeader
            title="Mental Wellness Hub"
            subtitle="Your calm, supportive sanctuary for emotional balance, guided breathing, and mindfulness."
          >
            <div className="flex items-center gap-2 mt-3 sm:mt-0 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
                <Flame className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>Wellness Streak: {profile.moodLogs?.length || 5} Days</span>
              </div>
              <Link to="/patient/emergency">
                <Button size="sm" variant="destructive" className="rounded-full gap-1.5 shadow-lg shadow-red-500/20 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>SOS Support</span>
                </Button>
              </Link>
            </div>
          </PageHeader>
        </motion.div>

        {/* --- SECTION 1: FULL SUPPORT ECOSYSTEM GRID (MOVED TO TOP FOR EASY NAVIGATION) --- */}
        <motion.div variants={fadeInOptions}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Heart className="w-6 h-6 text-rose-400" />
                <span>Explore Care & Support Ecosystem</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Direct access to AI health tools, community connections, and professional doctor support.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: "Personal Journal", desc: "Private thoughts & reflection", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", path: "/patient/journal" },
              { title: "AI Companion", desc: "24/7 intelligent symptom chat", icon: MessageCircle, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", path: "/patient/ai-companion" },
              { title: "Peer Community", desc: "Connect with support groups", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", path: "/patient/community" },
              { title: "Doctor Consults", desc: "Book video or in-clinic visits", icon: Calendar, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", path: "/patient/consultations" },
              { title: "Emergency SOS", desc: "Instant emergency protocols", icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", path: "/patient/emergency" },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className={cn(
                  "flex flex-col items-center justify-center p-5 sm:p-6 rounded-3xl bg-card/60 backdrop-blur-xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1 shadow-sm text-center",
                  action.border,
                  "hover:border-primary/50 hover:shadow-lg"
                )}
              >
                <div className={cn("p-4 rounded-2xl mb-3 group-hover:scale-110 transition-transform", action.bg, action.color)}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-snug">{action.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* --- SECTION 1: DAILY AFFIRMATIONS CAROUSEL --- */}
        <motion.div variants={fadeInOptions}>
          <GlassCard className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-purple-900/20 via-indigo-900/15 to-purple-950/20 border-purple-500/20 group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
              <Sparkles className="w-36 h-36 text-purple-400" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/30">
                    Daily Affirmation
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">• {currentQuote.tag}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuote.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-2"
                  >
                    <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-foreground leading-relaxed italic">
                      "{currentQuote.text}"
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-purple-400">
                      — {currentQuote.author}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)}
                  title="Next affirmation"
                  className="h-11 w-11 rounded-2xl border-purple-500/20 bg-card/60 hover:bg-purple-500/10 text-foreground"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSaveQuote}
                  className={cn(
                    "h-11 px-4 rounded-2xl border-purple-500/30 gap-2 transition-all duration-300 font-semibold text-xs sm:text-sm shadow-sm",
                    isQuoteSaved
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/50 hover:bg-purple-500/30"
                      : "bg-card/60 hover:bg-muted text-muted-foreground"
                  )}
                >
                  {isQuoteSaved ? <BookmarkCheck className="h-4 w-4 text-purple-400" /> : <Bookmark className="h-4 w-4" />}
                  <span>{isQuoteSaved ? "Saved" : "Save Affirmation"}</span>
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* --- CLINICAL MENTAL HEALTH SCREENING BANNER (FR-05) --- */}
        <motion.div variants={fadeInOptions}>
          <GlassCard className="p-6 sm:p-7 relative overflow-hidden bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-card/70 border-pink-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pink-500/20 text-pink-400 border border-pink-500/30">
                    Clinical Standard Instruments
                  </span>
                  <span className="text-xs text-muted-foreground">• PHQ-9 • GAD-7 • PSS-10</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Validated Mental Health & Clinical Screening
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Take clinically validated self-assessments to detect early signs of depression, anxiety, and chronic stress. High scores automatically prompt priority doctor consultations.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link to="/patient/mental-screening">
                  <Button className="h-12 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-pink-500/20 gap-2">
                    <Activity className="w-4 h-4" />
                    <span>Start Clinical Screening</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* --- BENTO GRID: GUIDED BREATHING & MOOD TRACKING --- */}
        <motion.div variants={fadeInOptions} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* --- 4-7-8 BREATHING TRAINER (7 cols lg) --- */}
          <GlassCard className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-card/80 via-card/50 to-emerald-950/10 border-emerald-500/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Wind className="w-6 h-6 text-emerald-400" />
                  <span>4-7-8 Guided Breathing</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Calm your nervous system and relieve stress in under 2 minutes.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {completedCycles} Cycles Done
                </span>
              </div>
            </div>

            {/* Visual Breathing Sphere */}
            <div className="py-8 flex flex-col items-center justify-center relative min-h-[260px]">
              <motion.div
                animate={{
                  scale: PHASE_CONFIG[breathingPhase].scale,
                  boxShadow: breathingActive
                    ? "0 0 60px rgba(52, 211, 153, 0.35), inset 0 0 30px rgba(52, 211, 153, 0.25)"
                    : "0 0 20px rgba(255, 255, 255, 0.05)",
                }}
                transition={{ duration: PHASE_CONFIG[breathingPhase].duration || 0.5, ease: "easeInOut" }}
                className={cn(
                  "w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 flex flex-col items-center justify-center backdrop-blur-xl transition-colors duration-500 relative",
                  PHASE_CONFIG[breathingPhase].color
                )}
              >
                {breathingActive ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                      {phaseSecondsLeft}s
                    </span>
                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider mt-1 opacity-90">
                      {PHASE_CONFIG[breathingPhase].label}
                    </span>
                  </>
                ) : (
                  <>
                    <Wind className="w-10 h-10 text-emerald-400 mb-2 opacity-80" />
                    <span className="text-xs sm:text-sm font-bold text-foreground">Start Breathing</span>
                  </>
                )}
              </motion.div>

              <p className="text-sm font-medium text-muted-foreground text-center mt-6 h-6">
                {PHASE_CONFIG[breathingPhase].text}
              </p>
            </div>

            {/* Breathing Controls */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-border/40">
              <Button
                onClick={toggleBreathing}
                className={cn(
                  "h-11 px-6 rounded-2xl gap-2 font-bold text-sm shadow-lg transition-all duration-300",
                  breathingActive
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20"
                    : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20"
                )}
              >
                {breathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{breathingActive ? "Pause Exercise" : "Start 4-7-8 Session"}</span>
              </Button>
              {breathingActive && (
                <Button
                  onClick={resetBreathing}
                  variant="outline"
                  className="h-11 px-4 rounded-2xl border-border/50 gap-2 font-semibold text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </Button>
              )}
            </div>
          </GlassCard>

          {/* --- MOOD TRACKER & RECHARTS TREND (5 cols lg) --- */}
          <GlassCard className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-card/60 backdrop-blur-xl border-border/50">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Smile className="w-6 h-6 text-purple-400" />
                  <span>How are you feeling?</span>
                </h3>
                <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  Daily Check-in
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                Select your current emotional state to track patterns and triggers.
              </p>

              {/* Mood Buttons */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {[
                  { label: "Great", score: 5, icon: Sparkles, color: "text-violet-400", bg: "hover:bg-violet-500/15 border-violet-500/30" },
                  { label: "Good", score: 4, icon: Smile, color: "text-emerald-400", bg: "hover:bg-emerald-500/15 border-emerald-500/30" },
                  { label: "Okay", score: 3, icon: Meh, color: "text-amber-400", bg: "hover:bg-amber-500/15 border-amber-500/30" },
                  { label: "Rough", score: 2, icon: Frown, color: "text-orange-400", bg: "hover:bg-orange-500/15 border-orange-500/30" },
                  { label: "Bad", score: 1, icon: Frown, color: "text-red-400", bg: "hover:bg-red-500/15 border-red-500/30" },
                ].map((mood) => (
                  <button
                    key={mood.score}
                    onClick={() => handleLogMood(mood.label, mood.score)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 group bg-card/40",
                      mood.bg,
                      selectedMood?.score === mood.score ? "ring-2 ring-purple-500 bg-purple-500/20" : ""
                    )}
                  >
                    <mood.icon className={cn("w-7 h-7 sm:w-8 sm:h-8 mb-1.5 transition-transform group-hover:scale-110", mood.color)} />
                    <span className="text-[11px] sm:text-xs font-semibold text-foreground">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Mood Trend Chart */}
            <div className="pt-4 border-t border-border/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  <span>7-Day Mood Trend</span>
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">Avg: 4.2 / 5</span>
              </div>

              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={moodHistory}>
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(val) => format(new Date(val), "E")}
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis domain={[1, 5]} hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(15,23,42,0.95)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      }}
                      labelFormatter={(val) => format(new Date(val), "MMM d, yyyy")}
                      formatter={(val: number) => [`Score: ${val}/5`, "Mood"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#a855f7"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#moodGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>

        </motion.div>

        {/* --- SECTION 2.5: PERSONALIZED ONBOARDING DIET & WORKOUT PROTOCOLS --- */}
        <motion.div variants={fadeInOptions} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Onboarding-Synchronized Regimens</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Personalized based on your {profile.diet || "vegetarian"} diet preference, {profile.activityLevel || "moderate"} activity, and clinical profile.
              </p>
            </div>
            <DietWorkoutModal
              trigger={
                <Button className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md">
                  View Full Protocols & Meal Schedule
                </Button>
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Diet Protocol Card */}
            <GlassCard className="p-6 bg-gradient-to-br from-emerald-500/10 via-card/70 to-card/90 border-emerald-500/20 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                    <Apple className="w-3 h-3" />
                    <span>{dietPlan.category} Protocol</span>
                  </span>
                  <span className="text-xs font-black text-foreground">{dietPlan.caloriesTarget}</span>
                </div>

                <h4 className="text-lg font-extrabold text-foreground">{dietPlan.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{dietPlan.medicalRationale}</p>

                <div className="p-3 rounded-xl bg-background/50 border border-border/40 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Breakfast:</span>
                    <span className="text-muted-foreground truncate max-w-[200px]">{dietPlan.meals.breakfast.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Lunch:</span>
                    <span className="text-muted-foreground truncate max-w-[200px]">{dietPlan.meals.lunch.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Dinner:</span>
                    <span className="text-muted-foreground truncate max-w-[200px]">{dietPlan.meals.dinner.name}</span>
                  </div>
                </div>
              </div>

              <DietWorkoutModal
                trigger={
                  <Button variant="outline" className="w-full h-10 rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/10">
                    Explore Nutritional Breakdown & Macros
                  </Button>
                }
              />
            </GlassCard>

            {/* Workout Protocol Card */}
            <GlassCard className="p-6 bg-gradient-to-br from-blue-500/10 via-card/70 to-card/90 border-blue-500/20 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25 flex items-center gap-1">
                    <Dumbbell className="w-3 h-3" />
                    <span>{workoutPlan.intensity}</span>
                  </span>
                  <span className="text-xs font-black text-foreground">{workoutPlan.duration} • {workoutPlan.frequency}</span>
                </div>

                <h4 className="text-lg font-extrabold text-foreground">{workoutPlan.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{workoutPlan.physiologicalBenefit}</p>

                <div className="p-3 rounded-xl bg-background/50 border border-border/40 space-y-1.5 text-xs">
                  {workoutPlan.mainCircuit.slice(0, 3).map((ex, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{ex.name}:</span>
                      <span className="text-blue-500 font-semibold">{ex.setsReps}</span>
                    </div>
                  ))}
                </div>
              </div>

              <DietWorkoutModal
                trigger={
                  <Button variant="outline" className="w-full h-10 rounded-xl border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-500/10">
                    View Prescribed Circuit & Schedule
                  </Button>
                }
              />
            </GlassCard>
          </div>
        </motion.div>

        {/* --- SECTION 3: AMBIENT SOUNDSCAPES & GRATITUDE JOURNAL --- */}
        <motion.div variants={fadeInOptions} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* AMBIENT SOUNDSCAPES HUB (8 cols lg) */}
          <GlassCard className="lg:col-span-8 p-6 sm:p-8 bg-card/60 backdrop-blur-xl border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Headphones className="w-6 h-6 text-cyan-400" />
                  <span>Ambient Relaxation Soundscapes</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Immerse yourself in calming soundscapes designed for focus, meditation, or rest.
                </p>
              </div>

              {isPlayingSound && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                  <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span>Playing Sound</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SOUNDSCAPES.map((sound) => {
                const isCurrentPlaying = activeSoundtrackId === sound.id && isPlayingSound;
                return (
                  <div
                    key={sound.id}
                    onClick={() => toggleSoundtrack(sound.id)}
                    className={cn(
                      "group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between relative overflow-hidden bg-gradient-to-br",
                      sound.gradient,
                      isCurrentPlaying
                        ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40"
                        : "border-border/40 hover:border-border/80 bg-card/40"
                    )}
                  >
                    <div className="flex items-center gap-3.5 relative z-10">
                      <div className={cn("p-3 rounded-xl bg-card/80 border border-border/40 shadow-sm", sound.iconColor)}>
                        {isCurrentPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground group-hover:text-cyan-400 transition-colors">
                          {sound.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">{sound.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 relative z-10">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
                        {sound.duration}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* QUICK GRATITUDE ENTRY (4 cols lg) */}
          <GlassCard className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-amber-500/5 via-card/60 to-card/80 border-amber-500/20">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 text-foreground mb-2">
                <Sun className="w-6 h-6 text-amber-400" />
                <span>Daily Gratitude</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                Reflecting on small positives rewires your brain for lasting optimism.
              </p>

              <form onSubmit={handleSaveGratitude} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    What are 2-3 things you are grateful for today?
                  </label>
                  <textarea
                    value={gratitudeNote}
                    onChange={(e) => setGratitudeNote(e.target.value)}
                    placeholder="e.g. A warm cup of tea, a good call with a friend, sunshine..."
                    rows={4}
                    className="w-full rounded-2xl border border-border/60 bg-card/80 p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm gap-2 shadow-md shadow-amber-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Save Gratitude Note</span>
                </Button>
              </form>
            </div>

            <div className="pt-4 mt-4 border-t border-border/40 text-center">
              <Link to="/patient/journal" className="text-xs font-bold text-amber-400 hover:underline inline-flex items-center gap-1">
                <span>Open Full Personal Journal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassCard>

        </motion.div>

      </motion.div>
    </PatientPageLayout>
  );
}
