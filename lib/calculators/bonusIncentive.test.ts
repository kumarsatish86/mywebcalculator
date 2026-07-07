import { describe, expect, it } from "vitest";
import {
  annualBonus,
  incentivePayout,
  performanceBonus,
  profitSharing,
  salesCommission,
  variablePay,
} from "./bonusIncentive";

describe("bonusIncentive", () => {
  it("computes annual bonus", () => {
    const result = annualBonus({ annualSalary: 1200000, bonusPercent: 15 });
    expect(result.annualBonus).toBe(180000);
    expect(result.monthlyBonus).toBe(15000);
    expect(result.totalCompensation).toBe(1380000);
  });

  it("computes performance bonus", () => {
    const result = performanceBonus({ annualSalary: 1200000, targetBonusPercent: 20, performanceScore: 80 });
    expect(result.targetBonus).toBe(240000);
    expect(result.earnedBonus).toBe(192000);
  });

  it("computes sales commission", () => {
    const result = salesCommission({ salesAmount: 5000000, commissionPercent: 5, baseSalary: 500000 });
    expect(result.commission).toBe(250000);
    expect(result.totalPayout).toBe(750000);
  });

  it("computes incentive payout", () => {
    const result = incentivePayout({ targetAmount: 1000000, achievedAmount: 800000, incentiveAt100: 100000 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.achievementPercent).toBe(80);
    expect(result.payout).toBe(80000);
  });

  it("caps incentive at 100% achievement", () => {
    const result = incentivePayout({ targetAmount: 1000000, achievedAmount: 1500000, incentiveAt100: 100000 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.payout).toBe(100000);
  });

  it("computes profit sharing", () => {
    const result = profitSharing({ companyProfit: 10000000, sharePercent: 2 });
    expect(result.profitShare).toBe(200000);
  });

  it("computes variable pay", () => {
    const result = variablePay({ fixedAnnual: 1000000, variablePercent: 30, achievementPercent: 90 });
    expect(result.variableAt100).toBe(300000);
    expect(result.variableEarned).toBe(270000);
    expect(result.totalAnnual).toBe(1270000);
  });
});
