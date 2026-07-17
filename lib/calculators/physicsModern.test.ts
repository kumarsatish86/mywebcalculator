import { describe, expect, it } from "vitest";
import { halfLife, photonEnergy, radioactiveDecay } from "./physicsModern";

describe("physicsModern", () => {
  it("computes photon energy from wavelength", () => {
    const r = photonEnergy({ mode: "fromWavelength", wavelengthM: 500e-9 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.energyEv).toBeGreaterThan(2);
    expect(r.energyEv).toBeLessThan(3);
  });

  it("decays with half-life", () => {
    const r = radioactiveDecay({ n0: 1000, halfLife: 10, t: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.n).toBeCloseTo(500, 5);
  });

  it("finds half-life from lambda", () => {
    const r = halfLife({ mode: "fromLambda", lambda: Math.LN2 / 5 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.halfLife).toBeCloseTo(5, 5);
  });
});
