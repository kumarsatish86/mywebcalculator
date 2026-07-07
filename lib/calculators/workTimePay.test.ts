import { describe, expect, it } from "vitest";
import {
  doublePayHoliday,
  hourlyWageFromAnnual,
  hourlyWageFromRate,
  nightShiftAllowance,
  overtimePay,
  shiftPay,
  timesheetPay,
  workHours,
} from "./workTimePay";

describe("workTimePay", () => {
  it("computes hourly wage from rate", () => {
    const result = hourlyWageFromRate({ hourlyRate: 500, hoursPerWeek: 40, weeksPerYear: 52 });
    expect(result.annualPay).toBe(1040000);
    expect(result.monthlyPay).toBeCloseTo(1040000 / 12, 0);
  });

  it("computes hourly wage from annual", () => {
    const result = hourlyWageFromAnnual({ annualSalary: 1040000, hoursPerWeek: 40, weeksPerYear: 52 });
    expect(result.hourlyRate).toBeCloseTo(500, 0);
  });

  it("computes overtime pay", () => {
    const result = overtimePay({ hourlyRate: 500, regularHours: 40, overtimeHours: 10, overtimeMultiplier: 1.5 });
    expect(result.regularPay).toBe(20000);
    expect(result.overtimePay).toBe(7500);
    expect(result.totalPay).toBe(27500);
  });

  it("computes double pay holiday", () => {
    const result = doublePayHoliday({ hourlyRate: 500, holidayHours: 8, multiplier: 2 });
    expect(result.totalPay).toBe(8000);
    expect(result.premiumPay).toBe(4000);
  });

  it("computes work hours", () => {
    const result = workHours({ dailyHours: 8, daysPerWeek: 5 });
    expect(result.weeklyHours).toBe(40);
    expect(result.annualHours).toBe(2080);
  });

  it("computes timesheet pay", () => {
    const result = timesheetPay({ hourlyRate: 400, regularHours: 38, overtimeHours: 5, overtimeMultiplier: 1.5 });
    expect(result.totalPay).toBe(38 * 400 + 5 * 400 * 1.5);
  });

  it("computes shift pay with differential", () => {
    const result = shiftPay({ hourlyRate: 500, shiftHours: 8, differentialPercent: 15 });
    expect(result.differentialPay).toBe(600);
    expect(result.totalPay).toBe(4600);
  });

  it("computes night shift allowance", () => {
    const result = nightShiftAllowance({ hourlyRate: 500, nightHours: 8, allowancePercent: 20 });
    expect(result.allowancePay).toBe(800);
    expect(result.totalPay).toBe(4800);
  });
});
