import { useState, useEffect } from "react";
import { usePatient, JournalEntry } from "@/context/PatientContext";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  PenLine,
  Smile,
  Meh,
  Frown,
  Sparkles,
  Calendar,
  Hash,
  Trash2,
  ChevronDown,
  ChevronUp,
  Flame,
  FileText,
  TrendingUp,
  Moon,
  Zap,
  Activity,
  AlertTriangle,
  RefreshCw,
  BrainCircuit,
} from "lucide-react";
import { format, isToday, isYesterday, differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateJournalTrendInsight, JournalTrendAnalysis } from "@/services/aiService";

const MOOD_OPTIONS = [
  { label: "Great", icon: Smile, color: "text-emerald-500", bg: "bg-emerald-500/10", activeBg: "bg-emerald-500/20 ring-2 ring-emerald-500/40" },
  { label: "Good", icon: Smile, color: "text-blue-500", bg: "bg-blue-500/10", activeBg: "bg-blue-500/20 ring-2 ring-blue-500/40" },
  { label: "Okay", icon: Meh, color: "text-yellow-500", bg: "bg-yellow-500/10", activeBg: "bg-yellow-500/20 ring-2 ring-yellow-500/40" },
  { label: "Rough", icon: Frown, color: "text-orange-500", bg: "bg-orange-500/10", activeBg: "bg-orange-500/20 ring-2 ring-orange-500/40" },
  { label: "Bad", icon: Frown, color: "text-red-500", bg: "bg-red-500/10", activeBg: "bg-red-500/20 ring-2 ring-red-500/40" },
];

const TAG_OPTIONS = ["gratitude", "anxiety", "sleep", "progress", "therapy", "self-care", "goals", "reflection", "exercise", "nutrition"];

const WRITING_PROMPTS = [
  "What are 3 things you're grateful for today?",
  "Describe a moment that made you smile recently.",
  "What's one thing you'd like to let go of?",
  "How did you take care of yourself today?",
  "Write about a challenge you overcame this week.",
  "What does your ideal tomorrow look like?",
];

const getMoodColor = (mood?: string) => {
  const found = MOOD_OPTIONS.find((m) => m.label === mood);
  return found ? found.color : "text-muted-foreground";
};

const getMoodBg = (mood?: string) => {
  const found = MOOD_OPTIONS.find((m) => m.label === mood);
  return found ? found.bg : "bg-muted/50";
};

const formatEntryDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
};

