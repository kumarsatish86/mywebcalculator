/** Geriatrics / aging helpers — educational only. */

export const MEDICAL_GERIATRICS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
} as const;

export function parseMedicalGeriatricsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_GERIATRICS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Toy remaining LE = base − age + lifestyle adjustments (years). */
export function lifeExpectancy(params: {
  age: number;
  sex: "male" | "female";
  smoke: number;
  exercise: number;
}): { estimateYears: number; note: string } | { error: string } {
  if (params.age < 0 || params.age > 120) return { error: "Enter a realistic age (0–120)." };
  if (params.smoke !== 0 && params.smoke !== 1) return { error: "Smoke flag must be 0 or 1." };
  if (params.exercise !== 0 && params.exercise !== 1) return { error: "Exercise flag must be 0 or 1." };
  const base = params.sex === "female" ? 83 : 78;
  const estimateYears = Math.max(0, base - params.age - params.smoke * 5 + params.exercise * 3);
  return {
    estimateYears,
    note: "Classroom toy model — not actuarial or clinical life expectancy.",
  };
}

/** Morse-like fall-risk points from CSV of item scores. */
export function fallRisk(params: {
  scoresCsv: string;
}): { score: number; band: string } | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length < 3) return { error: "Enter at least 3 fall-risk item points." };
  if (scores.some((s) => s < 0)) return { error: "Scores cannot be negative." };
  const score = scores.reduce((a, b) => a + b, 0);
  const band =
    score < 25 ? "Low fall-risk band (teaching)" : score < 45 ? "Moderate" : "Higher fall-risk band (teaching)";
  return { score, band };
}

/** Cognitive screening total from item CSV (e.g. MoCA-style 0–30 teaching sum). */
export function cognitiveScore(params: {
  scoresCsv: string;
  maxTotal?: number;
}): { total: number; band: string } | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length < 1) return { error: "Enter item scores or a single total." };
  if (scores.some((s) => s < 0)) return { error: "Scores cannot be negative." };
  const total = scores.reduce((a, b) => a + b, 0);
  const max = params.maxTotal ?? 30;
  if (total > max) return { error: `Total exceeds max ${max}.` };
  const band =
    total >= 26 ? "Higher screening band (teaching)" : total >= 18 ? "Intermediate band" : "Lower screening band";
  return { total, band };
}
