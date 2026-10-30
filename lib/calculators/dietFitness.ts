/** Fitness nutrition calculators. */
import { DIET_URL, macroSplit, parseDietSearchParams } from "./dietHelpers";

export { DIET_URL as DIET_FITNESS_URL, parseDietSearchParams as parseDietFitnessSearchParams };

export function dietPreWorkout(p: { workoutKcal: number }) {
  if (p.workoutKcal < 0) return { error: "Workout kcal cannot be negative." };
  const carbsG = Math.max(20, p.workoutKcal * 0.15);
  return { suggestedCarbsG: carbsG, note: "~15% of session burn as carbs before training (teaching)." };
}

export function dietPostWorkout(p: { weightKg: number }) {
  if (p.weightKg <= 0) return { error: "Weight must be positive." };
  return { proteinG: p.weightKg * 0.3, carbsG: p.weightKg * 0.5, note: "0.3 g/kg protein + 0.5 g/kg carbs teaching." };
}

export function dietMuscleGain(p: { tdee: number }) {
  if (p.tdee <= 0) return { error: "TDEE must be positive." };
  const calories = p.tdee + 300;
  const m = macroSplit(calories, 30, 45, 25);
  if ("error" in m) return m;
  return { calories, ...m };
}

export function dietFatLoss(p: { tdee: number }) {
  if (p.tdee <= 0) return { error: "TDEE must be positive." };
  const calories = Math.max(1200, p.tdee - 500);
  const m = macroSplit(calories, 40, 30, 30);
  if ("error" in m) return m;
  return { calories, ...m };
}

export function dietBulkingCalories(p: { tdee: number; surplus?: number }) {
  if (p.tdee <= 0) return { error: "TDEE must be positive." };
  const surplus = p.surplus ?? 400;
  return { calories: p.tdee + surplus, surplus };
}

export function dietCuttingCalories(p: { tdee: number; deficit?: number }) {
  if (p.tdee <= 0) return { error: "TDEE must be positive." };
  const deficit = p.deficit ?? 500;
  return { calories: Math.max(1200, p.tdee - deficit), deficit };
}
