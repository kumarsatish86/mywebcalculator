import { describe, expect, it } from "vitest";
import {
  assetAllocationRich,
  creditScoreRich,
  debtRepayRich,
  emiOptimizeRich,
  loanAdvisorRich,
  riskAnalyzeRich,
} from "./aiFinanceLoanRich";

describe("aiFinanceLoanRich", () => {
  it("analyzes risk with factor breakdown", () => {
    const r = riskAnalyzeRich({ age: 32, horizonYears: 10, incomeStability: 75, emergencyFundMonths: 4 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.profile).toBe("high");
    expect(r.compareRows!.length).toBe(4);
  });

  it("allocates assets with compare rows", () => {
    const r = assetAllocationRich({ age: 32, risk: "medium", horizonYears: 15, portfolioValue: 2000000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.chartSlices!.length).toBe(4);
    expect(r.equity).toBeGreaterThan(0);
  });

  it("advises loan with DTI compare", () => {
    const r = loanAdvisorRich({
      grossIncome: 100000,
      existingDebt: 15000,
      principal: 2500000,
      apr: 8.5,
      termMonths: 240,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.verdict).toBeTruthy();
    expect(r.chartSlices!.length).toBe(3);
  });

  it("optimizes EMI tenure ladder", () => {
    const r = emiOptimizeRich({ principal: 2500000, apr: 8.5, maxAffordableEmi: 35000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.plans.length).toBeGreaterThan(2);
    expect(r.best).toBeTruthy();
  });

  it("plans debt payoff with projection", () => {
    const r = debtRepayRich({
      debts: [
        { balance: 50000, apr: 18, minimum: 2000, name: "Card" },
        { balance: 25000, apr: 24, minimum: 1000, name: "Personal" },
      ],
      extraPayment: 2000,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.projection!.length).toBeGreaterThan(1);
    expect(r.payoffOrder.length).toBe(2);
  });

  it("scores credit with factor insights", () => {
    const r = creditScoreRich({
      utilizationPercent: 35,
      paymentHistoryScore: 85,
      accountAgeYears: 4,
      recentInquiries: 2,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.estimatedScore).toBeGreaterThan(600);
    expect(r.insights.length).toBeGreaterThan(0);
  });
});
