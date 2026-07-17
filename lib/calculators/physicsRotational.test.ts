import { describe, expect, it } from "vitest";
import { momentOfInertia, rotationalKe, torque } from "./physicsRotational";

describe("physicsRotational", () => {
  it("computes torque at 90°", () => {
    const r = torque({ r: 0.5, force: 20, angleDeg: 90 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.torqueNm).toBeCloseTo(10, 5);
  });

  it("computes I = mr²", () => {
    const r = momentOfInertia({ mode: "mr2", mass: 2, radius: 3 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.inertia).toBeCloseTo(18, 5);
  });

  it("computes rotational KE", () => {
    const r = rotationalKe({ inertia: 2, omega: 4 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.keJ).toBeCloseTo(16, 5);
  });
});
