import { describe, expect, it } from "vitest";
import { amortizationSchedule, amortizationTotals, monthlyLoanPayment, resolveLoanTermMonths } from "./loanPayment";

describe("resolveLoanTermMonths", () => {
  it("prefers explicit months", () => {
    expect(resolveLoanTermMonths({ termMonths: 63, termYears: 5 })).toBe(63);
  });
  it("rounds years to months", () => {
    expect(resolveLoanTermMonths({ termYears: 5 })).toBe(60);
  });
  it("rejects empty term", () => {
    const r = resolveLoanTermMonths({});
    expect(typeof r).toBe("object");
    if (typeof r === "object" && r && "error" in r) expect(r.error).toBeTruthy();
  });
});

describe("monthlyLoanPayment", () => {
  it("matches known 5y 6.5% $25k ballpark", () => {
    const r = monthlyLoanPayment({
      principal: 25000,
      annualRatePercent: 6.5,
      termYears: 5,
    });
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.termMonths).toBe(60);
      expect(r.payment).toBeGreaterThan(480);
      expect(r.payment).toBeLessThan(500);
      expect(r.totalInterest).toBeGreaterThan(0);
    }
  });
  it("handles zero APR", () => {
    const r = monthlyLoanPayment({ principal: 12000, annualRatePercent: 0, termMonths: 12 });
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.payment).toBe(1000);
      expect(r.totalInterest).toBe(0);
    }
  });
  it("rejects NaN principal", () => {
    const r = monthlyLoanPayment({
      principal: Number.NaN,
      annualRatePercent: 5,
      termYears: 10,
    });
    expect("error" in r).toBe(true);
  });
});

describe("amortizationSchedule bankPennyRounding", () => {
  it("zeros balance at end and rounds row amounts to cents", () => {
    const rows = amortizationSchedule(25000, 6.5, { termYears: 5 }, undefined, true);
    expect("error" in rows).toBe(false);
    if ("error" in rows) return;
    expect(rows.length).toBe(60);
    const last = rows[rows.length - 1]!;
    expect(last.balance).toBeLessThanOrEqual(0.02);
    for (const r of rows) {
      expect(Number(r.payment.toFixed(2))).toBe(r.payment);
      expect(Number(r.interest.toFixed(2))).toBe(r.interest);
      expect(Number(r.principal.toFixed(2))).toBe(r.principal);
      expect(Number(r.balance.toFixed(2))).toBe(r.balance);
    }
    const t = amortizationTotals(rows);
    expect(t.totalPaid).toBeGreaterThan(25000);
    expect(t.firstPayment).toBe(rows[0]!.payment);
  });
});
