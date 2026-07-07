import { formatLoanMoney } from "./loanFormat";
import { pfContribution } from "./salaryIndia";

export const BENEFITS_URL = {
  A: "a",
  B: "b",
  D: "d",
  Y: "y",
  R: "r",
  E: "e",
  P: "p",
  C: "c",
  X: "x",
} as const;

export const PF_WAGE_CEILING = 15000;
export const PF_RATE = 0.12;
export const EPS_RATE = 0.0833;
export const EPS_MONTHLY_CAP = 1250;
export const ESIC_WAGE_CEILING = 21000;
export const ESIC_EMPLOYEE_RATE = 0.0075;
export const ESIC_EMPLOYER_RATE = 0.0325;
export const DEFAULT_EPF_INTEREST = 8.25;
export const DEFAULT_NPS_RETURN = 10;
export const DEFAULT_SUPERANNUATION_RETURN = 8;

export function formatBenefitsInr(amount: number): string {
  return formatLoanMoney(amount, "INR");
}

export function parseBenefitsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BENEFITS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function pfWages(basic: number, da = 0, useCeiling = true): number {
  const wages = basic + da;
  return useCeiling ? Math.min(wages, PF_WAGE_CEILING) : wages;
}

export function pfBreakdown(params: {
  basic: number;
  da?: number;
  useCeiling?: boolean;
}): {
  pfWages: number;
  employeePf: number;
  employerEpf: number;
  employerEps: number;
  employerPf: number;
  totalMonthly: number;
  annualEmployee: number;
  annualEmployer: number;
  annualTotal: number;
} {
  const wages = pfWages(params.basic, params.da ?? 0, params.useCeiling ?? true);
  const employeePf = wages * PF_RATE;
  const employerEps = Math.min(wages * EPS_RATE, EPS_MONTHLY_CAP);
  const employerEpf = wages * PF_RATE - employerEps;
  const employerPf = employerEps + employerEpf;
  return {
    pfWages: wages,
    employeePf,
    employerEpf,
    employerEps,
    employerPf,
    totalMonthly: employeePf + employerPf,
    annualEmployee: employeePf * 12,
    annualEmployer: employerPf * 12,
    annualTotal: (employeePf + employerPf) * 12,
  };
}

export function pfCorpusProjection(params: {
  monthlyEmployee: number;
  monthlyEmployerEpf: number;
  years: number;
  annualInterestRate: number;
}): { monthlyContribution: number; corpus: number; totalContributed: number; interestEarned: number } {
  const monthlyContribution = params.monthlyEmployee + params.monthlyEmployerEpf;
  const months = params.years * 12;
  const monthlyRate = params.annualInterestRate / 100 / 12;
  let corpus = 0;
  for (let i = 0; i < months; i += 1) {
    corpus = (corpus + monthlyContribution) * (1 + monthlyRate);
  }
  const totalContributed = monthlyContribution * months;
  return {
    monthlyContribution,
    corpus,
    totalContributed,
    interestEarned: corpus - totalContributed,
  };
}

export function providentFund(params: {
  basic: number;
  da?: number;
  years?: number;
  interestRate?: number;
  useCeiling?: boolean;
}): ReturnType<typeof pfBreakdown> & ReturnType<typeof pfCorpusProjection> {
  const breakdown = pfBreakdown(params);
  const projection = pfCorpusProjection({
    monthlyEmployee: breakdown.employeePf,
    monthlyEmployerEpf: breakdown.employerEpf,
    years: params.years ?? 20,
    annualInterestRate: params.interestRate ?? DEFAULT_EPF_INTEREST,
  });
  return { ...breakdown, ...projection };
}

/** Employee + employer EPF account contributions (excludes EPS pension allocation). */
export function epfContribution(params: { basic: number; da?: number; useCeiling?: boolean }) {
  const breakdown = pfBreakdown(params);
  return {
    pfWages: breakdown.pfWages,
    employeeEpf: breakdown.employeePf,
    employerEpf: breakdown.employerEpf,
    totalEpfMonthly: breakdown.employeePf + breakdown.employerEpf,
    totalEpfAnnual: (breakdown.employeePf + breakdown.employerEpf) * 12,
  };
}

