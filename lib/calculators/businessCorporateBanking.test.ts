import { describe, expect, it } from "vitest";
import {
  businessCreditLine,
  cashFlowCalc,
  invoiceFinancing,
  workingCapitalLoan,
} from "./businessCorporateBanking";

describe("businessCorporateBanking", () => {
  it("computes working capital EMI", () => {
    const r = workingCapitalLoan({ principal: 2000000, annualRatePercent: 12, termMonths: 36 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.payment).toBeGreaterThan(0);
    expect(r.totalInterest).toBeGreaterThan(0);
  });

  it("computes cash flow status", () => {
    const r = cashFlowCalc({ inflows: 500000, outflows: 420000, openingCash: 100000 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.netCashFlow).toBe(80000);
    expect(r.closingCash).toBe(180000);
    expect(r.status).toBe("surplus");
  });

  it("computes credit line and invoice financing", () => {
    const cl = businessCreditLine({
      creditLimit: 1000000,
      drawnAmount: 600000,
      annualRatePercent: 14,
      daysDrawn: 30,
    });
    expect("error" in cl).toBe(false);
    if ("error" in cl) return;
    expect(cl.available).toBe(400000);

    const inv = invoiceFinancing({
      invoiceAmount: 800000,
      advancePercent: 80,
      feePercent: 1.5,
      daysUntilPayment: 45,
    });
    expect("error" in inv).toBe(false);
    if ("error" in inv) return;
    expect(inv.netReceived).toBeLessThan(inv.advanceAmount);
  });
});
