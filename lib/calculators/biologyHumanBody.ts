/** Human body / health estimators for education science hub (not medical advice). */

export const BIOLOGY_HUMAN_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  S: "s",
  H: "h",
} as const;

export function parseBiologyHumanSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_HUMAN_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function bmiBiology(params: {
  weightKg: number;
  heightM: number;
}): { bmi: number; category: string } | { error: string } {
  if (params.weightKg <= 0 || params.heightM <= 0) return { error: "Weight and height must be positive." };
  const bmi = params.weightKg / params.heightM ** 2;
  const category =
    bmi < 18.5 ? "Underweight band" : bmi < 25 ? "Normal band" : bmi < 30 ? "Overweight band" : "Obese band";
  return { bmi, category };
}

/** Mifflin–St Jeor */
export function bmrBiology(params: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: "male" | "female";
}): { bmr: number } | { error: string } {
  if (params.weightKg <= 0 || params.heightCm <= 0 || params.age <= 0) {
    return { error: "Weight, height, and age must be positive." };
  }
  const base = 10 * params.weightKg + 6.25 * params.heightCm - 5 * params.age;
  return { bmr: params.sex === "male" ? base + 5 : base - 161 };
}

/** Devine ideal body weight (kg) */
export function idealBodyWeight(params: {
  heightCm: number;
  sex: "male" | "female";
}): { ibwKg: number } | { error: string } {
  if (params.heightCm < 152) return { error: "Devine IBW expects height ≥ 152 cm." };
  const inchesOver5ft = (params.heightCm - 152.4) / 2.54;
  const ibwKg =
    params.sex === "male" ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;
  return { ibwKg };
}

/** Boer lean body mass */
export function leanBodyMass(params: {
  weightKg: number;
  heightCm: number;
  sex: "male" | "female";
}): { lbmKg: number } | { error: string } {
  if (params.weightKg <= 0 || params.heightCm <= 0) return { error: "Inputs must be positive." };
  const lbmKg =
    params.sex === "male"
      ? 0.407 * params.weightKg + 0.267 * params.heightCm - 19.2
      : 0.252 * params.weightKg + 0.473 * params.heightCm - 48.3;
  return { lbmKg };
}

/** Mosteller BSA (m²) */
export function bodySurfaceArea(params: {
  weightKg: number;
  heightCm: number;
}): { bsaM2: number } | { error: string } {
  if (params.weightKg <= 0 || params.heightCm <= 0) return { error: "Inputs must be positive." };
  return { bsaM2: Math.sqrt((params.heightCm * params.weightKg) / 3600) };
}

export function maxHeartRate(params: { age: number }): { maxHr: number } | { error: string } {
  if (params.age <= 0 || params.age > 120) return { error: "Enter a plausible age." };
  return { maxHr: 220 - params.age };
}

export function targetHeartRate(params: {
  age: number;
  restHr: number;
}): { moderateLow: number; moderateHigh: number; vigorousLow: number; vigorousHigh: number } | { error: string } {
  const max = maxHeartRate({ age: params.age });
  if ("error" in max) return max;
  if (params.restHr <= 0) return { error: "Resting HR must be positive." };
  const reserve = max.maxHr - params.restHr;
  return {
    moderateLow: params.restHr + 0.5 * reserve,
    moderateHigh: params.restHr + 0.7 * reserve,
    vigorousLow: params.restHr + 0.7 * reserve,
    vigorousHigh: params.restHr + 0.85 * reserve,
  };
}

export function bloodPressureAnalysis(params: {
  systolic: number;
  diastolic: number;
}): { pulsePressure: number; category: string } | { error: string } {
  if (params.systolic <= 0 || params.diastolic <= 0) return { error: "BP values must be positive." };
  if (params.systolic <= params.diastolic) return { error: "Systolic should exceed diastolic." };
  const pulsePressure = params.systolic - params.diastolic;
  let category = "Normal band (educational)";
  if (params.systolic >= 180 || params.diastolic >= 120) category = "Crisis-range band — seek urgent care (not a diagnosis)";
  else if (params.systolic >= 140 || params.diastolic >= 90) category = "High band (educational)";
  else if (params.systolic >= 130 || params.diastolic >= 80) category = "Elevated / stage-1 band (educational)";
  return { pulsePressure, category };
}

