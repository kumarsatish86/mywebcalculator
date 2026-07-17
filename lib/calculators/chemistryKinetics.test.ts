import { describe, expect, it } from "vitest";
import { arrhenius, halfLifeKinetics, rateConstant } from "./chemistryKinetics";

describe("chemistryKinetics", () => {
  it("computes first-order k", () => {
    const r = rateConstant({ order: 1, a0: Math.E, a: 1, t: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.k).toBeCloseTo(1, 5);
  });

  it("computes first-order half-life", () => {
    const r = halfLifeKinetics({ order: 1, k: Math.LN2 / 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.halfLife).toBeCloseTo(10, 5);
  });

  it("computes Arrhenius k", () => {
    const r = arrhenius({
      mode: "forward",
      aFactor: 1e10,
      eaJ: 50000,
      tK: 300,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.k).toBeGreaterThan(0);
  });
});
