/** Scholarship, merit, admission cut-off, and course eligibility helpers. */

export const EXAM_SCHOLARSHIP_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
} as const;

export function parseExamScholarshipSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_SCHOLARSHIP_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function scholarshipEligibility(params: {
  scorePercent: number;
  minPercent: number;
  familyIncome: number;
  maxIncome: number;
}): {
  scoreOk: boolean;
  incomeOk: boolean;
  eligible: boolean;
  message: string;
} | { error: string } {
  if (params.scorePercent < 0 || params.minPercent < 0) return { error: "Percents cannot be negative." };
  if (params.familyIncome < 0 || params.maxIncome < 0) return { error: "Income cannot be negative." };
  const scoreOk = params.scorePercent + 1e-9 >= params.minPercent;
  const incomeOk = params.familyIncome <= params.maxIncome + 1e-9;
  const eligible = scoreOk && incomeOk;
  return {
    scoreOk,
    incomeOk,
    eligible,
    message: eligible
      ? "Meets the score and income gates you entered (scheme rules may add more filters)."
      : !scoreOk && !incomeOk
        ? "Below both score and income criteria in this model."
        : !scoreOk
          ? "Score is below the minimum — income gate alone is not enough."
          : "Income exceeds the scheme cap in this model.",
  };
}

export function meritScore(params: {
  examPercent: number;
  boardPercent: number;
  examWeightPercent: number;
}): {
  meritPercent: number;
  boardWeightPercent: number;
} | { error: string } {
  if (params.examWeightPercent < 0 || params.examWeightPercent > 100) {
    return { error: "Exam weight % must be 0–100." };
  }
  if (params.examPercent < 0 || params.boardPercent < 0) {
    return { error: "Scores cannot be negative." };
  }
  const boardWeightPercent = 100 - params.examWeightPercent;
  const meritPercent =
    (params.examPercent * params.examWeightPercent + params.boardPercent * boardWeightPercent) / 100;
  return { meritPercent, boardWeightPercent };
}

export function admissionEligibility(params: {
  yourScore: number;
  cutoffScore: number;
  minEligibilityPercent?: number;
  yourPercent?: number;
}): {
  clearsCutoff: boolean;
  meetsMinEligibility: boolean;
  eligible: boolean;
  margin: number;
} | { error: string } {
  if (params.yourScore < 0 || params.cutoffScore < 0) return { error: "Scores cannot be negative." };
  const clearsCutoff = params.yourScore + 1e-9 >= params.cutoffScore;
  const minEl = params.minEligibilityPercent;
  const yourPct = params.yourPercent;
  const meetsMinEligibility =
    minEl === undefined || yourPct === undefined ? true : yourPct + 1e-9 >= minEl;
  return {
    clearsCutoff,
    meetsMinEligibility,
    eligible: clearsCutoff && meetsMinEligibility,
    margin: params.yourScore - params.cutoffScore,
  };
}

export function collegeCutoffChecker(params: {
  yourRankOrScore: number;
  cutoff: number;
  mode: "rank" | "score";
}): {
  clears: boolean;
  difference: number;
  note: string;
} | { error: string } {
  if (params.yourRankOrScore < 0 || params.cutoff < 0) {
    return { error: "Values cannot be negative." };
  }
  // Rank: lower is better. Score: higher is better.
  const clears =
    params.mode === "rank"
      ? params.yourRankOrScore <= params.cutoff + 1e-9
      : params.yourRankOrScore + 1e-9 >= params.cutoff;
  const difference =
    params.mode === "rank"
      ? params.cutoff - params.yourRankOrScore
      : params.yourRankOrScore - params.cutoff;
  return {
    clears,
    difference,
    note:
      params.mode === "rank"
        ? clears
          ? "Your rank is at or better than the cut-off rank."
          : "Your rank is worse than the cut-off rank."
        : clears
          ? "Your score meets or exceeds the cut-off."
          : "Your score is below the cut-off.",
  };
}

export function courseEligibility(params: {
  subjectsCsv: string;
  requiredCsv: string;
}): {
  missing: string[];
  eligible: boolean;
  matched: number;
} | { error: string } {
  const have = new Set(
    params.subjectsCsv
      .split(/[,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
  const required = params.requiredCsv
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (required.length === 0) return { error: "Enter at least one required subject." };
  if (have.size === 0) return { error: "Enter subjects you have studied." };
  const missing = required.filter((r) => !have.has(r.toLowerCase()));
  return {
    missing,
    eligible: missing.length === 0,
    matched: required.length - missing.length,
  };
}
