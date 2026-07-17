/** Viral micro exam tools — pass/fail, what-if marks, rank & CGPA gates. */

export const EXAM_VIRAL_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
} as const;

export function parseExamViralSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_VIRAL_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Marks needed on remaining paper to hit a pass threshold overall. */
export function howMuchToScoreToPass(params: {
  totalMaxMarks: number;
  passPercent: number;
  marksAlreadyScored: number;
  remainingMaxMarks: number;
}): {
  passMarksNeeded: number;
  marksStillNeeded: number;
  percentNeededOnRemaining: number;
  canPass: boolean;
} | { error: string } {
  if (params.totalMaxMarks <= 0) return { error: "Total max marks must be positive." };
  if (params.passPercent < 0 || params.passPercent > 100) {
    return { error: "Pass % must be between 0 and 100." };
  }
  if (params.remainingMaxMarks < 0 || params.marksAlreadyScored < 0) {
    return { error: "Marks cannot be negative." };
  }
  const passMarksNeeded = (params.passPercent / 100) * params.totalMaxMarks;
  const marksStillNeeded = Math.max(0, passMarksNeeded - params.marksAlreadyScored);
  const canPass = marksStillNeeded <= params.remainingMaxMarks + 1e-9;
  const percentNeededOnRemaining =
    params.remainingMaxMarks > 0 ? (marksStillNeeded / params.remainingMaxMarks) * 100 : 0;
  return { passMarksNeeded, marksStillNeeded, percentNeededOnRemaining, canPass };
}

export function canIPassWithThisScore(params: {
  scored: number;
  maxMarks: number;
  passPercent: number;
}): {
  percent: number;
  pass: boolean;
  marginMarks: number;
} | { error: string } {
  if (params.maxMarks <= 0) return { error: "Max marks must be positive." };
  if (params.scored < 0) return { error: "Score cannot be negative." };
  if (params.passPercent < 0 || params.passPercent > 100) {
    return { error: "Pass % must be between 0 and 100." };
  }
  const percent = (params.scored / params.maxMarks) * 100;
  const passMarks = (params.passPercent / 100) * params.maxMarks;
  return {
    percent,
    pass: percent + 1e-9 >= params.passPercent,
    marginMarks: params.scored - passMarks,
  };
}

export function whatIfXMarks(params: {
  currentTotal: number;
  currentMax: number;
  addMarks: number;
  addMax: number;
}): {
  newTotal: number;
  newMax: number;
  newPercent: number;
  percentChange: number;
} | { error: string } {
  if (params.currentMax <= 0 || params.addMax < 0) return { error: "Max marks invalid." };
  if (params.currentTotal < 0 || params.addMarks < 0) return { error: "Marks cannot be negative." };
  const newTotal = params.currentTotal + params.addMarks;
  const newMax = params.currentMax + params.addMax;
  if (newMax <= 0) return { error: "Combined max marks must be positive." };
  const oldPct = (params.currentTotal / params.currentMax) * 100;
  const newPercent = (newTotal / newMax) * 100;
  return { newTotal, newMax, newPercent, percentChange: newPercent - oldPct };
}

/**
 * Educational rank band from percentile / marks — not an official counseling predictor.
 * Higher marks → better (lower) illustrative rank.
 */
export function rankPredictorJeeNeet(params: {
  marks: number;
  maxMarks: number;
  exam: "jee" | "neet";
  candidates?: number;
}): {
  estimatedPercentile: number;
  estimatedRank: number;
  band: string;
  note: string;
} | { error: string } {
  if (params.maxMarks <= 0) return { error: "Max marks must be positive." };
  if (params.marks < 0) return { error: "Marks cannot be negative." };
  const ratio = Math.min(1, params.marks / params.maxMarks);
  // Soft curve: top scores map near 99+ percentile
  const estimatedPercentile = Math.min(99.9, 100 * (1 - Math.pow(1 - ratio, 2.2)));
  const pool = params.candidates ?? (params.exam === "neet" ? 2_000_000 : 1_200_000);
  const estimatedRank = Math.max(1, Math.round(pool * (1 - estimatedPercentile / 100)));
  const band =
    estimatedPercentile >= 99
      ? "Top tier (illustrative)"
      : estimatedPercentile >= 95
        ? "Very competitive"
        : estimatedPercentile >= 85
          ? "Competitive"
          : estimatedPercentile >= 70
            ? "Average+"
            : "Needs improvement";
  return {
    estimatedPercentile,
    estimatedRank,
    band,
    note: "Heuristic only — real ranks depend on paper difficulty and the year’s score distribution.",
  };
}

export function cgpaNeededForPlacement(params: {
  requiredCgpa: number;
  currentCgpa: number;
  completedCredits: number;
  remainingCredits: number;
}): {
  cgpaNeededOnRemaining: number;
  feasible: boolean;
  tip: string;
} | { error: string } {
  if (params.requiredCgpa < 0 || params.currentCgpa < 0) {
    return { error: "CGPA cannot be negative." };
  }
  if (params.completedCredits < 0 || params.remainingCredits <= 0) {
    return { error: "Credit inputs invalid (remaining credits must be positive)." };
  }
  const total = params.completedCredits + params.remainingCredits;
  const pointsNeeded = params.requiredCgpa * total;
  const pointsHave = params.currentCgpa * params.completedCredits;
  const cgpaNeededOnRemaining = (pointsNeeded - pointsHave) / params.remainingCredits;
  const feasible = cgpaNeededOnRemaining <= 10 + 1e-9 && cgpaNeededOnRemaining >= 0;
  return {
    cgpaNeededOnRemaining,
    feasible,
    tip: feasible
      ? cgpaNeededOnRemaining > params.currentCgpa
        ? "You’ll need stronger grades in remaining semesters than your current CGPA."
        : "You’re on track if you maintain roughly your current performance."
      : "Target CGPA may be unreachable with remaining credits — check with your college rules.",
  };
}
