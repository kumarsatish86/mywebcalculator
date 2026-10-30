/** Rule-based “AI” nutrition planners — not a live model. */
import { DIET_URL, macroSplit, parseDietSearchParams } from "./dietHelpers";

export { DIET_URL as DIET_AI_URL, parseDietSearchParams as parseDietAiSearchParams };

export function dietAiDietPlan(p: { calories: number; style: string }) {
  if (p.calories < 1000 || p.calories > 5000) return { error: "Calories 1000–5000 for this template." };
  const style = p.style.trim().toLowerCase();
  const veg = style.includes("veg") && !style.includes("non");
  const m = macroSplit(p.calories, 25, 45, 30);
  if ("error" in m) return m;
  const plan = veg
    ? `Plant-forward day ~${Math.round(p.calories)} kcal: oats; legumes+grain; tofu stir-fry. Rule-based — not live AI.`
    : `Mixed day ~${Math.round(p.calories)} kcal: eggs/yogurt; grain+protein lunch; fish/chicken or legumes dinner. Not live AI.`;
  return { plan, ...m };
}

export function dietSmartCalorieTracker(p: { target: number; loggedCsv: string }) {
  if (p.target <= 0) return { error: "Target must be positive." };
  const vals = p.loggedCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 0);
  const logged = vals.reduce((a, b) => a + b, 0);
  return { logged, remaining: p.target - logged, mealsLogged: vals.length };
}

export function dietPersonalizedMealPlan(p: { calories: number; meals: number; style: string }) {
  if (p.calories <= 0 || p.meals <= 0) return { error: "Calories and meals must be positive." };
  const per = p.calories / p.meals;
  return {
    perMealKcal: per,
    outline: `${p.meals} meals × ~${Math.round(per)} kcal (${p.style || "balanced"} template). Not live AI.`,
  };
}

export function dietGoalBasedNutrition(p: { tdee: number; goal: string }) {
  if (p.tdee <= 0) return { error: "TDEE must be positive." };
  const g = p.goal.trim().toLowerCase();
  let calories = p.tdee;
  if (g.includes("loss") || g.includes("cut")) calories = Math.max(1200, p.tdee - 500);
  else if (g.includes("gain") || g.includes("bulk")) calories = p.tdee + 300;
  const m = macroSplit(calories, 30, 40, 30);
  if ("error" in m) return m;
  return { calories, goal: g || "maintain", ...m };
}

export function dietAiMacroAdjuster(p: {
  calories: number;
  proteinPct: number;
  carbPct: number;
  fatPct: number;
  bias: string;
}) {
  let { proteinPct, carbPct, fatPct } = p;
  const b = p.bias.trim().toLowerCase();
  if (b.includes("protein")) {
    proteinPct += 5;
    carbPct -= 5;
  } else if (b.includes("carb")) {
    carbPct += 5;
    fatPct -= 5;
  } else if (b.includes("fat")) {
    fatPct += 5;
    carbPct -= 5;
  }
  const m = macroSplit(p.calories, proteinPct, carbPct, fatPct);
  if ("error" in m) return m;
  return { proteinPct, carbPct, fatPct, ...m, note: "Rule-based adjuster — not a live AI model." };
}
