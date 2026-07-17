import { describe, expect, it } from "vitest";
import { centripetalForce, forceFma, netForce } from "./physicsDynamics";

describe("physicsDynamics", () => {
  it("computes F = ma", () => {
    const r = forceFma({ m: 2, a: 3 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.f).toBeCloseTo(6, 5);
  });

  it("sums net force", () => {
    const r = netForce({ forcesCsv: "10,-3,2" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.net).toBe(9);
  });

  it("computes centripetal force", () => {
    const r = centripetalForce({ m: 2, v: 4, r: 2 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.f).toBeCloseTo(16, 5);
  });
});
