import { describe, expect, it } from "vitest";
import {
  afterTaxReturn,
  capitalGainsTax,
  elssCalc,
  inflationVsReturn,
  realRateOfReturn,
  taxSavingInvestment,
} from "./taxRealReturn";

describe("taxRealReturn", () => {
  it("computes India equity LTCG with exemption", () => {
    const result = capitalGainsTax({
      buyValue: 100000,
      sellValue: 300000,
      holdingYears: 2,
      regime: "india-equity",
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.isLongTerm).toBe(true);
    expect(result.gain).toBe(200000);
    expect(result.taxableGain).toBe(75000);
    expect(result.taxEstimate).toBeCloseTo(75000 * 0.125, 2);
  });

  it("computes global flat capital gains tax", () => {
    const result = capitalGainsTax({
      buyValue: 10000,
      sellValue: 15000,
      holdingYears: 0.5,
      regime: "global-flat",
      flatTaxRatePercent: 20,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.taxEstimate).toBe(1000);
  });

  it("computes 80C-style tax saving", () => {
    const result = taxSavingInvestment({
      investmentAmount: 200000,
      marginalTaxRatePercent: 30,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.eligibleAmount).toBe(150000);
    expect(result.taxSaved).toBe(45000);
  });

  it("projects ELSS SIP with tax benefit", () => {
    const result = elssCalc({
      monthlySip: 12500,
      years: 5,
      expectedReturnPercent: 12,
      marginalTaxRatePercent: 30,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.maturityValue).toBeGreaterThan(result.totalInvested);
    expect(result.firstYearTaxSaved).toBe(45000);
  });

  it("computes after-tax and real returns", () => {
    const atr = afterTaxReturn({ preTaxReturnPercent: 10, taxRatePercent: 20 });
    expect("error" in atr).toBe(false);
    if ("error" in atr) return;
    expect(atr.afterTaxReturnPercent).toBe(8);

    const real = realRateOfReturn({ nominalReturnPercent: 12, inflationPercent: 5 });
    expect(real.realReturnPercent).toBeCloseTo(((1.12 / 1.05) - 1) * 100, 4);
  });

  it("compares inflation vs return wealth", () => {
    const result = inflationVsReturn({
      principal: 100000,
      nominalReturnPercent: 10,
      inflationPercent: 5,
      years: 10,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.nominalFutureValue).toBeGreaterThan(result.realFutureValue);
    expect(result.purchasingPowerLoss).toBeGreaterThan(0);
  });
});
