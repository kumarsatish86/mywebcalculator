import { describe, expect, it } from "vitest";
import {
  accuracyCorrectVsWrong,
  scoreTrend,
  subjectWisePerformance,
} from "./examPerformanceAnalysis";

describe("examPerformanceAnalysis", () => {
  it("analyzes subject-wise performance", () => {
    const r = subjectWisePerformance({ scoresCsv: "Math:72,Physics:55,Chem:68", maxPerSubject: 100 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.subjects).toHaveLength(3);
    expect(r.strongest).toBe("Math");
    expect(r.weakest).toBe("Physics");
  });

  it("computes accuracy and attempt rate", () => {
    const r = accuracyCorrectVsWrong({ correct: 42, wrong: 18, unattempted: 40 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.accuracyPercent).toBeCloseTo(70, 5);
    expect(r.attempted).toBe(60);
    expect(r.attemptRatePercent).toBeCloseTo(60, 5);
  });

  it("detects improving score trend", () => {
    const r = scoreTrend({ scoresCsv: "520,535,548,560" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.trend).toBe("improving");
    expect(r.slopePerTest).toBeGreaterThan(0);
  });
});
