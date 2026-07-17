import { describe, expect, it } from "vitest";
import {
  emergencyFund,
  financialHealthScore,
  interestSavedByPrepayment,
  loanBurden,
} from "./advancedViralBanking";

describe("advancedViralBanking", () => {
  it("computes loan burden", () => {
    const r = loanBurden({ monthlyEmi: 45000, monthlyIncome: 120000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.burdenPercent).toBeCloseTo(37.5, 5);
    expect(r.band).toBe("Elevated");
  });

  it("computes interest saved by prepayment", () => {
    const r = interestSavedByPrepayment({
      principal: 2500000,
      annualRatePercent: 9,
      termMonths: 180,
      closureMonth: 36,
      feePercent: 2,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.interestSavedVsFullTerm).toBeGreaterThan(0);
    expect(r.outstanding).toBeGreaterThan(0);
  });

  it("computes emergency fund and health score", () => {
    const ef = emergencyFund({ monthlyExpenses: 60000, monthsDesired: 6, currentSavings: 150000 });
    expect("error" in ef).toBe(false);
    if ("error" in ef) return;
    expect(ef.target).toBe(360000);
    expect(ef.shortfall).toBe(210000);

    const hs = financialHealthScore({
      emergencyMonths: 4,
      dtiPercent: 35,
      savingsRatePercent: 15,
      investmentRatePercent: 10,
    });
    expect("error" in hs).toBe(false);
    if ("error" in hs) return;
    expect(hs.score).toBeGreaterThan(0);
    expect(hs.tips.length).toBeGreaterThan(0);
  });
});
