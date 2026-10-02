import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { usePatient } from "@/context/PatientContext";
import {
  Brain,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Activity,
  HeartHandshake,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const ScreeningHistoryTab: React.FC = () => {
  const { screeningHistory } = usePatient();

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "Severe":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Moderately Severe":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Moderate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Mild":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
  };

  // Find latest by instrument
  const latestPhq9 = screeningHistory.find((s) => s.instrument === "PHQ-9");
  const latestGad7 = screeningHistory.find((s) => s.instrument === "GAD-7");
  const latestPss10 = screeningHistory.find((s) => s.instrument === "PSS-10");

  return (
    <div className="space-y-6">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Clinical Psychological Screening Suite"
          subtitle="Validated psychometric instruments: PHQ-9 (Depression), GAD-7 (Anxiety), and PSS-10 (Perceived Stress)."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-violet-500" />
              <span>Validated Psychometrics (FR-05)</span>
            </span>
          }
        />

        {/* 3 INSTRUMENT SNAPSHOT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PHQ-9 */}
          <div className="p-5 rounded-2xl bg-card/60 border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">PHQ-9 Depression</span>
              {latestPhq9 && (
                <Badge variant="outline" className={`text-xs ${getSeverityBadgeColor(latestPhq9.severity)}`}>
                  {latestPhq9.severity}
                </Badge>
              )}
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-foreground">
                {latestPhq9 ? `${latestPhq9.score} / ${latestPhq9.maxScore}` : "No Record"}
              </span>
              <span className="text-xs text-muted-foreground">
                {latestPhq9 ? format(new Date(latestPhq9.completedAt), "MMM d, yyyy") : "—"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {latestPhq9 ? latestPhq9.clinicalInterpretation : "Baseline test pending."}
            </p>
            {latestPhq9?.crisisAlert && (
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-[11px] text-red-400 flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                Item 9 Positive: Ideation flagged
              </div>
            )}
          </div>

          {/* GAD-7 */}
          <div className="p-5 rounded-2xl bg-card/60 border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">GAD-7 Anxiety</span>
              {latestGad7 && (
                <Badge variant="outline" className={`text-xs ${getSeverityBadgeColor(latestGad7.severity)}`}>
                  {latestGad7.severity}
                </Badge>
              )}
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-foreground">
                {latestGad7 ? `${latestGad7.score} / ${latestGad7.maxScore}` : "No Record"}
              </span>
              <span className="text-xs text-muted-foreground">
                {latestGad7 ? format(new Date(latestGad7.completedAt), "MMM d, yyyy") : "—"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {latestGad7 ? latestGad7.clinicalInterpretation : "Baseline test pending."}
            </p>
            {latestGad7?.escalationTriggered && (
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-400 flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Score ≥ 10: Clinical follow-up advised
              </div>
            )}
          </div>

          {/* PSS-10 */}
          <div className="p-5 rounded-2xl bg-card/60 border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">PSS-10 Stress Scale</span>
              {latestPss10 && (
                <Badge variant="outline" className={`text-xs ${getSeverityBadgeColor(latestPss10.severity)}`}>
                  {latestPss10.severity}
                </Badge>
              )}
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-foreground">
                {latestPss10 ? `${latestPss10.score} / ${latestPss10.maxScore}` : "No Record"}
              </span>
              <span className="text-xs text-muted-foreground">
                {latestPss10 ? format(new Date(latestPss10.completedAt), "MMM d, yyyy") : "—"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {latestPss10 ? latestPss10.clinicalInterpretation : "Baseline test pending."}
            </p>
          </div>
        </div>
      </DoctorGlassCard>

      {/* DETAILED SCREENING TIMELINE LIST */}
      <DoctorGlassCard variant="default" padding="lg" className="space-y-4">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Complete Screening Audit Log & Longitudinal Submissions
        </h4>

        <div className="space-y-3">
          {screeningHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-card/50 border border-border/40 space-y-3 hover:border-border transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-bold text-xs">
                    {item.instrument}
                  </Badge>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getSeverityBadgeColor(item.severity)}`}>
                    {item.severity}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    Score: {item.score} / {item.maxScore}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {format(new Date(item.completedAt), "MMM d, yyyy h:mm a")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-primary" />
                    Interpretation
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{item.clinicalInterpretation}</p>
                </div>

                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                  <span className="font-semibold text-primary flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    Clinical Recommendation
                  </span>
                  <p className="text-foreground/90 leading-relaxed">{item.actionRecommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </div>
  );
};

export default ScreeningHistoryTab;
