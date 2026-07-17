import { describe, expect, it } from "vitest";
import {
  brokerageCalc,
  capitalGainEquity,
  dividendReinvestment,
  dividendYield,
  intradayPnL,
  portfolioReturn,
  riskVsReturn,
  stockAverage,
  stockCagr,
  stockReturn,
} from "./stockMarket";

describe("stockMarket", () => {
  it("computes stock return with dividends", () => {
    const result = stockReturn({
      buyPrice: 100,
      sellPrice: 120,
      quantity: 10,
      dividendsPerShare: 2,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.absoluteProfit).toBe(220);
    expect(result.returnPercent).toBe(22);
  });

  it("computes stock CAGR", () => {
    const result = stockCagr({ initialValue: 100, finalValue: 200, years: 5 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.cagrPercent).toBeCloseTo(14.87, 1);
  });

  it("computes dividend yield", () => {
    const result = dividendYield({ annualDividendPerShare: 5, sharePrice: 100 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.yieldPercent).toBe(5);
  });

  it("reinvests dividends", () => {
    const result = dividendReinvestment({
      initialShares: 100,
      sharePrice: 50,
      annualDividendPerShare: 2,
      years: 5,
      priceGrowthPercent: 8,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.endingShares).toBeGreaterThan(100);
    expect(result.endingValue).toBeGreaterThan(5000);
  });

  it("averages buy price", () => {
    const result = stockAverage({ qty1: 10, price1: 100, qty2: 10, price2: 120 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.averagePrice).toBe(110);
  });

  it("computes intraday P&L", () => {
    const result = intradayPnL({ buyPrice: 100, sellPrice: 102, quantity: 100, brokeragePercent: 0.03 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.grossPnL).toBe(200);
    expect(result.netPnL).toBeLessThan(result.grossPnL);
  });

  it("computes brokerage charges", () => {
    const b = brokerageCalc({ buyValue: 100000, sellValue: 110000, brokeragePercent: 0.05 });
    expect("error" in b).toBe(false);
    if ("error" in b) return;
    expect(b.totalCharges).toBeGreaterThan(0);
  });

  it("LTCG below exemption has zero tax", () => {
    const g = capitalGainEquity({ buyValue: 100000, sellValue: 200000, holdingYears: 2 });
    expect("error" in g).toBe(false);
    if ("error" in g) return;
    expect(g.gain).toBe(100000);
    expect(g.taxableGain).toBe(0);
    expect(g.taxEstimate).toBe(0);
  });

  it("computes portfolio and risk metrics", () => {
    const p = portfolioReturn({
      valueA: 60000,
      returnAPercent: 10,
      valueB: 40000,
      returnBPercent: 5,
    });
    expect("error" in p).toBe(false);
    if ("error" in p) return;
    expect(p.weightedReturnPercent).toBeCloseTo(8, 5);

    const r = riskVsReturn({ expectedReturnPercent: 12, riskFreePercent: 6, volatilityPercent: 10 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.sharpeLike).toBeCloseTo(0.6, 5);
    expect(r.verdict).toBe("attractive");
  });
});
