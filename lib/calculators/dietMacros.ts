/** Macronutrient diet calculators. */
import { DIET_URL, macroSplit, parseDietSearchParams } from "./dietHelpers";

export { DIET_URL as DIET_MACRO_URL, parseDietSearchParams as parseDietMacroSearchParams };

export function dietMacroSplit(p: {
  calories: number;
  proteinPct: number;
  carbPct: number;
  fatPct: number;
}) {
  return macroSplit(p.calories, p.proteinPct, p.carbPct, p.fatPct);
}

export function dietProteinIntake(p: { weightKg: number; gPerKg: number }) {
  if (p.weightKg <= 0 || p.gPerKg <= 0) return { error: "Weight and g/kg must be positive." };
  return { proteinG: p.weightKg * p.gPerKg };
}

export function dietCarbIntake(p: { calories: number; carbPct: number }) {
  if (p.calories <= 0 || p.carbPct <= 0 || p.carbPct > 100) return { error: "Calories > 0; carb % in (0,100]." };
  return { carbG: (p.calories * (p.carbPct / 100)) / 4 };
}

export function dietFatIntake(p: { calories: number; fatPct: number }) {
  if (p.calories <= 0 || p.fatPct <= 0 || p.fatPct > 100) return { error: "Calories > 0; fat % in (0,100]." };
  return { fatG: (p.calories * (p.fatPct / 100)) / 9 };
}

export function dietKetoMacros(p: { calories: number }) {
  return macroSplit(p.calories, 25, 5, 70);
}

export function dietLowCarb(p: { calories: number }) {
  return macroSplit(p.calories, 30, 20, 50);
}

export function dietHighProtein(p: { calories: number }) {
  return macroSplit(p.calories, 40, 30, 30);
}

export function dietBodybuildingMacros(p: { calories: number }) {
  return macroSplit(p.calories, 35, 40, 25);
}

export function dietLeanBulkMacros(p: { calories: number }) {
  return macroSplit(p.calories, 30, 45, 25);
}

export function dietCuttingMacros(p: { calories: number }) {
  return macroSplit(p.calories, 40, 30, 30);
}
