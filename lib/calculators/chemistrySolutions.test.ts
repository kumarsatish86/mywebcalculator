import { describe, expect, it } from "vitest";
import { dilution, molarity, solutionMixing } from "./chemistrySolutions";

describe("chemistrySolutions", () => {
  it("computes molarity", () => {
    const r = molarity({ moles: 0.5, liters: 0.25 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.M).toBeCloseTo(2, 5);
  });

  it("solves dilution for M2", () => {
    const r = dilution({ m1: 2, v1: 0.1, m2: null, v2: 0.5 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.m2).toBeCloseTo(0.4, 5);
  });

  it("mixes two solutions", () => {
    const r = solutionMixing({ c1: 1, v1: 1, c2: 3, v2: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.cFinal).toBeCloseTo(2, 5);
  });
});
