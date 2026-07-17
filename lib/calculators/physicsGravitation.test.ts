import { describe, expect, it } from "vitest";
import {
  escapeVelocity,
  gravitationalForce,
  gravitationalPe,
} from "./physicsGravitation";

describe("physicsGravitation", () => {
  it("computes gravitational force", () => {
    const r = gravitationalForce({ m1: 5.972e24, m2: 1, r: 6.371e6 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.forceN).toBeGreaterThan(9);
    expect(r.forceN).toBeLessThan(10);
  });

  it("computes escape velocity for Earth-scale body", () => {
    const r = escapeVelocity({ massCentral: 5.972e24, radius: 6.371e6 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.vEsc).toBeGreaterThan(11000);
    expect(r.vEsc).toBeLessThan(11300);
  });

  it("computes near-surface PE", () => {
    const r = gravitationalPe({ mode: "surface", mass: 2, height: 5, g: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.peJ).toBeCloseTo(100, 5);
  });
});
