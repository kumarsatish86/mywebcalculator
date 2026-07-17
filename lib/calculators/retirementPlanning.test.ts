import { describe, expect, it } from "vitest";
import {
  fireCalc,
  inflationImpactRetirement,
  lifeExpectancyFinancial,
  pensionCalc,
  retirementCalc,
  retirementCorpusNeeded,
  retirementWithdrawal,
} from "./retirementPlanning";

describe("retirementPlanning", () => {
  it("projects retirement corpus", () => {
    const result = retirementCalc({
      currentAge: 30,
      retirementAge: 60,
      currentSavings: 500000,
      monthlySavings: 20000,
      expectedReturnPercent: 10,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.yearsToRetirement).toBe(30);
    expect(result.retirementCorpus).toBeGreaterThan(result.totalContributed);
  });

  it("computes FIRE number and years", () => {
    const result = fireCalc({
      annualExpenses: 600000,
      withdrawalRatePercent: 4,
      currentSavings: 1000000,
      monthlySavings: 50000,
      expectedReturnPercent: 10,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.fireNumber).toBe(15000000);
    expect(result.yearsToFire).toBeGreaterThan(0);
  });

  it("computes pension from corpus", () => {
    const result = pensionCalc({ corpus: 10000000, annualPayoutRatePercent: 4 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.monthlyPension).toBeCloseTo(33333.33, 0);
  });

  it("computes required retirement corpus", () => {
    const result = retirementCorpusNeeded({
      monthlyExpensesAtRetirement: 50000,
      withdrawalRatePercent: 4,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.requiredCorpus).toBe(15000000);
  });

  it("simulates withdrawals", () => {
    const ok = retirementWithdrawal({
      corpus: 5000000,
      monthlyWithdrawal: 20000,
      annualReturnPercent: 6,
      years: 20,
    });
    expect("error" in ok).toBe(false);
    if ("error" in ok) return;
    expect(ok.depleted).toBe(false);

    const deplete = retirementWithdrawal({
      corpus: 100000,
      monthlyWithdrawal: 20000,
      annualReturnPercent: 0,
      years: 10,
    });
    expect("error" in deplete).toBe(false);
    if ("error" in deplete) return;
    expect(deplete.depleted).toBe(true);
  });

  it("inflates expenses to retirement", () => {
    const result = inflationImpactRetirement({
      monthlyExpensesToday: 50000,
      yearsToRetirement: 20,
      inflationPercent: 5,
      plannedCorpus: 10000000,
      withdrawalRatePercent: 4,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.monthlyExpensesAtRetirement).toBeGreaterThan(50000);
    expect(result.requiredCorpus).toBeGreaterThan(0);
  });

  it("computes financial longevity horizon", () => {
    const result = lifeExpectancyFinancial({
      currentAge: 35,
      retirementAge: 60,
      expectedLifespan: 85,
      monthlyExpensesAtRetirement: 40000,
      inflationPercent: 5,
      withdrawalRatePercent: 4,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.yearsInRetirement).toBe(25);
    expect(result.yearsToRetirement).toBe(25);
  });
});
