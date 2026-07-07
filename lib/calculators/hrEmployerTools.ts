import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { annualFromMonthly, ctcFromGross, netFromGross } from "./salaryCore";

export type HrEmployerCurrencyCode = LoanCurrencyCode;

export const HR_EMPLOYER_URL = {
  A: "a",
  B: "b",
  C: "c",
  D: "d",
  E: "e",
  H: "h",
  N: "n",
  O: "o",
  P: "p",
  R: "r",
  T: "t",
  V: "v",
  X: "x",
  Y: "y",
} as const;

export const DEFAULT_BASIC_PERCENT = 40;
export const DEFAULT_HRA_PERCENT_OF_BASIC = 50;
export const DEFAULT_EMPLOYER_CONTRIB_PERCENT = 12;
export const DEFAULT_WORKING_DAYS_PER_YEAR = 260;

export function formatHrEmployerMoney(amount: number, currency: HrEmployerCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseHrEmployerSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(HR_EMPLOYER_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function payrollCalc(params: {
  grossMonthly: number;
  taxPercent: number;
  deductionPercent: number;
  employerBenefitPercent?: number;
}): {
  grossMonthly: number;
  taxAmount: number;
  deductionAmount: number;
  netMonthly: number;
  netAnnual: number;
  employerContribution: number;
  totalEmployerCostMonthly: number;
  totalEmployerCostAnnual: number;
} {
  const breakdown = netFromGross({
    gross: params.grossMonthly,
    taxPercent: params.taxPercent,
    deductionPercent: params.deductionPercent,
  });
  const employer = ctcFromGross({
    gross: params.grossMonthly,
    employerPercent: params.employerBenefitPercent ?? DEFAULT_EMPLOYER_CONTRIB_PERCENT,
  });
  return {
    grossMonthly: params.grossMonthly,
    taxAmount: breakdown.taxAmount,
    deductionAmount: breakdown.deductionAmount,
    netMonthly: breakdown.net,
    netAnnual: breakdown.annualNet,
    employerContribution: employer.employerContribution,
    totalEmployerCostMonthly: employer.ctc,
    totalEmployerCostAnnual: employer.annualCtc,
  };
}

export function employeeCost(params: {
  grossMonthly: number;
  employerBenefitPercent: number;
  overheadPercent: number;
}): {
  grossMonthly: number;
  employerBenefits: number;
  subtotal: number;
  overhead: number;
  totalMonthly: number;
  totalAnnual: number;
} {
  const employerBenefits = params.grossMonthly * (params.employerBenefitPercent / 100);
  const subtotal = params.grossMonthly + employerBenefits;
  const overhead = subtotal * (params.overheadPercent / 100);
  const totalMonthly = subtotal + overhead;
  return {
    grossMonthly: params.grossMonthly,
    employerBenefits,
    subtotal,
    overhead,
    totalMonthly,
    totalAnnual: annualFromMonthly(totalMonthly),
  };
}

export function salaryStructure(params: {
  monthlyCtc: number;
  basicPercent?: number;
  hraPercentOfBasic?: number;
  employerContribPercent?: number;
}):
  | {
      monthlyCtc: number;
      basic: number;
      hra: number;
      specialAllowance: number;
      employerContribution: number;
      grossMonthly: number;
      annualCtc: number;
    }
  | { error: string } {
  const basicPercent = params.basicPercent ?? DEFAULT_BASIC_PERCENT;
  const hraPercentOfBasic = params.hraPercentOfBasic ?? DEFAULT_HRA_PERCENT_OF_BASIC;
  const employerContribPercent = params.employerContribPercent ?? DEFAULT_EMPLOYER_CONTRIB_PERCENT;

  if (basicPercent <= 0 || basicPercent > 100) return { error: "Basic % must be between 1 and 100." };
  if (hraPercentOfBasic < 0 || hraPercentOfBasic > 200) {
    return { error: "HRA % of basic must be between 0 and 200." };
  }

  const basic = params.monthlyCtc * (basicPercent / 100);
  const hra = basic * (hraPercentOfBasic / 100);
  const employerContribution = basic * (employerContribPercent / 100);
  const specialAllowance = params.monthlyCtc - basic - hra - employerContribution;

  if (specialAllowance < 0) {
    return { error: "CTC is too low for this basic/HRA split after employer contributions." };
  }

  const grossMonthly = basic + hra + specialAllowance;
  return {
    monthlyCtc: params.monthlyCtc,
    basic,
    hra,
    specialAllowance,
    employerContribution,
    grossMonthly,
    annualCtc: params.monthlyCtc * 12,
  };
}

export function compensationPlanning(params: {
  headcount: number;
  avgGrossMonthly: number;
  employerBenefitPercent: number;
}): {
  headcount: number;
  avgGrossMonthly: number;
  perEmployeeAnnual: number;
  totalMonthlyPayroll: number;
  totalAnnualPayroll: number;
  totalAnnualWithBenefits: number;
} | { error: string } {
  if (params.headcount <= 0) return { error: "Headcount must be positive." };
  if (params.avgGrossMonthly <= 0) return { error: "Average gross salary must be positive." };

  const perEmployeeAnnual =
    params.avgGrossMonthly * 12 * (1 + params.employerBenefitPercent / 100);
  const totalMonthlyPayroll = params.headcount * params.avgGrossMonthly;
  const totalAnnualPayroll = annualFromMonthly(totalMonthlyPayroll);
  const totalAnnualWithBenefits = params.headcount * perEmployeeAnnual;

  return {
    headcount: params.headcount,
    avgGrossMonthly: params.avgGrossMonthly,
    perEmployeeAnnual,
    totalMonthlyPayroll,
    totalAnnualPayroll,
    totalAnnualWithBenefits,
  };
}

export function salaryBenchmark(params: {
  offerAnnual: number;
  marketMedianAnnual: number;
}): {
  offerAnnual: number;
  marketMedianAnnual: number;
  difference: number;
  differencePercent: number;
  position: "above" | "below" | "at";
} | { error: string } {
  if (params.marketMedianAnnual <= 0) return { error: "Market median must be positive." };
  if (params.offerAnnual < 0) return { error: "Offer amount must be zero or positive." };

  const difference = params.offerAnnual - params.marketMedianAnnual;
  const differencePercent = (difference / params.marketMedianAnnual) * 100;
  let position: "above" | "below" | "at" = "at";
  if (difference > 0) position = "above";
  else if (difference < 0) position = "below";

  return {
    offerAnnual: params.offerAnnual,
    marketMedianAnnual: params.marketMedianAnnual,
    difference,
    differencePercent,
    position,
  };
}

export function costToHire(params: {
  annualSalary: number;
  recruiterFeePercent: number;
  signingBonus: number;
  onboardingCost: number;
  vacancyDays: number;
  workingDaysPerYear?: number;
}): {
  annualSalary: number;
  recruiterFee: number;
  signingBonus: number;
  onboardingCost: number;
  vacancyCost: number;
  totalCost: number;
  costAsPercentOfSalary: number;
} | { error: string } {
  if (params.annualSalary <= 0) return { error: "Annual salary must be positive." };
  if (params.vacancyDays < 0) return { error: "Vacancy days cannot be negative." };

  const workingDays = params.workingDaysPerYear ?? DEFAULT_WORKING_DAYS_PER_YEAR;
  const recruiterFee = params.annualSalary * (params.recruiterFeePercent / 100);
  const dailyVacancyCost = params.annualSalary / workingDays;
  const vacancyCost = dailyVacancyCost * params.vacancyDays;
  const totalCost = recruiterFee + params.signingBonus + params.onboardingCost + vacancyCost;

  return {
    annualSalary: params.annualSalary,
    recruiterFee,
    signingBonus: params.signingBonus,
    onboardingCost: params.onboardingCost,
    vacancyCost,
    totalCost,
    costAsPercentOfSalary: (totalCost / params.annualSalary) * 100,
  };
}
