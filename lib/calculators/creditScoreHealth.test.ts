import { describe, expect, it } from "vitest";
import {
  creditScoreSimulator,
  creditUtilization,
  loanEligibilityByScore,
} from "./creditScoreHealth";

describe("creditScoreHealth", () => {
  it("simulates score and utilization", () => {
    const s = creditScoreSimulator({
      paymentHistoryScore: 90,
      utilizationPercent: 20,
      ageOfCreditYears: 8,
      inquiriesLastYear: 1,
      mixScore: 70,
    });
    expect("error" in s).toBe(false);
    if ("error" in s) return;
    expect(s.estimatedScore).toBeGreaterThan(600);

    const u = creditUtilization({ balancesCsv: "20000,10000", limitsCsv: "100000,50000" });
    expect("error" in u).toBe(false);
    if ("error" in u) return;
    expect(u.utilizationPercent).toBeCloseTo(20, 4);
  });

  it("checks eligibility", () => {
    const e = loanEligibilityByScore({
      creditScore: 760,
      monthlyIncome: 80000,
      requestedAmount: 500000,
    });
    expect("error" in e).toBe(false);
    if ("error" in e) return;
    expect(e.eligible).toBe(true);
    expect(e.tier).toBe("Prime");
  });
});
