/** Orthopedic / bone-health educational estimators. */

export const MEDICAL_ORTHO_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
} as const;

export function parseMedicalOrthoSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_ORTHO_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** T-score style: (BMD − youngMean) / SD. */
export function boneDensity(params: {
  bmd: number;
  youngMean: number;
  sd: number;
}): { tScore: number; band: string } | { error: string } {
  if (params.sd <= 0) return { error: "SD must be positive." };
  const tScore = (params.bmd - params.youngMean) / params.sd;
  let band: string;
  if (tScore >= -1) band = "Normal BMD band (WHO teaching)";
  else if (tScore > -2.5) band = "Osteopenia band (WHO teaching)";
  else band = "Osteoporosis band (WHO teaching)";
  return { tScore, band };
}

/** Simplified FRAX-like point sum — not the licensed FRAX algorithm. */
export function fractureRiskFrax(params: {
  age: number;
  priorFracture: number;
  parentHip: number;
  smoke: number;
  steroids: number;
  ra: number;
  secondary: number;
  alcohol: number;
  tScore: number;
}): { points: number; band: string; note: string } | { error: string } {
  if (params.age < 40 || params.age > 90) return { error: "Age should be 40–90 for this teaching helper." };
  for (const [v, l] of [
    [params.priorFracture, "Prior fracture"],
    [params.parentHip, "Parent hip fracture"],
    [params.smoke, "Smoking"],
    [params.steroids, "Steroids"],
    [params.ra, "RA"],
    [params.secondary, "Secondary osteoporosis"],
    [params.alcohol, "Alcohol"],
  ] as const) {
    if (v !== 0 && v !== 1) return { error: `${l} must be 0 or 1.` };
  }
  let points =
    (params.age >= 65 ? 2 : 1) +
    params.priorFracture * 2 +
    params.parentHip +
    params.smoke +
    params.steroids +
    params.ra +
    params.secondary +
    params.alcohol;
  if (params.tScore <= -2.5) points += 2;
  else if (params.tScore <= -1) points += 1;
  const band =
    points <= 3 ? "Lower relative risk band (teaching)" : points <= 6 ? "Moderate" : "Higher relative risk band";
  return {
    points,
    band,
    note: "Not the licensed FRAX® tool — classroom risk-factor tally only.",
  };
}

/** Ideal sitting eye height / desk heuristics from stature. */
export function idealPosture(params: {
  heightCm: number;
}): { deskCm: number; monitorCm: number; note: string } | { error: string } {
  if (params.heightCm < 120 || params.heightCm > 220) {
    return { error: "Enter height between 120 and 220 cm." };
  }
  // Rough ANSI/HFES-style fractions for teaching
  const deskCm = params.heightCm * 0.43;
  const monitorCm = deskCm + 15;
  return {
    deskCm,
    monitorCm,
    note: "Ergonomic starting estimates only — adjust for comfort and clinician/physio guidance.",
  };
}
