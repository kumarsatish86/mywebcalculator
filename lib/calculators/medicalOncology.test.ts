import { describe, expect, it } from "vitest";
import { chemotherapyDosage, tumorGrowth } from "./medicalOncology";

describe("medicalOncology", () => {
  it("doubles tumor volume", () => {
    const r = tumorGrowth({ v0: 1, doublingDays: 10, tDays: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.volume).toBeCloseTo(2, 5);
  });

  it("computes BSA dose", () => {
    const r = chemotherapyDosage({ mgPerM2: 100, weightKg: 70, heightCm: 170 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.bsa).toBeCloseTo(Math.sqrt((170 * 70) / 3600), 5);
  });
});
