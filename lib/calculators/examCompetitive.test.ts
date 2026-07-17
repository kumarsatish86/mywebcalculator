import { describe, expect, it } from "vitest";
import {
  cutoffPredictor,
  negativeMarking,
  rankPredictor,
} from "./examCompetitive";

describe("examCompetitive", () => {
  it("predicts cut-off clearance with margin", () => {
    const r = cutoffPredictor({ yourScore: 285, lastYearCutoff: 270, difficultyFactor: 1.05 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.adjustedCutoff).toBeCloseTo(283.5, 5);
    expect(r.clears).toBe(true);
    expect(r.margin).toBeGreaterThan(0);
  });

  it("estimates rank from marks", () => {
    const r = rankPredictor({ marks: 420, maxMarks: 500, candidates: 1_000_000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.estimatedPercentile).toBeGreaterThan(50);
    expect(r.estimatedRank).toBeGreaterThan(0);
  });

  it("computes negative marking net score", () => {
    const r = negativeMarking({ correct: 45, wrong: 12, marksPerCorrect: 4, marksPerWrong: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.score).toBe(168);
    expect(r.accuracyPercent).toBeCloseTo(78.95, 1);
  });
});
