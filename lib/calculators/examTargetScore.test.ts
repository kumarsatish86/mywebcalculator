import { describe, expect, it } from "vitest";
import {
  requiredMarksFinalExam,
  requiredOnRemaining,
  requiredScoreGap,
} from "./examTargetScore";

describe("examTargetScore", () => {
  it("back-solves marks on remaining paper", () => {
    const r = requiredOnRemaining({
      marksSoFar: 200,
      maxSoFar: 300,
      remainingMax: 100,
      targetPercent: 75,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.overallTarget).toBeCloseTo(300, 5);
    expect(r.required).toBeCloseTo(100, 5);
  });

  it("computes required final exam marks from weights", () => {
    const r = requiredMarksFinalExam({
      courseworkPercent: 70,
      courseworkWeightPercent: 40,
      finalWeightPercent: 60,
      targetOverallPercent: 75,
      finalMaxMarks: 100,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.requiredFinalPercent).toBeCloseTo(78.333, 1);
  });

  it("measures gap to target score", () => {
    const r = requiredScoreGap({ currentScore: 520, targetScore: 580 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.gap).toBe(60);
    expect(r.alreadyMet).toBe(false);
  });
});