export function pulsePressure(params: {
  systolic: number;
  diastolic: number;
}): { pp: number } | { error: string } {
  const r = bloodPressureAnalysis(params);
  if ("error" in r) return r;
  return { pp: r.pulsePressure };
}

/** kcal ≈ MET × weightKg × hours */
export function calorieBurn(params: {
  mets: number;
  weightKg: number;
  hours: number;
}): { kcal: number } | { error: string } {
  if (params.mets < 0 || params.weightKg <= 0 || params.hours < 0) {
    return { error: "Invalid MET/weight/hours." };
  }
  return { kcal: params.mets * params.weightKg * params.hours };
}

export function dailyCalorieNeeds(params: {
  bmr: number;
  activityFactor: number;
}): { tdee: number } | { error: string } {
  if (params.bmr <= 0 || params.activityFactor <= 0) return { error: "BMR and activity factor must be positive." };
  return { tdee: params.bmr * params.activityFactor };
}

/** Simple VO2max estimate from rest HR (Uth–Sørensen–Overgaard–Pedersen style educational) */
export function vo2Max(params: {
  maxHr: number;
  restHr: number;
}): { vo2: number } | { error: string } {
  if (params.maxHr <= 0 || params.restHr <= 0) return { error: "Heart rates must be positive." };
  if (params.restHr >= params.maxHr) return { error: "Rest HR must be below max HR." };
  return { vo2: 15.3 * (params.maxHr / params.restHr) };
}

export function metsFromActivity(params: {
  kcalPerHour: number;
  weightKg: number;
}): { mets: number } | { error: string } {
  if (params.weightKg <= 0) return { error: "Weight must be positive." };
  if (params.kcalPerHour < 0) return { error: "kcal/hour cannot be negative." };
  return { mets: params.kcalPerHour / params.weightKg };
}

/** Nadler blood volume (L) */
export function bloodVolume(params: {
  weightKg: number;
  heightCm: number;
  sex: "male" | "female";
}): { volumeL: number } | { error: string } {
  if (params.weightKg <= 0 || params.heightCm <= 0) return { error: "Inputs must be positive." };
  const h = params.heightCm / 100;
  const volumeL =
    params.sex === "male"
      ? 0.3669 * h ** 3 + 0.03219 * params.weightKg + 0.6041
      : 0.3561 * h ** 3 + 0.03308 * params.weightKg + 0.1833;
  return { volumeL };
}

/** Educational altitude Hb factor placeholder: corrected ≈ measured × (1 + 0.03 × km) */
export function hemoglobinCorrection(params: {
  measured: number;
  altitudeKm: number;
}): { corrected: number } | { error: string } {
  if (params.measured <= 0) return { error: "Hb must be positive." };
  if (params.altitudeKm < 0) return { error: "Altitude cannot be negative." };
  return { corrected: params.measured * (1 + 0.03 * params.altitudeKm) };
}

export function glucoseConverter(params: {
  value: number;
  from: "mgdl" | "mmol";
}): { mgdl: number; mmol: number } | { error: string } {
  if (params.value <= 0) return { error: "Value must be positive." };
  if (params.from === "mgdl") {
    return { mgdl: params.value, mmol: params.value / 18.0182 };
  }
  return { mmol: params.value, mgdl: params.value * 18.0182 };
}

/** eAG (mg/dL) ≈ 28.7 × A1c − 46.7 */
export function hba1c(params: {
  a1cPercent: number;
}): { eagMgdl: number; eagMmol: number } | { error: string } {
  if (params.a1cPercent <= 0) return { error: "A1c must be positive." };
  const eagMgdl = 28.7 * params.a1cPercent - 46.7;
  return { eagMgdl, eagMmol: eagMgdl / 18.0182 };
}
