/** School/college board percentage, GPA/CGPA, entrance & internal-external marks. */

export const EXAM_SCHOOL_COLLEGE_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
  I: "i",
  E: "e",
} as const;

export function parseExamSchoolCollegeSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_SCHOOL_COLLEGE_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function percentageFromMarksCsv(marksCsv: string, maxPerSubject?: number): {
  subjects: number;
  total: number;
  maxTotal: number;
  percent: number;
} | { error: string } {
  const marks = marksCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (marks.length < 1) return { error: "Enter at least one subject mark." };
  if (marks.some((m) => m < 0)) return { error: "Marks cannot be negative." };
  const maxEach = maxPerSubject ?? 100;
  const total = marks.reduce((a, b) => a + b, 0);
  const maxTotal = marks.length * maxEach;
  return {
    subjects: marks.length,
    total,
    maxTotal,
    percent: (total / maxTotal) * 100,
  };
}

export function cbsePercentage(params: {
  marksCsv: string;
  maxPerSubject?: number;
}): ReturnType<typeof percentageFromMarksCsv> {
  return percentageFromMarksCsv(params.marksCsv, params.maxPerSubject ?? 100);
}

export function icsePercentage(params: {
  marksCsv: string;
  maxPerSubject?: number;
}): ReturnType<typeof percentageFromMarksCsv> {
  return percentageFromMarksCsv(params.marksCsv, params.maxPerSubject ?? 100);
}

export function stateBoardPercentage(params: {
  marksCsv: string;
  maxPerSubject?: number;
}): ReturnType<typeof percentageFromMarksCsv> {
  return percentageFromMarksCsv(params.marksCsv, params.maxPerSubject ?? 100);
}

/** Grade points CSV + optional credit weights CSV. */
export function universityGpa(params: {
  gradePointsCsv: string;
  creditsCsv?: string;
}): {
  gpa: number;
  courses: number;
} | { error: string } {
  const gps = params.gradePointsCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (gps.length < 1) return { error: "Enter grade points (comma-separated)." };
  if (gps.some((g) => g < 0)) return { error: "Grade points cannot be negative." };
  let credits: number[];
  if (params.creditsCsv && params.creditsCsv.trim()) {
    credits = params.creditsCsv
      .split(/[,;\s]+/)
      .map(Number)
      .filter((n) => Number.isFinite(n));
    if (credits.length !== gps.length) {
      return { error: "Credits count must match grade-points count." };
    }
    if (credits.some((c) => c <= 0)) return { error: "Credits must be positive." };
  } else {
    credits = gps.map(() => 1);
  }
  const weighted = gps.reduce((s, g, i) => s + g * credits[i]!, 0);
  const totalCredits = credits.reduce((a, b) => a + b, 0);
  return { gpa: weighted / totalCredits, courses: gps.length };
}

export function engineeringCgpa(params: {
  semesterGpasCsv: string;
  creditsCsv?: string;
}): ReturnType<typeof universityGpa> {
  return universityGpa({
    gradePointsCsv: params.semesterGpasCsv,
    creditsCsv: params.creditsCsv,
  });
}

export function medicalEntranceScore(params: {
  correct: number;
  wrong: number;
  marksPerCorrect: number;
  marksPerWrong: number;
}): {
  score: number;
  attempted: number;
} | { error: string } {
  if (params.correct < 0 || params.wrong < 0) return { error: "Counts cannot be negative." };
  return {
    score: params.correct * params.marksPerCorrect - params.wrong * Math.abs(params.marksPerWrong),
    attempted: params.correct + params.wrong,
  };
}

export function semesterWiseMarks(params: {
  marksCsv: string;
  maxPerSubject?: number;
}): {
  subjects: { index: number; marks: number; percent: number }[];
  averagePercent: number;
} | { error: string } {
  const max = params.maxPerSubject ?? 100;
  const marks = params.marksCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (marks.length < 1) return { error: "Enter semester/subject marks." };
  if (marks.some((m) => m < 0)) return { error: "Marks cannot be negative." };
  const subjects = marks.map((m, i) => ({
    index: i + 1,
    marks: m,
    percent: (m / max) * 100,
  }));
  const averagePercent = subjects.reduce((s, x) => s + x.percent, 0) / subjects.length;
  return { subjects, averagePercent };
}

export function internalExternalMarks(params: {
  internal: number;
  external: number;
  internalMax: number;
  externalMax: number;
  internalWeightPercent?: number;
}): {
  combinedPercent: number;
  internalPercent: number;
  externalPercent: number;
} | { error: string } {
  if (params.internalMax <= 0 || params.externalMax <= 0) {
    return { error: "Max marks must be positive." };
  }
  if (params.internal < 0 || params.external < 0) return { error: "Marks cannot be negative." };
  const internalPercent = (params.internal / params.internalMax) * 100;
  const externalPercent = (params.external / params.externalMax) * 100;
  const iw = params.internalWeightPercent ?? 30;
  if (iw < 0 || iw > 100) return { error: "Internal weight % must be 0–100." };
  const combinedPercent = (internalPercent * iw + externalPercent * (100 - iw)) / 100;
  return { combinedPercent, internalPercent, externalPercent };
}
