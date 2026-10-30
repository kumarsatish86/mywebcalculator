import { describe, expect, it } from "vitest";
import { dietDailyCalorieNeeds, dietCalorieDeficit } from "./dietCalorieEnergy";
import { dietKetoMacros, dietMacroSplit } from "./dietMacros";
import { dietIdealWeight, dietWeeklyWeightLoss } from "./dietWeightMgmt";
import { dietDailyWater, dietDehydrationRisk } from "./dietHydration";
import { dietIntermittentFasting, dietMealPlanCalories } from "./dietMealPlanning";
import { dietIf168, dietOmad } from "./dietTrends";
import { dietIronIntake } from "./dietMicros";
import { dietBulkingCalories, dietPostWorkout } from "./dietFitness";
import { dietDiabetes, dietLowSugar } from "./dietCondition";
import { dietChildNutrition, dietPregnancyNutrition } from "./dietAgeGender";
import { dietCaloriesInFood, dietRecipeNutrition } from "./dietFoodBased";
import { dietAiDietPlan, dietSmartCalorieTracker } from "./dietAiAdvanced";

describe("diet families smoke", () => {
  it("calorie TDEE", () => {
    const r = dietDailyCalorieNeeds({
      weightKg: 70,
      heightCm: 175,
      age: 30,
      sex: "male",
      activity: "moderate",
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.tdee).toBeGreaterThan(2000);
  });

  it("macros keto", () => {
    const r = dietKetoMacros({ calories: 2000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.fatG).toBeGreaterThan(r.carbG);
  });

  it("ideal weight", () => {
    const r = dietIdealWeight({ heightCm: 175, sex: "male" });
    expect("error" in r).toBe(false);
  });

  it("water + deficit", () => {
    expect(dietDailyWater({ weightKg: 70 })).toMatchObject({ mlPerDay: 2450 });
    expect(dietCalorieDeficit({ tdee: 2500, intake: 2000 })).toMatchObject({ deficit: 500 });
  });

  it("meal + IF", () => {
    expect(dietMealPlanCalories({ dailyCalories: 2100, meals: 3 })).toMatchObject({ perMeal: 700 });
    expect(dietIntermittentFasting({ fastingHours: 16 })).toMatchObject({ eatingWindowHours: 8 });
  });

  it("trends + micros + fitness", () => {
    expect(dietIf168({})).toMatchObject({ fastingHours: 16 });
    expect(dietOmad({ calories: 2000 })).toMatchObject({ caloriesInOneMeal: 2000 });
    const iron = dietIronIntake({ intakeMg: 9, sex: "male" });
    expect("error" in iron).toBe(false);
    expect(dietPostWorkout({ weightKg: 80 })).toMatchObject({ proteinG: 24 });
    expect(dietBulkingCalories({ tdee: 2500 })).toMatchObject({ calories: 2900 });
  });

  it("condition + age + food + ai", () => {
    expect("error" in dietDiabetes({ calories: 2000 })).toBe(false);
    expect(dietLowSugar({ dailySugarG: 20 })).toMatchObject({ withinLimit: true });
    expect(dietChildNutrition({ weightKg: 25, ageYears: 8 })).toMatchObject({ calories: 1800 });
    expect("error" in dietPregnancyNutrition({
      weightKg: 60,
      heightCm: 165,
      age: 30,
      activity: "light",
      trimester: 2,
    })).toBe(false);
    expect(dietCaloriesInFood({ grams: 100, kcalPer100g: 250 })).toMatchObject({ kcal: 250 });
    expect(dietRecipeNutrition({
      totalKcal: 800,
      proteinG: 40,
      carbG: 80,
      fatG: 30,
      servings: 4,
    })).toMatchObject({ perServingKcal: 200 });
    expect("error" in dietAiDietPlan({ calories: 2000, style: "veg" })).toBe(false);
    expect(dietSmartCalorieTracker({ target: 2000, loggedCsv: "500,600" })).toMatchObject({
      logged: 1100,
      remaining: 900,
    });
    expect("error" in dietMacroSplit({ calories: 2000, proteinPct: 30, carbPct: 40, fatPct: 30 })).toBe(
      false,
    );
    const wl = dietWeeklyWeightLoss({ dailyDeficit: 500 });
    expect("error" in wl).toBe(false);
    if ("error" in wl) return;
    expect(wl.kgPerWeek).toBeCloseTo(0.454, 2);
    expect(dietDehydrationRisk({ intakeMl: 2000, needMl: 2500 })).toMatchObject({
      percentOfNeed: 80,
    });
  });
});
