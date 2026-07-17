import { describe, expect, it } from "vitest";
import { cfu, doublingTime, opticalDensity } from "./biologyMicrobiology";

describe("biologyMicrobiology", () => {
  it("computes doubling time", () => {
    const r = doublingTime({ mu: Math.LN2 / 20 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.td).toBeCloseTo(20, 5);
  });

  it("computes OD", () => {
    const r = opticalDensity({ i0: 100, i: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.od).toBeCloseTo(1, 5);
  });

  it("computes CFU/mL", () => {
    const r = cfu({ colonies: 50, dilutionFactor: 1000, volumeMl: 0.1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.cfuPerMl).toBeCloseTo(500000, 5);
  });
});
