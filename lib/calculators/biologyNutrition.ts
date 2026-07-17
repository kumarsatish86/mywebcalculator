/** Nutrition / diet estimators (educational, not medical advice). */

export const BIOLOGY_NUTRITION_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  P: "p",
  F: "f",
} as const;

export function parseBiologyNutritionSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_NUTRITION_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function macronutrientSplit(params: {
  calories: number;
  proteinPct: number;
  carbPct: number;
  fatPct: number;
}): { proteinG: number; carbG: number; fatG: number } | { error: string } {
  if (params.calories <= 0) return { error: "Calories must be positive." };
  const sum = params.proteinPct + params.carbPct + params.fatPct;
  if (sum <= 0) return { error: "Macro % mix must be positive." };
  const scale = 100 / sum;
  const p = params.proteinPct * scale;
  const c = params.carbPct * scale;
  const f = params.fatPct * scale;
  return {
    proteinG: (params.calories * (p / 100)) / 4,
    carbG: (params.calories * (c / 100)) / 4,
    fatG: (params.calories * (f / 100)) / 9,
  };
}

export function proteinIntake(params: {
  weightKg: number;
  gPerKg: number;
}): { proteinG: number } | { error: string } {
  if (params.weightKg <= 0 || params.gPerKg <= 0) return { error: "Weight and g/kg must be positive." };
  return { proteinG: params.weightKg * params.gPerKg };
}

/** ~35 mL/kg educational heuristic */
export function waterIntake(params: {
  weightKg: number;
  mlPerKg?: number;
}): { ml: number; liters: number } | { error: string } {
  if (params.weightKg <= 0) return { error: "Weight must be positive." };
  const mlPerKg = params.mlPerKg ?? 35;
  if (mlPerKg <= 0) return { error: "mL/kg must be positive." };
  const ml = params.weightKg * mlPerKg;
  return { ml, liters: ml / 1000 };
}

export function calorieDeficitSurplus(params: {
  tdee: number;
  intake: number;
}): { delta: number; kind: "deficit" | "surplus" | "maintenance" } | { error: string } {
  if (params.tdee <= 0 || params.intake < 0) return { error: "TDEE must be positive; intake ≥ 0." };
  const delta = params.intake - params.tdee;
  const kind = Math.abs(delta) < 25 ? "maintenance" : delta < 0 ? "deficit" : "surplus";
  return { delta, kind };
}

export function tdeeFromBmr(params: {
  bmr: number;
  activityFactor: number;
}): { tdee: number } | { error: string } {
  if (params.bmr <= 0 || params.activityFactor <= 0) return { error: "BMR and activity must be positive." };
  return { tdee: params.bmr * params.activityFactor };
}

/** Split daily calories across N meals equally */
export function mealPlanner(params: {
  dailyCalories: number;
  meals: number;
}): { perMeal: number } | { error: string } {
  if (params.dailyCalories <= 0 || params.meals < 1) {
    return { error: "Calories must be positive; meals ≥ 1." };
  }
  return { perMeal: params.dailyCalories / params.meals };
}

/** Glycemic load ≈ (GI × carbs_g) / 100 */
export function glycemicIndexLoad(params: {
  gi: number;
  carbsG: number;
}): { load: number; band: string } | { error: string } {
  if (params.gi < 0 || params.gi > 100) return { error: "GI should be 0–100." };
  if (params.carbsG < 0) return { error: "Carbs cannot be negative." };
  const load = (params.gi * params.carbsG) / 100;
  const band = load < 10 ? "Low GL band" : load < 20 ? "Medium GL band" : "High GL band";
  return { load, band };
}
