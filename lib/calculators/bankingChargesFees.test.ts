import { describe, expect, it } from "vitest";
import {
  accountMaintenanceFee,
  atmWithdrawalFee,
  bankChargesTotal,
  loanProcessingFee,
} from "./bankingChargesFees";

describe("bankingChargesFees", () => {
  it("totals annual bank charges", () => {
    const r = bankChargesTotal({ monthlyFee: 500, annualFee: 1000, otherFeesPerYear: 2000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.annualTotal).toBe(500 * 12 + 1000 + 2000);
    expect(r.monthlyEquivalent).toBeCloseTo(r.annualTotal / 12, 5);
  });

  it("computes ATM excess fees", () => {
    const r = atmWithdrawalFee({ withdrawals: 12, freeLimit: 5, feePerExtra: 21 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.chargedWithdrawals).toBe(7);
    expect(r.totalFee).toBe(147);
  });

  it("computes loan processing fee with GST", () => {
    const r = loanProcessingFee({ loanAmount: 1000000, feePercent: 1, gstPercent: 18, flatFee: 5000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.baseFee).toBe(15000);
    expect(r.totalFee).toBeGreaterThan(r.baseFee);
    expect(r.netDisbursal).toBeLessThan(1000000);
    const m = accountMaintenanceFee({ monthlyFee: 500, months: 12, waivers: 2 });
    expect("error" in m).toBe(false);
    if ("error" in m) return;
    expect(m.monthsCharged).toBe(10);
  });
});
