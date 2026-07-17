/** GPA / CGPA / SGPA and percentage conversion helpers. */

export const EXAM_GPA_CGPA_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  W: "w",
  S: "s",
} as const;

export function parseExamGpaCgpaSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_GPA_CGPA_URL)) {
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

/** Credit-weighted GPA from grade-point CSV (+ optional credits CSV). */
export function creditWeightedGpa(params: {
  gradePointsCsv: string;
  creditsCsv?: string;
}): { gpa: number; courses: number; totalCredits: number } | { error: string } {
  const gps = parseCsv(params.gradePointsCsv);
  if (gps.length < 1) return { error: "Enter grade points (comma-separated)." };
  if (gps.some((g) => g < 0)) return { error: "Grade points cannot be negative." };
  let credits: number[];
  if (params.creditsCsv && params.creditsCsv.trim()) {
    credits = parseCsv(params.creditsCsv);
    if (credits.length !== gps.length) {
      return { error: "Credits count must match grade-points count." };
    }
    if (credits.some((c) => c <= 0)) return { error: "Credits must be positive." };
  } else {
    credits = gps.map(() => 1);
  }
  const totalCredits = credits.reduce((a, b) => a + b, 0);
  const weighted = gps.reduce((s, g, i) => s + g * credits[i]!, 0);
  return { gpa: weighted / totalCredits, courses: gps.length, totalCredits };
}

export function unweightedGpa(params: {
  gradePointsCsv: string;
}): { gpa: number; courses: number } | { error: string } {
  const r = creditWeightedGpa({ gradePointsCsv: params.gradePointsCsv });
  if ("error" in r) return r;
  return { gpa: r.gpa, courses: r.courses };
}

export function cumulativeGpa(params: {
  priorGpa: number;
  priorCredits: number;
  newGpa: number;
  newCredits: number;
}): { cgpa: number; totalCredits: number } | { error: string } {
  if (params.priorGpa < 0 || params.newGpa < 0) {
    return { error: "GPA values cannot be negative." };
  }
  if (params.priorCredits < 0 || params.newCredits <= 0) {
    return { error: "Credits invalid (new credits must be positive)." };
  }
  const totalCredits = params.priorCredits + params.newCredits;
  if (totalCredits <= 0) return { error: "Total credits must be positive." };
  const cgpa =
    (params.priorGpa * params.priorCredits + params.newGpa * params.newCredits) / totalCredits;
  return { cgpa, totalCredits };
}

/** Common linear maps: 4.0 scale ≈ %/25; 10.0 scale ≈ %/9.5 (India-style approx). */
export function gpaToPercentage(params: {
  gpa: number;
  scale: number;
}): { percent: number; formula: string } | { error: string } {
  if (params.gpa < 0) return { error: "GPA cannot be negative." };
  if (params.scale !== 4 && params.scale !== 10) {
    return { error: "Scale must be 4 or 10." };
  }
  if (params.gpa > params.scale) return { error: "GPA cannot exceed scale." };
  if (params.scale === 4) {
    return { percent: params.gpa * 25, formula: "GPA × 25 (4.0 scale)" };
  }
  return { percent: params.gpa * 9.5, formula: "GPA × 9.5 (10.0 scale approx)" };
}

export function percentageToGpa(params: {
  percent: number;
  scale: number;
}): { gpa: number; formula: string } | { error: string } {
  if (params.percent < 0 || params.percent > 100) {
    return { error: "Percentage must be 0–100." };
  }
  if (params.scale !== 4 && params.scale !== 10) {
    return { error: "Scale must be 4 or 10." };
  }
  if (params.scale === 4) {
    return { gpa: params.percent / 25, formula: "% ÷ 25 (4.0 scale)" };
  }
  return { gpa: params.percent / 9.5, formula: "% ÷ 9.5 (10.0 scale approx)" };
}

/** Map percentage to grade points on a 4.0 or 10.0 band table. */
export function gradePointFromPercent(params: {
  percent: number;
  scale: number;
}): { gradePoint: number; letter: string } | { error: string } {
  if (params.percent < 0 || params.percent > 100) {
    return { error: "Percentage must be 0–100." };
  }
  if (params.scale !== 4 && params.scale !== 10) {
    return { error: "Scale must be 4 or 10." };
  }
  const p = params.percent;
  if (params.scale === 4) {
    if (p >= 93) return { gradePoint: 4.0, letter: "A" };
    if (p >= 90) return { gradePoint: 3.7, letter: "A-" };
    if (p >= 87) return { gradePoint: 3.3, letter: "B+" };
    if (p >= 83) return { gradePoint: 3.0, letter: "B" };
    if (p >= 80) return { gradePoint: 2.7, letter: "B-" };
    if (p >= 77) return { gradePoint: 2.3, letter: "C+" };
    if (p >= 73) return { gradePoint: 2.0, letter: "C" };
    if (p >= 70) return { gradePoint: 1.7, letter: "C-" };
    if (p >= 67) return { gradePoint: 1.3, letter: "D+" };
    if (p >= 60) return { gradePoint: 1.0, letter: "D" };
    return { gradePoint: 0, letter: "F" };
  }
  if (p >= 90) return { gradePoint: 10, letter: "O" };
  if (p >= 80) return { gradePoint: 9, letter: "A+" };
  if (p >= 70) return { gradePoint: 8, letter: "A" };
  if (p >= 60) return { gradePoint: 7, letter: "B+" };
  if (p >= 50) return { gradePoint: 6, letter: "B" };
  if (p >= 40) return { gradePoint: 5, letter: "C" };
  return { gradePoint: 0, letter: "F" };
}
