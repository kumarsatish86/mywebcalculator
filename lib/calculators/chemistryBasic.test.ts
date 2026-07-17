import { describe, expect, it } from "vitest";
import { empiricalFormula, moleToParticle, molarMass } from "./chemistryBasic";

describe("chemistryBasic", () => {
  it("sums molar mass from atoms", () => {
    const r = molarMass({ atomicMassesCsv: "1,16", countsCsv: "2,1" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.molarMass).toBeCloseTo(18, 5);
  });

  it("converts moles to particles", () => {
    const r = moleToParticle({ moles: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.particles).toBeCloseTo(6.02214076e23, 5);
  });

  it("simplifies empirical ratios", () => {
    const r = empiricalFormula({ molesCsv: "2,4,2" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.ratios).toEqual([1, 2, 1]);
  });
});
