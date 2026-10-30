/** Diet-trend pattern calculators. */
import { DIET_URL, macroSplit, parseDietSearchParams } from "./dietHelpers";

export { DIET_URL as DIET_TRENDS_URL, parseDietSearchParams as parseDietTrendsSearchParams };

export function dietKetoDiet(p: { calories: number }) {
  const m = macroSplit(p.calories, 20, 5, 75);
  if ("error" in m) return m;
  return { ...m, pattern: "Keto-style teaching split (~75% fat)" };
}

export function dietPaleoDiet(p: { calories: number }) {
  const m = macroSplit(p.calories, 30, 30, 40);
  if ("error" in m) return m;
  return { ...m, pattern: "Paleo-style teaching split" };
}

export function dietVeganPlanner(p: { calories: number }) {
  const m = macroSplit(p.calories, 20, 55, 25);
  if ("error" in m) return m;
  return { ...m, proteinNote: "Emphasize legumes, tofu, seitan for protein." };
}

export function dietMediterranean(p: { calories: number }) {
  const m = macroSplit(p.calories, 20, 50, 30);
  if ("error" in m) return m;
  return { ...m, pattern: "Mediterranean-style teaching split" };
}

export function dietLowFat(p: { calories: number }) {
  return macroSplit(p.calories, 25, 60, 15);
}

export function dietDash(p: { calories: number }) {
  const m = macroSplit(p.calories, 18, 55, 27);
  if ("error" in m) return m;
  return { ...m, sodiumCapMg: 2300, pattern: "DASH-style teaching macros + sodium awareness" };
}

export function dietIf168(p: { wakeHour?: number }) {
  const wake = p.wakeHour ?? 8;
  if (wake < 0 || wake > 23) return { error: "Wake hour 0–23." };
  const eatStart = wake;
  const eatEnd = (wake + 8) % 24;
  return { fastingHours: 16, eatingHours: 8, suggestedEatStart: eatStart, suggestedEatEnd: eatEnd };
}

export function dietOmad(p: { mealHour?: number; calories: number }) {
  if (p.calories <= 0) return { error: "Calories must be positive." };
  const hour = p.mealHour ?? 18;
  if (hour < 0 || hour > 23) return { error: "Meal hour 0–23." };
  return { mealHour: hour, caloriesInOneMeal: p.calories, fastingHours: 23 };
}
