/** Performance analysis: subject mix, accuracy, pacing, weak topics, trends. */

export const EXAM_PERFORMANCE_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
  W: "w",
} as const;

export function parseExamPerformanceSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_PERFORMANCE_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** CSV like "Math:72,Physics:55,Chem:68" or "72,55,68". */
export function subjectWisePerformance(params: {
  scoresCsv: string;
  maxPerSubject?: number;
}): {
  subjects: { name: string; score: number; percent: number }[];
  averagePercent: number;
  strongest: string;
  weakest: string;
} | { error: string } {
  const max = params.maxPerSubject ?? 100;
  const parts = params.scoresCsv
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 2) return { error: "Enter at least 2 subject scores." };
  const subjects = parts.map((part, i) => {
    const m = part.match(/^([^:]+):\s*([0-9.]+)$/);
    const name = m ? m[1]!.trim() : `Subject ${i + 1}`;
    const score = m ? Number(m[2]) : Number(part);
    return { name, score, percent: (score / max) * 100 };
  });
  if (subjects.some((s) => !Number.isFinite(s.score) || s.score < 0)) {
    return { error: "Could not parse subject scores." };
  }
  const averagePercent = subjects.reduce((s, x) => s + x.percent, 0) / subjects.length;
  const sorted = [...subjects].sort((a, b) => a.percent - b.percent);
  return {
    subjects,
    averagePercent,
    weakest: sorted[0]!.name,
    strongest: sorted[sorted.length - 1]!.name,
  };
}

export function accuracyCorrectVsWrong(params: {
  correct: number;
  wrong: number;
  unattempted?: number;
}): {
  attempted: number;
  accuracyPercent: number;
  attemptRatePercent: number;
} | { error: string } {
  if (params.correct < 0 || params.wrong < 0) return { error: "Counts cannot be negative." };
  const un = params.unattempted ?? 0;
  if (un < 0) return { error: "Unattempted cannot be negative." };
  const attempted = params.correct + params.wrong;
  const total = attempted + un;
  if (attempted <= 0) return { error: "Need at least one attempted question." };
  return {
    attempted,
    accuracyPercent: (params.correct / attempted) * 100,
    attemptRatePercent: total > 0 ? (attempted / total) * 100 : 100,
  };
}

export function timeEfficiency(params: {
  questionsDone: number;
  minutesUsed: number;
  targetMinutesPerQuestion?: number;
}): {
  secondsPerQuestion: number;
  qpm: number;
  vsTarget: string;
} | { error: string } {
  if (params.questionsDone <= 0) return { error: "Questions done must be positive." };
  if (params.minutesUsed <= 0) return { error: "Minutes used must be positive." };
  const secondsPerQuestion = (params.minutesUsed * 60) / params.questionsDone;
  const qpm = params.questionsDone / params.minutesUsed;
  const target = params.targetMinutesPerQuestion ?? 1.5;
  const vsTarget =
    secondsPerQuestion <= target * 60
      ? "On or ahead of your pacing target."
      : "Behind target pace — skip or mark long items sooner.";
  return { secondsPerQuestion, qpm, vsTarget };
}

export function weakTopicAnalyzer(params: {
  topicsCsv: string;
}): {
  topics: { name: string; score: number; tag: string }[];
  focusList: string[];
} | { error: string } {
  const parts = params.topicsCsv
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 2) return { error: "Enter topics as Name:score pairs (comma-separated)." };
  const topics = parts.map((part, i) => {
    const m = part.match(/^([^:]+):\s*([0-9.]+)$/);
    const name = m ? m[1]!.trim() : `Topic ${i + 1}`;
    const score = m ? Number(m[2]) : Number(part);
    const tag = !Number.isFinite(score) ? "invalid" : score < 50 ? "weak" : score < 70 ? "ok" : "strong";
    return { name, score, tag };
  });
  if (topics.some((t) => t.tag === "invalid" || t.score < 0)) {
    return { error: "Could not parse topic scores (use Topic:score)." };
  }
  const focusList = [...topics]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((t) => t.name);
  return { topics, focusList };
}

export function scoreTrend(params: {
  scoresCsv: string;
}): {
  count: number;
  average: number;
  slopePerTest: number;
  trend: "improving" | "declining" | "stable";
} | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length < 2) return { error: "Enter at least 2 scores." };
  const n = scores.length;
  const average = scores.reduce((a, b) => a + b, 0) / n;
  // Simple linear slope via first/last
  const slopePerTest = (scores[n - 1]! - scores[0]!) / (n - 1);
  const trend =
    slopePerTest > 0.5 ? "improving" : slopePerTest < -0.5 ? "declining" : "stable";
  return { count: n, average, slopePerTest, trend };
}

export function improvementTracker(params: {
  baselineScore: number;
  latestScore: number;
  maxScore: number;
}): {
  absoluteGain: number;
  percentGainOfMax: number;
  relativeImprovementPercent: number;
} | { error: string } {
  if (params.maxScore <= 0) return { error: "Max score must be positive." };
  if (params.baselineScore < 0 || params.latestScore < 0) {
    return { error: "Scores cannot be negative." };
  }
  const absoluteGain = params.latestScore - params.baselineScore;
  const percentGainOfMax = (absoluteGain / params.maxScore) * 100;
  const relativeImprovementPercent =
    params.baselineScore > 0 ? (absoluteGain / params.baselineScore) * 100 : 0;
  return { absoluteGain, percentGainOfMax, relativeImprovementPercent };
}
