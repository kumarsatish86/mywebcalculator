import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import {
  DEFAULT_HOURS_PER_WEEK,
  DEFAULT_WEEKS_PER_YEAR,
  hourlyToSalary,
  netFromGross,
} from "./salaryCore";

export type FreelanceCurrencyCode = LoanCurrencyCode;

export const FREELANCE_URL = {
  A: "a",
  B: "b",
  H: "h",
  D: "d",
  W: "w",
  P: "p",
  T: "t",
  X: "x",
  Y: "y",
  M: "m",
} as const;

export const DEFAULT_BILLABLE_HOURS = 30;
export const DEFAULT_BILLABLE_DAYS = 5;

export function formatFreelanceMoney(amount: number, currency: FreelanceCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseFreelanceGigSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(FREELANCE_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function freelanceIncome(params: {
  hourlyRate: number;
  billableHoursPerWeek: number;
  weeksPerYear?: number;
}): {
  hourlyRate: number;
  billableHoursPerWeek: number;
  weeksPerYear: number;
  weeklyIncome: number;
  monthlyIncome: number;
  annualIncome: number;
  billableHoursPerYear: number;
} {
  const weeksPerYear = params.weeksPerYear ?? DEFAULT_WEEKS_PER_YEAR;
  const pay = hourlyToSalary({
    hourly: params.hourlyRate,
    hoursPerWeek: params.billableHoursPerWeek,
    weeksPerYear,
  });
  return {
    hourlyRate: params.hourlyRate,
    billableHoursPerWeek: params.billableHoursPerWeek,
    weeksPerYear,
    weeklyIncome: pay.weekly,
    monthlyIncome: pay.monthly,
    annualIncome: pay.annual,
    billableHoursPerYear: pay.hoursPerYear,
  };
}

export function hourlyRateFromTarget(params: {
  targetAnnualIncome: number;
  billableHoursPerWeek: number;
  weeksPerYear?: number;
}): {
  targetAnnualIncome: number;
  billableHoursPerWeek: number;
  weeksPerYear: number;
  requiredHourlyRate: number;
  billableHoursPerYear: number;
  weeklyIncome: number;
} {
  const weeksPerYear = params.weeksPerYear ?? DEFAULT_WEEKS_PER_YEAR;
  const billableHoursPerYear = params.billableHoursPerWeek * weeksPerYear;
  const requiredHourlyRate =
    billableHoursPerYear > 0 ? params.targetAnnualIncome / billableHoursPerYear : 0;
  return {
    targetAnnualIncome: params.targetAnnualIncome,
    billableHoursPerWeek: params.billableHoursPerWeek,
    weeksPerYear,
    requiredHourlyRate,
    billableHoursPerYear,
    weeklyIncome: requiredHourlyRate * params.billableHoursPerWeek,
  };
}

export function projectRate(params: {
  projectHours: number;
  projectFee: number;
}): {
  projectHours: number;
  projectFee: number;
  effectiveHourlyRate: number;
  dailyRateAt8h: number;
} | { error: string } {
  if (params.projectHours <= 0) return { error: "Project hours must be positive." };
  const effectiveHourlyRate = params.projectFee / params.projectHours;
  return {
    projectHours: params.projectHours,
    projectFee: params.projectFee,
    effectiveHourlyRate,
    dailyRateAt8h: effectiveHourlyRate * 8,
  };
}

export function freelancerTax(params: {
  grossAnnualIncome: number;
  taxPercent: number;
  expensePercent: number;
}): {
  grossAnnualIncome: number;
  taxAmount: number;
  expenseAmount: number;
  netAnnualIncome: number;
  netMonthlyIncome: number;
  effectiveTaxRate: number;
} {
  const grossMonthly = params.grossAnnualIncome / 12;
  const breakdown = netFromGross({
    gross: grossMonthly,
    taxPercent: params.taxPercent,
    deductionPercent: params.expensePercent,
  });
  const netAnnual = breakdown.annualNet;
  const totalDeductions = breakdown.taxAmount * 12 + breakdown.deductionAmount * 12;
  return {
    grossAnnualIncome: params.grossAnnualIncome,
    taxAmount: breakdown.taxAmount * 12,
    expenseAmount: breakdown.deductionAmount * 12,
    netAnnualIncome: netAnnual,
    netMonthlyIncome: breakdown.net,
    effectiveTaxRate:
      params.grossAnnualIncome > 0 ? (totalDeductions / params.grossAnnualIncome) * 100 : 0,
  };
}

export function contractorPay(params: {
  contractValue: number;
  contractMonths: number;
  hoursPerWeek?: number;
}): {
  contractValue: number;
  contractMonths: number;
  monthlyPay: number;
  weeklyPay: number;
  effectiveHourlyRate: number;
  hoursPerWeek: number;
} | { error: string } {
  if (params.contractMonths <= 0) return { error: "Contract duration must be positive." };
  const hoursPerWeek = params.hoursPerWeek ?? DEFAULT_HOURS_PER_WEEK;
  const weeksInContract = params.contractMonths * (52 / 12);
  const monthlyPay = params.contractValue / params.contractMonths;
  const weeklyPay = params.contractValue / weeksInContract;
  const totalHours = weeksInContract * hoursPerWeek;
  const effectiveHourlyRate = totalHours > 0 ? params.contractValue / totalHours : 0;
  return {
    contractValue: params.contractValue,
    contractMonths: params.contractMonths,
    monthlyPay,
    weeklyPay,
    effectiveHourlyRate,
    hoursPerWeek,
  };
}

export function dailyRateIncome(params: {
  dailyRate: number;
  billableDaysPerWeek: number;
  weeksPerYear?: number;
}): {
  dailyRate: number;
  billableDaysPerWeek: number;
  weeksPerYear: number;
  weeklyIncome: number;
  monthlyIncome: number;
  annualIncome: number;
  billableDaysPerYear: number;
} {
  const weeksPerYear = params.weeksPerYear ?? DEFAULT_WEEKS_PER_YEAR;
  const weeklyIncome = params.dailyRate * params.billableDaysPerWeek;
  const annualIncome = weeklyIncome * weeksPerYear;
  return {
    dailyRate: params.dailyRate,
    billableDaysPerWeek: params.billableDaysPerWeek,
    weeksPerYear,
    weeklyIncome,
    monthlyIncome: annualIncome / 12,
    annualIncome,
    billableDaysPerYear: params.billableDaysPerWeek * weeksPerYear,
  };
}
