import { describe, expect, it } from "vitest";
import {
  carPurchasePlan,
  childEducationPlan,
  dreamHomePlan,
  financialFreedomPlan,
  goalPlan,
  goalSipCalc,
  wealthGoalPlan,
} from "./goalBasedInvestment";

describe("goalBasedInvestment", () => {
  it("plans a generic inflated goal", () => {
    const result = goalPlan({
      costToday: 1000000,
      years: 10,
      inflationPercent: 6,
      expectedReturnPercent: 12,
      existingCorpus: 100000,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.futureCost).toBeGreaterThan(1000000);
    expect(result.requiredMonthlySip).toBeGreaterThan(0);
  });

  it("plans child education", () => {
    const result = childEducationPlan({
      educationCostToday: 2000000,
      yearsUntilCollege: 12,
      existingCorpus: 200000,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.requiredMonthlySip).toBeGreaterThan(0);
  });

  it("plans wealth goal without inflation", () => {
    const result = wealthGoalPlan({ targetWealth: 10000000, years: 15, existingCorpus: 500000 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.futureCost).toBe(10000000);
  });

  it("plans dream home down payment", () => {
    const result = dreamHomePlan({
      homeCostToday: 10000000,
      years: 8,
      downPaymentPercent: 20,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.downPaymentToday).toBe(2000000);
    expect(result.downPaymentFuture).toBe(result.futureCost);
  });

  it("plans car purchase", () => {
    const result = carPurchasePlan({ carCostToday: 800000, years: 3 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.requiredMonthlySip).toBeGreaterThan(0);
  });

  it("computes financial freedom number and SIP", () => {
    const result = financialFreedomPlan({
      annualExpenses: 600000,
      withdrawalRatePercent: 4,
      years: 20,
      existingCorpus: 1000000,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.freedomNumber).toBe(15000000);
    expect(result.requiredMonthlySip).toBeGreaterThan(0);
  });

  it("computes goal SIP for a fixed target", () => {
    const result = goalSipCalc({
      goalAmount: 5000000,
      years: 10,
      expectedReturnPercent: 12,
      existingCorpus: 0,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.requiredMonthlySip).toBeGreaterThan(0);
  });

  it("returns zero SIP when existing corpus already covers goal", () => {
    const result = goalSipCalc({
      goalAmount: 100000,
      years: 5,
      expectedReturnPercent: 10,
      existingCorpus: 200000,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.requiredMonthlySip).toBe(0);
  });
});
