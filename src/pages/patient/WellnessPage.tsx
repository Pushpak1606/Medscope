import React, { useState, useEffect } from "react";
import { usePatient, MoodLog } from "@/context/PatientContext";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Smile,
  Meh,
  Frown,
  Activity,
  Wind,
  Headphones,
  PlayCircle,
  BookOpen,
  MessageCircle,
  Users,
  Calendar,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Zap,
} from "lucide-react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Mock Data for Quotes ---
const MOTIVATIONAL_QUOTES = [
  { id: "q-1", text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  { id: "q-2", text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { id: "q-3", text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
  { id: "q-4", text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
];

export default function WellnessPage() {
  const { profile, addMoodLog, toggleQuoteFavorite } = usePatient();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Rotate quotes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = MOTIVATIONAL_QUOTES[currentQuoteIndex];
  const isQuoteSaved = profile.savedQuotes?.includes(currentQuote.id);

  const handleSaveQuote = () => {
    toggleQuoteFavorite(currentQuote.id);
    toast.success(isQuoteSaved ? "Quote removed from bookmarks" : "Quote saved to bookmarks!");
  };

  const handleLogMood = (mood: string, score: number) => {
    addMoodLog({ date: new Date().toISOString(), mood, score });
    toast.success("Mood logged successfully");
  };

  return (
    <div className="w-full min-h-screen bg-transparent relative overflow-x-hidden flex flex-col pb-24 lg:pb-12">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-full h-[60vh] bg-gradient-to-b from-purple-500/5 via-fuchsia-500/5 to-transparent pointer-events-none -z-10" />

      {/* Header */}
      <div className="px-5 sm:px-8 xl:px-12 pt-8 sm:pt-10 mb-8 sm:mb-12">
        <PageHeader
          title="Mental Wellness"
          subtitle="Your calm, supportive space to track and improve your emotional health."
        />
      </div>

      <div className="px-5 sm:px-8 xl:px-12 pb-12 flex-1 max-w-[1600px] w-full mx-auto space-y-8 lg:space-y-12">
        {/* HERO: Quote Section */}
        <section>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 p-6 sm:p-10 shadow-lg group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <Wind className="w-32 h-32 text-purple-500" />
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuote.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-3"
                  >
                    <p className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground leading-relaxed italic">
                      "{currentQuote.text}"
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-purple-600/80">
                      — {currentQuote.author}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleSaveQuote}
                className={cn(
                  "shrink-0 h-12 w-12 rounded-2xl border-purple-500/20 shadow-sm transition-all duration-300",
                  isQuoteSaved ? "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" : "bg-card hover:bg-muted text-muted-foreground"
                )}
              >
                {isQuoteSaved ? <BookmarkCheck className="h-6 w-6" /> : <Bookmark className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </section>

        {/* MOOD TRACKER SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Mood Input Card */}
          <div className="lg:col-span-5 bg-card/60 backdrop-blur-xl rounded-[2rem] border border-border/50 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Smile className="w-6 h-6 text-purple-500" /> How are you feeling today?
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                Tracking your mood helps identify patterns and triggers.
              </p>
            </div>
            
            <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-6">
              {[
                { label: "Great", score: 5, icon: Smile, color: "text-emerald-500", bg: "hover:bg-emerald-500/10 active:bg-emerald-500/20" },
                { label: "Good", score: 4, icon: Smile, color: "text-blue-500", bg: "hover:bg-blue-500/10 active:bg-blue-500/20" },
                { label: "Okay", score: 3, icon: Meh, color: "text-yellow-500", bg: "hover:bg-yellow-500/10 active:bg-yellow-500/20" },
                { label: "Rough", score: 2, icon: Frown, color: "text-orange-500", bg: "hover:bg-orange-500/10 active:bg-orange-500/20" },
                { label: "Bad", score: 1, icon: Frown, color: "text-red-500", bg: "hover:bg-red-500/10 active:bg-red-500/20" },
              ].map((mood) => (
                <button
                  key={mood.score}
                  onClick={() => handleLogMood(mood.label, mood.score)}
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border border-border/40 transition-all duration-200 group ${mood.bg}`}
                >
                  <mood.icon className={`w-8 h-8 sm:w-10 sm:h-10 mb-2 transition-transform group-hover:scale-110 ${mood.color}`} strokeWidth={1.5} />
                  <span className="text-xs sm:text-sm font-medium text-foreground">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood Trend Chart */}
          <div className="lg:col-span-7 bg-card/60 backdrop-blur-xl rounded-[2rem] border border-border/50 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" /> Recent Mood Trends
            </h3>
            
            {profile.moodLogs && profile.moodLogs.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profile.moodLogs.slice(-7)}>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(val) => format(new Date(val), "MMM d")}
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(15,23,42,0.95)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                      labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '6px' }}
                      itemStyle={{ color: '#e9d5ff', fontWeight: '500' }}
                      labelFormatter={(val) => format(new Date(val), "MMM d, yyyy")}
                      formatter={(value: number) => [`Score: ${value}/5`, "Mood"]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#a855f7" 
                      strokeWidth={4}
                      dot={{ r: 6, fill: "#a855f7", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 8, fill: "#a855f7" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] w-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
                <Activity className="w-8 h-8 mb-3 opacity-50" />
                <p>No mood logs yet. Start tracking today!</p>
              </div>
            )}
          </div>
        </section>

        {/* GUIDED EXERCISES & MEDIA */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Calming Exercises */}
          <div className="bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[2rem] border border-emerald-500/10 p-6 sm:p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-600">
              <Wind className="w-5 h-5" /> Guided Exercises
            </h3>
            <div className="space-y-4">
              {[
                { title: "4-7-8 Breathing", desc: "Relax your nervous system in 2 minutes", icon: Wind, time: "2 Min" },
                { title: "Quick Body Scan", desc: "Release physical tension step-by-step", icon: Activity, time: "5 Min" },
                { title: "Mindful Grounding", desc: "5-4-3-2-1 sensory technique", icon: Zap, time: "3 Min" }
              ].map((ex, i) => (
                <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-card hover:bg-emerald-500/5 border border-border/50 hover:border-emerald-500/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500">
                      <ex.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-emerald-500 transition-colors">{ex.title}</h4>
                      <p className="text-sm text-muted-foreground">{ex.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold bg-muted px-2 py-1 rounded-md">{ex.time}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors opacity-50 group-hover:opacity-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Suggestions */}
          <div className="bg-gradient-to-br from-blue-500/5 to-transparent rounded-[2rem] border border-blue-500/10 p-6 sm:p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-600">
              <Headphones className="w-5 h-5" /> Listen & Watch
            </h3>
            <div className="space-y-4">
              {[
                { title: "Deep Focus Lo-Fi", desc: "Ambient beats for concentration", icon: Headphones, type: "Audio" },
                { title: "Rain & Thunderstorm", desc: "Natural white noise for sleep", icon: Headphones, type: "Audio" },
                { title: "Visual Meditation: Ocean", desc: "Rolling waves with soft ambient", icon: PlayCircle, type: "Video" }
              ].map((media, i) => (
                <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-card hover:bg-blue-500/5 border border-border/50 hover:border-blue-500/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500 relative overflow-hidden">
                       <media.icon className="w-5 h-5 relative z-10" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-blue-500 transition-colors">{media.title}</h4>
                      <p className="text-sm text-muted-foreground">{media.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold bg-muted px-2 py-1 rounded-md">{media.type}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors opacity-50 group-hover:opacity-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* QUICK SUPPORT ACTIONS */}
        <section className="pt-4">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <Heart className="w-5 h-5 text-rose-500" /> Quick Support
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Journal", desc: "Write your thoughts", icon: BookOpen, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", hover: "hover:border-amber-500/50" },
              { title: "AI Companion", desc: "Chat securely", icon: MessageCircle, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", hover: "hover:border-indigo-500/50" },
              { title: "Community", desc: "Connect with others", icon: Users, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20", hover: "hover:border-cyan-500/50" },
              { title: "Consultation", desc: "Talk to a pro", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", hover: "hover:border-emerald-500/50" }
            ].map((action, i) => (
              <div key={i} className={`flex flex-col items-center justify-center p-6 rounded-3xl bg-card border ${action.border} ${action.hover} transition-all cursor-pointer group hover:-translate-y-1 shadow-sm`}>
                <div className={`${action.bg} ${action.color} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-foreground text-center mb-1">{action.title}</h4>
                <p className="text-xs text-muted-foreground text-center">{action.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
