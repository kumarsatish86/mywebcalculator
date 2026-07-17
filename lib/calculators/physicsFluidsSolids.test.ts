import { describe, expect, it } from "vitest";
import { density, flowRate, hydrostaticPressure } from "./physicsFluidsSolids";

describe("physicsFluidsSolids", () => {
  it("computes density", () => {
    const r = density({ massKg: 1000, volumeM3: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.density).toBeCloseTo(1000, 5);
  });

  it("computes hydrostatic pressure", () => {
    const r = hydrostaticPressure({ densityKgM3: 1000, depthM: 10, g: 9.8 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.pressurePa).toBeCloseTo(98000, 0);
  });

  it("computes volumetric flow rate", () => {
    const r = flowRate({ areaM2: 0.01, velocityMs: 2 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.qM3s).toBeCloseTo(0.02, 5);
  });
});
