import { describe, expect, it } from "vitest";
import { massDefect, radioactiveDecayChem } from "./chemistryNuclear";

describe("chemistryNuclear", () => {
  it("decays with half-life", () => {
    const r = radioactiveDecayChem({ n0: 1000, halfLife: 5, t: 5 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.n).toBeCloseTo(500, 5);
  });

  it("computes mass defect for He-ish inputs", () => {
    const r = massDefect({
      massNumber: 4,
      atomicNumber: 2,
      atomicMassU: 4.0026,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.defectU).toBeGreaterThan(0);
    expect(r.bindingMev).toBeGreaterThan(20);
  });
});
