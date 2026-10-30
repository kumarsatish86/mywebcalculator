/** Food-based calorie teaching calculators. */
import { DIET_URL, parseDietSearchParams } from "./dietHelpers";

export { DIET_URL as DIET_FOOD_URL, parseDietSearchParams as parseDietFoodSearchParams };

/** kcal = (grams / 100) × kcalPer100g */
export function dietCaloriesInFood(p: { grams: number; kcalPer100g: number }) {
  if (p.grams < 0 || p.kcalPer100g < 0) return { error: "Values cannot be negative." };
  return { kcal: (p.grams / 100) * p.kcalPer100g };
}

export function dietFastFoodCalories(p: { itemsCsv: string }) {
  const vals = p.itemsCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 0);
  if (!vals.length) return { error: "Enter item calories as CSV numbers." };
  return { totalKcal: vals.reduce((a, b) => a + b, 0), items: vals.length };
}

export function dietRestaurantMeal(p: { entreeKcal: number; sideKcal: number; drinkKcal: number }) {
  if (p.entreeKcal < 0 || p.sideKcal < 0 || p.drinkKcal < 0) return { error: "kcal cannot be negative." };
  return { totalKcal: p.entreeKcal + p.sideKcal + p.drinkKcal };
}

export function dietRecipeNutrition(p: {
  totalKcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  servings: number;
}) {
  if (p.servings <= 0) return { error: "Servings must be positive." };
  if (p.totalKcal < 0 || p.proteinG < 0 || p.carbG < 0 || p.fatG < 0) return { error: "Values cannot be negative." };
  return {
    perServingKcal: p.totalKcal / p.servings,
    perServingProteinG: p.proteinG / p.servings,
    perServingCarbG: p.carbG / p.servings,
    perServingFatG: p.fatG / p.servings,
  };
}

export function dietIngredientNutrition(p: { grams: number; kcalPer100g: number; proteinPer100g: number }) {
  if (p.grams < 0 || p.kcalPer100g < 0 || p.proteinPer100g < 0) return { error: "Values cannot be negative." };
  const f = p.grams / 100;
  return { kcal: f * p.kcalPer100g, proteinG: f * p.proteinPer100g };
}
