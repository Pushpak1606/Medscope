import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { usePatient } from "@/context/PatientContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Brain,
  Moon,
  Zap,
  Smile,
  AlertTriangle,
  Sparkles,
  Quote,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const JournalTrendsTab: React.FC = () => {
  const { journalEntries } = usePatient();

  // Format journal entries into chart data
  const chartData = [...journalEntries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: format(new Date(entry.date), "MMM d"),
      mood: entry.moodRating || (entry.mood === "Great" ? 9 : entry.mood === "Good" ? 7 : entry.mood === "Okay" ? 5 : 3),
      sleep: entry.sleepQuality || 7,
      stress: entry.stressLevel || 4,
      energy: entry.energyLevel || 7,
    }));

  const latestEntry = journalEntries[0];

  return (
    <div className="space-y-6">
      {/* SECTION HEADER & SUMMARY CARDS */}
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Patient Psychological & Journal Trends"
          subtitle="Longitudinal tracking of mood, sleep quality, stress indices, and lifestyle entries."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-violet-500" />
              <span>AI Trend Engine (Microservice 4)</span>
            </span>
          }
        />

        {/* 4 TELEMETRY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-card/60 border border-border/50 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-blue-400">
              <Smile className="h-4 w-4" />
              <span>Current Mood</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {latestEntry?.moodRating ? `${latestEntry.moodRating}/10` : latestEntry?.mood || "Stable"}
            </div>
            <p className="text-[10px] text-muted-foreground">Self-reported</p>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 border border-border/50 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-purple-400">
              <Moon className="h-4 w-4" />
              <span>Sleep Quality</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {latestEntry?.sleepQuality ? `${latestEntry.sleepQuality}/10` : "7.5/10"}
            </div>
            <p className="text-[10px] text-muted-foreground">Restorative index</p>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 border border-border/50 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-400">
              <Zap className="h-4 w-4" />
              <span>Stress Index</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {latestEntry?.stressLevel ? `${latestEntry.stressLevel}/10` : "4/10"}
            </div>
            <p className="text-[10px] text-muted-foreground">Mild-Moderate</p>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 border border-border/50 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span>Energy Vitality</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {latestEntry?.energyLevel ? `${latestEntry.energyLevel}/10` : "7/10"}
            </div>
            <p className="text-[10px] text-muted-foreground">Physical stamina</p>
          </div>
        </div>

        {/* 14-DAY LONGITUDINAL RECHARTS GRAPH */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              14-Day Vitals & Affective Telemetry
            </h4>
            <span className="text-xs text-muted-foreground">1 to 10 Scale</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="mood" stroke="#60a5fa" strokeWidth={2.5} name="Mood" />
                <Line type="monotone" dataKey="sleep" stroke="#c084fc" strokeWidth={2} name="Sleep" />
                <Line type="monotone" dataKey="stress" stroke="#fbbf24" strokeWidth={2} name="Stress" />
                <Line type="monotone" dataKey="energy" stroke="#34d399" strokeWidth={2} name="Energy" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DoctorGlassCard>

      {/* RECENT JOURNAL ENTRIES STREAM */}
      <DoctorGlassCard variant="default" padding="lg" className="space-y-4">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Quote className="w-4 h-4 text-primary" />
          Patient Journal Free-Text Excerpts (Clinician Feed)
        </h4>

        <div className="space-y-3">
          {journalEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-2xl bg-card/50 border border-border/40 space-y-2 hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground">{entry.title}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(entry.date), "MMM d, yyyy")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "{entry.content}"
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                {entry.moodRating && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400">
                    Mood: {entry.moodRating}/10
                  </span>
                )}
                {entry.sleepQuality && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400">
                    Sleep: {entry.sleepQuality}/10
                  </span>
                )}
                {entry.stressLevel && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400">
                    Stress: {entry.stressLevel}/10
                  </span>
                )}
                {entry.energyLevel && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">
                    Energy: {entry.energyLevel}/10
                  </span>
                )}
                {entry.tags?.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </div>
  );
};

export default JournalTrendsTab;
