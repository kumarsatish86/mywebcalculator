import { describe, expect, it } from "vitest";
import { boylesLaw, daltonsLaw, rmsSpeed } from "./chemistryGasLaws";

describe("chemistryGasLaws", () => {
  it("solves Boyle for P2", () => {
    const r = boylesLaw({ p1: 100000, v1: 2, p2: null, v2: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.p2).toBeCloseTo(200000, 0);
  });

  it("sums Dalton partial pressures", () => {
    const r = daltonsLaw({ partialsCsv: "20,30,50" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.totalP).toBe(100);
  });

  it("computes RMS speed", () => {
    const r = rmsSpeed({ tK: 300, molarMassKg: 0.032 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.vRms).toBeGreaterThan(400);
    expect(r.vRms).toBeLessThan(500);
  });
});
