/** Pediatrics educational helpers — clinician verification required. */

export const MEDICAL_PEDS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
} as const;

export function parseMedicalPedsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_PEDS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function childBmi(params: {
  weightKg: number;
  heightCm: number;
}): { bmi: number; note: string } | { error: string } {
  if (params.weightKg <= 0 || params.heightCm <= 0) return { error: "Weight and height must be positive." };
  const m = params.heightCm / 100;
  return {
    bmi: params.weightKg / (m * m),
    note: "BMI number only — pediatric percentile charts require age/sex clinical tools.",
  };
}

/** Approximate percentile from z-score via Φ(z) teaching map. */
export function growthPercentile(params: {
  zScore: number;
}): { percentile: number; note: string } | { error: string } {
  if (!Number.isFinite(params.zScore) || Math.abs(params.zScore) > 5) {
    return { error: "Enter a z-score roughly between −5 and 5." };
  }
  // Abramowitz–Stegun-ish erf approximation for Φ
  const z = params.zScore;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  const cdf = z >= 0 ? 1 - p : p;
  return {
    percentile: cdf * 100,
    note: "From z-score via normal CDF approximation — not a CDC/WHO chart lookup.",
  };
}

export function pediatricDosage(params: {
  weightKg: number;
  mgPerKg: number;
  dosesPerDay?: number;
}): { doseMg: number; dailyMg: number } | { error: string } {
  if (params.weightKg <= 0 || params.mgPerKg <= 0) return { error: "Weight and mg/kg must be positive." };
  const doses = params.dosesPerDay ?? 1;
  if (doses <= 0) return { error: "Doses/day must be positive." };
  const doseMg = params.weightKg * params.mgPerKg;
  return { doseMg, dailyMg: doseMg * doses };
}

export function babyWeightGain(params: {
  birthKg: number;
  currentKg: number;
  ageDays: number;
}): { gainKg: number; gPerDay: number } | { error: string } {
  if (params.birthKg <= 0 || params.currentKg <= 0 || params.ageDays <= 0) {
    return { error: "Weights and age (days) must be positive." };
  }
  const gainKg = params.currentKg - params.birthKg;
  return { gainKg, gPerDay: (gainKg * 1000) / params.ageDays };
}

export function headCircumference(params: {
  hcCm: number;
  meanCm: number;
  sdCm: number;
}): { zScore: number; note: string } | { error: string } {
  if (params.hcCm <= 0 || params.meanCm <= 0 || params.sdCm <= 0) {
    return { error: "HC, reference mean, and SD must be positive." };
  }
  return {
    zScore: (params.hcCm - params.meanCm) / params.sdCm,
    note: "Z-score vs provided reference mean/SD — use official growth charts clinically.",
  };
}
