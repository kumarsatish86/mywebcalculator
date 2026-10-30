import { describe, expect, it } from "vitest";
import { computeAffordability } from "./loanAffordability";

describe("loanAffordability", () => {
  it("marks low DTI as affordable", () => {
    const r = computeAffordability(
      {
        payment: 20000,
        totalPaid: 480000,
        totalInterest: 80000,
        principal: 400000,
        termMonths: 24,
        monthlyIncome: 100000,
      },
      "INR",
    );
    expect(r.statusLabel).toBe("Affordable");
    expect(r.risk).toBe("LOW");
    expect(r.incomeUsedPct).toBe(20);
  });

  it("suggests adding income when missing", () => {
    const r = computeAffordability(
      {
        payment: 1000,
        totalPaid: 12000,
        totalInterest: 2000,
        principal: 10000,
        termMonths: 12,
      },
      "USD",
    );
    expect(r.suggestions.some((s) => s.toLowerCase().includes("income"))).toBe(true);
  });
});
