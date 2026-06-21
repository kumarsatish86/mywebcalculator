import { describe, expect, it } from "vitest";
import {
  calorieOptimizationRich,
  fitnessPlannerRich,
  stressAnalyzerRich,
  weightLossStrategyRich,
} from "./aiHealthSmartRich";

describe("aiHealthSmartRich", () => {
  it("plans fitness with macros", () => {
    const r = fitnessPlannerRich({
      age: 30,
      weightKg: 75,
      heightCm: 175,
      sex: "male",
      activity: "moderate",
      goal: "maintain",
      daysPerWeek: 4,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.tdee).toBeGreaterThan(1500);
    expect(r.macroSplit.p).toBeGreaterThan(100);
    expect(r.chartSlices?.length).toBe(3);
  });

  it("rejects aggressive weight loss", () => {
    const r = weightLossStrategyRich({
      currentKg: 90,
      targetKg: 70,
      weeks: 8,
      activity: "moderate",
      heightCm: 170,
      age: 30,
      sex: "female",
    });
    expect("error" in r).toBe(true);
  });

  it("optimizes calories for gain goal", () => {
    const r = calorieOptimizationRich({
      weightKg: 70,
      heightCm: 175,
      age: 25,
      sex: "male",
      activity: "active",
      goal: "gain",
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.targetCal).toBeGreaterThan(r.tdee);
  });

  it("ranks stress factors", () => {
    const r = stressAnalyzerRich({ work: 8, health: 3, social: 5, finance: 6 });
    expect(r.topStressor).toBe("Work");
    expect(r.stressIndex).toBeGreaterThan(50);
  });
});
