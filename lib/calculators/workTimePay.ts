import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import {
  DEFAULT_HOURS_PER_WEEK,
  DEFAULT_WEEKS_PER_YEAR,
  hourlyToSalary,
  salaryToHourly,
} from "./salaryCore";

export type WorkTimeCurrencyCode = LoanCurrencyCode;

export const WORK_TIME_URL = {
  A: "a",
  B: "b",
  H: "h",
  R: "r",
  M: "m",
  D: "d",
  P: "p",
  X: "x",
  MD: "md",
} as const;

export const DEFAULT_OT_MULTIPLIER = 1.5;
export const DEFAULT_DOUBLE_PAY_MULTIPLIER = 2;

export function formatWorkTimeMoney(amount: number, currency: WorkTimeCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseWorkTimePaySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(WORK_TIME_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function hourlyWageFromRate(params: {
  hourlyRate: number;
  hoursPerWeek?: number;
  weeksPerYear?: number;
}) {
  const pay = hourlyToSalary({
    hourly: params.hourlyRate,
    hoursPerWeek: params.hoursPerWeek,
    weeksPerYear: params.weeksPerYear,
  });
  return {
    hourlyRate: params.hourlyRate,
    hoursPerWeek: params.hoursPerWeek ?? DEFAULT_HOURS_PER_WEEK,
    weeksPerYear: params.weeksPerYear ?? DEFAULT_WEEKS_PER_YEAR,
    weeklyPay: pay.weekly,
    monthlyPay: pay.monthly,
    annualPay: pay.annual,
  };
}

export function hourlyWageFromAnnual(params: {
  annualSalary: number;
  hoursPerWeek?: number;
  weeksPerYear?: number;
}) {
  const rate = salaryToHourly({
    annual: params.annualSalary,
    hoursPerWeek: params.hoursPerWeek,
    weeksPerYear: params.weeksPerYear,
  });
  return {
    annualSalary: params.annualSalary,
    hoursPerWeek: params.hoursPerWeek ?? DEFAULT_HOURS_PER_WEEK,
    weeksPerYear: params.weeksPerYear ?? DEFAULT_WEEKS_PER_YEAR,
    hourlyRate: rate.hourly,
    weeklyPay: rate.weekly,
    monthlyPay: params.annualSalary / 12,
    hoursPerYear: rate.hoursPerYear,
  };
}

export function overtimePay(params: {
  hourlyRate: number;
  regularHours: number;
  overtimeHours: number;
  overtimeMultiplier: number;
}): {
  hourlyRate: number;
  regularHours: number;
  overtimeHours: number;
  overtimeMultiplier: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  effectiveHourly: number;
} {
  const regularPay = params.regularHours * params.hourlyRate;
  const overtimePayAmount = params.overtimeHours * params.hourlyRate * params.overtimeMultiplier;
  const totalHours = params.regularHours + params.overtimeHours;
  const totalPay = regularPay + overtimePayAmount;
  return {
    hourlyRate: params.hourlyRate,
    regularHours: params.regularHours,
    overtimeHours: params.overtimeHours,
    overtimeMultiplier: params.overtimeMultiplier,
    regularPay,
    overtimePay: overtimePayAmount,
    totalPay,
    effectiveHourly: totalHours > 0 ? totalPay / totalHours : 0,
  };
}

export function doublePayHoliday(params: {
  hourlyRate: number;
  holidayHours: number;
  multiplier: number;
}): {
  hourlyRate: number;
  holidayHours: number;
  multiplier: number;
  basePay: number;
  premiumPay: number;
  totalPay: number;
} {
  const basePay = params.holidayHours * params.hourlyRate;
  const totalPay = params.holidayHours * params.hourlyRate * params.multiplier;
  return {
    hourlyRate: params.hourlyRate,
    holidayHours: params.holidayHours,
    multiplier: params.multiplier,
    basePay,
    premiumPay: totalPay - basePay,
    totalPay,
  };
}

export function workHours(params: {
  dailyHours: number;
  daysPerWeek: number;
  weeksPerYear?: number;
}): {
  dailyHours: number;
  daysPerWeek: number;
  weeklyHours: number;
  monthlyHours: number;
  annualHours: number;
} {
  const weeksPerYear = params.weeksPerYear ?? DEFAULT_WEEKS_PER_YEAR;
  const weeklyHours = params.dailyHours * params.daysPerWeek;
  const annualHours = weeklyHours * weeksPerYear;
  return {
    dailyHours: params.dailyHours,
    daysPerWeek: params.daysPerWeek,
    weeklyHours,
    monthlyHours: annualHours / 12,
    annualHours,
  };
}

export function timesheetPay(params: {
  hourlyRate: number;
  regularHours: number;
  overtimeHours: number;
  overtimeMultiplier: number;
}): ReturnType<typeof overtimePay> {
  return overtimePay(params);
}

export function shiftPay(params: {
  hourlyRate: number;
  shiftHours: number;
  differentialPercent: number;
}): {
  hourlyRate: number;
  shiftHours: number;
  differentialPercent: number;
  basePay: number;
  differentialPay: number;
  totalPay: number;
  effectiveHourly: number;
} {
  const basePay = params.shiftHours * params.hourlyRate;
  const differentialPay = basePay * (params.differentialPercent / 100);
  const totalPay = basePay + differentialPay;
  return {
    hourlyRate: params.hourlyRate,
    shiftHours: params.shiftHours,
    differentialPercent: params.differentialPercent,
    basePay,
    differentialPay,
    totalPay,
    effectiveHourly: params.hourlyRate * (1 + params.differentialPercent / 100),
  };
}

export function nightShiftAllowance(params: {
  hourlyRate: number;
  nightHours: number;
  allowancePercent: number;
}): {
  hourlyRate: number;
  nightHours: number;
  allowancePercent: number;
  basePay: number;
  allowancePay: number;
  totalPay: number;
  effectiveHourly: number;
} {
  const basePay = params.nightHours * params.hourlyRate;
  const allowancePay = basePay * (params.allowancePercent / 100);
  const totalPay = basePay + allowancePay;
  return {
    hourlyRate: params.hourlyRate,
    nightHours: params.nightHours,
    allowancePercent: params.allowancePercent,
    basePay,
    allowancePay,
    totalPay,
    effectiveHourly: params.hourlyRate * (1 + params.allowancePercent / 100),
  };
}
