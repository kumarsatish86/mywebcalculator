import { describe, expect, it } from "vitest";
import {
  compensationPlanning,
  costToHire,
  employeeCost,
  payrollCalc,
  salaryBenchmark,
  salaryStructure,
} from "./hrEmployerTools";

describe("hrEmployerTools", () => {
  it("computes payroll net and employer cost", () => {
    const result = payrollCalc({ grossMonthly: 100000, taxPercent: 20, deductionPercent: 5 });
    expect(result.netMonthly).toBe(75000);
    expect(result.totalEmployerCostMonthly).toBeGreaterThan(100000);
  });

  it("computes total employee cost", () => {
    const result = employeeCost({ grossMonthly: 100000, employerBenefitPercent: 15, overheadPercent: 10 });
    expect(result.totalMonthly).toBe(100000 * 1.15 * 1.1);
  });

  it("builds salary structure from CTC", () => {
    const result = salaryStructure({ monthlyCtc: 100000, basicPercent: 40, hraPercentOfBasic: 50 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.basic).toBe(40000);
    expect(result.hra).toBe(20000);
    expect(result.basic + result.hra + result.specialAllowance).toBe(result.grossMonthly);
  });

  it("computes compensation planning budget", () => {
    const result = compensationPlanning({ headcount: 10, avgGrossMonthly: 80000, employerBenefitPercent: 20 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.totalAnnualWithBenefits).toBe(10 * 80000 * 12 * 1.2);
  });

  it("compares offer to market median", () => {
    const result = salaryBenchmark({ offerAnnual: 1100000, marketMedianAnnual: 1000000 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.differencePercent).toBeCloseTo(10, 1);
    expect(result.position).toBe("above");
  });

  it("computes cost to hire", () => {
    const result = costToHire({
      annualSalary: 1200000,
      recruiterFeePercent: 15,
      signingBonus: 50000,
      onboardingCost: 25000,
      vacancyDays: 30,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.recruiterFee).toBe(180000);
    expect(result.totalCost).toBeGreaterThan(180000);
  });
});
