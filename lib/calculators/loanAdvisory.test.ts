import { describe, expect, it } from "vitest";
import {
  adviseSmartLoan,
  assessLoanRisk,
  generateEmiPlans,
  optimizeLoanScenarios,
  pickBestEmiPlan,
  shouldTakeLoan,
} from "./loanAdvisory";

describe("loanAdvisory", () => {
  it("advises on affordable loan", () => {
    const result = adviseSmartLoan({
      grossIncome: 100000,
      existingDebt: 15000,
      principal: 2500000,
      apr: 8.5,
      termMonths: 240,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.emi).toBeGreaterThan(0);
    expect(result.tips.length).toBeGreaterThan(0);
  });

  it("generates EMI plans and picks best", () => {
    const plans = generateEmiPlans({
      principal: 25000,
      apr: 6.5,
      maxAffordableEmi: 500,
    });
    expect("error" in plans).toBe(false);
    if ("error" in plans) return;
    const best = pickBestEmiPlan(plans, 500);
    expect(best).not.toBeNull();
    expect(best!.fitsBudget).toBe(true);
  });

  it("compares optimization scenarios", () => {
    const result = optimizeLoanScenarios({
      principal: 25000,
      apr: 6.5,
      termMonths: 60,
      prepaymentAmount: 2500,
      prepaymentMonth: 12,
      alternateTermMonths: 48,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.options.length).toBeGreaterThan(1);
  });

  it("evaluates should-take-loan decision", () => {
    const result = shouldTakeLoan({
      principal: 25000,
      apr: 6.5,
      termMonths: 60,
      grossIncome: 8000,
      existingDebt: 500,
      alternativeReturnPercent: 4,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.rationale.length).toBeGreaterThan(0);
  });

  it("scores loan risk", () => {
    const result = assessLoanRisk({
      grossIncome: 50000,
      existingDebt: 10000,
      emi: 22000,
      apr: 12,
      termMonths: 60,
      emergencyFundMonths: 2,
    });
    expect(result.score).toBeGreaterThan(0);
    expect(["Low", "Moderate", "Elevated", "High"]).toContain(result.band);
  });
});
