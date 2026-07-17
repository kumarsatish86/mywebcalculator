import { describe, expect, it } from "vitest";
import { biodiversityIndex, carryingCapacity, populationGrowth } from "./biologyEcology";

describe("biologyEcology", () => {
  it("grows exponentially", () => {
    const r = populationGrowth({ n0: 100, r: 0, t: 5 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.n).toBeCloseTo(100, 5);
  });

  it("approaches K in logistic", () => {
    const r = carryingCapacity({ n0: 10, k: 100, r: 1, t: 50 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.n).toBeGreaterThan(90);
  });

  it("computes Shannon H", () => {
    const r = biodiversityIndex({ abundancesCsv: "10,10,10,10" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.h).toBeCloseTo(Math.log(4), 5);
  });
});
