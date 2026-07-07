import { describe, expect, it } from "vitest";
import {
  COUNTRY_PROFILES,
  costOfLivingAdjustedSalary,
  countryFromSlug,
  countrySalary,
  salaryAfterTaxCountry,
} from "./internationalSalary";

describe("internationalSalary", () => {
  it("maps slugs to countries", () => {
    expect(countryFromSlug("salary-calculator-usa")).toBe("usa");
    expect(countryFromSlug("salary-calculator-uae")).toBe("uae");
    expect(countryFromSlug("unknown")).toBeNull();
  });

  it("computes USA salary breakdown", () => {
    const result = countrySalary({
      grossMonthly: 8000,
      taxPercent: 22,
      deductionPercent: 7.65,
      country: "usa",
    });
    expect(result.currency).toBe("USD");
    expect(result.netMonthly).toBeLessThan(8000);
  });

  it("computes UAE salary with zero tax", () => {
    const result = countrySalary({
      grossMonthly: 25000,
      taxPercent: 0,
      deductionPercent: 0,
      country: "uae",
    });
    expect(result.netMonthly).toBe(25000);
    expect(result.currency).toBe("AED");
  });

  it("computes salary after tax with country defaults", () => {
    const result = salaryAfterTaxCountry({ grossMonthly: 5000, country: "uk" });
    expect(result.taxAmount).toBeCloseTo(5000 * (COUNTRY_PROFILES.uk.defaultTaxPercent / 100), 0);
  });

  it("adjusts salary for cost of living", () => {
    const result = costOfLivingAdjustedSalary({ salary: 100000, fromColIndex: 100, toColIndex: 80 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.adjustedSalary).toBe(80000);
    expect(result.percentChange).toBe(-20);
  });

  it("rejects invalid COL indices", () => {
    const result = costOfLivingAdjustedSalary({ salary: 100000, fromColIndex: 0, toColIndex: 80 });
    expect("error" in result).toBe(true);
  });
});
