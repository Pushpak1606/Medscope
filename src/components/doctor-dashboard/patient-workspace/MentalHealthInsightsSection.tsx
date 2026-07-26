import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import {
  Brain,
  Moon,
  Zap,
  Smile,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Quote,
  TrendingUp,
} from "lucide-react";

export interface MentalHealthData {
  moodTrend: string;
  sleepHours: string;
  stressLevel: string;
  adherenceRate: string;
  aiPsychSummary: string;
  recentJournalQuotes: {
    date: string;
    text: string;
    sentiment: "anxious" | "calm" | "optimistic";
  }[];
}

const MOCK_MENTAL_HEALTH: MentalHealthData = {
  moodTrend: "Mild Health Anxiety (Correlated with chest symptoms)",
  sleepHours: "7.2 hrs/night",
  stressLevel: "6/10 (Medium)",
  adherenceRate: "94% High Adherence",
  aiPsychSummary:
    "Patient exhibits transient health anxiety triggered by exertional symptoms. No clinical depression markers. High engagement with Rx companion app.",
  recentJournalQuotes: [
    {
      date: "July 25, 2026",
      text: "Felt a slight tightness in my chest while carrying groceries. Trying to stay calm and take slow breaths.",
      sentiment: "anxious",
    },
    {
      date: "July 22, 2026",
      text: "Slept well last night after evening relaxation routine. Energy felt good during morning walk.",
      sentiment: "calm",
    },
    {
      date: "July 18, 2026",
      text: "Metformin side effects seem less noticeable now. Keeping up with low-salt meals.",
      sentiment: "optimistic",
    },
  ],
};

import { usePatient } from "@/context/PatientContext";

export const MentalHealthInsightsSection: React.FC = () => {
  const { profile } = usePatient();
  const moodLogs = profile?.moodLogs || [];
  const latestMood = moodLogs.length > 0 ? moodLogs[0] : null;

  return (
    <section aria-label="Mental Health & Journal Insights Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Mental Health & Patient Journal Insights"
          subtitle="Real-time mood logs, sleep quality telemetry & AI psychological risk summary."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20 flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-violet-500" />
              <span>{latestMood ? `Live Mood: ${latestMood.mood} (${latestMood.score}/10)` : "Psychological Telemetry"}</span>
            </span>
          }
        />

        {/* 4 Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-violet-500">
              <Smile className="h-4 w-4" />
              <span>Mood State</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-foreground">Mild Anxiety</div>
            <div className="text-[10px] text-muted-foreground font-medium">Symptom-triggered</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-blue-500">
              <Moon className="h-4 w-4" />
              <span>Avg Sleep</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-foreground">{MOCK_MENTAL_HEALTH.sleepHours}</div>
            <div className="text-[10px] text-muted-foreground font-medium">7-day telemetry</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-500">
              <Zap className="h-4 w-4" />
              <span>Stress Index</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-amber-500">{MOCK_MENTAL_HEALTH.stressLevel}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Moderate tension</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
              <span>Rx Adherence</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-emerald-500">94%</div>
            <div className="text-[10px] text-muted-foreground font-medium">Excellent logger</div>
          </div>
        </div>

        {/* AI Psychological Synthesis Box */}
        <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 backdrop-blur-xl flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold uppercase tracking-wider text-violet-600 dark:text-violet-300">
              AI Psychological Synthesis
            </span>
            <p className="text-foreground/90 font-medium leading-relaxed">
              {MOCK_MENTAL_HEALTH.aiPsychSummary}
            </p>
          </div>
        </div>

        {/* Patient Journal Quotes */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span>Recent Patient Journal Entries</span>
          </h4>

          <div className="space-y-2.5">
            {MOCK_MENTAL_HEALTH.recentJournalQuotes.map((quote, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-md flex items-start gap-3"
              >
                <Quote className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-muted-foreground">{quote.date}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        quote.sentiment === "anxious"
                          ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          : quote.sentiment === "calm"
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      }`}
                    >
                      {quote.sentiment}
                    </span>
                  </div>
                  <p className="text-foreground font-medium italic">"{quote.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default MentalHealthInsightsSection;
