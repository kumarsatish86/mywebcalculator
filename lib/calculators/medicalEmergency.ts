/** Emergency / critical-care educational scores. */

export const MEDICAL_EMERGENCY_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  N: "n",
  M: "m",
} as const;

export function parseMedicalEmergencySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_EMERGENCY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** APGAR: five components 0–2 each. */
export function apgarScore(params: {
  scoresCsv: string;
}): { score: number; band: string } | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length !== 5) return { error: "Enter 5 APGAR components (0–2 each)." };
  if (scores.some((s) => s < 0 || s > 2 || !Number.isInteger(s))) {
    return { error: "Each APGAR component must be an integer 0–2." };
  }
  const score = scores.reduce((a, b) => a + b, 0);
  const band =
    score >= 7 ? "Reassuring band (teaching)" : score >= 4 ? "Moderately abnormal" : "Low band (teaching)";
  return { score, band };
}

/** Shock index = HR / SBP. */
export function shockIndex(params: {
  hr: number;
  sbp: number;
}): { index: number; band: string } | { error: string } {
  if (params.hr <= 0 || params.sbp <= 0) return { error: "HR and SBP must be positive." };
  const index = params.hr / params.sbp;
  const band =
    index < 0.7 ? "Lower SI band (teaching)" : index <= 0.9 ? "Intermediate" : "Elevated SI band (teaching)";
  return { index, band };
}

/** Oxygenation index = (FIO₂ × MAP × 100) / PaO₂. */
export function oxygenationIndex(params: {
  fio2: number;
  map: number;
  pao2: number;
}): { oi: number; band: string } | { error: string } {
  if (params.fio2 <= 0 || params.fio2 > 1) return { error: "FIO₂ as fraction 0–1." };
  if (params.map <= 0 || params.pao2 <= 0) return { error: "MAP and PaO₂ must be positive." };
  const oi = (params.fio2 * params.map * 100) / params.pao2;
  const band =
    oi < 5 ? "Milder OI band (teaching)" : oi < 15 ? "Moderate" : "Higher OI band (teaching)";
  return { oi, band };
}

/** Revised trauma score style: sum of coded GCS/SBP/RR categories (CSV 3 ints). */
export function traumaScore(params: {
  scoresCsv: string;
}): { score: number; band: string } | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length !== 3) return { error: "Enter 3 coded values (GCS, SBP, RR categories 0–4)." };
  if (scores.some((s) => s < 0 || s > 4 || !Number.isInteger(s))) {
    return { error: "Each trauma code must be an integer 0–4." };
  }
  const score = scores.reduce((a, b) => a + b, 0);
  const band =
    score >= 11 ? "Higher RTS band (teaching)" : score >= 8 ? "Intermediate" : "Lower RTS band (teaching)";
  return { score, band };
}

/** NEWS2-style: sum of 7 vital-sign scores 0–3 (CSV). */
export function newsScore(params: {
  scoresCsv: string;
}): { score: number; band: string } | { error: string } {
  const scores = params.scoresCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (scores.length !== 7) return { error: "Enter 7 NEWS component scores (0–3 each)." };
  if (scores.some((s) => s < 0 || s > 3 || !Number.isInteger(s))) {
    return { error: "Each NEWS component must be an integer 0–3." };
  }
  const score = scores.reduce((a, b) => a + b, 0);
  const band =
    score <= 4 ? "Low aggregate band (teaching)" : score <= 6 ? "Medium" : "High aggregate band (teaching)";
  return { score, band };
}