export default function JournalPage() {
  const { journalEntries, addJournalEntry, deleteJournalEntry } = usePatient();

  // New entry form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>("Good");
  const [moodRating, setMoodRating] = useState<number>(7);
  const [sleepQuality, setSleepQuality] = useState<number>(7);
  const [stressLevel, setStressLevel] = useState<number>(4);
  const [energyLevel, setEnergyLevel] = useState<number>(7);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [promptIndex] = useState(() => Math.floor(Math.random() * WRITING_PROMPTS.length));

  // AI Longitudinal Trend Analysis state
  const [trendInsight, setTrendInsight] = useState<JournalTrendAnalysis | null>(null);
  const [isAnalyzingTrends, setIsAnalyzingTrends] = useState<boolean>(false);

  // Auto-analyze trends on load or when entries change
  useEffect(() => {
    let isMounted = true;
    const loadTrends = async () => {
      if (journalEntries.length === 0) return;
      setIsAnalyzingTrends(true);
      try {
        const result = await generateJournalTrendInsight(journalEntries);
        if (isMounted) setTrendInsight(result);
      } catch (err) {
        console.warn("Trend insight generation fallback:", err);
      } finally {
        if (isMounted) setIsAnalyzingTrends(false);
      }
    };
    loadTrends();
    return () => {
      isMounted = false;
    };
  }, [journalEntries.length]);

  const handleRefreshTrends = async () => {
    setIsAnalyzingTrends(true);
    try {
      const result = await generateJournalTrendInsight(journalEntries);
      setTrendInsight(result);
      toast.success("AI trend insights updated.");
    } catch {
      toast.error("Could not refresh AI insights.");
    } finally {
      setIsAnalyzingTrends(false);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please add a title and some content to your entry.");
      return;
    }
    addJournalEntry({
      date: new Date().toISOString(),
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood || undefined,
      moodRating,
      sleepQuality,
      stressLevel,
      energyLevel,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    });
    toast.success("Daily clinical journal entry saved ✨");
    setTitle("");
    setContent("");
    setSelectedMood("Good");
    setMoodRating(7);
    setSleepQuality(7);
    setStressLevel(4);
    setEnergyLevel(7);
    setSelectedTags([]);
    setShowComposer(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    toast.success("Entry deleted");
  };

  // Calculate writing streak
  const getWritingStreak = () => {
    if (journalEntries.length === 0) return 0;
    const sorted = [...journalEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < sorted.length; i++) {
      const entryDate = new Date(sorted[i].date);
      const diff = differenceInCalendarDays(today, entryDate);
      if (diff === streak || diff === streak + 1) {
        streak = diff + 1;
      } else if (i === 0 && diff > 1) {
        return 0;
      } else {
        break;
      }
    }
    return Math.max(streak, journalEntries.length > 0 ? 1 : 0);
  };

  const thisWeekEntries = journalEntries.filter(
    (e) => differenceInCalendarDays(new Date(), new Date(e.date)) < 7
  );

  return (
    <PatientPageLayout className="pb-32">
      <PageHeader
        title="Writing Journal"
        subtitle="A private space to reflect, express, and grow. Your thoughts stay with you."
        backHref="/patient/wellness"
        backLabel="Wellness"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* --- Main Column --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* New Entry Trigger / Composer */}
          <AnimatePresence mode="wait">
            {!showComposer ? (
              <motion.div
                key="trigger"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GlassCard
                  className="cursor-pointer group hover:border-amber-500/30 hover:shadow-amber-500/5 hover:shadow-lg transition-all"
                  onClick={() => setShowComposer(true)}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <PenLine className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg group-hover:text-amber-600 transition-colors">
                        Write a new entry
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5 italic">
                        "{WRITING_PROMPTS[promptIndex]}"
                      </p>
                    </div>
                    <PenLine className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="composer"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="border-amber-500/20 shadow-lg relative overflow-hidden">
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />
                  
                  <div className="space-y-5 pt-2">
                    {/* Title */}
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(), "EEEE, MMMM d, yyyy")}
                      </div>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your entry a title..."
                        className="w-full bg-transparent border-none outline-none text-xl sm:text-2xl font-bold text-foreground placeholder:text-muted-foreground/40 focus:ring-0"
                      />
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind? Let your thoughts flow freely..."
                        className="w-full bg-background/50 border border-border/40 rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed text-foreground placeholder:text-muted-foreground/50 min-h-[180px] resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all"
                      />
                      <span className="absolute bottom-3 right-4 text-xs text-muted-foreground/50">
                        {content.length} characters
                      </span>
                    </div>

                    {/* Mood Selection */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">How are you feeling?</p>
                      <div className="flex flex-wrap gap-2">
                        {MOOD_OPTIONS.map((mood) => (
                          <button
                            key={mood.label}
                            onClick={() => setSelectedMood(selectedMood === mood.label ? null : mood.label)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                              selectedMood === mood.label
                                ? `${mood.activeBg} ${mood.color}`
                                : `${mood.bg} ${mood.color} hover:scale-105`
                            )}
                          >
                            <mood.icon className="h-4 w-4" strokeWidth={1.5} />
                            {mood.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Numeric 1-10 Metrics Sliders (Medscope FR-07 Specification) */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-primary" />
                          Daily Health Metrics (1-10 Scale)
                        </span>
                        <span className="text-[11px] text-muted-foreground">Used for AI longitudinal trend analysis</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        {/* Mood Rating */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Smile className="w-3.5 h-3.5 text-blue-400" /> Mood Rating
                            </span>
                            <span className="font-bold text-foreground">{moodRating} / 10</span>
                          </div>
                          <Slider
                            value={[moodRating]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={([val]) => setMoodRating(val)}
                          />
                        </div>

                        {/* Sleep Quality */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Moon className="w-3.5 h-3.5 text-purple-400" /> Sleep Quality
                            </span>
                            <span className="font-bold text-foreground">{sleepQuality} / 10</span>
                          </div>
                          <Slider
                            value={[sleepQuality]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={([val]) => setSleepQuality(val)}
                          />
                        </div>

                        {/* Stress Level */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Stress Level
                            </span>
                            <span className="font-bold text-foreground">{stressLevel} / 10</span>
                          </div>
                          <Slider
                            value={[stressLevel]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={([val]) => setStressLevel(val)}
                          />
                        </div>

                        {/* Energy Level */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Energy Vitality
                            </span>
                            <span className="font-bold text-foreground">{energyLevel} / 10</span>
                          </div>
                          <Slider
                            value={[energyLevel]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={([val]) => setEnergyLevel(val)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5" /> Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {TAG_OPTIONS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
                              selectedTags.includes(tag)
                                ? "bg-amber-500/15 border-amber-500/40 text-amber-600 scale-105"
                                : "bg-muted/30 border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                            )}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => setShowComposer(false)}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                      <LiquidGlassButton
                        onClick={handleSave}
                        disabled={!title.trim() || !content.trim()}
                        className="px-6"
                      >
                        <Sparkles className="h-4 w-4" />
                        Save Entry
                      </LiquidGlassButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- Past Entries Timeline --- */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-500" />
              Your Entries
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">
                {journalEntries.length} total
              </span>
            </h3>

            {journalEntries.length === 0 ? (
              <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-3xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <PenLine className="h-8 w-8 text-amber-500/50" />
                </div>
                <h4 className="font-bold text-foreground text-lg mb-2">Start your journal</h4>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Your first entry is waiting. Writing helps you process emotions, track progress, and discover patterns.
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {journalEntries.map((entry, i) => {
                    const isExpanded = expandedEntry === entry.id;
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <GlassCard className="group hover:border-amber-500/20 transition-all">
                          <div
                            className="cursor-pointer"
                            onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                          >
                            <div className="flex items-start gap-3 sm:gap-4">
                              {/* Mood Indicator */}
                              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", getMoodBg(entry.mood))}>
                                {entry.mood ? (
                                  (() => {
                                    const M = MOOD_OPTIONS.find((m) => m.label === entry.mood);
                                    return M ? <M.icon className={cn("h-5 w-5", M.color)} strokeWidth={1.5} /> : <PenLine className="h-5 w-5 text-amber-500" />;
                                  })()
                                ) : (
                                  <PenLine className="h-5 w-5 text-amber-500" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="font-bold text-foreground truncate">{entry.title}</h4>
                                  <span className="text-xs text-muted-foreground shrink-0">
                                    {formatEntryDate(entry.date)}
                                  </span>
                                </div>
                                <p className={cn(
                                  "text-sm text-muted-foreground mt-1 leading-relaxed",
                                  !isExpanded && "line-clamp-2"
                                )}>
                                  {entry.content}
                                </p>
                              </div>

                              <div className="shrink-0 pt-1">
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expanded content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 mt-4 border-t border-border/30">
                                  {/* Tags */}
                                  {entry.tags && entry.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                      {entry.tags.map((tag) => (
                                        <span key={tag} className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold">
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* Metric Pills (FR-07) */}
                                  {(entry.moodRating || entry.sleepQuality || entry.stressLevel || entry.energyLevel) && (
                                    <div className="flex flex-wrap gap-2 pt-1 pb-3 text-xs">
                                      {entry.moodRating && (
                                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                                          Mood: {entry.moodRating}/10
                                        </span>
                                      )}
                                      {entry.sleepQuality && (
                                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                                          Sleep: {entry.sleepQuality}/10
                                        </span>
                                      )}
                                      {entry.stressLevel && (
                                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                                          Stress: {entry.stressLevel}/10
                                        </span>
                                      )}
                                      {entry.energyLevel && (
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                                          Energy: {entry.energyLevel}/10
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Mood + Meta */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      {entry.mood && (
                                        <span className={cn("font-semibold", getMoodColor(entry.mood))}>
                                          Feeling {entry.mood}
                                        </span>
                                      )}
                                      <span>•</span>
                                      <span>{format(new Date(entry.date), "h:mm a")}</span>
                                    </div>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                                      className="text-muted-foreground hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* --- Desktop Sidebar --- */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
          
          {/* AI Longitudinal Trend Analysis (Microservice 4) */}
          <GlassCard className="relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-card/70 to-card">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
            <div className="flex items-center justify-between mb-3 pt-2">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-purple-400" />
                <h4 className="font-bold text-foreground text-sm">AI Weekly Trend Insights</h4>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRefreshTrends}
                disabled={isAnalyzingTrends}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isAnalyzingTrends && "animate-spin")} />
              </Button>
            </div>

            {trendInsight ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Trajectory:</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-bold",
                      trendInsight.trajectory === "Improving"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : trendInsight.trajectory === "Declining / Needs Attention"
                        ? "bg-red-500/15 text-red-400 border-red-500/30"
                        : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                    )}
                  >
                    {trendInsight.trajectory}
                  </Badge>
                </div>

                {/* 4 Metrics Averages */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-background/50 border border-border/30">
                    <span className="text-muted-foreground block text-[10px]">Avg Mood</span>
                    <span className="font-bold text-foreground text-sm">{trendInsight.averageMood} / 10</span>
                  </div>
                  <div className="p-2 rounded-xl bg-background/50 border border-border/30">
                    <span className="text-muted-foreground block text-[10px]">Avg Sleep</span>
                    <span className="font-bold text-foreground text-sm">{trendInsight.averageSleep} / 10</span>
                  </div>
                  <div className="p-2 rounded-xl bg-background/50 border border-border/30">
                    <span className="text-muted-foreground block text-[10px]">Avg Stress</span>
                    <span className="font-bold text-foreground text-sm">{trendInsight.averageStress} / 10</span>
                  </div>
                  <div className="p-2 rounded-xl bg-background/50 border border-border/30">
                    <span className="text-muted-foreground block text-[10px]">Avg Energy</span>
                    <span className="font-bold text-foreground text-sm">{trendInsight.averageEnergy} / 10</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {trendInsight.summaryText}
                </p>

                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground/90">
                  <strong className="text-primary block mb-0.5">Clinical Note:</strong>
                  {trendInsight.actionableAdvice}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-2">
                {isAnalyzingTrends ? "Analyzing trend patterns with Medscope AI..." : "Log your daily entries to reveal trend insights."}
              </p>
            )}
          </GlassCard>

          {/* Writing Streak */}
          <GlassCard className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="flex items-center gap-4 pt-2">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <Flame className="h-7 w-7 text-amber-500" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground">{getWritingStreak()}</p>
                <p className="text-sm text-muted-foreground font-medium">Day writing streak</p>
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard>
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" /> Journal Stats
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Total Entries</span>
                </div>
                <span className="text-sm font-bold text-foreground">{journalEntries.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">This Week</span>
                </div>
                <span className="text-sm font-bold text-foreground">{thisWeekEntries.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <div className="flex items-center gap-2.5">
                  <Smile className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Top Mood</span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {(() => {
                    const moods = journalEntries.filter((e) => e.mood).map((e) => e.mood!);
                    if (moods.length === 0) return "—";
                    const freq: Record<string, number> = {};
                    moods.forEach((m) => (freq[m] = (freq[m] || 0) + 1));
                    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
                  })()}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Writing Prompt */}
          <GlassCard variant="subtle" className="border-amber-500/15 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Today's Prompt</p>
                <p className="text-sm text-foreground font-medium leading-relaxed italic">
                  "{WRITING_PROMPTS[promptIndex]}"
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </PatientPageLayout>
  );
}
