import { describe, expect, it } from "vitest";
import { investmentPlanRich, portfolioAnalyzeRich, sipStrategyOptimizeRich } from "./aiFinanceInvestRich";

describe("aiFinanceInvestRich", () => {
  it("plans investment with projection", () => {
    const r = investmentPlanRich({
      goal: 500000,
      years: 10,
      expectedReturn: 12,
      risk: "medium",
      existingCorpus: 50000,
      inflationPercent: 5,
      monthlyIncome: 100000,
      goalType: "retirement",
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.monthlySip).toBeGreaterThan(0);
    expect(r.projection.length).toBeGreaterThan(1);
    expect(r.insights.length).toBeGreaterThan(2);
  });

  it("analyzes portfolio with rebalance", () => {
    const r = portfolioAnalyzeRich({
      equityPercent: 55,
      debtPercent: 35,
      goldPercent: 7,
      cashPercent: 3,
      risk: "medium",
      portfolioValue: 2000000,
      age: 38,
      horizonYears: 10,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.rebalance.length).toBe(4);
    expect(r.compareRows.length).toBe(4);
  });

  it("optimizes sip with compare paths", () => {
    const r = sipStrategyOptimizeRich({
      targetCorpus: 500000,
      years: 10,
      expectedReturn: 12,
      stepUpPercent: 10,
      inflationPercent: 5,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.sipCompare.length).toBeGreaterThan(1);
    expect(r.stepUpStartSip).toBeLessThan(r.flatSip);
  });
});
