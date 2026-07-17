import { describe, expect, it } from "vitest";
import {
  interestRateSensitivity,
  loanAffordability,
  loanComparisonMultiBank,
  totalLoanCost,
} from "./loanCreditBanking";

describe("loanCreditBanking", () => {
  it("computes affordability and total cost", () => {
    const a = loanAffordability({
      monthlyIncome: 100000,
      existingEmi: 10000,
      maxDtiPercent: 40,
      annualRatePercent: 10,
      termMonths: 240,
    });
    expect("error" in a).toBe(false);
    if ("error" in a) return;
    expect(a.maxEmi).toBe(30000);
    expect(a.affordablePrincipal).toBeGreaterThan(0);

    const t = totalLoanCost({
      principal: 1000000,
      annualRatePercent: 10,
      termMonths: 120,
      processingFeePercent: 1,
    });
    expect("error" in t).toBe(false);
    if ("error" in t) return;
    expect(t.fees).toBe(10000);
    expect(t.totalCost).toBeGreaterThan(t.totalInterest);
  });

  it("compares banks and rate shock", () => {
    const c = loanComparisonMultiBank({
      principal: 2000000,
      termMonths: 180,
      rateA: 9,
      rateB: 10,
      rateC: 9.5,
    });
    expect("error" in c).toBe(false);
    if ("error" in c) return;
    expect(c.cheapestLabel).toBe("Bank A");

    const s = interestRateSensitivity({
      principal: 1000000,
      termMonths: 240,
      baseRatePercent: 9,
      shockPercentPoints: 1,
    });
    expect("error" in s).toBe(false);
    if ("error" in s) return;
    expect(s.upEmi).toBeGreaterThan(s.baseEmi);
  });
});
