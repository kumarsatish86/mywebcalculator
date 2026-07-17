/** Competitive exam: cut-off, rank, percentile, normalization, negative marking. */

export const EXAM_COMPETITIVE_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
  N: "n",
  W: "w",
} as const;

export function parseExamCompetitiveSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_COMPETITIVE_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function cutoffPredictor(params: {
  yourScore: number;
  lastYearCutoff: number;
  difficultyFactor?: number;
}): {
  adjustedCutoff: number;
  margin: number;
  clears: boolean;
  note: string;
} | { error: string } {
  if (params.yourScore < 0 || params.lastYearCutoff < 0) {
    return { error: "Scores cannot be negative." };
  }
  const factor = params.difficultyFactor ?? 1;
  if (factor <= 0) return { error: "Difficulty factor must be positive." };
  const adjustedCutoff = params.lastYearCutoff * factor;
  const margin = params.yourScore - adjustedCutoff;
  return {
    adjustedCutoff,
    margin,
    clears: margin >= 0,
    note: "Educational estimate — real cut-offs shift with paper mix and vacancies.",
  };
}

export function rankPredictor(params: {
  marks: number;
  maxMarks: number;
  candidates?: number;
}): {
  estimatedPercentile: number;
  estimatedRank: number;
} | { error: string } {
  if (params.maxMarks <= 0) return { error: "Max marks must be positive." };
  if (params.marks < 0) return { error: "Marks cannot be negative." };
  const ratio = Math.min(1, params.marks / params.maxMarks);
  const estimatedPercentile = Math.min(99.9, 100 * (1 - Math.pow(1 - ratio, 2.1)));
  const pool = params.candidates ?? 1_000_000;
  const estimatedRank = Math.max(1, Math.round(pool * (1 - estimatedPercentile / 100)));
  return { estimatedPercentile, estimatedRank };
}

export function percentileExam(params: {
  yourScore: number;
  meanScore: number;
  stdDev: number;
}): {
  zScore: number;
  estimatedPercentile: number;
} | { error: string } {
  if (params.stdDev <= 0) return { error: "Std deviation must be positive." };
  const zScore = (params.yourScore - params.meanScore) / params.stdDev;
  // Logistic-ish CDF approximation for educational use
  const estimatedPercentile = Math.min(
    99.9,
    Math.max(0.1, 100 / (1 + Math.exp(-1.7 * zScore))),
  );
  return { zScore, estimatedPercentile };
}

export function normalizationScore(params: {
  rawScore: number;
  sessionMean: number;
  sessionStd: number;
  targetMean: number;
  targetStd: number;
}): {
  normalized: number;
} | { error: string } {
  if (params.sessionStd <= 0 || params.targetStd <= 0) {
    return { error: "Std deviations must be positive." };
  }
  const z = (params.rawScore - params.sessionMean) / params.sessionStd;
  return { normalized: params.targetMean + z * params.targetStd };
}

export function marksVsRank(params: {
  marks: number;
  topMarks: number;
  candidates: number;
}): {
  estimatedRank: number;
  note: string;
} | { error: string } {
  if (params.topMarks <= 0 || params.candidates <= 0) {
    return { error: "Top marks and candidates must be positive." };
  }
  if (params.marks < 0) return { error: "Marks cannot be negative." };
  const ratio = Math.min(1, params.marks / params.topMarks);
  const estimatedRank = Math.max(1, Math.round(params.candidates * Math.pow(1 - ratio, 1.8)));
  return {
    estimatedRank,
    note: "Rough curve only — not an official counseling rank.",
  };
}

export function scoreScaling(params: {
  raw: number;
  rawMin: number;
  rawMax: number;
  scaleMin: number;
  scaleMax: number;
}): {
  scaled: number;
} | { error: string } {
  if (params.rawMax <= params.rawMin) return { error: "Raw max must exceed raw min." };
  if (params.scaleMax <= params.scaleMin) return { error: "Scale max must exceed scale min." };
  const t = (params.raw - params.rawMin) / (params.rawMax - params.rawMin);
  const scaled = params.scaleMin + t * (params.scaleMax - params.scaleMin);
  return { scaled };
}

export function negativeMarking(params: {
  correct: number;
  wrong: number;
  marksPerCorrect: number;
  marksPerWrong: number;
  unattempted?: number;
}): {
  score: number;
  attempted: number;
  accuracyPercent: number;
} | { error: string } {
  if (params.correct < 0 || params.wrong < 0) return { error: "Counts cannot be negative." };
  const attempted = params.correct + params.wrong;
  const score =
    params.correct * params.marksPerCorrect - params.wrong * Math.abs(params.marksPerWrong);
  return {
    score,
    attempted,
    accuracyPercent: attempted > 0 ? (params.correct / attempted) * 100 : 0,
  };
}

export function attemptAccuracy(params: {
  correct: number;
  wrong: number;
}): {
  attempted: number;
  accuracyPercent: number;
  wrongPercent: number;
} | { error: string } {
  if (params.correct < 0 || params.wrong < 0) return { error: "Counts cannot be negative." };
  const attempted = params.correct + params.wrong;
  if (attempted <= 0) return { error: "Need at least one attempt." };
  return {
    attempted,
    accuracyPercent: (params.correct / attempted) * 100,
    wrongPercent: (params.wrong / attempted) * 100,
  };
}

export function examScoreEstimator(params: {
  attempted: number;
  expectedAccuracyPercent: number;
  marksPerCorrect: number;
  marksPerWrong: number;
}): {
  expectedCorrect: number;
  expectedWrong: number;
  expectedScore: number;
} | { error: string } {
  if (params.attempted <= 0) return { error: "Attempted must be positive." };
  if (params.expectedAccuracyPercent < 0 || params.expectedAccuracyPercent > 100) {
    return { error: "Accuracy % must be 0–100." };
  }
  const p = params.expectedAccuracyPercent / 100;
  const expectedCorrect = params.attempted * p;
  const expectedWrong = params.attempted * (1 - p);
  const expectedScore =
    expectedCorrect * params.marksPerCorrect - expectedWrong * Math.abs(params.marksPerWrong);
  return { expectedCorrect, expectedWrong, expectedScore };
}
