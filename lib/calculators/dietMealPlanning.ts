/** Meal planning diet calculators. */
import { DIET_URL, parseDietSearchParams } from "./dietHelpers";

export { DIET_URL as DIET_MEAL_URL, parseDietSearchParams as parseDietMealSearchParams };

export function dietMealPlanCalories(p: { dailyCalories: number; meals: number }) {
  if (p.dailyCalories <= 0 || p.meals <= 0) return { error: "Calories and meals must be positive." };
  return { perMeal: p.dailyCalories / p.meals };
}

export function dietDailyMealPlanner(p: { dailyCalories: number; meals: number }) {
  const r = dietMealPlanCalories(p);
  if ("error" in r) return r;
  return { perMeal: r.perMeal, breakfast: r.perMeal * 0.3, lunch: r.perMeal * 0.35, dinner: r.perMeal * 0.35 };
}

export function dietPortionSize(p: { foodGrams: number; servings: number }) {
  if (p.foodGrams <= 0 || p.servings <= 0) return { error: "Grams and servings must be positive." };
  return { gramsPerServing: p.foodGrams / p.servings };
}

export function dietMealFrequency(p: { dailyCalories: number; preferredMeals: number }) {
  return dietMealPlanCalories({ dailyCalories: p.dailyCalories, meals: p.preferredMeals });
}

export function dietIntermittentFasting(p: { fastingHours: number }) {
  if (p.fastingHours < 0 || p.fastingHours >= 24) return { error: "Fasting hours must be 0–23." };
  return { eatingWindowHours: 24 - p.fastingHours, fastingHours: p.fastingHours };
}

export function dietEatingWindow(p: { startHour: number; endHour: number }) {
  if (p.startHour < 0 || p.startHour > 23 || p.endHour < 0 || p.endHour > 23) {
    return { error: "Hours must be 0–23." };
  }
  let hours = p.endHour - p.startHour;
  if (hours <= 0) hours += 24;
  return { windowHours: hours, fastingHours: 24 - hours };
}

export function dietCheatMealImpact(p: { dailyTarget: number; cheatKcal: number }) {
  if (p.dailyTarget <= 0 || p.cheatKcal < 0) return { error: "Target > 0; cheat ≥ 0." };
  const over = p.cheatKcal - p.dailyTarget;
  return { overBy: over, weeklyAvgIfOnce: over / 7 };
}
