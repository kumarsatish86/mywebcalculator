import { describe, expect, it } from "vitest";
import {
  creditWeightedGpa,
  cumulativeGpa,
  gpaToPercentage,
  percentageToGpa,
} from "./examGpaCgpa";

describe("examGpaCgpa", () => {
  it("computes credit-weighted GPA", () => {
    const r = creditWeightedGpa({
      gradePointsCsv: "4,3,2",
      creditsCsv: "3,3,3",
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.gpa).toBeCloseTo(3, 5);
    expect(r.totalCredits).toBe(9);
  });

  it("rolls prior GPA into cumulative GPA", () => {
    const r = cumulativeGpa({
      priorGpa: 3.5,
      priorCredits: 30,
      newGpa: 3.0,
      newCredits: 15,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.cgpa).toBeCloseTo((3.5 * 30 + 3 * 15) / 45, 5);
  });

  it("converts between GPA and percentage", () => {
    const toPct = gpaToPercentage({ gpa: 8, scale: 10 });
    expect("error" in toPct).toBe(false);
    if ("error" in toPct) return;
    expect(toPct.percent).toBeCloseTo(76, 5);

    const toGpa = percentageToGpa({ percent: 80, scale: 4 });
    expect("error" in toGpa).toBe(false);
    if ("error" in toGpa) return;
    expect(toGpa.gpa).toBeCloseTo(3.2, 5);
  });
});
