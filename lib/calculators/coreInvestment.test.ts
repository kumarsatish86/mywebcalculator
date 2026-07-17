import { describe, expect, it } from "vitest";
import {
  annualReturn,
  compoundInterestCalc,
  futureValueCalc,
  inflationAdjustedReturn,
  investmentGrowth,
  lumpsumInvestment,
  presentValueCalc,
  rateOfReturn,
  simpleInterestCalc,
  sipFutureValue,
} from "./coreInvestment";

describe("coreInvestment", () => {
  it("computes SIP future value", () => {
    const result = sipFutureValue({ monthlyInvestment: 10000, annualRatePercent: 12, years: 10 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.totalInvested).toBe(1200000);
    expect(result.futureValue).toBeGreaterThan(result.totalInvested);
  });

  it("computes lumpsum growth", () => {
    const result = lumpsumInvestment({ principal: 100000, annualRatePercent: 10, years: 5 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.futureValue).toBeCloseTo(100000 * Math.pow(1.1, 5), 0);
  });

  it("computes compound interest", () => {
    const result = compoundInterestCalc({
      principal: 10000,
      annualRatePercent: 8,
      years: 2,
      compoundsPerYear: 1,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.futureValue).toBeCloseTo(11664, 0);
  });

  it("computes simple interest", () => {
    const result = simpleInterestCalc({ principal: 10000, annualRatePercent: 8, years: 3 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.interest).toBe(2400);
    expect(result.totalAmount).toBe(12400);
  });

  it("computes investment growth with SIP + lump", () => {
    const result = investmentGrowth({
      initialAmount: 100000,
      monthlyContribution: 5000,
      annualRatePercent: 12,
      years: 5,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.futureValue).toBeGreaterThan(result.totalInvested);
  });

  it("computes future and present value", () => {
    const fv = futureValueCalc({ presentValue: 10000, annualRatePercent: 10, years: 5 });
    expect("error" in fv).toBe(false);
    if ("error" in fv) return;
    const pv = presentValueCalc({ futureValue: fv.futureValue, annualRatePercent: 10, years: 5 });
    expect("error" in pv).toBe(false);
    if ("error" in pv) return;
    expect(pv.presentValue).toBeCloseTo(10000, 0);
  });

  it("computes rate of return and CAGR", () => {
    const ror = rateOfReturn({ initialValue: 100, finalValue: 200, years: 5 });
    expect("error" in ror).toBe(false);
    if ("error" in ror) return;
    expect(ror.absoluteReturnPercent).toBe(100);
    expect(ror.annualizedReturnPercent).toBeCloseTo(14.87, 1);

    const ann = annualReturn({ initialValue: 100, finalValue: 200, years: 5 });
    expect("error" in ann).toBe(false);
    if ("error" in ann) return;
    expect(ann.cagrPercent).toBeCloseTo(14.87, 1);
  });

  it("computes inflation-adjusted return", () => {
    const result = inflationAdjustedReturn({ nominalReturnPercent: 12, inflationPercent: 5 });
    expect(result.realReturnPercent).toBeCloseTo(((1.12 / 1.05) - 1) * 100, 4);
  });
});
