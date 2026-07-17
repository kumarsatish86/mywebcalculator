import { describe, expect, it } from "vitest";
import { bufferSolution, michaelisMenten, phFromH } from "./biologyBiochemistry";

describe("biologyBiochemistry", () => {
  it("computes pH from [H+]", () => {
    const r = phFromH({ hMolar: 1e-7 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.ph).toBeCloseTo(7, 5);
  });

  it("applies Henderson–Hasselbalch", () => {
    const r = bufferSolution({ pKa: 4.76, saltConc: 0.1, acidConc: 0.1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.ph).toBeCloseTo(4.76, 5);
  });

  it("computes Michaelis–Menten velocity", () => {
    const r = michaelisMenten({ vmax: 100, km: 10, s: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.v).toBeCloseTo(50, 5);
  });
});
