/** Medical body-metrics estimators — educational only. */

export const MEDICAL_BODY_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  H: "h",
  S: "s",
} as const;

export function parseMedicalBodySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_BODY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function medicalBmi(params: {
  weightKg: number;
  heightCm: number;
}): { bmi: number; band: string } | { error: string } {
  if (params.weightKg <= 0 || params.heightCm <= 0) return { error: "Weight and height must be positive." };
  const m = params.heightCm / 100;
  const bmi = params.weightKg / (m * m);
  const band =
    bmi < 18.5 ? "Underweight range" : bmi < 25 ? "Normal range" : bmi < 30 ? "Overweight range" : "Obesity range";
  return { bmi, band };
}

export function medicalBmr(params: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: "male" | "female";
}): { bmr: number } | { error: string } {
  if (params.weightKg <= 0 || params.heightCm <= 0 || params.age <= 0) {
    return { error: "Weight, height, and age must be positive." };
  }
  const s = params.sex === "male" ? 5 : -161;
  return { bmr: 10 * params.weightKg + 6.25 * params.heightCm - 5 * params.age + s };
}

/** US Navy body-fat % (cm → inches internally). */
export function medicalBodyFat(params: {
  sex: "male" | "female";
  heightCm: number;
  waistCm: number;
  neckCm: number;
  hipCm?: number;
}): { bodyFatPct: number } | { error: string } {
  const toIn = (cm: number) => cm / 2.54;
  if (params.heightCm <= 0 || params.waistCm <= 0 || params.neckCm <= 0) {
    return { error: "Height, waist, and neck must be positive." };
  }
  const h = toIn(params.heightCm);
  const w = toIn(params.waistCm);
  const n = toIn(params.neckCm);
  if (params.sex === "male") {
    if (w <= n) return { error: "Waist must exceed neck for Navy male formula." };
    return { bodyFatPct: 86.01 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76 };
  }
  if (params.hipCm == null || params.hipCm <= 0) return { error: "Hip (cm) required for female Navy formula." };
  const hp = toIn(params.hipCm);
  if (w + hp <= n) return { error: "Waist + hip must exceed neck." };
  return { bodyFatPct: 163.205 * Math.log10(w + hp - n) - 97.684 * Math.log10(h) - 78.387 };
}

/** Devine IBW (kg). */
export function medicalIdealBodyWeight(params: {
  heightCm: number;
  sex: "male" | "female";
}): { ibwKg: number } | { error: string } {
  if (params.heightCm < 152) return { error: "Devine IBW assumes height ≥ 152 cm (5 ft)." };
  const inchesOver5ft = (params.heightCm / 2.54) - 60;
  const base = params.sex === "male" ? 50 : 45.5;
  return { ibwKg: base + 2.3 * inchesOver5ft };
}

/** Boer LBM. */
export function medicalLeanBodyMass(params: {
  weightKg: number;
  heightCm: number;
  sex: "male" | "female";
}): { lbmKg: number } | { error: string } {
  if (params.weightKg <= 0 || params.heightCm <= 0) return { error: "Weight and height must be positive." };
  if (params.sex === "male") {
    return { lbmKg: 0.407 * params.weightKg + 0.267 * params.heightCm - 19.2 };
  }
  return { lbmKg: 0.252 * params.weightKg + 0.473 * params.heightCm - 48.3 };
}

export function medicalWaistHip(params: {
  waistCm: number;
  hipCm: number;
}): { ratio: number; band: string } | { error: string } {
  if (params.waistCm <= 0 || params.hipCm <= 0) return { error: "Waist and hip must be positive." };
  const ratio = params.waistCm / params.hipCm;
  const band = ratio < 0.85 ? "Lower WHR band (teaching)" : ratio < 0.95 ? "Moderate" : "Higher WHR band (teaching)";
  return { ratio, band };
}

/** Mosteller BSA. */
export function medicalBsa(params: {
  weightKg: number;
  heightCm: number;
}): { bsaM2: number } | { error: string } {
  if (params.weightKg <= 0 || params.heightCm <= 0) return { error: "Weight and height must be positive." };
  return { bsaM2: Math.sqrt((params.heightCm * params.weightKg) / 3600) };
}

/** AjBW = IBW + 0.4 × (TBW − IBW). */
export function medicalAdjustedBodyWeight(params: {
  weightKg: number;
  heightCm: number;
  sex: "male" | "female";
}): { ibwKg: number; ajbwKg: number } | { error: string } {
  const ibw = medicalIdealBodyWeight({ heightCm: params.heightCm, sex: params.sex });
  if ("error" in ibw) return ibw;
  if (params.weightKg <= 0) return { error: "Weight must be positive." };
  return {
    ibwKg: ibw.ibwKg,
    ajbwKg: ibw.ibwKg + 0.4 * (params.weightKg - ibw.ibwKg),
  };
}

/** FFMI = FFM(kg) / height(m)²; FFM from weight and body-fat %. */
export function medicalFfmi(params: {
  weightKg: number;
  heightCm: number;
  bodyFatPct: number;
}): { ffmKg: number; ffmi: number } | { error: string } {
  if (params.weightKg <= 0 || params.heightCm <= 0) return { error: "Weight and height must be positive." };
  if (params.bodyFatPct < 0 || params.bodyFatPct >= 100) return { error: "Body fat % must be 0–100." };
  const ffmKg = params.weightKg * (1 - params.bodyFatPct / 100);
  const m = params.heightCm / 100;
  return { ffmKg, ffmi: ffmKg / (m * m) };
}
