/** Calorie / energy diet calculators. */
import { mifflinBmr, parseDietSearchParams, parseSex, tdeeFromBmr, DIET_URL } from "./dietHelpers";

export { DIET_URL as DIET_CALORIE_URL, parseDietSearchParams as parseDietCalorieSearchParams };

function baseTdee(p: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: "male" | "female";
  activity: string;
}) {
  const bmr = mifflinBmr(p.weightKg, p.heightCm, p.age, p.sex);
  if (typeof bmr === "object") return bmr;
  return tdeeFromBmr(bmr, p.activity);
}

export function dietDailyCalorieNeeds(p: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: string;
  activity: string;
}) {
  const sex = parseSex(p.sex);
  if (typeof sex === "object") return sex;
  return baseTdee({ ...p, sex });
}

export function dietMaintenanceCalories(p: Parameters<typeof dietDailyCalorieNeeds>[0]) {
  const r = dietDailyCalorieNeeds(p);
  if ("error" in r) return r;
  return { maintenance: r.tdee, factor: r.factor };
}

export function dietWeightLossCalories(p: Parameters<typeof dietDailyCalorieNeeds>[0] & { deficit?: number }) {
  const r = dietDailyCalorieNeeds(p);
  if ("error" in r) return r;
  const deficit = p.deficit ?? 500;
  if (deficit < 0) return { error: "Deficit cannot be negative." };
  return { target: Math.max(1200, r.tdee - deficit), tdee: r.tdee, deficit };
}

export function dietWeightGainCalories(p: Parameters<typeof dietDailyCalorieNeeds>[0] & { surplus?: number }) {
  const r = dietDailyCalorieNeeds(p);
  if ("error" in r) return r;
  const surplus = p.surplus ?? 300;
  if (surplus < 0) return { error: "Surplus cannot be negative." };
  return { target: r.tdee + surplus, tdee: r.tdee, surplus };
}

export function dietTdee(p: Parameters<typeof dietDailyCalorieNeeds>[0]) {
  return dietDailyCalorieNeeds(p);
}

/** MET × kg × hours */
export function dietActivityBurn(p: { weightKg: number; met: number; hours: number }) {
  if (p.weightKg <= 0 || p.met <= 0 || p.hours < 0) return { error: "Weight, MET > 0; hours ≥ 0." };
  return { kcal: p.met * p.weightKg * p.hours };
}

export function dietStepsToCalories(p: { steps: number; kcalPerStep?: number }) {
  if (p.steps < 0) return { error: "Steps cannot be negative." };
  const k = p.kcalPerStep ?? 0.04;
  return { kcal: p.steps * k };
}

export function dietExerciseCalories(p: { weightKg: number; met: number; minutes: number }) {
  if (p.weightKg <= 0 || p.met <= 0 || p.minutes < 0) return { error: "Weight, MET > 0; minutes ≥ 0." };
  return { kcal: p.met * p.weightKg * (p.minutes / 60) };
}

export function dietCalorieDeficit(p: { tdee: number; intake: number }) {
  if (p.tdee <= 0 || p.intake < 0) return { error: "TDEE > 0; intake ≥ 0." };
  return { deficit: p.tdee - p.intake, weeklyLossKgEst: ((p.tdee - p.intake) * 7) / 7700 };
}

export function dietCalorieSurplus(p: { tdee: number; intake: number }) {
  if (p.tdee <= 0 || p.intake < 0) return { error: "TDEE > 0; intake ≥ 0." };
  return { surplus: p.intake - p.tdee, weeklyGainKgEst: ((p.intake - p.tdee) * 7) / 7700 };
}
