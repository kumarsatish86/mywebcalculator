import { describe, expect, it } from "vitest";
import {
  downPaymentCalc,
  homeAffordability,
  mortgageCalc,
  refinanceCalc,
} from "./mortgageProperty";

describe("mortgageProperty", () => {
  it("computes mortgage EMI", () => {
    const r = mortgageCalc({
      homePrice: 8000000,
      downPayment: 1600000,
      annualRatePercent: 8.5,
      termYears: 20,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.loanAmount).toBe(6400000);
    expect(r.emi).toBeGreaterThan(0);
  });

  it("computes down payment", () => {
    const r = downPaymentCalc({ homePrice: 6000000, downPaymentPercent: 20 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.downPayment).toBe(1200000);
    expect(r.loanAmount).toBe(4800000);
  });

  it("computes refinance and affordability", () => {
    const ref = refinanceCalc({
      remainingPrincipal: 4500000,
      currentRatePercent: 9,
      remainingMonths: 180,
      newRatePercent: 7.5,
      closingCosts: 50000,
    });
    expect("error" in ref).toBe(false);
    if ("error" in ref) return;
    expect(ref.monthlySavings).toBeGreaterThanOrEqual(0);

    const aff = homeAffordability({
      monthlyIncome: 150000,
      existingEmi: 20000,
      maxHousingPercent: 40,
      annualRatePercent: 8.5,
      termYears: 20,
      downPaymentAvailable: 1500000,
    });
    expect("error" in aff).toBe(false);
    if ("error" in aff) return;
    expect(aff.maxHomePrice).toBeGreaterThan(aff.maxLoan);
  });
});
