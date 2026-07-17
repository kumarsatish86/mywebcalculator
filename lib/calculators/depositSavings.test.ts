import { describe, expect, it } from "vitest";
import {
  fdInterestPayout,
  goalBasedSavings,
  savingsAccountInterest,
  savingsGrowthRegular,
} from "./depositSavings";

describe("depositSavings", () => {
  it("computes savings interest", () => {
    const r = savingsAccountInterest({ averageBalance: 100000, annualRatePercent: 3.5, days: 30 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.interest).toBeCloseTo((100000 * 3.5 * 30) / (100 * 365), 4);
  });

  it("computes FD payout and goal savings", () => {
    const p = fdInterestPayout({
      principal: 500000,
      annualRatePercent: 7,
      years: 1,
      frequency: "quarterly",
    });
    expect("error" in p).toBe(false);
    if ("error" in p) return;
    expect(p.periodsPerYear).toBe(4);
    expect(p.payoutPerPeriod).toBeCloseTo(8750, 5);

    const g = goalBasedSavings({ goalAmount: 1200000, years: 5, annualRatePercent: 6, existingSavings: 100000 });
    expect("error" in g).toBe(false);
    if ("error" in g) return;
    expect(g.requiredMonthlyDeposit).toBeGreaterThan(0);
  });

  it("grows savings with deposits", () => {
    const r = savingsGrowthRegular({
      startingBalance: 10000,
      monthlyDeposit: 5000,
      annualRatePercent: 6,
      years: 2,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.endingBalance).toBeGreaterThan(r.totalDeposited - 10000);
  });
});
