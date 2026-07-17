import { describe, expect, it } from "vitest";
import { absorbance, concentrationFromAbsorbance, titration } from "./chemistryAnalytical";

describe("chemistryAnalytical", () => {
  it("solves titration for M2", () => {
    const r = titration({ m1: 0.1, v1: 25, m2: null, v2: 20 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.m2).toBeCloseTo(0.125, 5);
  });

  it("computes absorbance", () => {
    const r = absorbance({ i0: 100, i: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.a).toBeCloseTo(1, 5);
  });

  it("solves concentration from A", () => {
    const r = concentrationFromAbsorbance({ a: 0.5, epsilon: 1000, path: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.c).toBeCloseTo(0.0005, 6);
  });
});
