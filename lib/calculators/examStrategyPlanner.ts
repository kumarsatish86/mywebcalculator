/**
 * Rules-based Exam Strategy digital twin (teaching aid — not official exam rules).
 */

import {
  optimalAttempt,
  questionAttemptStrategy,
  timeAllocationPerSection,
} from "./examStrategy";

export type ExamPresetId = "jee" | "neet" | "upsc" | "cat" | "gate" | "ssc" | "cuet" | "custom";

export type ExamPreset = {
  id: ExamPresetId;
  label: string;
  totalMinutes: number;
  totalQuestions: number;
  marksCorrect: number;
  marksWrong: number;
  /** Section weight CSV for time allocation */
  sectionWeights: string;
  subjects: string[];
};

export const EXAM_PRESETS: Record<ExamPresetId, ExamPreset> = {
  jee: {
    id: "jee",
    label: "JEE",
    totalMinutes: 180,
    totalQuestions: 90,
    marksCorrect: 4,
    marksWrong: 1,
    sectionWeights: "33,33,34",
    subjects: ["Physics", "Chemistry", "Math"],
  },
  neet: {
    id: "neet",
    label: "NEET",
    totalMinutes: 200,
    totalQuestions: 180,
    marksCorrect: 4,
    marksWrong: 1,
    sectionWeights: "45,45,10",
    subjects: ["Physics", "Chemistry", "Biology"],
  },
  upsc: {
    id: "upsc",
    label: "UPSC",
    totalMinutes: 120,
    totalQuestions: 100,
    marksCorrect: 2,
    marksWrong: 0.66,
    sectionWeights: "50,50",
    subjects: ["GS", "CSAT"],
  },
  cat: {
    id: "cat",
    label: "CAT",
    totalMinutes: 120,
    totalQuestions: 66,
    marksCorrect: 3,
    marksWrong: 1,
    sectionWeights: "34,33,33",
    subjects: ["VARC", "DILR", "QA"],
  },
  gate: {
    id: "gate",
    label: "GATE",
    totalMinutes: 180,
    totalQuestions: 65,
    marksCorrect: 2,
    marksWrong: 0.66,
    sectionWeights: "15,85",
    subjects: ["GA", "Core"],
  },
  ssc: {
    id: "ssc",
    label: "SSC",
    totalMinutes: 60,
    totalQuestions: 100,
    marksCorrect: 2,
    marksWrong: 0.5,
    sectionWeights: "25,25,25,25",
    subjects: ["Reasoning", "Quant", "English", "GK"],
  },
  cuet: {
    id: "cuet",
    label: "CUET",
    totalMinutes: 60,
    totalQuestions: 50,
    marksCorrect: 5,
    marksWrong: 1,
    sectionWeights: "50,50",
    subjects: ["Domain", "Language"],
  },
  custom: {
    id: "custom",
    label: "Custom",
    totalMinutes: 180,
    totalQuestions: 100,
    marksCorrect: 4,
    marksWrong: 1,
    sectionWeights: "40,30,30",
    subjects: ["Section A", "Section B", "Section C"],
  },
};

export type StrategyKind = "aggressive" | "balanced" | "safe";

export type StrategyCard = {
  kind: StrategyKind;
  label: string;
  attemptPct: number;
  expectedScore: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
};

export type TimelinePhase = {
  label: string;
  startMin: number;
  endMin: number;
  focus: string;
};

export type StudyDay = {
  day: number;
  subject: string;
  hours: number;
  why: string;
};

export type ExamDigitalTwin = {
  examId: ExamPresetId;
  accuracyPercent: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
  statusLabel: string;
  statusTone: "good" | "warn" | "bad" | "neutral";
  minutesPerQuestion: number;
  attemptQuality: "Excellent" | "Good" | "Average";
  guessingProbabilityPct: number;
  expectedScore: number;
  bestScore: number;
  worstScore: number;
  maxScore: number;
  strategies: StrategyCard[];
  timeline: TimelinePhase[];
  studyPlan: StudyDay[];
  attemptMix: { easy: number; medium: number; hard: number };
  sectionMinutes: { index: number; weight: number; minutes: number }[];
  suggestions: string[];
  coachTips: { prompt: string; reply: string }[];
  insights: { title: string; detail: string; tone?: "good" | "warn" | "bad" }[];
  chartAttempt: { name: string; value: number }[];
  chartScoreRange: { name: string; value: number }[];
  confidenceMeter: number;
};

