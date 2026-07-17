import { describe, expect, it } from "vitest";
import {
  balanceCoefficients,
  limitingReagent,
  percentYield,
} from "./chemistryStoichiometry";

describe("chemistryStoichiometry", () => {
  it("finds limiting reagent", () => {
    const r = limitingReagent({ molesA: 2, coeffA: 2, molesB: 2, coeffB: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.limiting).toBe("A");
  });

  it("computes percent yield", () => {
    const r = percentYield({ actual: 8, theoretical: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.percent).toBeCloseTo(80, 5);
  });

  it("reduces coefficients", () => {
    const r = balanceCoefficients({ coeffsCsv: "2,4,2" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.coeffs).toEqual([1, 2, 1]);
  });
});
