import { describe, expect, it } from "vitest";
import { computeGstPlusLoan } from "./loanRegion";

describe("loanRegion", () => {
  it("computes GST-inclusive loan EMI", () => {
    const result = computeGstPlusLoan({
      baseAmount: 5000000,
      gstPercent: 5,
      downPayment: 1000000,
      apr: 8.5,
      termMonths: 240,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.gstAmount).toBe(250000);
    expect(result.totalCost).toBe(5250000);
    expect(result.loanPrincipal).toBe(4250000);
    expect(result.emi).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it("rejects when down payment exceeds total cost", () => {
    const result = computeGstPlusLoan({
      baseAmount: 100000,
      gstPercent: 5,
      downPayment: 200000,
      apr: 10,
      termMonths: 60,
    });
    expect("error" in result).toBe(true);
  });
});
