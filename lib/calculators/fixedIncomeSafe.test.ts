import { describe, expect, it } from "vitest";
import {
  epfCalc,
  fixedDeposit,
  npsCalc,
  postOfficeSavings,
  ppfCalc,
  recurringDeposit,
  scssCalc,
  ssyCalc,
  treasuryBillBond,
} from "./fixedIncomeSafe";

describe("fixedIncomeSafe", () => {
  it("computes FD maturity", () => {
    const result = fixedDeposit({ principal: 100000, annualRatePercent: 7, years: 5, compoundsPerYear: 4 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.maturityValue).toBeGreaterThan(100000);
  });

  it("computes RD maturity", () => {
    const result = recurringDeposit({ monthlyDeposit: 5000, annualRatePercent: 6.5, months: 36 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.totalDeposited).toBe(180000);
    expect(result.maturityValue).toBeGreaterThan(result.totalDeposited);
  });

  it("computes PPF over 15 years", () => {
    const result = ppfCalc({ annualDeposit: 150000 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.totalDeposited).toBe(150000 * 15);
    expect(result.maturityValue).toBeGreaterThan(result.totalDeposited);
  });

  it("computes EPF corpus", () => {
    const result = epfCalc({ monthlyContribution: 3600, years: 20 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.maturityValue).toBeGreaterThan(result.totalContributed);
  });

  it("computes NPS corpus and pension estimate", () => {
    const result = npsCalc({ monthlyContribution: 5000, annualRatePercent: 10, years: 25 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.lumpSum + result.annuityCorpus).toBeCloseTo(result.retirementCorpus, 0);
    expect(result.estimatedMonthlyPension).toBeGreaterThan(0);
  });

  it("computes SSY with 15 deposit years", () => {
    const result = ssyCalc({ annualDeposit: 100000 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.totalDeposited).toBe(100000 * 15);
    expect(result.years).toBe(21);
  });

  it("computes SCSS quarterly payout", () => {
    const result = scssCalc({ principal: 1000000 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.quarterlyInterest).toBeCloseTo(result.annualInterest / 4, 5);
  });

  it("computes post office savings", () => {
    const result = postOfficeSavings({ principal: 50000, years: 3 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.interestEarned).toBe(6000);
  });

  it("computes T-bill YTM", () => {
    const result = treasuryBillBond({
      faceValue: 100000,
      purchasePrice: 95000,
      yearsToMaturity: 1,
      couponPercent: 0,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.ytmApproxPercent).toBeCloseTo((100000 / 95000 - 1) * 100, 2);
  });
});
