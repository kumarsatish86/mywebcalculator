import { describe, expect, it } from "vitest";
import {
  analyzeExpenses,
  assetAllocation,
  creditScoreImprover,
  debtRepaymentPlanner,
  investmentPlan,
  monthlySavingsPlan,
  planBudget,
  riskAnalyzeInvestor,
  subscriptionAnalyzer,
} from "./aiFinanceSmart";

describe("aiFinanceSmart", () => {
  it("plans budget with 50/30/20", () => {
    const r = planBudget({ income: 100000, fixedExpenses: 40000, variableExpenses: 20000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.savings).toBe(20000);
  });

  it("analyzes expenses", () => {
    const r = analyzeExpenses({ housing: 30000, food: 10000, transport: 5000, other: 5000 });
    expect(r.total).toBe(50000);
    expect(r.top).toBe("Housing");
  });

  it("plans monthly savings", () => {
    const r = monthlySavingsPlan({ income: 80000, expenses: 50000, goal: 120000, months: 12 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.requiredMonthly).toBe(10000);
  });

  it("analyzes subscriptions", () => {
    const r = subscriptionAnalyzer({ monthlyTotal: 2500, count: 5 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.annualCost).toBe(30000);
  });

  it("builds investment plan", () => {
    const r = investmentPlan({ goal: 1000000, years: 10, expectedReturn: 12, risk: "medium" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.monthlySip).toBeGreaterThan(0);
  });

  it("scores risk profile", () => {
    const r = riskAnalyzeInvestor({ age: 28, horizonYears: 15, incomeStability: 80 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.profile).toBe("high");
  });

  it("allocates assets", () => {
    const r = assetAllocation({ age: 30, risk: "medium" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.equity + r.debt + r.gold + r.cash).toBe(100);
  });

  it("compares debt strategies", () => {
    const r = debtRepaymentPlanner({
      debts: [
        { balance: 50000, apr: 18, minimum: 2000 },
        { balance: 20000, apr: 24, minimum: 800 },
      ],
      extraPayment: 1000,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.snowball.months).toBeGreaterThan(0);
  });

  it("estimates credit score actions", () => {
    const r = creditScoreImprover({
      utilizationPercent: 45,
      paymentHistoryScore: 70,
      accountAgeYears: 3,
      recentInquiries: 3,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.actions.length).toBeGreaterThan(0);
  });
});
