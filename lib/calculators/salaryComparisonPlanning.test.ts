import { describe, expect, it } from "vitest";
import {
  costOfLivingComparison,
  incrementSalary,
  offerComparison,
  promotionSalary,
  salaryComparison,
  salaryGrowth,
} from "./salaryComparisonPlanning";

describe("salaryComparisonPlanning", () => {
  it("compares two salaries", () => {
    const result = salaryComparison({ salaryA: 1000000, salaryB: 1200000 });
    expect(result.difference).toBe(200000);
    expect(result.higher).toBe("B");
  });

  it("compares offers with bonus", () => {
    const result = offerComparison({ offerA: 1000000, offerB: 1100000, bonusAPercent: 10, bonusBPercent: 5 });
    expect(result.totalA).toBe(1100000);
    expect(result.totalB).toBe(1155000);
  });

  it("compares COL purchasing power", () => {
    const result = costOfLivingComparison({ salaryA: 100000, colA: 100, salaryB: 90000, colB: 80 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.equivalentBInA).toBe(112500);
    expect(result.betterInPP).toBe("B");
  });

  it("projects salary growth", () => {
    const result = salaryGrowth({ currentSalary: 1000000, annualGrowthPercent: 10, years: 3 });
    expect(result.finalSalary).toBeCloseTo(1331000, 0);
    expect(result.yearlyProjection).toHaveLength(4);
  });

  it("computes promotion salary", () => {
    const result = promotionSalary({ currentSalary: 1000000, increasePercent: 15 });
    expect(result.newSalary).toBe(1150000);
  });

  it("computes increment", () => {
    const result = incrementSalary({ currentSalary: 600000, incrementPercent: 8 });
    expect(result.newSalary).toBe(648000);
    expect(result.monthlyIncrement).toBe(4000);
  });
});
