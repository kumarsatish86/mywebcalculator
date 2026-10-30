/** Condition-oriented diet teaching calculators. */
import { DIET_URL, macroSplit, parseDietSearchParams } from "./dietHelpers";

export { DIET_URL as DIET_CONDITION_URL, parseDietSearchParams as parseDietConditionSearchParams };

export function dietDiabetes(p: { calories: number }) {
  const m = macroSplit(p.calories, 20, 45, 35);
  if ("error" in m) return m;
  return { ...m, carbNote: "Spread carbs evenly; pair with clinician guidance." };
}

export function dietLowSugar(p: { dailySugarG: number; limitG?: number }) {
  if (p.dailySugarG < 0) return { error: "Sugar cannot be negative." };
  const limit = p.limitG ?? 25;
  return { intakeG: p.dailySugarG, limitG: limit, withinLimit: p.dailySugarG <= limit };
}

export function dietCholesterol(p: { calories: number }) {
  const m = macroSplit(p.calories, 20, 50, 30);
  if ("error" in m) return m;
  return { ...m, satFatCapPct: 7, note: "Teaching pattern emphasizing fiber and unsaturated fats." };
}

export function dietBloodPressure(p: { calories: number }) {
  const m = macroSplit(p.calories, 18, 55, 27);
  if ("error" in m) return m;
  return { ...m, sodiumCapMg: 1500, pattern: "DASH-leaning teaching targets" };
}

export function dietThyroid(p: { calories: number }) {
  const m = macroSplit(p.calories, 25, 45, 30);
  if ("error" in m) return m;
  return { ...m, note: "Adequate iodine/selenium foods are clinical topics — not dosed here." };
}

export function dietPcos(p: { calories: number }) {
  const m = macroSplit(p.calories, 25, 40, 35);
  if ("error" in m) return m;
  return { ...m, note: "Lower-GI carb emphasis is a common teaching frame — individualize clinically." };
}
