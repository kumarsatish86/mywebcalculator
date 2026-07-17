import { describe, expect, it } from "vitest";
import {
  apyFromNominal,
  aprFromFees,
  monthlyAnnualInterestConverter,
  reducingVsFlatConverter,
} from "./interestRateConversion";

describe("interestRateConversion", () => {
  it("computes APR from fees", () => {
    const r = aprFromFees({ principal: 500000, annualInterestPercent: 10, fees: 15000, years: 3 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.aprPercent).toBeGreaterThan(0);
    expect(r.totalCost).toBe(500000 * 0.1 * 3 + 15000);
  });

  it("computes APY from nominal", () => {
    const r = apyFromNominal({ nominalRatePercent: 7, compoundsPerYear: 4 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.apyPercent).toBeGreaterThan(7);
  });

  it("converts monthly to annual and flat vs reducing shape", () => {
    const conv = monthlyAnnualInterestConverter({ mode: "monthly-to-annual", ratePercent: 1.5 });
    expect("error" in conv).toBe(false);
    if ("error" in conv) return;
    expect(conv.resultPercent).toBe(18);

    const flat = reducingVsFlatConverter({
      principal: 1000000,
      flatAnnualPercent: 10,
      reducingAprPercent: 10,
      termMonths: 60,
    });
    expect("error" in flat).toBe(false);
    if ("error" in flat) return;
    expect(flat.reducing.emi).toBeGreaterThan(0);
    expect(flat.flat.totalInterest).toBeDefined();
  });
});