export type PlannerInput = {
  examId: ExamPresetId;
  /** Easy / medium / hard % mix (need not sum to 100). */
  easyPct: number;
  mediumPct: number;
  hardPct: number;
  negativeMarking: boolean;
  accuracyPercent: number;
  /** Confidence threshold 0–100 for when to attempt doubtful Qs */
  confidenceThreshold: number;
  /** Override preset duration / Q count when custom */
  totalMinutes?: number;
  totalQuestions?: number;
  marksCorrect?: number;
  marksWrong?: number;
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function strategyAttemptPct(kind: StrategyKind, accuracy: number, confidence: number): number {
  const base =
    kind === "aggressive" ? 0.92 : kind === "balanced" ? 0.8 : 0.65;
  const confAdj = (confidence - 70) / 200;
  const accAdj = (accuracy - 70) / 300;
  return clamp(base + confAdj + accAdj, 0.45, 0.98);
}

/**
 * Build a full digital twin from wizard inputs.
 */
export function computeExamDigitalTwin(input: PlannerInput): ExamDigitalTwin | { error: string } {
  const preset = EXAM_PRESETS[input.examId];
  if (!preset) return { error: "Unknown exam preset." };

  const accuracy = clamp(input.accuracyPercent, 0, 100);
  const confidence = clamp(input.confidenceThreshold, 0, 100);
  const totalQuestions = Math.max(1, Math.round(input.totalQuestions ?? preset.totalQuestions));
  const totalMinutes = Math.max(1, Math.round(input.totalMinutes ?? preset.totalMinutes));
  const marksCorrect = input.marksCorrect ?? preset.marksCorrect;
  const marksWrong = input.negativeMarking
    ? Math.abs(input.marksWrong ?? preset.marksWrong)
    : 0;

  const mix = questionAttemptStrategy({
    totalQuestions,
    easyPct: input.easyPct,
    mediumPct: input.mediumPct,
    hardPct: input.hardPct,
  });
  if ("error" in mix) return mix;

  const opt = optimalAttempt({
    totalQuestions,
    accuracyPercent: accuracy,
    marksCorrect,
    marksWrong,
  });
  if ("error" in opt) return opt;

  const alloc = timeAllocationPerSection({
    totalMinutes,
    weightsCsv: preset.sectionWeights,
  });
  if ("error" in alloc) return alloc;

  const maxScore = totalQuestions * marksCorrect;
  const minutesPerQuestion = totalMinutes / totalQuestions;
  const guessingProbabilityPct = clamp(100 - confidence + (100 - accuracy) * 0.25, 5, 55);

  const strategies: StrategyCard[] = (["aggressive", "balanced", "safe"] as StrategyKind[]).map(
    (kind) => {
      const attemptPct = strategyAttemptPct(kind, accuracy, confidence) * 100;
      const attempts = Math.round((attemptPct / 100) * totalQuestions);
      const p = accuracy / 100;
      const expectedPerQ = p * marksCorrect - (1 - p) * marksWrong;
      const expectedScore = Math.round(attempts * expectedPerQ * 10) / 10;
      const risk: StrategyCard["risk"] =
        kind === "aggressive" ? (accuracy >= 80 ? "MEDIUM" : "HIGH") : kind === "balanced" ? "LOW" : "LOW";
      return {
        kind,
        label: kind === "aggressive" ? "Aggressive" : kind === "balanced" ? "Balanced" : "Safe",
        attemptPct: Math.round(attemptPct),
        expectedScore,
        risk,
      };
    },
  );

  const balanced = strategies.find((s) => s.kind === "balanced")!;
  const aggressive = strategies.find((s) => s.kind === "aggressive")!;
  const safe = strategies.find((s) => s.kind === "safe")!;

  const expectedScore = balanced.expectedScore;
  const bestScore = Math.min(maxScore, Math.round(aggressive.expectedScore * 1.05));
  const worstScore = Math.max(0, Math.round(safe.expectedScore * 0.9));

  let risk: ExamDigitalTwin["risk"] = "MEDIUM";
  let statusLabel = "Balanced plan";
  let statusTone: ExamDigitalTwin["statusTone"] = "neutral";
  if (accuracy >= 80 && guessingProbabilityPct < 25) {
    risk = "LOW";
    statusLabel = "Strong readiness";
    statusTone = "good";
  } else if (accuracy < 60 || (marksWrong > 0 && guessingProbabilityPct > 40)) {
    risk = "HIGH";
    statusLabel = "High risk of negatives";
    statusTone = "bad";
  } else if (accuracy < 70) {
    risk = "MEDIUM";
    statusLabel = "Needs accuracy work";
    statusTone = "warn";
  }

  const attemptQuality: ExamDigitalTwin["attemptQuality"] =
    accuracy >= 85 ? "Excellent" : accuracy >= 70 ? "Good" : "Average";

  const easyEnd = Math.round(totalMinutes * 0.25);
  const medEnd = Math.round(totalMinutes * 0.6);
  const hardEnd = Math.round(totalMinutes * 0.9);
  const timeline: TimelinePhase[] = [
    { label: "Easy pass", startMin: 0, endMin: easyEnd, focus: `~${mix.easy} easier items first` },
    {
      label: "Medium pass",
      startMin: easyEnd,
      endMin: medEnd,
      focus: `~${mix.medium} medium items`,
    },
    {
      label: "Hard pass",
      startMin: medEnd,
      endMin: hardEnd,
      focus: `~${mix.hard} harder items if confidence ≥ ${confidence}%`,
    },
    {
      label: "Review",
      startMin: hardEnd,
      endMin: totalMinutes,
      focus: "Marked doubts + OMR / form check",
    },
  ];

  const studyPlan: StudyDay[] = [];
  for (let d = 1; d <= 7; d++) {
    const subject = preset.subjects[(d - 1) % preset.subjects.length]!;
    const hours = d % 3 === 0 ? 3 : d % 2 === 0 ? 2 : 1.5;
    const why =
      accuracy < 70
        ? `Build accuracy on ${subject} before adding speed drills.`
        : risk === "HIGH"
          ? `Practice skip/attempt judgment on ${subject} under timer.`
          : `Maintain ${subject} with timed mixed sets.`;
    studyPlan.push({ day: d, subject, hours, why });
  }

  const suggestions: string[] = [];
  if (marksWrong > 0 && accuracy < 70) {
    suggestions.push("Skip doubtful items until accuracy climbs above ~70%");
  }
  if (minutesPerQuestion < 1.2) {
    suggestions.push("Pace is tight — front-load easy marks and leave hard for later");
  }
  if (confidence < 60) {
    suggestions.push("Raise confidence threshold: only attempt when you would bet on the answer");
  }
  suggestions.push(mix.suggestedOrder);
  suggestions.push(opt.note);

  const coachTips = [
    {
      prompt: "I keep getting negative marks.",
      reply: `Your modeled accuracy is ${accuracy.toFixed(0)}%. Prefer the Safe strategy (~${safe.attemptPct}% attempts) until accuracy improves.`,
    },
    {
      prompt: "I finish only part of the paper.",
      reply: `Aim ~${minutesPerQuestion.toFixed(1)} min/question. Use the Easy→Medium timeline (${easyEnd}–${medEnd} min) before hard items.`,
    },
    {
      prompt: "How can I improve?",
      reply: studyPlan[0]
        ? `Day 1 focus: ${studyPlan[0].subject} for ${studyPlan[0].hours}h — ${studyPlan[0].why}`
        : "Run the 7-day plan below and re-check after two mocks.",
    },
  ];

  const insights: ExamDigitalTwin["insights"] = [
    {
      title: "Expected value per question",
      detail: `At ${accuracy}% accuracy with +${marksCorrect}/−${marksWrong}, EV favors ${opt.optimalAttempts} attempts.`,
      tone: opt.expectedScore > 0 ? "good" : "warn",
    },
    {
      title: "Guessing pressure",
      detail: `Estimated guess share ~${guessingProbabilityPct.toFixed(0)}% at confidence ${confidence}%.`,
      tone: guessingProbabilityPct > 35 ? "bad" : "good",
    },
  ];

  return {
    examId: input.examId,
    accuracyPercent: accuracy,
    risk,
    statusLabel,
    statusTone,
    minutesPerQuestion,
    attemptQuality,
    guessingProbabilityPct,
    expectedScore,
    bestScore,
    worstScore,
    maxScore,
    strategies,
    timeline,
    studyPlan,
    attemptMix: { easy: mix.easy, medium: mix.medium, hard: mix.hard },
    sectionMinutes: alloc.sections,
    suggestions,
    coachTips,
    insights,
    chartAttempt: [
      { name: "Easy", value: mix.easy },
      { name: "Medium", value: mix.medium },
      { name: "Hard", value: mix.hard },
    ],
    chartScoreRange: [
      { name: "Worst", value: worstScore },
      { name: "Expected", value: expectedScore },
      { name: "Best", value: bestScore },
    ],
    confidenceMeter: confidence,
  };
}

export const PLANNER_URL = {
  EXAM: "ex",
  EASY: "ea",
  MED: "md",
  HARD: "hd",
  NM: "nm",
  ACC: "ac",
  CONF: "cf",
} as const;

export function parsePlannerSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PLANNER_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}
