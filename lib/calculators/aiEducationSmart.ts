export const AI_EDUCATION_URL = {
  HOURS: "hpd",
  DAYS: "dte",
  SUBJECTS: "sc",
  WAKE: "wh",
  SLEEP: "sh",
  SCHOOL_START: "ss",
  SCHOOL_END: "se",
  MARK1: "m1",
  MARK2: "m2",
  MARK3: "m3",
  MARK4: "m4",
  MARK5: "m5",
  MARK6: "m6",
  MAX: "mx",
  STUDENTS: "tst",
  SCORE: "ms",
  CURRENT: "ca",
  TARGET: "ta",
  WEEKS: "wl",
  TOPIC: "tp",
  SUBJECT: "sbj",
  DEPTH: "dp",
  PROBLEM: "pt",
  A: "va",
  B: "vb",
  C: "vc",
  ENERGY: "ep",
  EXAM: "et",
  PREP1: "p1",
  PREP2: "p2",
  PREP3: "p3",
  PREP4: "p4",
  W1: "w1",
  W2: "w2",
  W3: "w3",
  W4: "w4",
  S1: "s1",
  S2: "s2",
  S3: "s3",
  S4: "s4",
} as const;

export function parseAiEducationSearchParams(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  const keys = [
    ...Object.values(AI_EDUCATION_URL),
    "s1n",
    "s2n",
    "s3n",
    "s4n",
    "brk",
    "diff",
  ];
  for (const k of keys) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export type ExamType = "board" | "competitive" | "unit";
export type EnergyPeak = "morning" | "afternoon" | "evening";
export type ProblemType = "linear" | "quadratic" | "percentage" | "pythagoras" | "area-circle";
export type NoteDepth = "brief" | "standard" | "detailed";

export function parseExamType(raw: string): ExamType {
  if (raw === "competitive" || raw === "unit") return raw;
  return "board";
}

export function parseEnergyPeak(raw: string): EnergyPeak {
  if (raw === "afternoon" || raw === "evening") return raw;
  return "morning";
}

export function parseProblemType(raw: string): ProblemType {
  if (raw === "quadratic" || raw === "percentage" || raw === "pythagoras" || raw === "area-circle") return raw;
  return "linear";
}

export function parseNoteDepth(raw: string): NoteDepth {
  if (raw === "brief" || raw === "detailed") return raw;
  return "standard";
}

export function gradeFromPercent(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}
