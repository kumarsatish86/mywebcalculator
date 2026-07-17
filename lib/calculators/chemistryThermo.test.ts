import { describe, expect, it } from "vitest";
import { gibbsFreeEnergy, heatEnergyChem, hessLaw } from "./chemistryThermo";

describe("chemistryThermo", () => {
  it("computes q = mcΔT", () => {
    const r = heatEnergyChem({ mass: 100, c: 4.18, deltaT: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.q).toBeCloseTo(4180, 0);
  });

  it("computes ΔG", () => {
    const r = gibbsFreeEnergy({ deltaH: 100, tK: 298, deltaS: 0.2 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.deltaG).toBeCloseTo(100 - 298 * 0.2, 5);
  });

  it("sums Hess steps", () => {
    const r = hessLaw({ stepsCsv: "-100,50,-25" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.deltaH).toBe(-75);
  });
});
