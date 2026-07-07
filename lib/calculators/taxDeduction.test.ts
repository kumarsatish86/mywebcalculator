import { describe, expect, it } from "vitest";
import {
  afterTaxSalary,
  effectiveTaxRate,
  globalIncomeTax,
  salaryAfterTax,
  taxRefund,
  taxableIncome,
  tdsFromAnnualTax,
  tdsFromRate,
} from "./taxDeduction";

describe("taxDeduction", () => {
  it("computes taxable income", () => {
    const result = taxableIncome({ gross: 1000000, exemptions: 75000, deductions: 150000 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.taxable).toBe(775000);
  });

  it("rejects deductions exceeding gross", () => {
    const result = taxableIncome({ gross: 100000, exemptions: 60000, deductions: 50000 });
    expect("error" in result).toBe(true);
  });

  it("computes global income tax", () => {
    const result = globalIncomeTax({
      grossAnnual: 1200000,
      standardDeduction: 75000,
      otherDeductions: 150000,
      taxPercent: 20,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.taxable).toBe(975000);
    expect(result.taxAmount).toBe(195000);
  });

  it("computes after-tax salary", () => {
    const result = afterTaxSalary({ grossMonthly: 100000, taxPercent: 20, deductionPercent: 5 });
    expect(result.net).toBe(75000);
  });

  it("computes salary after tax annually", () => {
    const result = salaryAfterTax({ grossAnnual: 1200000, taxPercent: 20, deductionPercent: 5 });
    expect(result.netAnnual).toBe(900000);
    expect(result.netMonthly).toBe(75000);
  });

  it("computes tax refund", () => {
    const result = taxRefund({ taxableIncome: 800000, taxPercent: 20, taxPaid: 200000 });
    expect(result.taxOwed).toBe(160000);
    expect(result.refund).toBe(40000);
    expect(result.balanceDue).toBe(0);
  });

  it("computes balance due when underpaid", () => {
    const result = taxRefund({ taxableIncome: 800000, taxPercent: 20, taxPaid: 100000 });
    expect(result.balanceDue).toBe(60000);
    expect(result.refund).toBe(0);
  });

  it("computes TDS from annual tax", () => {
    const result = tdsFromAnnualTax({ annualIncome: 1200000, estimatedAnnualTax: 180000 });
    expect(result.monthlyTds).toBe(15000);
    expect(result.effectiveTdsRate).toBeCloseTo(15, 1);
  });

  it("computes TDS from rate", () => {
    const result = tdsFromRate({ monthlyGross: 100000, tdsPercent: 10 });
    expect(result.monthlyTds).toBe(10000);
    expect(result.annualTds).toBe(120000);
  });

  it("computes effective tax rate", () => {
    const result = effectiveTaxRate({ grossIncome: 1000000, totalTax: 150000 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.effectiveRate).toBe(15);
    expect(result.netIncome).toBe(850000);
  });
});
