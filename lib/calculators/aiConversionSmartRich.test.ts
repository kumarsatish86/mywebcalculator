import { describe, expect, it } from "vitest";
import {
  convertUnits,
  currencyTrendPredictorRich,
  dailyRoutineOptimizerRich,
  productivityScoreRich,
  timeManagementPlannerRich,
  timeZonePlannerRich,
  unitConversionAdvisorRich,
} from "./aiConversionSmartRich";

describe("aiConversionSmartRich", () => {
  it("converts length units", () => {
    const r = convertUnits(1, "km", "mi");
    expect(typeof r).toBe("number");
    expect(r as number).toBeCloseTo(0.621, 2);
  });

  it("advises unit conversion with related units", () => {
    const r = unitConversionAdvisorRich({ value: 100, from: "km", to: "mi" });
    expect(r.result).toBeCloseTo(62.137, 1);
    expect(r.relatedUnits?.length).toBeGreaterThan(0);
  });

  it("predicts currency scenarios", () => {
    const r = currencyTrendPredictorRich({ amount: 1000, rate: 83.5, trendPct: 1.2, volatility: 6, horizonDays: 30 });
    expect(r.convertedNow).toBeGreaterThan(80000);
    expect(r.scenarios?.length).toBe(3);
  });

  it("finds timezone overlap", () => {
    const r = timeZonePlannerRich({ offsets: [0, 5.5, 8], workStart: 9, workEnd: 18, meetingMin: 60 });
    expect(r.overlapHours).toBeGreaterThan(0);
    expect(r.overlapWindows?.length).toBeGreaterThan(0);
  });

  it("plans time management day", () => {
    const r = timeManagementPlannerRich({
      hoursAvailable: 8,
      tasks: [{ name: "Deep work", hours: 3, priority: 9 }, { name: "Meetings", hours: 2, priority: 7 }],
    });
    expect(r.schedule?.length).toBeGreaterThan(0);
    expect(r.utilization).toBeGreaterThan(0);
  });

  it("scores productivity", () => {
    const r = productivityScoreRich({ focusHours: 5, interruptions: 8, completed: 7, planned: 9, deepWorkHours: 2 });
    expect(r.productivityScore).toBeGreaterThan(50);
    expect(r.rankedLevers?.length).toBeGreaterThan(0);
  });

  it("optimizes daily routine", () => {
    const r = dailyRoutineOptimizerRich({
      wakeHour: 6,
      sleepHour: 23,
      blocks: [
        { name: "Exercise", duration: 1, energy: "high" },
        { name: "Deep work", duration: 3, energy: "high" },
        { name: "TV", duration: 2, energy: "low" },
      ],
    });
    expect(r.schedule?.length).toBe(3);
    expect(r.efficiency).toBeGreaterThan(0);
  });
});
