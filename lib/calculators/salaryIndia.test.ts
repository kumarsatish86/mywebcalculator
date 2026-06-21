import { describe, expect, it } from "vitest";
import {
  annualIncomeTaxNewRegime,
  annualIncomeTaxOldRegime,
  basicFromCtc,
  compareTaxRegimes,
  gratuityAmount,
  hraExemption,
  indiaSalaryBreakdown,
  leaveEncashment,
  monthlyProfessionalTax,
  pfContribution,
  statutoryBonus,
} from "./salaryIndia";

describe("salaryIndia", () => {
  it("caps PF at wage ceiling", () => {
    expect(pfContribution(10000)).toBeCloseTo(1200, 0);
    expect(pfContribution(20000)).toBeCloseTo(1800, 0);
  });

  it("computes HRA exemption", () => {
    const result = hraExemption({
      basic: 50000,
      hraReceived: 25000,
      rentPaid: 20000,
      metro: true,
    });
    expect(result.exemption).toBeGreaterThan(0);
    expect(result.exemption).toBeLessThanOrEqual(25000);
  });

  it("computes new regime tax with rebate band", () => {
    expect(annualIncomeTaxNewRegime(500000)).toBe(0);
    expect(annualIncomeTaxNewRegime(1200000)).toBeGreaterThan(0);
  });

  it("old regime tax respects 80C", () => {
    const withDeduction = annualIncomeTaxOldRegime({ annualIncome: 1200000, sec80c: 150000 });
    const without = annualIncomeTaxOldRegime({ annualIncome: 1200000, sec80c: 0 });
    expect(withDeduction).toBeLessThan(without);
  });

  it("compares regimes", () => {
    const cmp = compareTaxRegimes({ annualIncome: 1500000, sec80c: 150000, hraExemptionAnnual: 120000 });
    expect(["old", "new", "tie"]).toContain(cmp.better);
  });

  it("breaks down India salary from CTC", () => {
    const result = indiaSalaryBreakdown({ monthlyCtc: 100000, basicPercent: 40, state: "maharashtra" });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.basic).toBeCloseTo(40000, 0);
    expect(result.inHandMonthly).toBeGreaterThan(0);
    expect(result.inHandMonthly).toBeLessThan(result.grossMonthly);
  });

  it("basic from CTC", () => {
    expect(basicFromCtc(100000, 40)).toBe(40000);
  });

  it("professional tax by state", () => {
    expect(monthlyProfessionalTax("delhi")).toBe(0);
    expect(monthlyProfessionalTax("maharashtra")).toBe(200);
  });

  it("gratuity with cap", () => {
    const result = gratuityAmount({ lastDrawnMonthly: 100000, yearsOfService: 25 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.amount).toBeLessThanOrEqual(2000000);
  });

  it("leave encashment", () => {
    const result = leaveEncashment({ basicPlusDa: 60000, leaveDays: 10 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.amount).toBeCloseTo(20000, 0);
  });

  it("statutory bonus", () => {
    const result = statutoryBonus({ basicPlusDa: 30000, bonusPercent: 8.33 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.monthlyBonus).toBeGreaterThan(0);
  });
});
