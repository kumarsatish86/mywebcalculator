import { describe, expect, it } from "vitest";
import { fdVsRd, inflationImpactOnSavings, realInterestRate, taxOnInterest } from "./investmentLinkedBanking";

describe("investmentLinkedBanking", () => {
  it("compares FD vs RD", () => {
    const r = fdVsRd({ principalOrMonthly: 5000, annualRatePercent: 7, years: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.fdMaturity).toBeGreaterThan(5000);
    expect(["FD", "RD", "tie"]).toContain(r.winner);
  });

  it("computes inflation impact", () => {
    const r = inflationImpactOnSavings({
      principal: 100000,
      nominalRatePercent: 7,
      inflationPercent: 6,
      years: 5,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.realPurchasingPower).toBeLessThan(r.nominalFuture);
  });

  it("computes real rate and tax on interest", () => {
    const real = realInterestRate({ nominalRatePercent: 7, inflationPercent: 5 });
    expect(real.realRatePercent).toBeLessThan(7);
    const tax = taxOnInterest({ interestIncome: 50000, taxRatePercent: 30 });
    expect("error" in tax).toBe(false);
    if ("error" in tax) return;
    expect(tax.afterTaxInterest).toBe(35000);
  });
});
