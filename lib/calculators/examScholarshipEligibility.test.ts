import { describe, expect, it } from "vitest";
import {
  collegeCutoffChecker,
  courseEligibility,
  meritScore,
} from "./examScholarshipEligibility";

describe("examScholarshipEligibility", () => {
  it("computes weighted merit score", () => {
    const r = meritScore({ examPercent: 75, boardPercent: 80, examWeightPercent: 60 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.meritPercent).toBeCloseTo(77, 5);
    expect(r.boardWeightPercent).toBe(40);
  });

  it("checks rank cut-off (lower is better)", () => {
    const r = collegeCutoffChecker({ yourRankOrScore: 5000, cutoff: 8000, mode: "rank" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.clears).toBe(true);
    expect(r.difference).toBe(3000);
  });

  it("flags missing course subjects", () => {
    const r = courseEligibility({
      subjectsCsv: "Physics,Chemistry,Math",
      requiredCsv: "Physics,Chemistry,Math,Biology",
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.eligible).toBe(false);
    expect(r.missing).toEqual(["Biology"]);
    expect(r.matched).toBe(3);
  });
});
