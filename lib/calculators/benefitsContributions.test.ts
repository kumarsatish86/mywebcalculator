import { describe, expect, it } from "vitest";
import {
  employerPfContribution,
  epfContribution,
  epsPension,
  esicContribution,
  npsProjection,
  pfBreakdown,
  providentFund,
  superannuationProjection,
} from "./benefitsContributions";

describe("benefitsContributions", () => {
  it("computes PF breakdown at wage ceiling", () => {
    const result = pfBreakdown({ basic: 40000 });
    expect(result.pfWages).toBe(15000);
    expect(result.employeePf).toBe(1800);
    expect(result.employerEps).toBe(1249.5);
    expect(result.employerEpf).toBeCloseTo(550.5, 0);
    expect(result.employerPf).toBe(1800);
  });

  it("computes provident fund with corpus projection", () => {
    const result = providentFund({ basic: 40000, years: 10, interestRate: 8.25 });
    expect(result.employeePf).toBe(1800);
    expect(result.corpus).toBeGreaterThan(result.totalContributed);
  });

  it("computes EPF contributions", () => {
    const result = epfContribution({ basic: 40000 });
    expect(result.totalEpfMonthly).toBeCloseTo(2350.5, 0);
  });

  it("computes employer PF split", () => {
    const result = employerPfContribution({ basic: 40000 });
    expect(result.employerPf).toBe(1800);
    expect(result.employerEps).toBe(1249.5);
  });

  it("computes EPS pension", () => {
    const result = epsPension({ pensionableSalary: 15000, yearsOfService: 20 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.monthlyPension).toBeCloseTo(4285.71, 0);
  });

  it("rejects EPS pension under 10 years", () => {
    const result = epsPension({ pensionableSalary: 15000, yearsOfService: 8 });
    expect("error" in result).toBe(true);
  });

  it("projects NPS corpus", () => {
    const result = npsProjection({
      basic: 40000,
      employeePercent: 10,
      employerPercent: 10,
      years: 25,
      expectedReturn: 10,
    });
    expect(result.employeeMonthly).toBe(4000);
    expect(result.projectedCorpus).toBeGreaterThan(result.totalContributed);
  });

  it("projects superannuation corpus", () => {
    const result = superannuationProjection({
      basic: 100000,
      employerPercent: 15,
      years: 20,
      expectedReturn: 8,
    });
    expect(result.employerMonthly).toBe(15000);
    expect(result.projectedCorpus).toBeGreaterThan(result.totalContributed);
  });

  it("computes ESIC when eligible", () => {
    const result = esicContribution({ grossMonthly: 18000 });
    expect(result.applicable).toBe(true);
    expect(result.employeeEsic).toBeCloseTo(135, 0);
    expect(result.employerEsic).toBeCloseTo(585, 0);
  });

  it("marks ESIC inapplicable above ceiling", () => {
    const result = esicContribution({ grossMonthly: 25000 });
    expect(result.applicable).toBe(false);
    expect(result.totalEsic).toBe(0);
  });
});
