import { describe, expect, it } from "vitest";
import { gcContent, primerMeltingTemperature, proteinMolecularWeight } from "./biologyMolecular";

describe("biologyMolecular", () => {
  it("computes GC%", () => {
    const r = gcContent({ sequence: "ATGC" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.gcPct).toBeCloseTo(50, 5);
  });

  it("uses Wallace Tm", () => {
    const r = primerMeltingTemperature({ sequence: "ATGCATGC" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.tmC).toBe(2 * 4 + 4 * 4);
  });

  it("computes protein MW for G", () => {
    const r = proteinMolecularWeight({ sequence: "G" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.mwDa).toBeCloseTo(75.07, 1);
  });
});
