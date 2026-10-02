import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import { usePatient } from "@/context/PatientContext";
import {
  ScreeningInstrument,
  PHQ9_QUESTIONS,
  PHQ9_OPTIONS,
  evaluatePHQ9,
  GAD7_QUESTIONS,
  GAD7_OPTIONS,
  evaluateGAD7,
  PSS10_QUESTIONS,
  PSS10_OPTIONS,
  evaluatePSS10,
  ScreeningResult,
} from "@/lib/clinicalScreening";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ShieldAlert,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  PhoneCall,
  Activity,
  HeartHandshake,
  Clock,
  ChevronRight,
  TrendingDown,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { format } from "date-fns";

export default function MentalHealthScreeningPage() {
  const navigate = useNavigate();
  const { screeningHistory, addScreeningResult } = usePatient();

  const [activeInstrument, setActiveInstrument] = useState<ScreeningInstrument>("PHQ-9");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completedResult, setCompletedResult] = useState<ScreeningResult | null>(null);

  // Switch instrument resets current questionnaire state
  const handleSelectInstrument = (inst: ScreeningInstrument) => {
    setActiveInstrument(inst);
    setAnswers({});
    setCompletedResult(null);
  };

  const getQuestions = () => {
    switch (activeInstrument) {
      case "PHQ-9":
        return PHQ9_QUESTIONS;
      case "GAD-7":
        return GAD7_QUESTIONS;
      case "PSS-10":
        return PSS10_QUESTIONS;
    }
  };

  const getOptions = () => {
    switch (activeInstrument) {
      case "PHQ-9":
        return PHQ9_OPTIONS;
      case "GAD-7":
        return GAD7_OPTIONS;
      case "PSS-10":
        return PSS10_OPTIONS;
    }
  };

  const questions = getQuestions();
  const options = getOptions();
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const handleOptionSelect = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      toast.error(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    let resultData: ReturnType<typeof evaluatePHQ9>;
    if (activeInstrument === "PHQ-9") {
      resultData = evaluatePHQ9(answers);
    } else if (activeInstrument === "GAD-7") {
      resultData = evaluateGAD7(answers);
    } else {
      resultData = evaluatePSS10(answers);
    }

    const fullResult: ScreeningResult = {
      ...resultData,
      id: `scr-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };

    addScreeningResult(fullResult);
    setCompletedResult(fullResult);

    if (fullResult.crisisAlert) {
      toast.error("Immediate crisis support resources activated.", { duration: 8000 });
    } else if (fullResult.escalationTriggered) {
      toast.warning("Clinical threshold met. Doctor consultation is advised.", { duration: 6000 });
    } else {
      toast.success("Screening successfully completed and recorded.");
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCompletedResult(null);
  };

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

  return (
    <PatientPageLayout>
      <div className="space-y-8 max-w-5xl mx-auto pb-16">
        
        {/* HEADER */}
        <PageHeader
          badge="Validated Clinical Instruments • FR-05"
          badgeIcon={Brain}
          title="Mental Health & Clinical Screening"
          description="Evidence-based depression (PHQ-9), anxiety (GAD-7), and stress (PSS-10) screening with automated clinical threshold routing."
        />

        {/* INSTRUMENT SELECTOR TABS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: "PHQ-9" as ScreeningInstrument,
              title: "PHQ-9 Depression",
              desc: "9-item standard depression screening tool (Kroenke et al., 2001)",
              time: "3-5 mins",
            },
            {
              id: "GAD-7" as ScreeningInstrument,
              title: "GAD-7 Anxiety",
              desc: "7-item generalised anxiety disorder instrument (Spitzer et al., 2006)",
              time: "2-4 mins",
            },
            {
              id: "PSS-10" as ScreeningInstrument,
              title: "PSS-10 Chronic Stress",
              desc: "10-item perceived stress measurement (Cohen et al., 1983)",
              time: "4-6 mins",
            },
          ].map((tab) => {
            const isSelected = activeInstrument === tab.id;
            return (
              <GlassCard
                key={tab.id}
                onClick={() => handleSelectInstrument(tab.id)}
                className={`p-5 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-primary/80 bg-primary/10 shadow-lg shadow-primary/10"
                    : "hover:bg-muted/40 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    {tab.title}
                  </h3>
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {tab.time}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tab.desc}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* ACTIVE QUESTIONNAIRE OR RESULT CARD */}
        <AnimatePresence mode="wait">
          {!completedResult ? (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* PROGRESS & INSTRUCTIONS */}
              <GlassCard className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      {activeInstrument === "PHQ-9" && "Patient Health Questionnaire (PHQ-9)"}
                      {activeInstrument === "GAD-7" && "Generalised Anxiety Disorder Assessment (GAD-7)"}
                      {activeInstrument === "PSS-10" && "Perceived Stress Scale (PSS-10)"}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activeInstrument === "PSS-10"
                        ? "In the last month, how often have you felt the following?"
                        : "Over the last 2 weeks, how often have you been bothered by any of the following problems?"}
                    </p>
                  </div>
                  <div className="text-right flex items-center sm:block gap-3">
                    <span className="text-xs font-medium text-muted-foreground">Progress:</span>
                    <span className="text-sm font-bold text-primary ml-1 sm:ml-0 block">
                      {answeredCount} of {questions.length} answered ({progressPercent}%)
                    </span>
                  </div>
                </div>

                <Progress value={progressPercent} className="h-2 bg-muted/60" />
              </GlassCard>

              {/* QUESTIONS LIST */}
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const currentAnswer = answers[q.id];
                  return (
                    <GlassCard
                      key={q.id}
                      className={`p-5 transition-all duration-200 ${
                        currentAnswer !== undefined
                          ? "border-primary/30 bg-primary/5"
                          : "border-border/40 hover:border-border"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center border border-primary/20">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
                            {q.text}
                          </p>
                          {q.isCrisisTrigger && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 mt-1">
                              <ShieldAlert className="w-3 h-3" />
                              Critical screening safety indicator
                            </span>
                          )}
                        </div>
                      </div>

                      {/* OPTIONS BUTTONS */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 ml-10">
                        {options.map((opt) => {
                          const isSelected = currentAnswer === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleOptionSelect(q.id, opt.value)}
                              className={`p-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-center border ${
                                isSelected
                                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
                                  : "bg-background/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </GlassCard>
                  );
                })}
              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setAnswers({})}
                  disabled={answeredCount === 0}
                  className="rounded-xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Answers
                </Button>
                <LiquidGlassButton
                  onClick={handleSubmit}
                  disabled={answeredCount < questions.length}
                  className="rounded-xl px-8"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit & Calculate Clinical Score
                </LiquidGlassButton>
              </div>
            </motion.div>
          ) : (
            /* COMPLETED RESULT VIEW */
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="space-y-6"
            >
              {/* CRISIS ALERT BANNER IF TRIGGERED */}
              {completedResult.crisisAlert && (
                <div className="p-6 rounded-2xl bg-red-500/15 border-2 border-red-500/40 text-red-200 relative overflow-hidden animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/30 rounded-xl text-red-300">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Crisis Resource Alert — Immediate Support Available 24/7
                      </h3>
                      <p className="text-sm text-red-100/90 leading-relaxed">
                        Your response indicates thoughts of self-harm. You do not have to carry this alone. Free, confidential support is available right now with a trained specialist.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-3">
                        <a
                          href="tel:988"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition shadow-lg shadow-red-600/30"
                        >
                          <PhoneCall className="w-4 h-4" />
                          Call or Text 988 (Lifeline)
                        </a>
                        <Link
                          to="/patient/emergency"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition border border-white/20"
                        >
                          Open Medscope SOS
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CLINICAL SCORE SUMMARY CARD */}
              <GlassCard className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border/40">
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs mb-2">
                      Screening Completed • {format(new Date(completedResult.completedAt), "MMM d, yyyy h:mm a")}
                    </Badge>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      {completedResult.instrument} Assessment Score:
                      <span className="text-primary text-3xl font-extrabold">
                        {completedResult.score} / {completedResult.maxScore}
                      </span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Severity Classification:{" "}
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSeverityBadgeColor(completedResult.severity)}`}>
                        {completedResult.severity}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleRetake} className="rounded-xl">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake Screening
                    </Button>
                    {completedResult.escalationTriggered && (
                      <Button
                        onClick={() => navigate("/patient/consultations")}
                        className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Doctor Consultation
                      </Button>
                    )}
                  </div>
                </div>

                {/* CLINICAL INTERPRETATION & RECOMMENDATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 space-y-2">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Info className="w-4 h-4 text-primary" />
                      Clinical Interpretation
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {completedResult.clinicalInterpretation}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
                    <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4" />
                      Recommended Action Plan
                    </h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {completedResult.actionRecommendation}
                    </p>
                  </div>
                </div>

                {/* ESCALATION NOTIFICATION */}
                {completedResult.escalationTriggered && (
                  <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <p className="text-xs text-amber-200">
                        <strong>Clinical Notification:</strong> Your score meets the guideline threshold for medical follow-up. This screening result has been securely synced to your treating physician's dashboard.
                      </p>
                    </div>
                    <Link
                      to="/patient/consultations"
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 flex-shrink-0"
                    >
                      Schedule now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SCREENING HISTORY TIMELINE */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Your Screening History
            </h3>
            <span className="text-xs text-muted-foreground">
              {screeningHistory.length} recorded assessments
            </span>
          </div>

          {screeningHistory.length === 0 ? (
            <GlassCard className="p-8 text-center text-muted-foreground">
              <Brain className="w-10 h-10 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm">No clinical screening assessments recorded yet.</p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Complete a PHQ-9, GAD-7, or PSS-10 assessment above to establish your mental health baseline.
              </p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {screeningHistory.map((item) => (
                <GlassCard key={item.id} className="p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-semibold text-xs">
                        {item.instrument}
                      </Badge>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityBadgeColor(item.severity)}`}>
                        {item.severity}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div className="text-xl font-bold text-foreground">
                        Score: {item.score} / {item.maxScore}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(item.completedAt), "MMM d, yyyy")}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.clinicalInterpretation}
                    </p>
                  </div>

                  {item.escalationTriggered && (
                    <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-amber-400">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Clinical Threshold Reached
                      </span>
                      <Link to="/patient/consultations" className="text-primary hover:underline font-medium">
                        Consultation Advised →
                      </Link>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          )}
        </div>

      </div>
    </PatientPageLayout>
  );
}
