import { describe, expect, it } from "vitest";
import {
  contractorPay,
  dailyRateIncome,
  freelanceIncome,
  freelancerTax,
  hourlyRateFromTarget,
  projectRate,
} from "./freelanceGigIncome";

describe("freelanceGigIncome", () => {
  it("computes freelance income", () => {
    const result = freelanceIncome({ hourlyRate: 50, billableHoursPerWeek: 30 });
    expect(result.annualIncome).toBe(50 * 30 * 52);
  });

  it("computes required hourly rate", () => {
    const result = hourlyRateFromTarget({ targetAnnualIncome: 78000, billableHoursPerWeek: 30 });
    expect(result.requiredHourlyRate).toBeCloseTo(50, 0);
  });

  it("computes project rate", () => {
    const result = projectRate({ projectHours: 40, projectFee: 4000 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.effectiveHourlyRate).toBe(100);
  });

  it("computes freelancer tax", () => {
    const result = freelancerTax({ grossAnnualIncome: 1200000, taxPercent: 20, expensePercent: 10 });
    expect(result.netAnnualIncome).toBeLessThan(1200000);
  });

  it("computes contractor pay", () => {
    const result = contractorPay({ contractValue: 600000, contractMonths: 6 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.monthlyPay).toBe(100000);
  });

  it("computes daily rate income", () => {
    const result = dailyRateIncome({ dailyRate: 500, billableDaysPerWeek: 4 });
    expect(result.weeklyIncome).toBe(2000);
    expect(result.annualIncome).toBe(2000 * 52);
  });
});
