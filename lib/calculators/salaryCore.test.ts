import { describe, expect, it } from "vitest";
import {
  annualFromMonthly,
  ctcFromGross,
  grossFromCtc,
  grossFromNet,
  hourlyToSalary,
  monthlyFromAnnual,
  netFromGross,
  salaryToHourly,
} from "./salaryCore";

describe("salaryCore", () => {
  it("converts monthly to annual", () => {
    expect(annualFromMonthly(5000)).toBe(60000);
    expect(monthlyFromAnnual(60000)).toBe(5000);
  });

  it("computes net from gross", () => {
    const result = netFromGross({ gross: 100000, taxPercent: 20, deductionPercent: 5 });
    expect(result.net).toBe(75000);
  });

  it("reverse-calculates gross from net", () => {
    const result = grossFromNet({ net: 75000, taxPercent: 20, deductionPercent: 5 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.gross).toBeCloseTo(100000, 0);
  });

  it("computes CTC from gross", () => {
    const result = ctcFromGross({ gross: 100000, employerPercent: 12 });
    expect(result.ctc).toBeCloseTo(112000, 0);
  });

  it("computes gross from CTC", () => {
    const result = grossFromCtc({ ctc: 112000, employerPercent: 12 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.gross).toBeCloseTo(100000, 0);
  });

  it("converts hourly to salary", () => {
    const result = hourlyToSalary({ hourly: 25, hoursPerWeek: 40, weeksPerYear: 52 });
    expect(result.annual).toBe(52000);
    expect(result.monthly).toBeCloseTo(52000 / 12, 2);
  });

  it("converts salary to hourly", () => {
    const result = salaryToHourly({ annual: 52000, hoursPerWeek: 40, weeksPerYear: 52 });
    expect(result.hourly).toBeCloseTo(25, 2);
  });
});
