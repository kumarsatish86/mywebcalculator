import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";

export type SalaryCurrencyCode = LoanCurrencyCode;

export const SALARY_URL = {
  A: "a",
  T: "t",
  D: "d",
  E: "e",
  H: "h",
  W: "w",
  M: "m",
} as const;

export const DEFAULT_HOURS_PER_WEEK = 40;
export const DEFAULT_WEEKS_PER_YEAR = 52;

export function formatSalaryMoney(amount: number, currency: SalaryCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseSalarySearchParams(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(SALARY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}


export function annualFromMonthly(monthly: number): number {
  return monthly * 12;
}

export function monthlyFromAnnual(annual: number): number {
  return annual / 12;
}

export function netFromGross(params: {
  gross: number;
  taxPercent: number;
  deductionPercent: number;
}): {
  gross: number;
  taxAmount: number;
  deductionAmount: number;
  net: number;
  monthlyNet: number;
  annualNet: number;
} {
  const { gross, taxPercent, deductionPercent } = params;
  const taxAmount = gross * (taxPercent / 100);
  const deductionAmount = gross * (deductionPercent / 100);
  const net = gross - taxAmount - deductionAmount;
  return {
    gross,
    taxAmount,
    deductionAmount,
    net,
    monthlyNet: net,
    annualNet: net * 12,
  };
}

export function grossFromNet(params: {
  net: number;
  taxPercent: number;
  deductionPercent: number;
}): { gross: number; taxAmount: number; deductionAmount: number; net: number } | { error: string } {
  const rate = (params.taxPercent + params.deductionPercent) / 100;
  if (rate >= 1) return { error: "Combined tax and deductions must be below 100%." };
  const gross = params.net / (1 - rate);
  const breakdown = netFromGross({
    gross,
    taxPercent: params.taxPercent,
    deductionPercent: params.deductionPercent,
  });
  return breakdown;
}

export function ctcFromGross(params: {
  gross: number;
  employerPercent: number;
}): { gross: number; employerContribution: number; ctc: number; monthlyCtc: number; annualCtc: number } {
  const employerContribution = params.gross * (params.employerPercent / 100);
  const ctc = params.gross + employerContribution;
  return {
    gross: params.gross,
    employerContribution,
    ctc,
    monthlyCtc: ctc,
    annualCtc: ctc * 12,
  };
}

export function grossFromCtc(params: {
  ctc: number;
  employerPercent: number;
}): { gross: number; employerContribution: number; ctc: number } | { error: string } {
  if (params.employerPercent < 0) return { error: "Employer contribution must be zero or positive." };
  const gross = params.ctc / (1 + params.employerPercent / 100);
  const employerContribution = params.ctc - gross;
  return { gross, employerContribution, ctc: params.ctc };
}

export function hourlyToSalary(params: {
  hourly: number;
  hoursPerWeek?: number;
  weeksPerYear?: number;
}): { hourly: number; weekly: number; monthly: number; annual: number; hoursPerYear: number } {
  const hoursPerWeek = params.hoursPerWeek ?? DEFAULT_HOURS_PER_WEEK;
  const weeksPerYear = params.weeksPerYear ?? DEFAULT_WEEKS_PER_YEAR;
  const weekly = params.hourly * hoursPerWeek;
  const annual = weekly * weeksPerYear;
  return {
    hourly: params.hourly,
    weekly,
    monthly: annual / 12,
    annual,
    hoursPerYear: hoursPerWeek * weeksPerYear,
  };
}

export function salaryToHourly(params: {
  annual: number;
  hoursPerWeek?: number;
  weeksPerYear?: number;
}): { hourly: number; hoursPerYear: number; weekly: number } {
  const hoursPerWeek = params.hoursPerWeek ?? DEFAULT_HOURS_PER_WEEK;
  const weeksPerYear = params.weeksPerYear ?? DEFAULT_WEEKS_PER_YEAR;
  const hoursPerYear = hoursPerWeek * weeksPerYear;
  const hourly = params.annual / hoursPerYear;
  return { hourly, hoursPerYear, weekly: hourly * hoursPerWeek };
}
