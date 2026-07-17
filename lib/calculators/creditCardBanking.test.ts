import { describe, expect, it } from "vitest";
import {
  balanceTransferSavings,
  cashbackCalc,
  creditCardPayoff,
  minimumPayment,
} from "./creditCardBanking";

describe("creditCardBanking", () => {
  it("computes minimum payment and payoff", () => {
    const min = minimumPayment({ balance: 50000, minPercent: 5, minFloor: 500 });
    expect("error" in min).toBe(false);
    if ("error" in min) return;
    expect(min.minimumDue).toBe(2500);

    const pay = creditCardPayoff({ balance: 10000, annualRatePercent: 36, monthlyPayment: 2000 });
    expect("error" in pay).toBe(false);
    if ("error" in pay) return;
    expect(pay.months).toBeGreaterThan(0);
  });

  it("computes BT savings and cashback", () => {
    const bt = balanceTransferSavings({
      balance: 100000,
      currentAprPercent: 36,
      transferAprPercent: 0,
      transferFeePercent: 2,
      months: 6,
    });
    expect("error" in bt).toBe(false);
    if ("error" in bt) return;
    expect(bt.netSavings).toBeGreaterThan(0);

    const cb = cashbackCalc({ spend: 50000, cashbackPercent: 2, cap: 500 });
    expect("error" in cb).toBe(false);
    if ("error" in cb) return;
    expect(cb.cashback).toBe(500);
  });
});
