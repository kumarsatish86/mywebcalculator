import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { annualFromMonthly, monthlyFromAnnual, netFromGross } from "./salaryCore";

export type FinPlanningCurrencyCode = LoanCurrencyCode;

export const SALARY_FIN_PLAN_URL = {
  A: "a",
  B: "b",
  P: "p",
  Y: "y",
  R: "r",
  T: "t",
  D: "d",
  W: "w",
  S: "s",
  C: "c",
  M: "m",
} as const;

export const DEFAULT_WITHDRAWAL_RATE = 4;
export const DEFAULT_RETURN = 8;

export function formatFinPlanningMoney(amount: number, currency: FinPlanningCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseSalaryFinancialPlanningSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(SALARY_FIN_PLAN_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function futureValueMonthlyContributions(
  monthlyContribution: number,
  annualReturnPercent: number,
  months: number,
  startingBalance = 0,
): number {
  const monthlyRate = annualReturnPercent / 100 / 12;
  let corpus = startingBalance;
  for (let i = 0; i < months; i += 1) {
    corpus = (corpus + monthlyContribution) * (1 + monthlyRate);
  }
  return corpus;
}

export function savingsFromSalary(params: {
  netMonthly: number;
  savingsPercent: number;
}): {
  netMonthly: number;
  savingsPercent: number;
  monthlySavings: number;
  annualSavings: number;
  monthlySpending: number;
} {
  const monthlySavings = params.netMonthly * (params.savingsPercent / 100);
  return {
    netMonthly: params.netMonthly,
    savingsPercent: params.savingsPercent,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    monthlySpending: params.netMonthly - monthlySavings,
  };
}

export function expenseVsSalary(params: {
  salaryMonthly: number;
  expensesMonthly: number;
}): {
  salaryMonthly: number;
  expensesMonthly: number;
  surplus: number;
  savingsRate: number;
  status: "surplus" | "deficit" | "balanced";
} {
  const surplus = params.salaryMonthly - params.expensesMonthly;
  const savingsRate = params.salaryMonthly > 0 ? (surplus / params.salaryMonthly) * 100 : 0;
  const status = surplus > 0 ? "surplus" : surplus < 0 ? "deficit" : "balanced";
  return { salaryMonthly: params.salaryMonthly, expensesMonthly: params.expensesMonthly, surplus, savingsRate, status };
}

export function salaryBudgetPlanner(params: {
  netMonthly: number;
  needsPercent: number;
  wantsPercent: number;
  savingsPercent: number;
}): {
  netMonthly: number;
  needs: number;
  wants: number;
  savings: number;
  totalPercent: number;
} | { error: string } {
  const totalPercent = params.needsPercent + params.wantsPercent + params.savingsPercent;
  if (Math.abs(totalPercent - 100) > 0.01 && totalPercent > 100) {
    return { error: "Needs, wants, and savings percentages must total 100% or less." };
  }
  return {
    netMonthly: params.netMonthly,
    needs: params.netMonthly * (params.needsPercent / 100),
    wants: params.netMonthly * (params.wantsPercent / 100),
    savings: params.netMonthly * (params.savingsPercent / 100),
    totalPercent,
  };
}

export function salaryInvestment(params: {
  monthlyInvestment: number;
  annualReturnPercent: number;
  years: number;
  startingBalance?: number;
}): {
  monthlyInvestment: number;
  annualReturnPercent: number;
  years: number;
  projectedCorpus: number;
  totalContributed: number;
  interestEarned: number;
} {
  const months = params.years * 12;
  const starting = params.startingBalance ?? 0;
  const projectedCorpus = futureValueMonthlyContributions(
    params.monthlyInvestment,
    params.annualReturnPercent,
    months,
    starting,
  );
  const totalContributed = starting + params.monthlyInvestment * months;
  return {
    monthlyInvestment: params.monthlyInvestment,
    annualReturnPercent: params.annualReturnPercent,
    years: params.years,
    projectedCorpus,
    totalContributed,
    interestEarned: projectedCorpus - totalContributed,
  };
}

export function fireCalculator(params: {
  annualExpenses: number;
  withdrawalRatePercent: number;
  currentSavings: number;
  monthlySavings: number;
  expectedReturnPercent: number;
}): {
  fireNumber: number;
  currentSavings: number;
  monthlySavings: number;
  yearsToFire: number;
  projectedAtFire: number;
} | { error: string } {
  if (params.withdrawalRatePercent <= 0) return { error: "Withdrawal rate must be positive." };
  const fireNumber = params.annualExpenses / (params.withdrawalRatePercent / 100);
  if (params.currentSavings >= fireNumber) {
    return {
      fireNumber,
      currentSavings: params.currentSavings,
      monthlySavings: params.monthlySavings,
      yearsToFire: 0,
      projectedAtFire: params.currentSavings,
    };
  }
  const monthlyRate = params.expectedReturnPercent / 100 / 12;
  let corpus = params.currentSavings;
  let months = 0;
  const maxMonths = 50 * 12;
  while (corpus < fireNumber && months < maxMonths) {
    corpus = (corpus + params.monthlySavings) * (1 + monthlyRate);
    months += 1;
  }
  if (months >= maxMonths) return { error: "FIRE target not reached within 50 years at these inputs." };
  return {
    fireNumber,
    currentSavings: params.currentSavings,
    monthlySavings: params.monthlySavings,
    yearsToFire: months / 12,
    projectedAtFire: corpus,
  };
}

export function retirementPlanning(params: {
  monthlySalary: number;
  savingsPercent: number;
  yearsToRetirement: number;
  expectedReturnPercent: number;
  currentCorpus?: number;
  taxPercent?: number;
  deductionPercent?: number;
}): {
  grossMonthly: number;
  netMonthly: number;
  monthlySavings: number;
  yearsToRetirement: number;
  retirementCorpus: number;
  totalContributed: number;
} {
  const tax = params.taxPercent ?? 20;
  const ded = params.deductionPercent ?? 5;
  const breakdown = netFromGross({
    gross: params.monthlySalary,
    taxPercent: tax,
    deductionPercent: ded,
  });
  const monthlySavings = breakdown.net * (params.savingsPercent / 100);
  const months = params.yearsToRetirement * 12;
  const retirementCorpus = futureValueMonthlyContributions(
    monthlySavings,
    params.expectedReturnPercent,
    months,
    params.currentCorpus ?? 0,
  );
  const totalContributed = (params.currentCorpus ?? 0) + monthlySavings * months;
  return {
    grossMonthly: breakdown.gross,
    netMonthly: breakdown.net,
    monthlySavings,
    yearsToRetirement: params.yearsToRetirement,
    retirementCorpus,
    totalContributed,
  };
}

export { annualFromMonthly, monthlyFromAnnual };
