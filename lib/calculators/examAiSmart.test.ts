import { describe, expect, it } from "vitest";
import {
  aiRankPredictor,
  aiScoreImprovementPlanner,
  aiWeaknessAnalyzer,
} from "./examAiSmart";

describe("examAiSmart", () => {
  it("predicts rank vs cut-off", () => {
    const r = aiRankPredictor({
      marks: 420,
      maxMarks: 500,
      lastYearCutoffMarks: 380,
      candidates: 1_000_000,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.vsCutoff).toBe(40);
    expect(r.estimatedRank).toBeGreaterThan(0);
    expect(r.outlook).toBeTruthy();
  });

  it("plans score improvement gap", () => {
    const r = aiScoreImprovementPlanner({
      currentPercent: 62,
      targetPercent: 75,
      weeksLeft: 8,
      hoursPerWeek: 12,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.gapPoints).toBe(13);
    expect(r.hoursTotal).toBe(96);
    expect(r.focusPlan.length).toBeGreaterThan(0);
  });

  it("analyzes weakness from CSV", () => {
    const r = aiWeaknessAnalyzer({ scoresCsv: "Math:60,Physics:45,Chem:70", maxPerSubject: 100 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.weakest).toBe("Physics");
    expect(r.strongest).toBe("Chem");
    expect(r.subjects).toHaveLength(3);
  });
});
