import { describe, expect, it } from "vitest";
import { analyzeExpensesRich, monthlySavingsPlanRich, planBudgetRich } from "./aiFinanceSmartRich";

describe("aiFinanceSmartRich", () => {
  it("scores budget health", () => {
    const r = planBudgetRich({
      income: 100000,
      framework: "50-30-20",
      rent: 25000,
      utilities: 4000,
      emi: 12000,
      insurance: 2000,
      groceries: 8000,
      transport: 6000,
      entertainment: 4000,
      shopping: 3000,
      other: 2000,
      savingsGoal: 15000,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.healthScore).toBeGreaterThan(0);
    expect(r.insights.length).toBeGreaterThan(0);
    expect(r.chartSlices.length).toBeGreaterThan(0);
  });

  it("analyzes expenses with benchmarks", () => {
    const r = analyzeExpensesRich({
      housing: 30000,
      food: 12000,
      transport: 8000,
      subscriptions: 2500,
      healthcare: 2000,
      education: 0,
      shopping: 5000,
      other: 5000,
      income: 100000,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.categories.length).toBe(8);
  });

  it("projects savings path", () => {
    const r = monthlySavingsPlanRich({
      income: 100000,
      expenses: 70000,
      goal: 500000,
      months: 24,
      expectedReturnPercent: 10,
      inflationPercent: 5,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.projection.length).toBe(25);
    expect(r.scenarios.length).toBe(3);
  });
});
