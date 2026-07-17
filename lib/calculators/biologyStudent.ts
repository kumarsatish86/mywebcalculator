/** Student / educational biology helpers. */

export const BIOLOGY_STUDENT_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  N: "n",
} as const;

export function parseBiologyStudentSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_STUDENT_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const FORMULAS: Record<string, { result: (a: number, b: number) => number; label: string }> = {
  magnification: {
    label: "Magnification = image / actual",
    result: (image, actual) => image / actual,
  },
  rate: {
    label: "Rate = change / time",
    result: (change, time) => change / time,
  },
  density: {
    label: "Population density = N / area",
    result: (n, area) => n / area,
  },
  efficiency: {
    label: "Efficiency % = (useful / total) × 100",
    result: (useful, total) => (useful / total) * 100,
  },
};

export function biologyFormula(params: {
  kind: string;
  a: number;
  b: number;
}): { value: number; label: string } | { error: string } {
  const key = params.kind.trim().toLowerCase();
  const hit = Object.entries(FORMULAS).find(([k]) => key.includes(k));
  if (!hit) {
    return { error: "Kind: magnification, rate, density, or efficiency." };
  }
  if (params.b === 0) return { error: "Second value cannot be zero." };
  if (!Number.isFinite(params.a) || !Number.isFinite(params.b)) {
    return { error: "Enter finite numbers." };
  }
  return { value: hit[1].result(params.a, params.b), label: hit[1].label };
}

export function quizScoreBiology(params: {
  correct: number;
  total: number;
}): { percent: number; grade: string } | { error: string } {
  if (params.total <= 0 || params.correct < 0 || params.correct > params.total) {
    return { error: "Need 0 ≤ correct ≤ total and total > 0." };
  }
  const percent = (params.correct / params.total) * 100;
  let grade: string;
  if (percent >= 90) grade = "A";
  else if (percent >= 80) grade = "B";
  else if (percent >= 70) grade = "C";
  else if (percent >= 60) grade = "D";
  else grade = "F";
  return { percent, grade };
}

export function studyTimePlannerBiology(params: {
  topics: number;
  hoursAvailable: number;
}): { hoursPerTopic: number; minutesPerTopic: number } | { error: string } {
  if (params.topics <= 0 || params.hoursAvailable <= 0) {
    return { error: "Topics and hours must be positive." };
  }
  const hoursPerTopic = params.hoursAvailable / params.topics;
  return { hoursPerTopic, minutesPerTopic: hoursPerTopic * 60 };
}

export function revisionPlannerBiology(params: {
  chapters: number;
  daysUntilExam: number;
}): { chaptersPerDay: number; note: string } | { error: string } {
  if (params.chapters <= 0 || params.daysUntilExam <= 0) {
    return { error: "Chapters and days must be positive." };
  }
  const chaptersPerDay = params.chapters / params.daysUntilExam;
  return {
    chaptersPerDay,
    note: "Even split — adjust for harder chapters as needed.",
  };
}
