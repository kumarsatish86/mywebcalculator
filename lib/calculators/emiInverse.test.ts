import { describe, expect, it } from "vitest";
import {
  annualRatePercentFromEmi,
  compareFlatVsReducing,
  principalFromEmi,
  termYearsFromEmi,
  totalInterestOnly,
} from "./emiInverse";
import { monthlyLoanPayment } from "./loanPayment";

describe("principalFromEmi", () => {
  it("inverts EMI formula for fixed case", () => {
    const target = monthlyLoanPayment({
      principal: 25000,
      annualRatePercent: 6.5,
      termMonths: 60,
    });
    expect("error" in target).toBe(false);
    if ("error" in target) return;
    const back = principalFromEmi(target.payment, 6.5, 60);
    expect("error" in back).toBe(false);
    if (!("error" in back)) {
      expect(back.principal).toBeCloseTo(25000, 1);
    }
  });

  it("rejects non-positive EMI", () => {
    const r = principalFromEmi(0, 6, 60);
    expect("error" in r).toBe(true);
  });

  it("rejects invalid term", () => {
    const r = principalFromEmi(500, 6, 0);
    expect("error" in r).toBe(true);
  });
});

describe("annualRatePercentFromEmi", () => {
  it("recovers rate from synthetic payment", () => {
    const pay = monthlyLoanPayment({
      principal: 10000,
      annualRatePercent: 8,
      termMonths: 36,
    });
    expect("error" in pay).toBe(false);
    if ("error" in pay) return;
    const rate = annualRatePercentFromEmi(10000, pay.payment, 36);
    expect("error" in rate).toBe(false);
    if (!("error" in rate)) {
      expect(rate.annualRatePercent).toBeCloseTo(8, 2);
    }
  });
  it("errors when EMI is impossibly high", () => {
    const r = annualRatePercentFromEmi(1000, 5000, 60);
    expect("error" in r).toBe(true);
  });

  it("returns 0% APR when EMI equals principal/n", () => {
    const r = annualRatePercentFromEmi(12000, 1000, 12);
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.annualRatePercent).toBe(0);
    }
  });

  it("errors when EMI is below zero-interest installment", () => {
    const r = annualRatePercentFromEmi(12000, 500, 12);
    expect("error" in r).toBe(true);
  });
});

describe("termYearsFromEmi", () => {
  it("solves tenure at zero APR", () => {
    const t = termYearsFromEmi(12000, 1000, 0);
    expect("error" in t).toBe(false);
    if (!("error" in t)) {
      expect(t.months).toBeCloseTo(12, 5);
    }
  });

  it("errors when EMI does not cover interest", () => {
    const t = termYearsFromEmi(100000, 1, 24);
    expect("error" in t).toBe(true);
  });
});

describe("compareFlatVsReducing", () => {
  it("returns flat equivalent APR when computable", () => {
    const c = compareFlatVsReducing({
      principal: 25000,
      flatAnnualPercent: 10,
      reducingAprPercent: 10,
      termMonths: 60,
    });
    expect("error" in c).toBe(false);
    if (!("error" in c)) {
      expect(c.flatEquivalentReducingApr).not.toBeNull();
      expect(c.totalPaidDifference).toBeDefined();
    }
  });

  it("rejects non-positive principal", () => {
    const c = compareFlatVsReducing({
      principal: 0,
      flatAnnualPercent: 10,
      reducingAprPercent: 10,
      termMonths: 60,
    });
    expect("error" in c).toBe(true);
  });
});

describe("totalInterestOnly", () => {
  it("matches monthlyLoanPayment interest for standard case", () => {
    const m = monthlyLoanPayment({
      principal: 10000,
      annualRatePercent: 7,
      termMonths: 48,
    });
    expect("error" in m).toBe(false);
    if ("error" in m) return;
    const t = totalInterestOnly({
      principal: 10000,
      annualRatePercent: 7,
      termMonths: 48,
    });
    expect("error" in t).toBe(false);
    if (!("error" in t)) {
      expect(t.totalInterest).toBeCloseTo(m.totalInterest, 8);
      expect(t.emi).toBeCloseTo(m.payment, 8);
    }
  });
});
