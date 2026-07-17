import { describe, expect, it } from "vitest";
import { calorieDeficitSurplus, macronutrientSplit, waterIntake } from "./biologyNutrition";

describe("biologyNutrition", () => {
  it("splits macros", () => {
    const r = macronutrientSplit({
      calories: 2000,
      proteinPct: 30,
      carbPct: 40,
      fatPct: 30,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.proteinG).toBeCloseTo(150, 5);
  });

  it("estimates water intake", () => {
    const r = waterIntake({ weightKg: 70 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.ml).toBeCloseTo(2450, 5);
  });

  it("flags calorie deficit", () => {
    const r = calorieDeficitSurplus({ tdee: 2500, intake: 2000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.kind).toBe("deficit");
  });
});
