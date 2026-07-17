import { describe, expect, it } from "vitest";
import { hardyWeinberg, phenotypeRatio, punnettSquare } from "./biologyGenetics";

describe("biologyGenetics", () => {
  it("builds Aa×Aa Punnett", () => {
    const r = punnettSquare({ parent1: "Aa", parent2: "Aa" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.offspring["AA"]).toBe(1);
    expect(r.offspring["Aa"]).toBe(2);
    expect(r.offspring["aa"]).toBe(1);
  });

  it("gives 3:1 phenotype ratio", () => {
    const r = phenotypeRatio({ parent1: "Aa", parent2: "Aa" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.ratio).toBe("3:1");
  });

  it("computes HWE frequencies", () => {
    const r = hardyWeinberg({ p: 0.6 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.p2).toBeCloseTo(0.36, 5);
    expect(r.twoPq).toBeCloseTo(0.48, 5);
    expect(r.q2).toBeCloseTo(0.16, 5);
  });
});
