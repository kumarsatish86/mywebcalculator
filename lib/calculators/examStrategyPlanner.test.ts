import { describe, expect, it } from "vitest";
import { computeExamDigitalTwin } from "./examStrategyPlanner";

describe("computeExamDigitalTwin", () => {
  it("returns score bands and three strategies for JEE", () => {
    const twin = computeExamDigitalTwin({
      examId: "jee",
      easyPct: 50,
      mediumPct: 35,
      hardPct: 15,
      negativeMarking: true,
      accuracyPercent: 75,
      confidenceThreshold: 70,
    });
    expect("error" in twin).toBe(false);
    if ("error" in twin) return;
    expect(twin.strategies).toHaveLength(3);
    expect(twin.studyPlan).toHaveLength(7);
    expect(twin.expectedScore).toBeGreaterThan(0);
    expect(twin.bestScore).toBeGreaterThanOrEqual(twin.expectedScore);
    expect(twin.timeline.length).toBe(4);
  });

  it("flags high risk at low accuracy with negative marking", () => {
    const twin = computeExamDigitalTwin({
      examId: "neet",
      easyPct: 40,
      mediumPct: 40,
      hardPct: 20,
      negativeMarking: true,
      accuracyPercent: 50,
      confidenceThreshold: 40,
    });
    expect("error" in twin).toBe(false);
    if ("error" in twin) return;
    expect(twin.risk).toBe("HIGH");
  });
});
