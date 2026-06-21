import { describe, expect, it } from "vitest";
import {
  compareTenureVsEmiReduction,
  computeEarlyClosure,
  computeForeclosure,
  computePrepaymentSavings,
} from "./loanPrepayment";

describe("loanPrepayment", () => {
  it("computes prepayment savings with tenure reduction", () => {
    const result = computePrepaymentSavings({
      principal: 25000,
      apr: 6.5,
      termMonths: 60,
      prepaymentAmount: 2500,
      prepaymentMonth: 12,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.interestSaved).toBeGreaterThan(0);
    expect(result.monthsSaved).toBeGreaterThan(0);
    expect(result.scenario.months).toBeLessThan(60);
  });

  it("compares tenure reduction vs EMI recast", () => {
    const result = compareTenureVsEmiReduction({
      principal: 25000,
      apr: 6.5,
      termMonths: 60,
      partPaymentAmount: 3000,
      partPaymentMonth: 18,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.interestSavedTenure).toBeGreaterThan(result.interestSavedEmi);
    expect(result.emiReduction).toBeGreaterThan(0);
    expect(result.monthsSaved).toBeGreaterThan(0);
  });

  it("computes foreclosure with fee", () => {
    const result = computeForeclosure({
      principal: 25000,
      apr: 6.5,
      termMonths: 60,
      closureMonth: 24,
      feePercent: 2,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.outstanding).toBeGreaterThan(0);
    expect(result.foreclosureFee).toBeCloseTo(result.outstanding * 0.02, 2);
    expect(result.totalClosureAmount).toBeCloseTo(result.outstanding + result.foreclosureFee, 2);
    expect(result.interestSaved).toBeGreaterThan(0);
  });

  it("computes early closure payoff", () => {
    const result = computeEarlyClosure({
      principal: 25000,
      apr: 6.5,
      termMonths: 60,
      closureMonth: 30,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.outstanding).toBeGreaterThan(0);
    expect(result.totalPayoff).toBe(result.outstanding);
    expect(result.monthsRemaining).toBe(30);
    expect(result.interestSaved).toBeGreaterThan(0);
  });
});
