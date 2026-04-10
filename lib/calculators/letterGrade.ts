/** 4.0 scale with +/- (A+ capped at 4.0). */
export const GRADE_POINTS: Record<string, number> = {
  "a+": 4.0,
  a: 4.0,
  "a-": 3.7,
  "b+": 3.3,
  b: 3.0,
  "b-": 2.7,
  "c+": 2.3,
  c: 2.0,
  "c-": 1.7,
  "d+": 1.3,
  d: 1.0,
  "d-": 0.7,
  f: 0,
};

export function letterToPoints(letter: string): number | null {
  const key = letter.trim().toLowerCase();
  if (key in GRADE_POINTS) return GRADE_POINTS[key];
  return null;
}

export function parseGradeInput(raw: string): { points: number } | { error: string } {
  const t = raw.trim();
  if (!t) return { error: "Enter a grade." };
  const asNum = Number(t);
  if (!Number.isNaN(asNum) && t !== "") {
    if (asNum < 0 || asNum > 4) return { error: "Numeric GPA must be 0–4." };
    return { points: asNum };
  }
  const pts = letterToPoints(t);
  if (pts === null) return { error: "Use A–F or 0–4." };
  return { points: pts };
}

/** Rows for reference tables (stable display order). */
export const GRADE_SCALE_ROWS: { letter: string; points: number }[] = [
  { letter: "A+", points: 4.0 },
  { letter: "A", points: 4.0 },
  { letter: "A−", points: 3.7 },
  { letter: "B+", points: 3.3 },
  { letter: "B", points: 3.0 },
  { letter: "B−", points: 2.7 },
  { letter: "C+", points: 2.3 },
  { letter: "C", points: 2.0 },
  { letter: "C−", points: 1.7 },
  { letter: "D+", points: 1.3 },
  { letter: "D", points: 1.0 },
  { letter: "D−", points: 0.7 },
  { letter: "F", points: 0 },
];
