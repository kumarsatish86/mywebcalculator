import { describe, expect, it } from "vitest";
import {
  assetAllocation,
  betaCalc,
  drawdownCalc,
  portfolioDiversification,
  riskTolerance,
  sharpeRatio,
  volatilityCalc,
} from "./riskPortfolioAnalysis";

describe("riskPortfolioAnalysis", () => {
  it("suggests asset allocation", () => {
    const result = assetAllocation({ age: 30, riskProfile: "moderate", portfolioValue: 1000000 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.mix.equity + result.mix.debt + result.mix.gold + result.mix.cash).toBe(100);
    expect(result.amounts?.equity).toBeGreaterThan(0);
  });

  it("measures diversification via HHI", () => {
    const result = portfolioDiversification({ weightA: 70, weightB: 20, weightC: 10 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.hhi).toBeGreaterThan(0.4);
    expect(result.concentration).toBe("high");
  });

  it("scores risk tolerance", () => {
    const result = riskTolerance({
      age: 30,
      yearsUntilGoal: 20,
      incomeStability: 4,
      maxLossPercentComfortable: 30,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.score).toBeGreaterThan(50);
  });

  it("computes Sharpe ratio", () => {
    const result = sharpeRatio({
      portfolioReturnPercent: 12,
      riskFreePercent: 6,
      volatilityPercent: 10,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.sharpe).toBeCloseTo(0.6, 5);
  });

  it("computes beta", () => {
    const result = betaCalc({
      assetVolatilityPercent: 20,
      marketVolatilityPercent: 15,
      correlation: 0.9,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.beta).toBeCloseTo((20 / 15) * 0.9, 5);
  });

  it("computes volatility from returns", () => {
    const result = volatilityCalc({
      periodReturnsPercent: [2, -1, 3, 0.5, -0.5],
      periodsPerYear: 12,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.stdDevPercent).toBeGreaterThan(0);
    expect(result.annualizedVolatilityPercent).toBeGreaterThan(result.stdDevPercent);
  });

  it("computes max drawdown", () => {
    const result = drawdownCalc({ values: [100, 120, 90, 95, 110] });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.maxDrawdownPercent).toBeCloseTo(25, 5);
    expect(result.peakValue).toBe(120);
    expect(result.troughValue).toBe(90);
  });
});