export function employerPfContribution(params: { basic: number; da?: number; useCeiling?: boolean }) {
  const breakdown = pfBreakdown(params);
  return {
    pfWages: breakdown.pfWages,
    employerEpf: breakdown.employerEpf,
    employerEps: breakdown.employerEps,
    employerPf: breakdown.employerPf,
    employerPfAnnual: breakdown.annualEmployer,
    epsShareOfEmployer: breakdown.employerEps / breakdown.employerPf,
  };
}

export function epsPension(params: {
  pensionableSalary: number;
  yearsOfService: number;
}): { pensionableSalary: number; yearsOfService: number; monthlyPension: number; annualPension: number } | { error: string } {
  if (params.yearsOfService < 10) {
    return { error: "Minimum 10 years of eligible service required for monthly EPS pension." };
  }
  const cappedSalary = Math.min(params.pensionableSalary, PF_WAGE_CEILING);
  const monthlyPension = (cappedSalary * params.yearsOfService) / 70;
  return {
    pensionableSalary: cappedSalary,
    yearsOfService: params.yearsOfService,
    monthlyPension,
    annualPension: monthlyPension * 12,
  };
}

export function npsProjection(params: {
  basic: number;
  employeePercent: number;
  employerPercent: number;
  years: number;
  expectedReturn: number;
}): {
  employeeMonthly: number;
  employerMonthly: number;
  totalMonthly: number;
  projectedCorpus: number;
  totalContributed: number;
} {
  const employeeMonthly = params.basic * (params.employeePercent / 100);
  const employerMonthly = params.basic * (params.employerPercent / 100);
  const totalMonthly = employeeMonthly + employerMonthly;
  const months = params.years * 12;
  const monthlyRate = params.expectedReturn / 100 / 12;
  let corpus = 0;
  for (let i = 0; i < months; i += 1) {
    corpus = (corpus + totalMonthly) * (1 + monthlyRate);
  }
  return {
    employeeMonthly,
    employerMonthly,
    totalMonthly,
    projectedCorpus: corpus,
    totalContributed: totalMonthly * months,
  };
}

export function superannuationProjection(params: {
  basic: number;
  employerPercent: number;
  years: number;
  expectedReturn: number;
}): {
  employerMonthly: number;
  employerAnnual: number;
  projectedCorpus: number;
  totalContributed: number;
} {
  const employerMonthly = params.basic * (params.employerPercent / 100);
  const months = params.years * 12;
  const monthlyRate = params.expectedReturn / 100 / 12;
  let corpus = 0;
  for (let i = 0; i < months; i += 1) {
    corpus = (corpus + employerMonthly) * (1 + monthlyRate);
  }
  return {
    employerMonthly,
    employerAnnual: employerMonthly * 12,
    projectedCorpus: corpus,
    totalContributed: employerMonthly * months,
  };
}

export function esicContribution(params: { grossMonthly: number }): {
  grossMonthly: number;
  applicable: boolean;
  employeeEsic: number;
  employerEsic: number;
  totalEsic: number;
  annualTotal: number;
} {
  const applicable = params.grossMonthly <= ESIC_WAGE_CEILING;
  const wages = applicable ? params.grossMonthly : 0;
  const employeeEsic = wages * ESIC_EMPLOYEE_RATE;
  const employerEsic = wages * ESIC_EMPLOYER_RATE;
  const totalEsic = employeeEsic + employerEsic;
  return {
    grossMonthly: params.grossMonthly,
    applicable,
    employeeEsic,
    employerEsic,
    totalEsic,
    annualTotal: totalEsic * 12,
  };
}

/** Re-export for consistency with salaryIndia host. */
export { pfContribution };
