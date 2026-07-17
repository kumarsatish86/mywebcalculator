import { describe, expect, it } from "vitest";
import { cellPotential, faradaysLaw, nernstEquation } from "./chemistryElectrochemistry";

describe("chemistryElectrochemistry", () => {
  it("computes cell potential", () => {
    const r = cellPotential({ eCathode: 0.8, eAnode: -0.76 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.eCell).toBeCloseTo(1.56, 5);
  });

  it("applies Nernst at Q=1", () => {
    const r = nernstEquation({ e0: 1.1, n: 2, q: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.e).toBeCloseTo(1.1, 5);
  });

  it("computes Faraday moles", () => {
    const r = faradaysLaw({ currentA: 965, timeS: 100, n: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.moles).toBeCloseTo(1, 2);
  });
});
