import { describe, expect, it } from "vitest";
import { magnificationOptics, mirrorOrLensFormula, snellsLaw } from "./physicsOptics";

describe("physicsOptics", () => {
  it("solves Snell for θ2", () => {
    const r = snellsLaw({ n1: 1, theta1Deg: 30, n2: 1.5, theta2Deg: null });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.theta2Deg).toBeCloseTo(19.47, 1);
  });

  it("solves lens formula for v", () => {
    const r = mirrorOrLensFormula({ f: 0.1, u: -0.2, v: null });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    // 1/v = 1/f − 1/u = 10 − (−5) = 15 → v = 1/15
    expect(r.v).toBeCloseTo(1 / 15, 5);
  });

  it("computes magnification from u,v", () => {
    const r = magnificationOptics({ mode: "fromUV", u: -0.2, v: 0.2 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.m).toBeCloseTo(1, 5);
  });
});
