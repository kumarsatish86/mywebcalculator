import { describe, expect, it } from "vitest";
import { compoundStructure, equationBalancerAi, labSolutionPrep } from "./chemistryAiSmart";

describe("chemistryAiSmart", () => {
  it("reduces coefficients", () => {
    const r = equationBalancerAi({ coeffsCsv: "2,4,2" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.coeffs).toEqual([1, 2, 1]);
  });

  it("preps solution mass", () => {
    const r = labSolutionPrep({ molarity: 1, volumeL: 0.5, molarMass: 58.44 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.massG).toBeCloseTo(29.22, 2);
  });

  it("parses H2O atoms", () => {
    const r = compoundStructure({ formula: "H2O" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.atoms.H).toBe(2);
    expect(r.atoms.O).toBe(1);
  });
});
