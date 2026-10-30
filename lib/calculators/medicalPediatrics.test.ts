import { describe, expect, it } from "vitest";
import { childBmi, pediatricDosage, babyWeightGain } from "./medicalPediatrics";

describe("medicalPediatrics", () => {
  it("child BMI", () => {
    const r = childBmi({ weightKg: 20, heightCm: 110 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.bmi).toBeCloseTo(16.53, 1);
  });

  it("pediatric dose", () => {
    const r = pediatricDosage({ weightKg: 20, mgPerKg: 15, dosesPerDay: 3 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.doseMg).toBe(300);
    expect(r.dailyMg).toBe(900);
  });

  it("weight gain rate", () => {
    const r = babyWeightGain({ birthKg: 3, currentKg: 4, ageDays: 30 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.gPerDay).toBeCloseTo(33.33, 1);
  });
});
