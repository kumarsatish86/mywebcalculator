import { describe, expect, it } from "vitest";
import { freeFall, projectileRange, speed } from "./physicsKinematics";

describe("physicsKinematics", () => {
  it("computes speed", () => {
    const r = speed({ distance: 100, time: 20 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.speed).toBeCloseTo(5, 5);
  });

  it("computes free-fall distance", () => {
    const r = freeFall({ t: 2, g: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.distance).toBeCloseTo(20, 5);
  });

  it("computes projectile range at 45°", () => {
    const r = projectileRange({ u: 20, angleDeg: 45, g: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.range).toBeCloseTo(40, 5);
  });
});
