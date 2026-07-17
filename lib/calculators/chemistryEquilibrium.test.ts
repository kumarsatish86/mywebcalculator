import { describe, expect, it } from "vitest";
import { equilibriumConstant, iceTable, reactionQuotient, solubilityProduct } from "./chemistryEquilibrium";

describe("chemistryEquilibrium", () => {
  it("computes Kc", () => {
    const r = equilibriumConstant({ products: 0.04, reactants: 0.01 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.kc).toBeCloseTo(4, 5);
  });

  it("compares Q to K", () => {
    const r = reactionQuotient({ products: 1, reactants: 1, k: 4 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.direction).toMatch(/forward/i);
  });

  it("solves ICE for A ⇌ B+C", () => {
    const r = iceTable({ k: 1e-4, c0: 0.1, mode: "ab" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.x).toBeGreaterThan(0);
    expect(r.x).toBeLessThan(0.1);
  });

  it("computes Ksp from s for AB", () => {
    const r = solubilityProduct({ mode: "fromS", type: "ab", s: 0.01 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.ksp).toBeCloseTo(1e-4, 8);
  });
});
