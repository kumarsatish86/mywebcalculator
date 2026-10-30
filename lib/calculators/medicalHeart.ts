/** Cardiovascular educational calculators. */

export const MEDICAL_HEART_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  N: "n",
  S: "s",
} as const;

export function parseMedicalHeartSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_HEART_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function medicalHeartRate(params: {
  age: number;
}): { maxHr: number } | { error: string } {
  if (params.age <= 0 || params.age > 120) return { error: "Enter a realistic age." };
  return { maxHr: 220 - params.age };
}

export function medicalTargetHeartRate(params: {
  age: number;
  restingHr: number;
  lowPct?: number;
  highPct?: number;
}): { maxHr: number; low: number; high: number } | { error: string } {
  if (params.age <= 0 || params.restingHr <= 0) return { error: "Age and resting HR must be positive." };
  const maxHr = 220 - params.age;
  const lowPct = params.lowPct ?? 0.5;
  const highPct = params.highPct ?? 0.85;
  const reserve = maxHr - params.restingHr;
  return {
    maxHr,
    low: params.restingHr + reserve * lowPct,
    high: params.restingHr + reserve * highPct,
  };
}

export function medicalBpCategory(params: {
  systolic: number;
  diastolic: number;
}): { category: string } | { error: string } {
  if (params.systolic <= 0 || params.diastolic <= 0) return { error: "BP values must be positive." };
  if (params.systolic < 120 && params.diastolic < 80) return { category: "Normal (ACC/AHA teaching bands)" };
  if (params.systolic < 130 && params.diastolic < 80) return { category: "Elevated" };
  if (params.systolic < 140 || params.diastolic < 90) return { category: "Stage 1 hypertension band" };
  return { category: "Stage 2 hypertension band (teaching)" };
}

export function medicalMap(params: {
  systolic: number;
  diastolic: number;
}): { map: number } | { error: string } {
  if (params.systolic <= 0 || params.diastolic <= 0) return { error: "BP values must be positive." };
  return { map: params.diastolic + (params.systolic - params.diastolic) / 3 };
}

export function medicalPulsePressure(params: {
  systolic: number;
  diastolic: number;
}): { pulsePressure: number } | { error: string } {
  if (params.systolic <= 0 || params.diastolic <= 0) return { error: "BP values must be positive." };
  if (params.systolic < params.diastolic) return { error: "Systolic should be ≥ diastolic." };
  return { pulsePressure: params.systolic - params.diastolic };
}

/** CO (L/min) = HR × SV(mL) / 1000 */
export function medicalCardiacOutput(params: {
  hr: number;
  strokeVolumeMl: number;
}): { coLMin: number } | { error: string } {
  if (params.hr <= 0 || params.strokeVolumeMl <= 0) return { error: "HR and stroke volume must be positive." };
  return { coLMin: (params.hr * params.strokeVolumeMl) / 1000 };
}

/** Simplified ASCVD-like points — not the PCE equation. */
export function medicalAscvdRisk(params: {
  age: number;
  totalChol: number;
  hdl: number;
  sbp: number;
  smoke: number;
  diabetes: number;
  treatedBp: number;
}): { points: number; band: string; note: string } | { error: string } {
  if (params.age < 20 || params.age > 90) return { error: "Age 20–90 for this helper." };
  if (params.totalChol <= 0 || params.hdl <= 0 || params.sbp <= 0) {
    return { error: "Cholesterol and SBP must be positive." };
  }
  for (const [v, l] of [
    [params.smoke, "Smoke"],
    [params.diabetes, "Diabetes"],
    [params.treatedBp, "Treated BP"],
  ] as const) {
    if (v !== 0 && v !== 1) return { error: `${l} must be 0 or 1.` };
  }
  let points = Math.floor((params.age - 40) / 5);
  if (params.totalChol >= 240) points += 2;
  else if (params.totalChol >= 200) points += 1;
  if (params.hdl < 40) points += 2;
  else if (params.hdl < 50) points += 1;
  if (params.sbp >= 140) points += 2;
  else if (params.sbp >= 130) points += 1;
  points += params.smoke * 2 + params.diabetes * 2 + params.treatedBp;
  const band = points <= 3 ? "Lower relative points" : points <= 7 ? "Moderate" : "Higher relative points";
  return { points, band, note: "Not the ACC/AHA PCE — classroom risk-factor tally only." };
}

/** Simplified Framingham-style point sum. */
export function medicalFramingham(params: {
  age: number;
  totalChol: number;
  hdl: number;
  sbp: number;
  smoke: number;
}): { points: number; band: string; note: string } | { error: string } {
  if (params.age < 20 || params.age > 90) return { error: "Age 20–90 for this helper." };
  if (params.totalChol <= 0 || params.hdl <= 0 || params.sbp <= 0) {
    return { error: "Labs and SBP must be positive." };
  }
  if (params.smoke !== 0 && params.smoke !== 1) return { error: "Smoke must be 0 or 1." };
  let points = Math.floor((params.age - 40) / 5);
  if (params.totalChol >= 240) points += 2;
  else if (params.totalChol >= 200) points += 1;
  if (params.hdl < 40) points += 2;
  if (params.sbp >= 140) points += 2;
  points += params.smoke * 2;
  const band = points <= 4 ? "Lower relative points" : points <= 8 ? "Moderate" : "Higher relative points";
  return { points, band, note: "Not a validated Framingham equation — teaching tally only." };
}
