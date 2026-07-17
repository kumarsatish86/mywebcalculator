import { describe, expect, it } from "vitest";
import { capacitanceAdvanced, electricField, gaussLaw } from "./physicsAdvanced";

describe("physicsAdvanced", () => {
  it("computes point-charge field", () => {
    const r = electricField({ mode: "point", qC: 1e-9, rM: 0.1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.eNic).toBeCloseTo(899, 0);
  });

  it("computes Gauss flux", () => {
    const r = gaussLaw({ mode: "flux", qEncC: 1e-9 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.flux).toBeCloseTo(112.9, 0);
  });

  it("computes C = Q/V", () => {
    const r = capacitanceAdvanced({ mode: "qv", qC: 1e-6, vVolt: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.cFarad).toBeCloseTo(1e-7, 12);
  });
});
