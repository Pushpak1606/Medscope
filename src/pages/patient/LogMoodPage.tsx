import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis,
  YAxis
} from "recharts";
import { 
  Frown, 
  Meh, 
  Smile, 
  Activity, 
  Flame, 
  Star, 
  Wind, 
  Brain, 
  Coffee,
  Calendar,
  Sparkles
} from "lucide-react";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";

// --- Types & Data ---

type MoodValue = 1 | 2 | 3 | 4 | 5;

interface MoodOption {
  id: string;
  value: MoodValue;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  glow: string;
}

const MOODS: MoodOption[] = [
  { id: "rough", value: 1, label: "Rough", icon: Frown, color: "text-red-500", bg: "bg-red-500/10", glow: "ring-red-500/50" },
  { id: "low", value: 2, label: "Low", icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10", glow: "ring-orange-500/50" },
  { id: "neutral", value: 3, label: "Neutral", icon: Meh, color: "text-blue-400", bg: "bg-blue-400/10", glow: "ring-blue-400/50" },
  { id: "good", value: 4, label: "Good", icon: Smile, color: "text-emerald-400", bg: "bg-emerald-400/10", glow: "ring-emerald-400/50" },
  { id: "great", value: 5, label: "Great", icon: Sparkles, color: "text-violet-500", bg: "bg-violet-500/10", glow: "ring-violet-500/50" },
];

const WEEKLY_DATA = [
  { day: "M", fullDate: "Mon, Oct 20", score: 3, mood: "Neutral", emoji: "😐" },
  { day: "T", fullDate: "Tue, Oct 21", score: 2, mood: "Low", emoji: "😕" },
  { day: "W", fullDate: "Wed, Oct 22", score: 4, mood: "Good", emoji: "🙂" },
  { day: "T", fullDate: "Thu, Oct 23", score: 5, mood: "Great", emoji: "😄" },
  { day: "F", fullDate: "Fri, Oct 24", score: 4, mood: "Good", emoji: "🙂" },
  { day: "S", fullDate: "Sat, Oct 25", score: 5, mood: "Great", emoji: "😄" },
  { day: "S", fullDate: "Sun, Oct 26", score: 4, mood: "Good", emoji: "🙂" }, // Today
];

const PAST_ENTRIES = [
  { id: 1, date: "Yesterday, 8:00 PM", moodId: "great", note: "Felt very productive. Completed all exercises." },
  { id: 2, date: "Oct 24, 9:00 PM", moodId: "good", note: "A bit tired today but managed to get through work." },
  { id: 3, date: "Oct 23, 7:30 PM", moodId: "great", note: "Awesome energetic day!" },
  { id: 4, date: "Oct 21, 6:00 PM", moodId: "low", note: "Long calls, missed afternoon walk. Headache." },
  { id: 5, date: "Oct 20, 8:15 PM", moodId: "neutral", note: "Normal day, nothing special." },
];

// --- Animations ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// --- Custom Components ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl">
        <p className="text-xs text-muted-foreground font-medium mb-1">{data.fullDate}</p>
        <p className="text-lg font-bold flex items-center gap-2">
          {data.emoji} {data.mood}
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Page ---

const LogMoodPage = () => {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [note, setNote] = useState("");
  const [stressLevel, setStressLevel] = useState(65); // Default stress %
  const [chartRendered, setChartRendered] = useState(false);

  // Trigger Recharts animation slightly after page mount
  useEffect(() => {
    const timer = setTimeout(() => setChartRendered(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleLogMood = () => {
    if (!selectedMood) return;
    // In a real app, this would save to global context/backend
    setSelectedMood(null);
    setNote("");
  };

  const getActiveMoodOption = () => MOODS.find(m => m.value === selectedMood);

  // Dynamic tips based on selected or default mood.
  const currentMoodValue = selectedMood || 3;
  
  return (
    <PatientPageLayout className="pb-32">
      <PageHeader
        title="Wellness & Mood Tracker"
        subtitle="Track how you feel, build a better mental wellness routine, and see your emotional trends over time."
      />

      <motion.div 
        className="flex flex-col gap-6 mt-6 max-w-5xl mx-auto w-full px-4 sm:px-8 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* SECTION 1: Today's Mood Check-in */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 sm:p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold font-heading text-center mb-8">How are you feeling today?</h2>
            
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-12 sm:gap-6 mb-8 w-full mt-4">
              {MOODS.map((mood) => {
                const isSelected = selectedMood === mood.value;
                const Icon = mood.icon;
                
                return (
                  <motion.button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      scale: isSelected ? 1.15 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`
                      relative flex flex-col items-center justify-center 
                      w-16 h-16 sm:w-20 sm:h-20 rounded-2xl backdrop-blur-md border border-border/50
                      transition-colors duration-300
                      ${isSelected ? `bg-card shadow-lg ring-2 ${mood.glow}` : 'bg-card/40 hover:bg-card'}
                    `}
                  >
                    <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${isSelected ? mood.color : 'text-muted-foreground'}`} />
                    
                    {/* Floating Label */}
                    {isSelected && (
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`absolute -bottom-8 text-sm font-bold ${mood.color}`}
                      >
                        {mood.label}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className={`w-full max-w-2xl transition-all duration-500 ${selectedMood ? 'opacity-100 mt-4' : 'opacity-0 h-0 pointer-events-none'}`}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind? (Optional)"
                className="w-full bg-background/50 backdrop-blur-sm border border-border/60 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[100px] shadow-inner mb-6"
              />
              <div className="flex justify-center">
                <LiquidGlassButton 
                  className="w-full sm:w-auto min-w-[200px]" 
                  disabled={!selectedMood}
                  onClick={handleLogMood}
                >
                  Log Today's Mood
                </LiquidGlassButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* SECTION 2: Mood History Chart */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg font-heading text-foreground">This Week</h3>
              
              {/* Optional: Tab row visualization */}
              <div className="flex gap-1.5 sm:gap-2">
                {WEEKLY_DATA.map((d, i) => (
                  <div key={i} className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                    i === WEEKLY_DATA.length - 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {d.day}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[140px] sm:h-[180px] w-full mt-4">
              {chartRendered && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis domain={[1, 5]} hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* SECTION 3: 2-Column Grid (Stats & Stress) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Left: Wellness Stats */}
          <motion.div variants={itemVariants} className="h-full">
            <GlassCard className="p-6 h-full flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4 bg-background/40 p-3 rounded-2xl border border-border/40">
                <div className="h-10 w-10 shrink-0 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">Average Mood</p>
                  <p className="font-bold text-foreground text-lg">Good (4.2)</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-background/40 p-3 rounded-2xl border border-border/40">
                <div className="h-10 w-10 shrink-0 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                  <Flame className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">Mood Streak</p>
                  <p className="font-bold text-foreground text-lg text-blue-400">12 Days 🔥</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-background/40 p-3 rounded-2xl border border-border/40">
                <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <Star className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">Best Day</p>
                  <p className="font-bold text-foreground text-lg">Saturday</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right: Stress Level Tracker */}
          <motion.div variants={itemVariants} className="h-full">
            <GlassCard className="p-6 h-full flex flex-col items-center justify-center relative overflow-hidden">
              <h3 className="font-bold text-lg font-heading self-start mb-2 z-10">Stress Level</h3>
              
              {/* Circular Progress (SVG) */}
              <div className="relative w-[120px] h-[120px] my-4 z-10 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-muted/30 fill-none" strokeWidth="8" />
                  <motion.circle 
                    cx="50" cy="50" r="40" 
                    className="stroke-amber-500 fill-none" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: `${(stressLevel / 100) * 251.2} 251.2` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-heading">{stressLevel}%</span>
                </div>
              </div>

              <div className="flex gap-2 w-full justify-center z-10 mt-2">
                <button onClick={() => setStressLevel(20)} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${stressLevel <= 30 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>Low</button>
                <button onClick={() => setStressLevel(65)} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${stressLevel > 30 && stressLevel <= 70 ? 'bg-amber-500/20 text-amber-500' : 'bg-muted text-muted-foreground'}`}>Mod</button>
                <button onClick={() => setStressLevel(90)} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${stressLevel > 70 ? 'bg-red-500/20 text-red-500' : 'bg-muted text-muted-foreground'}`}>High</button>
              </div>
              
              <button className="mt-4 text-xs font-bold text-primary hover:underline z-10">Update Stress Level</button>
              
              {/* Background gradient hint */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 blur-3xl rounded-full z-0"></div>
            </GlassCard>
          </motion.div>
        </div>

        {/* SECTION 4: Personalized Tips */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6">
            <h3 className="font-bold text-lg font-heading text-foreground mb-4">Personalized Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {currentMoodValue <= 2 ? (
                <>
                  <div className="bg-background/40 p-4 rounded-2xl border border-border/40">
                    <div className="h-8 w-8 rounded-full bg-teal-500/20 text-teal-500 flex items-center justify-center mb-3">
                      <Wind className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">Box Breathing</h4>
                    <p className="text-xs text-muted-foreground">Inhale 4s, hold 4s, exhale 4s. Try this for 2 minutes to center yourself.</p>
                  </div>
                  <div className="bg-background/40 p-4 rounded-2xl border border-border/40">
                    <div className="h-8 w-8 rounded-full bg-violet-500/20 text-violet-500 flex items-center justify-center mb-3">
                      <Coffee className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">Screen Break</h4>
                    <p className="text-xs text-muted-foreground">Step away from devices. Look at something 20 feet away for 20 seconds.</p>
                  </div>
                  <div className="bg-background/40 p-4 rounded-2xl border border-border/40">
                    <div className="h-8 w-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mb-3">
                      <Brain className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">Gentle Walk</h4>
                    <p className="text-xs text-muted-foreground">A 10-minute walk outside can naturally boost endorphins and reset mood.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-background/40 p-4 rounded-2xl border border-border/40">
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mb-3">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">Maintain Routine</h4>
                    <p className="text-xs text-muted-foreground">You're doing great! Keep up with your current sleep and activity schedule.</p>
                  </div>
                  <div className="bg-background/40 p-4 rounded-2xl border border-border/40">
                    <div className="h-8 w-8 rounded-full bg-teal-500/20 text-teal-500 flex items-center justify-center mb-3">
                      <Brain className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">Mindful Gratitude</h4>
                    <p className="text-xs text-muted-foreground">Capitalize on good feeling by writing down 3 things you're grateful for today.</p>
                  </div>
                  <div className="bg-background/40 p-4 rounded-2xl border border-border/40">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-3">
                      <Activity className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">Light Exercise</h4>
                    <p className="text-xs text-muted-foreground">Use this positive energy for a 20-minute workout or yoga session.</p>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* SECTION 5: Past Entries */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg font-heading text-foreground">Past Entries</h3>
              <button className="text-sm font-bold text-primary hover:underline">View All</button>
            </div>
            
            <div className="space-y-0">
              {PAST_ENTRIES.map((entry, idx) => {
                const moodData = MOODS.find(m => m.id === entry.moodId);
                const isLast = idx === PAST_ENTRIES.length - 1;
                
                return (
                  <div key={entry.id} className={`relative pl-8 py-4 ${!isLast ? 'border-b border-border/40' : ''}`}>
                    {/* Tiny visual connecting line could go here if desired */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${moodData?.bg} flex items-center justify-center`}>
                      <div className={`w-2 h-2 rounded-full ${moodData?.color.replace('text-', 'bg-')}`} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${moodData?.color} uppercase tracking-wider`}>{moodData?.label}</span>
                        <span className="text-sm text-foreground/80 line-clamp-1">— {entry.note}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium shrink-0">{entry.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

      </motion.div>
    </PatientPageLayout>
  );
};

export default LogMoodPage;
