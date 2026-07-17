import { describe, expect, it } from "vitest";
import { efficiency, kineticEnergy, work } from "./physicsWorkEnergyPower";

describe("physicsWorkEnergyPower", () => {
  it("computes work with angle", () => {
    const r = work({ force: 10, distance: 5, angleDeg: 0 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.workJ).toBeCloseTo(50, 5);
  });

  it("computes kinetic energy", () => {
    const r = kineticEnergy({ mass: 2, velocity: 3 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.keJ).toBeCloseTo(9, 5);
  });

  it("computes efficiency percent", () => {
    const r = efficiency({ useful: 40, total: 50 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.percent).toBeCloseTo(80, 5);
  });
});
