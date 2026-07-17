import { describe, expect, it } from "vitest";
import {
  bestOfNSubjects,
  marksPercentage,
  requiredMarksToPass,
  weightedPercentage,
} from "./examBasicScore";

describe("examBasicScore", () => {
  it("computes marks percentage", () => {
    const r = marksPercentage({ obtained: 78, total: 100 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.percent).toBeCloseTo(78, 5);
  });

  it("weights component scores", () => {
    const r = weightedPercentage({ scoresCsv: "80,70", weightsCsv: "60,40" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.weightedPercent).toBeCloseTo(76, 5);
  });

  it("selects best of N and required marks to pass", () => {
    const best = bestOfNSubjects({ marksCsv: "40,90,70,85", bestN: 3 });
    expect("error" in best).toBe(false);
    if ("error" in best) return;
    expect(best.total).toBe(245);

    const need = requiredMarksToPass({
      marksSoFar: 120,
      maxSoFar: 200,
      remainingMax: 100,
      passPercent: 40,
    });
    expect("error" in need).toBe(false);
    if ("error" in need) return;
    expect(need.alreadySafe).toBe(true);
  });
});
