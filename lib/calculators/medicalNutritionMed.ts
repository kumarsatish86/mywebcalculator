/** Medical nutrition estimators — educational only. */

export const MEDICAL_NUTRITION_MED_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  P: "p",
  F: "f",
} as const;

export function parseMedicalNutritionMedSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MEDICAL_NUTRITION_MED_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const ACTIVITY: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very: 1.9,
};

function activityFactor(activity: string): number | { error: string } {
  const key = activity.trim().toLowerCase();
  const hit = Object.entries(ACTIVITY).find(([k]) => key.includes(k));
  if (!hit) return { error: "Activity: sedentary, light, moderate, active, or very." };
  return hit[1];
}

export function medicalDailyCalories(params: {
  bmr: number;
  activity: string;
}): { calories: number; factor: number } | { error: string } {
  if (params.bmr <= 0) return { error: "BMR must be positive." };
  const factor = activityFactor(params.activity);
  if (typeof factor === "object") return factor;
  return { calories: params.bmr * factor, factor };
}

export function medicalTdee(params: {
  bmr: number;
  activity: string;
}): { tdee: number; factor: number } | { error: string } {
  const r = medicalDailyCalories(params);
  if ("error" in r) return r;
  return { tdee: r.calories, factor: r.factor };
}

export function medicalMacros(params: {
  calories: number;
  proteinPct: number;
  carbPct: number;
  fatPct: number;
}): { proteinG: number; carbG: number; fatG: number } | { error: string } {
  if (params.calories <= 0) return { error: "Calories must be positive." };
  const sum = params.proteinPct + params.carbPct + params.fatPct;
  if (sum <= 0) return { error: "Macro % mix must be positive." };
  const s = 100 / sum;
  return {
    proteinG: (params.calories * ((params.proteinPct * s) / 100)) / 4,
    carbG: (params.calories * ((params.carbPct * s) / 100)) / 4,
    fatG: (params.calories * ((params.fatPct * s) / 100)) / 9,
  };
}

export function medicalWaterIntake(params: {
  weightKg: number;
  mlPerKg?: number;
}): { mlPerDay: number } | { error: string } {
  if (params.weightKg <= 0) return { error: "Weight must be positive." };
  const mlPerKg = params.mlPerKg ?? 35;
  if (mlPerKg <= 0) return { error: "ml/kg must be positive." };
  return { mlPerDay: params.weightKg * mlPerKg };
}

export function medicalProteinIntake(params: {
  weightKg: number;
  gPerKg: number;
}): { proteinG: number } | { error: string } {
  if (params.weightKg <= 0 || params.gPerKg <= 0) return { error: "Weight and g/kg must be positive." };
  return { proteinG: params.weightKg * params.gPerKg };
}

export function medicalCarbIntake(params: {
  calories: number;
  carbPct: number;
}): { carbG: number } | { error: string } {
  if (params.calories <= 0 || params.carbPct <= 0 || params.carbPct > 100) {
    return { error: "Calories > 0 and carb % in (0,100]." };
  }
  return { carbG: (params.calories * (params.carbPct / 100)) / 4 };
}

export function medicalFatIntake(params: {
  calories: number;
  fatPct: number;
}): { fatG: number } | { error: string } {
  if (params.calories <= 0 || params.fatPct <= 0 || params.fatPct > 100) {
    return { error: "Calories > 0 and fat % in (0,100]." };
  }
  return { fatG: (params.calories * (params.fatPct / 100)) / 9 };
}

export function medicalFiberIntake(params: {
  calories: number;
  gPer1000kcal?: number;
}): { fiberG: number } | { error: string } {
  if (params.calories <= 0) return { error: "Calories must be positive." };
  const g = params.gPer1000kcal ?? 14;
  return { fiberG: (params.calories / 1000) * g };
}

export function medicalSodiumIntake(params: {
  dailyMg: number;
}): { dailyMg: number; band: string } | { error: string } {
  if (params.dailyMg < 0) return { error: "Sodium cannot be negative." };
  const band =
    params.dailyMg <= 2300
      ? "Within common adult upper-limit teaching band (~2300 mg)"
      : "Above common upper-limit teaching band";
  return { dailyMg: params.dailyMg, band };
}
