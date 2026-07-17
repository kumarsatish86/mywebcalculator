import { describe, expect, it } from "vitest";
import {
  cagrCalc,
  expenseRatioImpact,
  mutualFundReturns,
  sipStepUp,
  sipVsLumpsum,
  stpCalc,
  swpCalc,
  xirrMutualFund,
} from "./mutualFund";

describe("mutualFund", () => {
  it("computes mutual fund returns", () => {
    const result = mutualFundReturns({ invested: 100000, currentValue: 160000, years: 4 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.absoluteReturnPercent).toBe(60);
    expect(result.cagrPercent).toBeGreaterThan(10);
  });

  it("compares SIP vs lumpsum", () => {
    const result = sipVsLumpsum({
      monthlySip: 10000,
      lumpsumAmount: 1200000,
      annualRatePercent: 12,
      years: 10,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.sipInvested).toBe(1200000);
    expect(result.lumpsumFutureValue).toBeGreaterThan(result.sipFutureValue);
  });

  it("computes step-up SIP", () => {
    const flat = sipStepUp({
      startingMonthly: 10000,
      annualRatePercent: 12,
      years: 5,
      stepUpPercent: 0,
    });
    const stepped = sipStepUp({
      startingMonthly: 10000,
      annualRatePercent: 12,
      years: 5,
      stepUpPercent: 10,
    });
    expect("error" in flat).toBe(false);
    expect("error" in stepped).toBe(false);
    if ("error" in flat || "error" in stepped) return;
    expect(stepped.futureValue).toBeGreaterThan(flat.futureValue);
    expect(stepped.endingMonthly).toBeGreaterThan(stepped.startingMonthly);
  });

  it("runs SWP until end or depletion", () => {
    const ok = swpCalc({
      initialCorpus: 5000000,
      monthlyWithdrawal: 20000,
      annualRatePercent: 8,
      years: 10,
    });
    expect("error" in ok).toBe(false);
    if ("error" in ok) return;
    expect(ok.depleted).toBe(false);
    expect(ok.endingCorpus).toBeGreaterThan(0);

    const deplete = swpCalc({
      initialCorpus: 100000,
      monthlyWithdrawal: 20000,
      annualRatePercent: 0,
      years: 10,
    });
    expect("error" in deplete).toBe(false);
    if ("error" in deplete) return;
    expect(deplete.depleted).toBe(true);
  });

  it("transfers via STP", () => {
    const result = stpCalc({
      sourceCorpus: 1200000,
      monthlyTransfer: 10000,
      sourceRatePercent: 6,
      destinationRatePercent: 12,
      years: 5,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.totalTransferred).toBeGreaterThan(0);
    expect(result.destinationEnding).toBeGreaterThan(0);
  });

  it("shows expense ratio drag", () => {
    const result = expenseRatioImpact({
      monthlySip: 10000,
      grossReturnPercent: 12,
      expenseRatioPercent: 1.5,
      years: 10,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.costOfExpenses).toBeGreaterThan(0);
    expect(result.netReturnPercent).toBeCloseTo(10.5, 5);
  });

  it("computes CAGR", () => {
    const result = cagrCalc({ initialValue: 100, finalValue: 200, years: 5 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.cagrPercent).toBeCloseTo(14.87, 1);
  });

  it("computes XIRR for lumpsum", () => {
    const result = xirrMutualFund({
      initialInvestment: 100000,
      monthlySip: 0,
      finalValue: 161051,
      years: 5,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.xirrPercent).toBeCloseTo(10, 0);
  });
});
