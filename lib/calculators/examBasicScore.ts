/** Basic exam marks, percentages, averages, pass/fail, and required marks. */

export const EXAM_BASIC_SCORE_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  W: "w",
  M: "m",
} as const;

export function parseExamBasicScoreSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_BASIC_SCORE_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function parseCsv(csv: string): number[] {
  return csv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

export function marksPercentage(params: {
  obtained: number;
  total: number;
}): { percent: number; remaining: number } | { error: string } {
  if (params.total <= 0) return { error: "Total marks must be positive." };
  if (params.obtained < 0) return { error: "Obtained marks cannot be negative." };
  if (params.obtained > params.total) return { error: "Obtained cannot exceed total." };
  return {
    percent: (params.obtained / params.total) * 100,
    remaining: params.total - params.obtained,
  };
}

export function totalMarks(params: {
  marksCsv: string;
}): { total: number; subjects: number; average: number } | { error: string } {
  const marks = parseCsv(params.marksCsv);
  if (marks.length < 1) return { error: "Enter at least one mark (comma-separated)." };
  if (marks.some((m) => m < 0)) return { error: "Marks cannot be negative." };
  const total = marks.reduce((a, b) => a + b, 0);
  return { total, subjects: marks.length, average: total / marks.length };
}

export function subjectWisePercentage(params: {
  marksCsv: string;
  maxPerSubject: number;
}): {
  subjects: { index: number; marks: number; percent: number }[];
  averagePercent: number;
} | { error: string } {
  if (params.maxPerSubject <= 0) return { error: "Max per subject must be positive." };
  const marks = parseCsv(params.marksCsv);
  if (marks.length < 1) return { error: "Enter at least one mark (comma-separated)." };
  if (marks.some((m) => m < 0 || m > params.maxPerSubject)) {
    return { error: "Each mark must be between 0 and max per subject." };
  }
  const subjects = marks.map((m, i) => ({
    index: i + 1,
    marks: m,
    percent: (m / params.maxPerSubject) * 100,
  }));
  const averagePercent = subjects.reduce((s, x) => s + x.percent, 0) / subjects.length;
  return { subjects, averagePercent };
}

export function weightedPercentage(params: {
  scoresCsv: string;
  weightsCsv: string;
}): { weightedPercent: number; components: number } | { error: string } {
  const scores = parseCsv(params.scoresCsv);
  const weights = parseCsv(params.weightsCsv);
  if (scores.length < 1) return { error: "Enter at least one score." };
  if (scores.length !== weights.length) {
    return { error: "Scores and weights counts must match." };
  }
  if (scores.some((s) => s < 0) || weights.some((w) => w < 0)) {
    return { error: "Scores and weights cannot be negative." };
  }
  const tw = weights.reduce((a, b) => a + b, 0);
  if (tw <= 0) return { error: "Weights must sum to a positive number." };
  const weightedPercent = scores.reduce((s, sc, i) => s + sc * weights[i]!, 0) / tw;
  return { weightedPercent, components: scores.length };
}

export function gradeFromPercentage(params: {
  percent: number;
}): { grade: string; band: string } | { error: string } {
  if (params.percent < 0 || params.percent > 100) {
    return { error: "Percentage must be 0–100." };
  }
  const p = params.percent;
  const grade =
    p >= 90 ? "A+" : p >= 80 ? "A" : p >= 70 ? "B" : p >= 60 ? "C" : p >= 50 ? "D" : "F";
  const band =
    p >= 90
      ? "Outstanding"
      : p >= 80
        ? "Excellent"
        : p >= 70
          ? "Good"
          : p >= 60
            ? "Fair"
            : p >= 50
              ? "Pass band"
              : "Below pass";
  return { grade, band };
}

export function scoreAverage(params: {
  scoresCsv: string;
}): { average: number; count: number; min: number; max: number } | { error: string } {
  const scores = parseCsv(params.scoresCsv);
  if (scores.length < 1) return { error: "Enter at least one score." };
  if (scores.some((s) => s < 0)) return { error: "Scores cannot be negative." };
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  return {
    average,
    count: scores.length,
    min: Math.min(...scores),
    max: Math.max(...scores),
  };
}

export function bestOfNSubjects(params: {
  marksCsv: string;
  bestN: number;
}): { selected: number[]; total: number; average: number } | { error: string } {
  const marks = parseCsv(params.marksCsv);
  if (marks.length < 1) return { error: "Enter at least one mark." };
  if (marks.some((m) => m < 0)) return { error: "Marks cannot be negative." };
  if (params.bestN < 1 || params.bestN > marks.length) {
    return { error: "Best-of N must be between 1 and the number of subjects." };
  }
  const selected = [...marks].sort((a, b) => b - a).slice(0, params.bestN);
  const total = selected.reduce((a, b) => a + b, 0);
  return { selected, total, average: total / selected.length };
}

export function passFail(params: {
  marks: number;
  passMark: number;
}): { status: "Pass" | "Fail"; margin: number } | { error: string } {
  if (params.marks < 0) return { error: "Marks cannot be negative." };
  if (params.passMark < 0) return { error: "Pass mark cannot be negative." };
  const margin = params.marks - params.passMark;
  return { status: margin >= 0 ? "Pass" : "Fail", margin };
}

export function scoreImprovement(params: {
  previous: number;
  current: number;
}): { delta: number; percentChange: number } | { error: string } {
  if (params.previous < 0 || params.current < 0) {
    return { error: "Scores cannot be negative." };
  }
  const delta = params.current - params.previous;
  const percentChange =
    params.previous === 0 ? (params.current > 0 ? 100 : 0) : (delta / params.previous) * 100;
  return { delta, percentChange };
}

/** Marks still needed on remaining paper to hit overall pass %. */
export function requiredMarksToPass(params: {
  marksSoFar: number;
  maxSoFar: number;
  remainingMax: number;
  passPercent: number;
}): { required: number; overallTarget: number; alreadySafe: boolean } | { error: string } {
  if (params.marksSoFar < 0 || params.maxSoFar < 0 || params.remainingMax < 0) {
    return { error: "Marks/max values cannot be negative." };
  }
  if (params.passPercent <= 0 || params.passPercent > 100) {
    return { error: "Pass % must be between 0 and 100." };
  }
  if (params.marksSoFar > params.maxSoFar) {
    return { error: "Marks so far cannot exceed max so far." };
  }
  const overallMax = params.maxSoFar + params.remainingMax;
  if (overallMax <= 0) return { error: "Overall max must be positive." };
  const overallTarget = (params.passPercent / 100) * overallMax;
  const required = overallTarget - params.marksSoFar;
  if (required <= 0) {
    return { required: 0, overallTarget, alreadySafe: true };
  }
  if (required > params.remainingMax) {
    return {
      error: `Need ${required.toFixed(1)} on remaining, but only ${params.remainingMax} marks left.`,
    };
  }
  return { required, overallTarget, alreadySafe: false };
}
