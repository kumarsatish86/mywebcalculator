/** Exam strategy: section timing, attempts, speed/accuracy, mock synthesis. */

export const EXAM_STRATEGY_URL = {
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

export function parseExamStrategySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_STRATEGY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Allocate total minutes across N sections by weight CSV (e.g. "40,30,30"). */
export function timeAllocationPerSection(params: {
  totalMinutes: number;
  weightsCsv: string;
}): {
  sections: { index: number; weight: number; minutes: number }[];
  totalWeight: number;
} | { error: string } {
  if (params.totalMinutes <= 0) return { error: "Total minutes must be positive." };
  const weights = params.weightsCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (weights.length < 1) return { error: "Enter at least one section weight." };
  if (weights.some((w) => w < 0)) return { error: "Weights cannot be negative." };
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  if (totalWeight <= 0) return { error: "Weights must sum to a positive number." };
  const sections = weights.map((weight, i) => ({
    index: i + 1,
    weight,
    minutes: (params.totalMinutes * weight) / totalWeight,
  }));
  return { sections, totalWeight };
}

export function questionAttemptStrategy(params: {
  totalQuestions: number;
  easyPct: number;
  mediumPct: number;
  hardPct: number;
}): {
  easy: number;
  medium: number;
  hard: number;
  suggestedOrder: string;
} | { error: string } {
  if (params.totalQuestions <= 0) return { error: "Total questions must be positive." };
  const sum = params.easyPct + params.mediumPct + params.hardPct;
  if (sum <= 0) return { error: "Difficulty % mix must be positive." };
  const scale = params.totalQuestions / sum;
  const easy = Math.round(params.easyPct * scale);
  const medium = Math.round(params.mediumPct * scale);
  const hard = Math.max(0, params.totalQuestions - easy - medium);
  return {
    easy,
    medium,
    hard,
    suggestedOrder: "Easy → Medium → Hard; mark doubtful for a final pass.",
  };
}

export function optimalAttempt(params: {
  totalQuestions: number;
  accuracyPercent: number;
  marksCorrect: number;
  marksWrong: number;
}): {
  optimalAttempts: number;
  expectedScore: number;
  note: string;
} | { error: string } {
  if (params.totalQuestions <= 0) return { error: "Total questions must be positive." };
  if (params.accuracyPercent < 0 || params.accuracyPercent > 100) {
    return { error: "Accuracy % must be 0–100." };
  }
  const p = params.accuracyPercent / 100;
  const expectedPerQ = p * params.marksCorrect - (1 - p) * Math.abs(params.marksWrong);
  // Attempt while expected value stays positive
  const optimalAttempts =
    expectedPerQ > 0 ? params.totalQuestions : Math.round(params.totalQuestions * p);
  const expectedScore = optimalAttempts * expectedPerQ;
  return {
    optimalAttempts,
    expectedScore,
    note:
      expectedPerQ > 0
        ? "At this accuracy, attempting more tends to raise expected score."
        : "At this accuracy, guessing aggressively may hurt — prioritize high-confidence items.",
  };
}

export function speedVsAccuracy(params: {
  questionsAttempted: number;
  correct: number;
  minutesUsed: number;
}): {
  accuracyPercent: number;
  qpm: number;
  secondsPerQuestion: number;
  balanceTip: string;
} | { error: string } {
  if (params.questionsAttempted <= 0) return { error: "Attempted questions must be positive." };
  if (params.correct < 0 || params.correct > params.questionsAttempted) {
    return { error: "Correct count invalid." };
  }
  if (params.minutesUsed <= 0) return { error: "Minutes used must be positive." };
  const accuracyPercent = (params.correct / params.questionsAttempted) * 100;
  const qpm = params.questionsAttempted / params.minutesUsed;
  const secondsPerQuestion = (params.minutesUsed * 60) / params.questionsAttempted;
  const balanceTip =
    accuracyPercent >= 80 && qpm < 0.8
      ? "Accuracy is strong — gently raise pace on easier items."
      : accuracyPercent < 60 && qpm > 1.2
        ? "Slow down: speed is outrunning accuracy."
        : "Pace and accuracy look reasonably balanced for this sample.";
  return { accuracyPercent, qpm, secondsPerQuestion, balanceTip };
}

export function mockTestPerformance(params: {
  scoresCsv: string;
  maxPerMock?: number;
}): {
  mocks: number;
  average: number;
  best: number;
  worst: number;
  trend: "up" | "down" | "flat";
} | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length < 2) return { error: "Enter at least 2 mock scores (comma-separated)." };
  if (scores.some((s) => s < 0)) return { error: "Scores cannot be negative." };
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const best = Math.max(...scores);
  const worst = Math.min(...scores);
  const first = scores[0]!;
  const last = scores[scores.length - 1]!;
  const trend = last - first > 1 ? "up" : first - last > 1 ? "down" : "flat";
  return { mocks: scores.length, average, best, worst, trend };
}
