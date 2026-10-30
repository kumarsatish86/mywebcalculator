import { describe, expect, it } from "vitest";
import { computeDailyInterestDecision, LOAN_PRESETS } from "./dailyInterestDecision";

describe("computeDailyInterestDecision", () => {
  it("computes daily/monthly/yearly and timeline", () => {
    const r = computeDailyInterestDecision({
      principal: 25000,
      apr: 6.5,
      days: 30,
      presetId: "home",
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.dailyInterest).toBeCloseTo((25000 * 0.065) / 365, 5);
    expect(r.monthlyInterest).toBeCloseTo(r.dailyInterest * 30, 5);
    expect(r.yearlyInterest).toBeCloseTo(r.dailyInterest * 365, 5);
    expect(r.timeline).toHaveLength(5);
    expect(r.bankCompare).toHaveLength(4);
    expect(r.decisionOptions).toHaveLength(3);
    expect(r.intelligence.length).toBeGreaterThan(5);
    expect(r.healthScore).toBeGreaterThan(0);
  });

  it("delay mode adds interest and penalty", () => {
    const r = computeDailyInterestDecision({
      principal: 100000,
      apr: 12,
      days: 1,
      presetId: "personal",
      delayDays: 5,
      penaltyFlat: 350,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.delay.days).toBe(5);
    expect(r.delay.interest).toBeGreaterThan(0);
    expect(r.delay.penalty).toBe(350);
    expect(r.delay.total).toBeCloseTo(r.delay.interest + 350, 5);
  });

  it("prepay option has positive savings estimate", () => {
    const r = computeDailyInterestDecision({
      principal: 500000,
      apr: LOAN_PRESETS.personal.apr,
      days: 30,
      presetId: "personal",
      prepayAmount: 50000,
      remainingMonths: 48,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.prepay.interestSaved).toBeGreaterThan(0);
    expect(r.decisionOptions[0]!.savingsEstimate).toBeGreaterThan(0);
  });
});
