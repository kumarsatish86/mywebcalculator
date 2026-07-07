import { describe, expect, it } from "vitest";
import {
  expenseVsSalary,
  fireCalculator,
  retirementPlanning,
  salaryBudgetPlanner,
  salaryInvestment,
  savingsFromSalary,
} from "./salaryFinancialPlanning";

describe("salaryFinancialPlanning", () => {
  it("computes savings from salary", () => {
    const result = savingsFromSalary({ netMonthly: 80000, savingsPercent: 20 });
    expect(result.monthlySavings).toBe(16000);
    expect(result.annualSavings).toBe(192000);
  });

  it("computes expense vs salary", () => {
    const result = expenseVsSalary({ salaryMonthly: 75000, expensesMonthly: 60000 });
    expect(result.surplus).toBe(15000);
    expect(result.status).toBe("surplus");
  });

  it("plans salary budget", () => {
    const result = salaryBudgetPlanner({ netMonthly: 100000, needsPercent: 50, wantsPercent: 30, savingsPercent: 20 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.savings).toBe(20000);
  });

  it("projects salary investment", () => {
    const result = salaryInvestment({ monthlyInvestment: 15000, annualReturnPercent: 10, years: 20 });
    expect(result.projectedCorpus).toBeGreaterThan(result.totalContributed);
  });

  it("computes FIRE target", () => {
    const result = fireCalculator({
      annualExpenses: 600000,
      withdrawalRatePercent: 4,
      currentSavings: 2000000,
      monthlySavings: 50000,
      expectedReturnPercent: 8,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.fireNumber).toBe(15000000);
    expect(result.yearsToFire).toBeGreaterThan(0);
  });

  it("plans retirement corpus", () => {
    const result = retirementPlanning({
      monthlySalary: 100000,
      savingsPercent: 20,
      yearsToRetirement: 25,
      expectedReturnPercent: 8,
    });
    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(result.retirementCorpus).toBeGreaterThan(result.totalContributed);
  });
});
