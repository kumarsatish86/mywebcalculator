import { describe, expect, it } from "vitest";
import {
  mockTestPerformance,
  optimalAttempt,
  timeAllocationPerSection,
} from "./examStrategy";

describe("examStrategy", () => {
  it("allocates minutes by section weight", () => {
    const r = timeAllocationPerSection({ totalMinutes: 180, weightsCsv: "40,30,30" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.sections).toHaveLength(3);
    expect(r.sections[0]!.minutes).toBeCloseTo(72, 5);
    expect(r.totalWeight).toBe(100);
  });

  it("suggests optimal attempts at high accuracy", () => {
    const r = optimalAttempt({
      totalQuestions: 100,
      accuracyPercent: 75,
      marksCorrect: 4,
      marksWrong: 1,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.optimalAttempts).toBe(100);
    expect(r.expectedScore).toBeGreaterThan(0);
  });

  it("summarizes mock score trend", () => {
    const r = mockTestPerformance({ scoresCsv: "520,545,560,578" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.mocks).toBe(4);
    expect(r.trend).toBe("up");
    expect(r.best).toBe(578);
  });
});
