import { describe, expect, it } from "vitest";
import { boylesLaw, carnotEfficiency, heatEnergy } from "./physicsThermoHeat";

describe("physicsThermoHeat", () => {
  it("computes Q = mcΔT", () => {
    const r = heatEnergy({ massKg: 2, c: 4186, deltaT: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.qJ).toBeCloseTo(83720, 0);
  });

  it("solves Boyle’s law for P2", () => {
    const r = boylesLaw({ p1: 100000, v1: 2, p2: null, v2: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.p2).toBeCloseTo(200000, 0);
  });

  it("computes Carnot efficiency", () => {
    const r = carnotEfficiency({ thK: 600, tcK: 300 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.percent).toBeCloseTo(50, 5);
  });
});
