import { describe, expect, it } from "vitest";
import { cropYield, leafAreaIndex, plantGrowthRate } from "./biologyPlants";

describe("biologyPlants", () => {
  it("computes LAI", () => {
    const r = leafAreaIndex({ leafAreaM2: 6, groundAreaM2: 2 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.lai).toBeCloseTo(3, 5);
  });

  it("computes crop yield", () => {
    const r = cropYield({ harvestKg: 5000, areaHa: 2 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.yieldKgHa).toBeCloseTo(2500, 5);
  });

  it("computes relative growth rate", () => {
    const r = plantGrowthRate({ mass1: Math.E, mass2: Math.E ** 2, timeDays: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.rgr).toBeCloseTo(1, 5);
  });
});
