import { describe, expect, it } from "vitest";
import { monthlyLoanPayment } from "./loanPayment";
import { simulateLoanWithOptions } from "./loanSimulation";

describe("simulateLoanWithOptions", () => {
  it("pays off earlier with extra principal", () => {
    const base = monthlyLoanPayment({
      principal: 25000,
      annualRatePercent: 6.5,
      termMonths: 60,
    });
    expect("error" in base).toBe(false);
    if ("error" in base) return;

    const noExtra = simulateLoanWithOptions({
      principal: 25000,
      annualRatePercent: 6.5,
      contractualEmi: base.payment,
      extraPrincipalMonthly: 0,
    });
    const withExtra = simulateLoanWithOptions({
      principal: 25000,
      annualRatePercent: 6.5,
      contractualEmi: base.payment,
      extraPrincipalMonthly: 100,
    });
    expect("error" in noExtra).toBe(false);
    expect("error" in withExtra).toBe(false);
    if ("error" in noExtra || "error" in withExtra) return;
    expect(withExtra.monthCount).toBeLessThan(noExtra.monthCount);
    expect(withExtra.totalInterest).toBeLessThan(noExtra.totalInterest);
  });

  it("supports annual EMI step-up", () => {
    const base = monthlyLoanPayment({
      principal: 25000,
      annualRatePercent: 6.5,
      termMonths: 60,
    });
    expect("error" in base).toBe(false);
    if ("error" in base) return;

    const stepped = simulateLoanWithOptions({
      principal: 25000,
      annualRatePercent: 6.5,
      contractualEmi: base.payment,
      stepUpPercentPerYear: 5,
    });
    expect("error" in stepped).toBe(false);
    if ("error" in stepped) return;
    expect(stepped.rows[12]!.payment).toBeGreaterThan(stepped.rows[0]!.payment);
  });

  it("errors when payment cannot cover monthly interest", () => {
    const impossible = simulateLoanWithOptions({
      principal: 100000,
      annualRatePercent: 24,
      contractualEmi: 1000,
      extraPrincipalMonthly: 0,
    });
    expect("error" in impossible).toBe(true);
  });

  it("supports bankPennyRounding without breaking payoff", () => {
    const base = monthlyLoanPayment({
      principal: 25000,
      annualRatePercent: 6.5,
      termMonths: 60,
    });
    expect("error" in base).toBe(false);
    if ("error" in base) return;

    const plain = simulateLoanWithOptions({
      principal: 25000,
      annualRatePercent: 6.5,
      contractualEmi: base.payment,
      extraPrincipalMonthly: 0,
      bankPennyRounding: false,
    });
    const rounded = simulateLoanWithOptions({
      principal: 25000,
      annualRatePercent: 6.5,
      contractualEmi: base.payment,
      extraPrincipalMonthly: 0,
      bankPennyRounding: true,
    });
    expect("error" in plain).toBe(false);
    expect("error" in rounded).toBe(false);
    if ("error" in plain || "error" in rounded) return;
    expect(rounded.rows[0]!.interest).toBe(Math.round(rounded.rows[0]!.interest * 100) / 100);
    // Rounding can leave a sub-cent trail requiring one extra month vs float math.
    expect(rounded.monthCount).toBeGreaterThanOrEqual(plain.monthCount);
    expect(rounded.monthCount).toBeLessThanOrEqual(plain.monthCount + 2);
    const tail = rounded.rows[rounded.rows.length - 1]!;
    expect(tail.balance).toBeLessThanOrEqual(0.06);
  });
});
