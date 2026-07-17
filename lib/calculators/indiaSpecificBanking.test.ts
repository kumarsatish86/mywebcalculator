import { describe, expect, it } from "vitest";
import {
  bankInterestComparison,
  fdIndiaBankWise,
  loanEmiIndia,
  rdIndia,
} from "./indiaSpecificBanking";

describe("indiaSpecificBanking", () => {
  it("computes FD maturity bank-wise", () => {
    const r = fdIndiaBankWise({ principal: 500000, years: 3, ratePercent: 7, bankLabel: "SBI" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.maturityValue).toBeGreaterThan(500000);
    expect(r.bankLabel).toBe("SBI");
  });

  it("computes RD India", () => {
    const r = rdIndia({ monthlyDeposit: 5000, annualRatePercent: 6.5, months: 12 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.maturityValue).toBeGreaterThan(r.totalDeposited);
  });

  it("computes loan EMI and bank comparison", () => {
    const emi = loanEmiIndia({ principal: 1500000, annualRatePercent: 10.5, termMonths: 60 });
    expect("error" in emi).toBe(false);
    if ("error" in emi) return;
    expect(emi.payment).toBeGreaterThan(0);

    const cmp = bankInterestComparison({
      principal: 1000000,
      years: 3,
      rateA: 6.8,
      rateB: 7.0,
      rateC: 7.2,
    });
    expect("error" in cmp).toBe(false);
    if ("error" in cmp) return;
    expect(cmp.options).toHaveLength(3);
    expect(cmp.bestLabel).toBe("Bank C");
  });
});
