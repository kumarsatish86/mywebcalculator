import { describe, expect, it } from "vitest";
import { inducedEmf, lorentzForce, magneticForceWire } from "./physicsMagnetism";

describe("physicsMagnetism", () => {
  it("computes wire magnetic force", () => {
    const r = magneticForceWire({
      currentA: 5,
      lengthM: 2,
      bTesla: 0.1,
      thetaDeg: 90,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.forceN).toBeCloseTo(1, 5);
  });

  it("computes Lorentz force", () => {
    const r = lorentzForce({
      chargeC: 1.6e-19,
      velocityMs: 1e6,
      bTesla: 0.5,
      thetaDeg: 90,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.forceN).toBeCloseTo(8e-14, 16);
  });

  it("computes motional EMF", () => {
    const r = inducedEmf({
      mode: "motional",
      bTesla: 0.2,
      lengthM: 0.5,
      velocityMs: 4,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.emfV).toBeCloseTo(0.4, 5);
  });
});
