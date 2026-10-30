import { describe, expect, it } from "vitest";
import { alcoholConsumption, smokingImpact } from "./medicalLifestyle";

describe("medicalLifestyle", () => {
  it("computes pack-years", () => {
    const r = smokingImpact({ cigPerDay: 20, years: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.packYears).toBeCloseTo(10, 5);
  });

  it("computes weekly alcohol units", () => {
    const r = alcoholConsumption({ volumeMl: 175, abvPct: 12, drinksPerWeek: 7 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.unitsPerDrink).toBeCloseTo(2.1, 5);
  });
});
