/** Hydration diet calculators. */
import { DIET_URL, parseDietSearchParams } from "./dietHelpers";

export { DIET_URL as DIET_HYDRATION_URL, parseDietSearchParams as parseDietHydrationSearchParams };

export function dietDailyWater(p: { weightKg: number; mlPerKg?: number }) {
  if (p.weightKg <= 0) return { error: "Weight must be positive." };
  const mlPerKg = p.mlPerKg ?? 35;
  return { mlPerDay: p.weightKg * mlPerKg, liters: (p.weightKg * mlPerKg) / 1000 };
}

export function dietWaterByWeight(p: { weightKg: number }) {
  return dietDailyWater({ weightKg: p.weightKg, mlPerKg: 33 });
}

export function dietHydrationClimate(p: { weightKg: number; climate: string }) {
  if (p.weightKg <= 0) return { error: "Weight must be positive." };
  const c = p.climate.trim().toLowerCase();
  let bonus = 0;
  if (c.includes("hot") || c.includes("humid")) bonus = 500;
  else if (c.includes("cold")) bonus = -200;
  else if (!c.includes("temperate") && !c.includes("mild") && c !== "") {
    return { error: "Climate: temperate, hot, humid, or cold." };
  }
  const base = p.weightKg * 35;
  return { mlPerDay: Math.max(1500, base + bonus), note: "Climate adjustment is a teaching heuristic." };
}

export function dietExerciseHydration(p: { baseMl: number; exerciseMin: number; mlPerMin?: number }) {
  if (p.baseMl < 0 || p.exerciseMin < 0) return { error: "Values cannot be negative." };
  const add = p.exerciseMin * (p.mlPerMin ?? 7);
  return { mlPerDay: p.baseMl + add, exerciseMl: add };
}

export function dietDehydrationRisk(p: { intakeMl: number; needMl: number }) {
  if (p.needMl <= 0 || p.intakeMl < 0) return { error: "Need > 0; intake ≥ 0." };
  const pct = (p.intakeMl / p.needMl) * 100;
  const band = pct >= 90 ? "Low risk band" : pct >= 70 ? "Moderate risk band" : "Higher risk band (teaching)";
  return { percentOfNeed: pct, band };
}
