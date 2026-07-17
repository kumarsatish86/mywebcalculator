import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";

export type RetirementCurrencyCode = LoanCurrencyCode;

export const RETIREMENT_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  Y: "y",
  W: "w",
  I: "i",
  M: "m",
  E: "e",
  P: "p",
} as const;

export const DEFAULT_WITHDRAWAL_RATE = 4;
export const DEFAULT_RETURN = 10;
export const DEFAULT_INFLATION = 5;

export function formatRetirementMoney(amount: number, currency: RetirementCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseRetirementSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(RETIREMENT_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function fvMonthly(monthly: number, annualReturnPercent: number, months: number, start = 0): number {
  const r = annualReturnPercent / 100 / 12;
  let corpus = start;
  for (let i = 0; i < months; i += 1) {
    corpus = (corpus + monthly) * (1 + r);
  }
  return corpus;
}

/** Grow current savings + monthly SIP to retirement date. */
export function retirementCalc(params: {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlySavings: number;
  expectedReturnPercent: number;
}): {
  yearsToRetirement: number;
  retirementCorpus: number;
  totalContributed: number;
  interestEarned: number;
} | { error: string } {
  if (params.retirementAge <= params.currentAge) {
    return { error: "Retirement age must be greater than current age." };
  }
  if (params.currentSavings < 0 || params.monthlySavings < 0) {
    return { error: "Savings amounts cannot be negative." };
  }
  const yearsToRetirement = params.retirementAge - params.currentAge;
  const months = Math.round(yearsToRetirement * 12);
  const retirementCorpus = fvMonthly(
    params.monthlySavings,
    params.expectedReturnPercent,
    months,
    params.currentSavings,
  );
  const totalContributed = params.currentSavings + params.monthlySavings * months;
  return {
    yearsToRetirement,
    retirementCorpus,
    totalContributed,
    interestEarned: retirementCorpus - totalContributed,
  };
}

export function fireCalc(params: {
  annualExpenses: number;
  withdrawalRatePercent: number;
  currentSavings: number;
  monthlySavings: number;
  expectedReturnPercent: number;
}): {
  fireNumber: number;
  yearsToFire: number;
  projectedAtFire: number;
  monthlySafeWithdrawal: number;
} | { error: string } {
  if (params.annualExpenses <= 0) return { error: "Annual expenses must be positive." };
  if (params.withdrawalRatePercent <= 0) return { error: "Withdrawal rate must be positive." };
  if (params.currentSavings < 0 || params.monthlySavings < 0) {
    return { error: "Savings amounts cannot be negative." };
  }
  const fireNumber = params.annualExpenses / (params.withdrawalRatePercent / 100);
  const monthlySafeWithdrawal = fireNumber * (params.withdrawalRatePercent / 100) / 12;
  if (params.currentSavings >= fireNumber) {
    return {
      fireNumber,
      yearsToFire: 0,
      projectedAtFire: params.currentSavings,
      monthlySafeWithdrawal,
    };
  }
  const monthlyRate = params.expectedReturnPercent / 100 / 12;
  let corpus = params.currentSavings;
  let months = 0;
  const maxMonths = 60 * 12;
  while (corpus < fireNumber && months < maxMonths) {
    corpus = (corpus + params.monthlySavings) * (1 + monthlyRate);
    months += 1;
  }
  if (months >= maxMonths) return { error: "FIRE target not reached within 60 years at these inputs." };
  return {
    fireNumber,
    yearsToFire: months / 12,
    projectedAtFire: corpus,
    monthlySafeWithdrawal,
  };
}

/** Monthly pension from corpus at given withdrawal/annuity rate. */
export function pensionCalc(params: {
  corpus: number;
  annualPayoutRatePercent: number;
}): {
  corpus: number;
  annualPension: number;
  monthlyPension: number;
} | { error: string } {
  if (params.corpus <= 0) return { error: "Corpus must be positive." };
  if (params.annualPayoutRatePercent <= 0) return { error: "Payout rate must be positive." };
  const annualPension = params.corpus * (params.annualPayoutRatePercent / 100);
  return {
    corpus: params.corpus,
    annualPension,
    monthlyPension: annualPension / 12,
  };
}

/** Required corpus for desired monthly expenses at retirement (withdrawal rate). */
export function retirementCorpusNeeded(params: {
  monthlyExpensesAtRetirement: number;
  withdrawalRatePercent: number;
}): {
  annualExpenses: number;
  requiredCorpus: number;
  monthlyWithdrawal: number;
} | { error: string } {
  if (params.monthlyExpensesAtRetirement <= 0) return { error: "Monthly expenses must be positive." };
  if (params.withdrawalRatePercent <= 0) return { error: "Withdrawal rate must be positive." };
  const annualExpenses = params.monthlyExpensesAtRetirement * 12;
  const requiredCorpus = annualExpenses / (params.withdrawalRatePercent / 100);
  return {
    annualExpenses,
    requiredCorpus,
    monthlyWithdrawal: params.monthlyExpensesAtRetirement,
  };
}

/** Simulate constant monthly withdrawals with portfolio return until depleted or years elapsed. */
export function retirementWithdrawal(params: {
  corpus: number;
  monthlyWithdrawal: number;
  annualReturnPercent: number;
  years: number;
}): {
  endingCorpus: number;
  totalWithdrawn: number;
  monthsSurvived: number;
  depleted: boolean;
} | { error: string } {
  if (params.corpus <= 0) return { error: "Corpus must be positive." };
  if (params.monthlyWithdrawal <= 0) return { error: "Monthly withdrawal must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };

  const months = Math.round(params.years * 12);
  const r = params.annualReturnPercent / 100 / 12;
  let balance = params.corpus;
  let totalWithdrawn = 0;
  let monthsSurvived = 0;

  for (let m = 1; m <= months; m += 1) {
    balance *= 1 + r;
    if (balance < params.monthlyWithdrawal) {
      totalWithdrawn += Math.max(0, balance);
      balance = 0;
      monthsSurvived = m;
      return {
        endingCorpus: 0,
        totalWithdrawn,
        monthsSurvived,
        depleted: true,
      };
    }
    balance -= params.monthlyWithdrawal;
    totalWithdrawn += params.monthlyWithdrawal;
    monthsSurvived = m;
  }

  return {
    endingCorpus: balance,
    totalWithdrawn,
    monthsSurvived,
    depleted: false,
  };
}

/** Inflate today's expenses to retirement; show real purchasing power of a corpus. */
export function inflationImpactRetirement(params: {
  monthlyExpensesToday: number;
  yearsToRetirement: number;
  inflationPercent: number;
  plannedCorpus: number;
  withdrawalRatePercent: number;
}): {
  monthlyExpensesAtRetirement: number;
  annualExpensesAtRetirement: number;
  requiredCorpus: number;
  corpusShortfallOrSurplus: number;
  monthlyWithdrawalFromCorpus: number;
} | { error: string } {
  if (params.monthlyExpensesToday <= 0) return { error: "Monthly expenses must be positive." };
  if (params.yearsToRetirement < 0) return { error: "Years cannot be negative." };
  if (params.plannedCorpus < 0) return { error: "Corpus cannot be negative." };
  if (params.withdrawalRatePercent <= 0) return { error: "Withdrawal rate must be positive." };

  const factor = Math.pow(1 + params.inflationPercent / 100, params.yearsToRetirement);
  const monthlyExpensesAtRetirement = params.monthlyExpensesToday * factor;
  const annualExpensesAtRetirement = monthlyExpensesAtRetirement * 12;
  const requiredCorpus = annualExpensesAtRetirement / (params.withdrawalRatePercent / 100);
  const monthlyWithdrawalFromCorpus =
    (params.plannedCorpus * (params.withdrawalRatePercent / 100)) / 12;

  return {
    monthlyExpensesAtRetirement,
    annualExpensesAtRetirement,
    requiredCorpus,
    corpusShortfallOrSurplus: params.plannedCorpus - requiredCorpus,
    monthlyWithdrawalFromCorpus,
  };
}

/** Financial longevity: years of retirement funding needed from current age to expected lifespan. */
export function lifeExpectancyFinancial(params: {
  currentAge: number;
  retirementAge: number;
  expectedLifespan: number;
  monthlyExpensesAtRetirement: number;
  inflationPercent: number;
  withdrawalRatePercent: number;
}): {
  yearsInRetirement: number;
  yearsToRetirement: number;
  futureMonthlyExpenses: number;
  requiredCorpus: number;
} | { error: string } {
  if (params.retirementAge <= params.currentAge) {
    return { error: "Retirement age must be greater than current age." };
  }
  if (params.expectedLifespan <= params.retirementAge) {
    return { error: "Expected lifespan must be greater than retirement age." };
  }
  if (params.monthlyExpensesAtRetirement <= 0) {
    return { error: "Monthly expenses must be positive." };
  }
  if (params.withdrawalRatePercent <= 0) return { error: "Withdrawal rate must be positive." };

  const yearsToRetirement = params.retirementAge - params.currentAge;
  const yearsInRetirement = params.expectedLifespan - params.retirementAge;
  const factor = Math.pow(1 + params.inflationPercent / 100, yearsToRetirement);
  const futureMonthlyExpenses = params.monthlyExpensesAtRetirement * factor;
  const requiredCorpus = (futureMonthlyExpenses * 12) / (params.withdrawalRatePercent / 100);

  return {
    yearsInRetirement,
    yearsToRetirement,
    futureMonthlyExpenses,
    requiredCorpus,
  };
}
