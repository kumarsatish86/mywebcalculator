import { describe, expect, it } from "vitest";
import {
  dollarCostAveraging,
  investmentFeeImpact,
  moneyWeightedReturn,
  monteCarloInvestment,
  netWorthGrowth,
  rebalancingCalc,
  timeWeightedReturn,
} from "./advancedProInvestment";

describe("advancedProInvestment", () => {
  it("runs seeded Monte Carlo with stable percentiles", () => {
    const a = monteCarloInvestment({
      principal: 100000,
      annualReturnMeanPercent: 10,
      annualVolPercent: 15,
      years: 10,
      simulations: 200,
      seed: 7,
    });
    const b = monteCarloInvestment({
      principal: 100000,
      annualReturnMeanPercent: 10,
      annualVolPercent: 15,
      years: 10,
      simulations: 200,
      seed: 7,
    });
    expect("error" in a).toBe(false);
    if ("error" in a || "error" in b) return;
    expect(a.p50).toBeCloseTo(b.p50, 6);
    expect(a.p90).toBeGreaterThan(a.p10);
    expect(a.meanEnding).toBeGreaterThan(0);
  });

  it("computes DCA average cost", () => {
    const result = dollarCostAveraging({
      amountPerPeriod: 1000,
      pricesCsv: "100, 80, 50",
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.periods).toBe(3);
    expect(result.totalInvested).toBe(3000);
    expect(result.totalShares).toBeCloseTo(10 + 12.5 + 20, 8);
    expect(result.averageCost).toBeCloseTo(3000 / result.totalShares, 6);
  });

  it("computes time-weighted return", () => {
    const result = timeWeightedReturn({
      periodReturnsCsv: "10, -5, 20",
      annualize: true,
      periodsPerYear: 1,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    // (1.1 * 0.95 * 1.2) - 1 = 0.254
    expect(result.twrPercent).toBeCloseTo(25.4, 4);
    expect(result.annualizedTwrPercent).not.toBeNull();
  });

  it("solves simple money-weighted IRR", () => {
    const result = moneyWeightedReturn({
      mode: "simple",
      initialInvestment: 10000,
      endingValue: 14641,
      years: 4,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.mwrAnnualPercent).toBeCloseTo(10, 1);
  });

  it("compares fee drag", () => {
    const result = investmentFeeImpact({
      principal: 100000,
      annualReturnPercent: 10,
      annualFeePercent: 1,
      years: 20,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.endingGross).toBeGreaterThan(result.endingNet);
    expect(result.feeDrag).toBeGreaterThan(0);
  });

  it("computes rebalancing trades", () => {
    const result = rebalancingCalc({
      portfolioValue: 100000,
      targetWeightsCsv: "60, 40",
      currentValuesCsv: "70000, 30000",
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.sleeves[0]!.action).toBe("sell");
    expect(result.sleeves[1]!.action).toBe("buy");
    expect(result.sleeves[0]!.tradeAmount).toBeCloseTo(-10000, 2);
  });

  it("projects net worth growth", () => {
    const result = netWorthGrowth({
      startingNetWorth: 500000,
      annualSavings: 100000,
      annualReturnPercent: 8,
      years: 5,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.path).toHaveLength(6);
    expect(result.endingNetWorth).toBeGreaterThan(500000);
  });
});
