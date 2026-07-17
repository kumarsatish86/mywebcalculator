import { describe, expect, it } from "vitest";
import {
  canIPassWithThisScore,
  howMuchToScoreToPass,
  rankPredictorJeeNeet,
} from "./examViralMicro";

describe("examViralMicro", () => {
  it("computes marks still needed to pass", () => {
    const r = howMuchToScoreToPass({
      totalMaxMarks: 100,
      passPercent: 40,
      marksAlreadyScored: 25,
      remainingMaxMarks: 40,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.passMarksNeeded).toBe(40);
    expect(r.marksStillNeeded).toBe(15);
    expect(r.canPass).toBe(true);
  });

  it("checks pass with margin", () => {
    const r = canIPassWithThisScore({ scored: 72, maxMarks: 100, passPercent: 40 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.pass).toBe(true);
    expect(r.percent).toBeCloseTo(72, 5);
    expect(r.marginMarks).toBeCloseTo(32, 5);
  });

  it("estimates JEE rank band", () => {
    const r = rankPredictorJeeNeet({ marks: 250, maxMarks: 360, exam: "jee", candidates: 1_200_000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.estimatedPercentile).toBeGreaterThan(80);
    expect(r.estimatedRank).toBeGreaterThan(0);
    expect(r.band).toBeTruthy();
  });
});
