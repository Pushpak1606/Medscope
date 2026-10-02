/**
 * =========================================================================
 * MEDSCOPE CLINICAL MENTAL HEALTH SCREENING ENGINE
 * =========================================================================
 * 
 * Implements validated clinical instruments as specified in Medscope FR-05
 * and Table 4.2 (AI Screening Analysis Service):
 * 1. PHQ-9 (Patient Health Questionnaire - 9) for Depression
 * 2. GAD-7 (Generalised Anxiety Disorder - 7) for Anxiety
 * 3. PSS-10 (Perceived Stress Scale - 10) for Chronic Stress
 * 
 * References:
 * - Kroenke, Spitzer & Williams (2001) - PHQ-9
 * - Spitzer, Kroenke, Williams & Löwe (2006) - GAD-7
 * - Cohen, Kamarck & Mermelstein (1983) - PSS-10
 */

export type ScreeningInstrument = "PHQ-9" | "GAD-7" | "PSS-10";

export type SeverityLevel = "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe";

export interface ScreeningQuestion {
  id: number;
  text: string;
  isCrisisTrigger?: boolean;
}

export interface ScreeningResult {
  id: string;
  instrument: ScreeningInstrument;
  score: number;
  maxScore: number;
  severity: SeverityLevel;
  clinicalInterpretation: string;
  actionRecommendation: string;
  escalationTriggered: boolean;
  crisisAlert: boolean;
  completedAt: string;
  answers: Record<number, number>;
}

