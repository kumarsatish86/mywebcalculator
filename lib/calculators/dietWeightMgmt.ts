/** Weight management diet calculators. */
import { DIET_URL, mifflinBmr, parseDietSearchParams, parseSex, tdeeFromBmr } from "./dietHelpers";

export { DIET_URL as DIET_WEIGHT_URL, parseDietSearchParams as parseDietWeightSearchParams };

export function dietIdealWeight(p: { heightCm: number; sex: string }) {
  const sex = parseSex(p.sex);
  if (typeof sex === "object") return sex;
  if (p.heightCm < 152) return { error: "Devine IBW assumes height ≥ 152 cm." };
  const inchesOver = p.heightCm / 2.54 - 60;
  const ibw = (sex === "male" ? 50 : 45.5) + 2.3 * inchesOver;
  return { ibwKg: ibw };
}

export function dietTargetWeight(p: { currentKg: number; targetKg: number }) {
  if (p.currentKg <= 0 || p.targetKg <= 0) return { error: "Weights must be positive." };
  return { deltaKg: p.targetKg - p.currentKg, direction: p.targetKg < p.currentKg ? "loss" : p.targetKg > p.currentKg ? "gain" : "maintain" };
}

export function dietWeightLossTimeline(p: { currentKg: number; targetKg: number; kgPerWeek: number }) {
  if (p.currentKg <= 0 || p.targetKg <= 0 || p.kgPerWeek <= 0) return { error: "All values must be positive." };
  if (p.targetKg >= p.currentKg) return { error: "Target must be below current for loss timeline." };
  const weeks = (p.currentKg - p.targetKg) / p.kgPerWeek;
  return { weeks, days: weeks * 7 };
}

export function dietBmiBasedDiet(p: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: string;
  activity: string;
}) {
  const sex = parseSex(p.sex);
  if (typeof sex === "object") return sex;
  if (p.weightKg <= 0 || p.heightCm <= 0) return { error: "Weight and height must be positive." };
  const m = p.heightCm / 100;
  const bmi = p.weightKg / (m * m);
  const bmr = mifflinBmr(p.weightKg, p.heightCm, p.age, sex);
  if (typeof bmr === "object") return bmr;
  const td = tdeeFromBmr(bmr, p.activity);
  if ("error" in td) return td;
  const adjust = bmi >= 25 ? -500 : bmi < 18.5 ? 300 : 0;
  return { bmi, tdee: td.tdee, targetCalories: Math.max(1200, td.tdee + adjust) };
}

export function dietBodyFatBasedDiet(p: { weightKg: number; bodyFatPct: number; tdee: number }) {
  if (p.weightKg <= 0 || p.tdee <= 0) return { error: "Weight and TDEE must be positive." };
  if (p.bodyFatPct < 0 || p.bodyFatPct >= 100) return { error: "Body fat % must be 0–100." };
  const ffm = p.weightKg * (1 - p.bodyFatPct / 100);
  const cut = p.bodyFatPct > 20 ? -500 : -250;
  return { ffmKg: ffm, targetCalories: Math.max(1200, p.tdee + cut) };
}

export function dietWeeklyWeightLoss(p: { dailyDeficit: number }) {
  if (p.dailyDeficit < 0) return { error: "Deficit cannot be negative." };
  return { kgPerWeek: (p.dailyDeficit * 7) / 7700 };
}

export function dietWeightGainPlanner(p: { tdee: number; surplus?: number }) {
  if (p.tdee <= 0) return { error: "TDEE must be positive." };
  const surplus = p.surplus ?? 300;
  return { targetCalories: p.tdee + surplus, kgPerWeekEst: (surplus * 7) / 7700 };
}
