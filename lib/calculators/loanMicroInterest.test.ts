import { describe, expect, it } from "vitest";
import {
  computeCompoundLoanInterest,
  computeDailyInterest,
  computeInterestPerEmi,
  computeMonthlyInterest,
  computeOutstandingBalance,
  computeSimpleInterest,
} from "./loanMicroInterest";

describe("loanMicroInterest", () => {
  it("computes daily interest", () => {
    const result = computeDailyInterest({ principal: 36500, apr: 10, days: 30 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.dailyInterest).toBeCloseTo(10, 2);
    expect(result.totalForDays).toBeCloseTo(300, 0);
  });

  it("computes monthly interest", () => {
    const result = computeMonthlyInterest({ principal: 12000, apr: 12 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.monthlyInterest).toBe(120);
  });

  it("computes simple interest", () => {
    const result = computeSimpleInterest({ principal: 10000, ratePercent: 8, timeYears: 3 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.interest).toBe(2400);
    expect(result.totalAmount).toBe(12400);
  });

  it("computes compound loan interest vs simple flat", () => {
    const result = computeCompoundLoanInterest({ principal: 25000, apr: 6.5, termMonths: 60 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.interestDifference).toBeLessThan(0);
  });

  it("computes interest per EMI month", () => {
    const result = computeInterestPerEmi({ principal: 25000, apr: 6.5, termMonths: 60, month: 1 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.interest).toBeGreaterThan(0);
  });

  it("computes outstanding balance", () => {
    const result = computeOutstandingBalance({ principal: 25000, apr: 6.5, termMonths: 60, month: 24 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.outstanding).toBeGreaterThan(0);
    expect(result.outstanding).toBeLessThan(25000);
  });
});