// ---------------------------------------------------------------------------
// 1. PHQ-9 Questionnaire & Scoring Logic
// ---------------------------------------------------------------------------
export const PHQ9_QUESTIONS: ScreeningQuestion[] = [
  { id: 1, text: "Little interest or pleasure in doing things" },
  { id: 2, text: "Feeling down, depressed, or hopeless" },
  { id: 3, text: "Trouble falling or staying asleep, or sleeping too much" },
  { id: 4, text: "Feeling tired or having little energy" },
  { id: 5, text: "Poor appetite or overeating" },
  { id: 6, text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down" },
  { id: 7, text: "Trouble concentrating on things, such as reading the newspaper or watching television" },
  { id: 8, text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual" },
  { id: 9, text: "Thoughts that you would be better off dead or of hurting yourself in some way", isCrisisTrigger: true },
];

export const PHQ9_OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

export function evaluatePHQ9(answers: Record<number, number>): Omit<ScreeningResult, "id" | "completedAt"> {
  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  const q9Score = answers[9] || 0;
  const crisisAlert = q9Score > 0;
  const escalationTriggered = totalScore >= 10 || crisisAlert;

  let severity: SeverityLevel = "Minimal";
  let clinicalInterpretation = "Minimal or no depressive symptoms detected.";
  let actionRecommendation = "Continue regular wellness tracking and self-care practices.";

  if (totalScore >= 20) {
    severity = "Severe";
    clinicalInterpretation = "Severe depression symptoms indicated. Immediate clinical attention recommended.";
    actionRecommendation = "Prompt consultation with a physician or psychiatrist is strongly recommended. Initiating safety care plan.";
  } else if (totalScore >= 15) {
    severity = "Moderately Severe";
    clinicalInterpretation = "Moderately severe depression symptoms indicated.";
    actionRecommendation = "Active treatment with psychotherapy and/or pharmacotherapy advised. Book a consultation with a care provider.";
  } else if (totalScore >= 10) {
    severity = "Moderate";
    clinicalInterpretation = "Moderate depression symptoms detected, meeting clinical threshold for evaluation.";
    actionRecommendation = "A clinical tele-consultation is advised to explore supportive counseling or treatment options.";
  } else if (totalScore >= 5) {
    severity = "Mild";
    clinicalInterpretation = "Mild depressive symptoms noted.";
    actionRecommendation = "Engage in physical activity, sleep hygiene, and Medscope guided wellness exercises. Re-screen in 2 weeks.";
  }

  return {
    instrument: "PHQ-9",
    score: totalScore,
    maxScore: 27,
    severity,
    clinicalInterpretation,
    actionRecommendation,
    escalationTriggered,
    crisisAlert,
    answers,
  };
}

// ---------------------------------------------------------------------------
// 2. GAD-7 Questionnaire & Scoring Logic
// ---------------------------------------------------------------------------
export const GAD7_QUESTIONS: ScreeningQuestion[] = [
  { id: 1, text: "Feeling nervous, anxious, or on edge" },
  { id: 2, text: "Not being able to stop or control worrying" },
  { id: 3, text: "Worrying too much about different things" },
  { id: 4, text: "Trouble relaxing" },
  { id: 5, text: "Being so restless that it's hard to sit still" },
  { id: 6, text: "Becoming easily annoyed or irritable" },
  { id: 7, text: "Feeling afraid as if something awful might happen" },
];

export const GAD7_OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

export function evaluateGAD7(answers: Record<number, number>): Omit<ScreeningResult, "id" | "completedAt"> {
  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  const escalationTriggered = totalScore >= 10;

  let severity: SeverityLevel = "Minimal";
  let clinicalInterpretation = "Minimal anxiety symptoms reported.";
  let actionRecommendation = "Maintain mindfulness and stress resilience routines.";

  if (totalScore >= 15) {
    severity = "Severe";
    clinicalInterpretation = "Severe anxiety symptoms detected. Clinical intervention strongly advised.";
    actionRecommendation = "Schedule a clinical evaluation for comprehensive anxiety management and therapeutic support.";
  } else if (totalScore >= 10) {
    severity = "Moderate";
    clinicalInterpretation = "Moderate anxiety symptoms detected (clinical threshold reached).";
    actionRecommendation = "Consider booking a consultation to discuss cognitive behavioral strategies and coping tools.";
  } else if (totalScore >= 5) {
    severity = "Mild";
    clinicalInterpretation = "Mild anxiety symptoms reported.";
    actionRecommendation = "Use Medscope Box Breathing, 5-4-3-2-1 grounding exercises, and daily emotional check-ins.";
  }

  return {
    instrument: "GAD-7",
    score: totalScore,
    maxScore: 21,
    severity,
    clinicalInterpretation,
    actionRecommendation,
    escalationTriggered,
    crisisAlert: false,
    answers,
  };
}

// ---------------------------------------------------------------------------
// 3. PSS-10 Questionnaire & Scoring Logic
// ---------------------------------------------------------------------------
export const PSS10_QUESTIONS: ScreeningQuestion[] = [
  { id: 1, text: "In the last month, how often have you been upset because of something that happened unexpectedly?" },
  { id: 2, text: "In the last month, how often have you felt that you were unable to control the important things in your life?" },
  { id: 3, text: "In the last month, how often have you felt nervous and stressed?" },
  { id: 4, text: "In the last month, how often have you felt confident about your ability to handle your personal problems?" }, // reverse
  { id: 5, text: "In the last month, how often have you felt that things were going your way?" }, // reverse
  { id: 6, text: "In the last month, how often have you found that you could not cope with all the things that you had to do?" },
  { id: 7, text: "In the last month, how often have you been able to control irritations in your life?" }, // reverse
  { id: 8, text: "In the last month, how often have you felt that you were on top of things?" }, // reverse
  { id: 9, text: "In the last month, how often have you been angered because of things that happened that were outside of your control?" },
  { id: 10, text: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?" },
];

export const PSS10_REVERSE_SCORED = [4, 5, 7, 8];

export const PSS10_OPTIONS = [
  { label: "Never", value: 0 },
  { label: "Almost Never", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Fairly Often", value: 3 },
  { label: "Very Often", value: 4 },
];

export function evaluatePSS10(answers: Record<number, number>): Omit<ScreeningResult, "id" | "completedAt"> {
  let totalScore = 0;
  for (let i = 1; i <= 10; i++) {
    const rawVal = answers[i] ?? 0;
    if (PSS10_REVERSE_SCORED.includes(i)) {
      totalScore += (4 - rawVal);
    } else {
      totalScore += rawVal;
    }
  }

  const escalationTriggered = totalScore >= 27;
  let severity: SeverityLevel = "Minimal";
  let clinicalInterpretation = "Low perceived stress levels.";
  let actionRecommendation = "Your stress management skills are effectively protective. Maintain your routine.";

  if (totalScore >= 27) {
    severity = "Severe";
    clinicalInterpretation = "High perceived stress detected. Potential risk for burnout and physical somatic strain.";
    actionRecommendation = "High stress levels may exacerbate chronic physical conditions. Consider clinical consultation and lifestyle adjustment.";
  } else if (totalScore >= 14) {
    severity = "Moderate";
    clinicalInterpretation = "Moderate perceived stress level.";
    actionRecommendation = "Incorporate daily restorative breaks, sleep schedule stabilization, and Medscope journaling.";
  }

  return {
    instrument: "PSS-10",
    score: totalScore,
    maxScore: 40,
    severity,
    clinicalInterpretation,
    actionRecommendation,
    escalationTriggered,
    crisisAlert: false,
    answers,
  };
}
