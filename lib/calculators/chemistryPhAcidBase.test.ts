import { describe, expect, it } from "vitest";
import {
  acidBaseDissociation,
  hendersonHasselbalch,
  phFromConcentration,
  pKa,
} from "./chemistryPhAcidBase";

describe("chemistryPhAcidBase", () => {
  it("computes pH from [H+]", () => {
    const r = phFromConcentration({ hPlus: 1e-3, pOh: null });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.ph).toBeCloseTo(3, 5);
  });

  it("converts Ka to pKa", () => {
    const r = pKa({ ka: 1e-5, pka: null });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.pka).toBeCloseTo(5, 5);
  });

  it("applies Henderson–Hasselbalch", () => {
    const r = hendersonHasselbalch({ pka: 4.76, salt: 0.1, acid: 0.1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.ph).toBeCloseTo(4.76, 5);
  });

  it("approximates weak-acid dissociation", () => {
    const r = acidBaseDissociation({ ka: 1e-5, c0: 0.1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.hPlus).toBeCloseTo(Math.sqrt(1e-6), 6);
  });
});
