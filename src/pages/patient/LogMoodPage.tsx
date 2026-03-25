import { useState } from "react";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import { Smile, Meh, Frown, Compass, Heart, Activity, CheckCircle, Flame, Sparkles } from "lucide-react";

const MOOD_OPTIONS = [
  { id: "great", label: "Great", icon: Smile, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "okay", label: "Okay", icon: Meh, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "stressed", label: "Stressed", icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "low", label: "Low", icon: Frown, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
];

const PAST_LOGS = [
  { date: "Yesterday, 8:00 PM", mood: "great", notes: "Felt very productive. Completed all exercises." },
  { date: "Oct 22, 9:00 PM", mood: "okay", notes: "A bit tired today but managed to get through work." },
  { date: "Oct 21, 7:30 PM", mood: "stressed", notes: "Long calls, missed afternoon walk. Headache." },
];

const LogMoodPage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (!selectedMood) return;
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setSelectedMood(null);
      setNotes("");
    }, 2000);
  };

  return (
    <PatientPageLayout className="pb-32">
      <PageHeader
        title="Mood Check-In"
        subtitle="Track how you feel, build a better mental wellness routine, and see your emotional trends over time."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* Left Column: Logger */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6 sm:p-8">
            <h3 className="text-xl font-bold font-heading text-foreground mb-6">How are you feeling right now?</h3>
            
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 mb-8">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`flex-1 min-w-[120px] flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl border-2 transition-all duration-300 ${
                    selectedMood === mood.id 
                      ? `${mood.bg} ${mood.border} scale-105 shadow-md` 
                      : "bg-card border-border/40 hover:bg-muted"
                  }`}
                >
                  <mood.icon className={`h-8 w-8 sm:h-10 sm:w-10 mb-3 ${selectedMood === mood.id ? mood.color : "text-muted-foreground"}`} />
                  <span className={`text-sm font-bold ${selectedMood === mood.id ? mood.color : "text-foreground"}`}>
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-sm font-bold text-foreground">Add a note (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's making you feel this way?"
                className="w-full bg-background border border-border/60 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[120px] shadow-sm"
              />
            </div>

            <LiquidGlassButton 
              className="w-full" 
              disabled={!selectedMood || isSaved}
              onClick={handleSave}
            >
              {isSaved ? (
                <><CheckCircle className="h-4 w-4" /> Entry Saved</>
              ) : (
                "Save Mood Entry"
              )}
            </LiquidGlassButton>
          </GlassCard>

          <GlassCard variant="highlight" className="p-6 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex gap-4 items-start">
              <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-700/90 text-sm mb-1 uppercase tracking-wider">AI Suggestion</h4>
                <p className="text-emerald-800/80 text-sm leading-relaxed">
                  Based on your recent check-ins, taking a <span className="font-bold">10-minute mindful breathing break</span> around 3:00 PM usually improves your afternoon focus.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: History & Trends */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg font-heading text-foreground">Weekly Streak</h3>
              <div className="flex items-center gap-1.5 text-orange-500 font-bold bg-orange-500/10 px-3 py-1 rounded-full text-sm">
                <Flame className="h-4 w-4" /> 12 Days
              </div>
            </div>
            
            {/* Simple dot visualization */}
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl border border-border/50">
              {['M','T','W','T','F','S','S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    i < 4 ? "bg-emerald-500/20 text-emerald-600" : 
                    i === 4 ? "bg-amber-500/20 text-amber-600" : 
                    "bg-border text-muted-foreground/30"
                  }`}>
                    {i < 4 ? <Smile className="h-4 w-4" /> : i === 4 ? <Activity className="h-4 w-4" /> : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-bold text-lg font-heading text-foreground mb-6">Past Entries</h3>
            <div className="space-y-4">
              {PAST_LOGS.map((log, idx) => {
                const moodData = MOOD_OPTIONS.find(m => m.id === log.mood);
                const Icon = moodData?.icon || Sparkles;
                return (
                  <div key={idx} className="relative pl-6 pb-4 border-l-2 border-border/50 last:border-0 last:pb-0">
                    <div className={`absolute -left-[11px] top-0 h-5 w-5 rounded-full border-4 border-card ${moodData?.bg} flex items-center justify-center`}>
                      <div className={`h-2 w-2 rounded-full ${moodData?.color.replace('text-', 'bg-')}`} />
                    </div>
                    <div className="bg-muted/30 p-4 rounded-xl border border-border/40">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${moodData?.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                          <span className="uppercase tracking-wider">{moodData?.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{log.date}</span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{log.notes}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

      </div>
    </PatientPageLayout>
  );
};

export default LogMoodPage;
