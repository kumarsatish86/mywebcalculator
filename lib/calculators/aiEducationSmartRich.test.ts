import { describe, expect, it } from "vitest";
import { studyPlannerRich, marksAnalyzerRich, questionSolverRich, rankPredictorRich } from "./aiEducationSmartRich";

describe("aiEducationSmartRich", () => {
  it("plans study hours by weight", () => {
    const r = studyPlannerRich({
      daysToExam: 30,
      hoursPerDay: 3,
      subjects: [
        { name: "Math", weight: 3 },
        { name: "Physics", weight: 2 },
      ],
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.plan.length).toBe(2);
    expect(r.chartSlices!.length).toBe(2);
  });

  it("analyzes marks", () => {
    const r = marksAnalyzerRich({
      subjects: [
        { name: "Math", marks: 72, max: 100 },
        { name: "Physics", marks: 65, max: 100 },
      ],
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.overall).toBeCloseTo(68.5, 0);
  });

  it("solves linear equation", () => {
    const r = questionSolverRich({ problemType: "linear", a: 2, b: -6 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.answer).toBe("x = 3");
  });

  it("rejects score above max", () => {
    const r = rankPredictorRich({ myScore: 420, maxScore: 100, totalStudents: 5000, difficulty: 55 });
    expect("error" in r).toBe(true);
  });

  it("predicts rank band", () => {
    const r = rankPredictorRich({ myScore: 420, maxScore: 500, totalStudents: 5000, difficulty: 55 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.percentile).toBeGreaterThan(0);
  });
});
