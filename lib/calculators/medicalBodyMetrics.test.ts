import { describe, expect, it } from "vitest";
import { medicalBmi, medicalBsa, medicalBmr } from "./medicalBodyMetrics";

describe("medicalBodyMetrics", () => {
  it("computes BMI", () => {
    const r = medicalBmi({ weightKg: 70, heightCm: 175 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.bmi).toBeCloseTo(22.86, 1);
  });

  it("computes BMR", () => {
    const r = medicalBmr({ weightKg: 70, heightCm: 175, age: 30, sex: "male" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.bmr).toBeCloseTo(1648.75, 1);
  });

  it("computes Mosteller BSA", () => {
    const r = medicalBsa({ weightKg: 70, heightCm: 170 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.bsaM2).toBeCloseTo(Math.sqrt((170 * 70) / 3600), 5);
  });
});
