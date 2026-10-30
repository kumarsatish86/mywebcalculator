import { describe, expect, it } from "vitest";
import { medicalMacros, medicalTdee, medicalWaterIntake } from "./medicalNutritionMed";

describe("medicalNutritionMed", () => {
  it("computes TDEE", () => {
    const r = medicalTdee({ bmr: 1600, activity: "moderate" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.tdee).toBeCloseTo(2480, 5);
  });

  it("splits macros", () => {
    const r = medicalMacros({ calories: 2000, proteinPct: 25, carbPct: 50, fatPct: 25 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.proteinG).toBeCloseTo(125, 5);
  });

  it("estimates water", () => {
    const r = medicalWaterIntake({ weightKg: 70 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.mlPerDay).toBe(2450);
  });
});
