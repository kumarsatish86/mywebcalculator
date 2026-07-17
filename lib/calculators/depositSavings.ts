import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { fixedDeposit, recurringDeposit } from "./fixedIncomeSafe";

export type DepositSavingsCurrencyCode = LoanCurrencyCode;

export const DEPOSIT_SAVINGS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
} as const;

export function formatDepositSavingsMoney(amount: number, currency: DepositSavingsCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseDepositSavingsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(DEPOSIT_SAVINGS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Simple savings interest on average balance for a period. */
export function savingsAccountInterest(params: {
  averageBalance: number;
  annualRatePercent: number;
  days: number;
}): {
  interest: number;
  dailyRatePercent: number;
  effectiveAnnualPercent: number;
} | { error: string } {
  if (params.averageBalance < 0) return { error: "Average balance cannot be negative." };
  if (params.annualRatePercent < 0) return { error: "Rate cannot be negative." };
  if (params.days <= 0) return { error: "Days must be positive." };
  const interest = (params.averageBalance * params.annualRatePercent * params.days) / (100 * 365);
  return {
    interest,
    dailyRatePercent: params.annualRatePercent / 365,
    effectiveAnnualPercent: params.annualRatePercent,
  };
}

export type PayoutFrequency = "monthly" | "quarterly" | "yearly";

/** Non-cumulative FD: interest paid out each period (not reinvested). */
export function fdInterestPayout(params: {
  principal: number;
  annualRatePercent: number;
  years: number;
  frequency: PayoutFrequency;
}): {
  payoutPerPeriod: number;
  periodsPerYear: number;
  totalInterestPaid: number;
  principalReturned: number;
} | { error: string } {
  if (params.principal <= 0) return { error: "Principal must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.annualRatePercent < 0) return { error: "Rate cannot be negative." };
  const periodsPerYear = params.frequency === "monthly" ? 12 : params.frequency === "quarterly" ? 4 : 1;
  const payoutPerPeriod = (params.principal * params.annualRatePercent) / 100 / periodsPerYear;
  const totalPeriods = periodsPerYear * params.years;
  return {
    payoutPerPeriod,
    periodsPerYear,
    totalInterestPaid: payoutPerPeriod * totalPeriods,
    principalReturned: params.principal,
  };
}

export function fdMaturityAmount(params: {
  principal: number;
  annualRatePercent: number;
  years: number;
  compoundsPerYear?: number;
}): ReturnType<typeof fixedDeposit> {
  return fixedDeposit(params);
}

export function rdMaturityWithBreakdown(params: {
  monthlyDeposit: number;
  annualRatePercent: number;
  months: number;
}): {
  maturityValue: number;
  totalDeposited: number;
  interestEarned: number;
  schedule: { month: number; depositedToDate: number; approximateBalance: number }[];
} | { error: string } {
  const base = recurringDeposit(params);
  if ("error" in base) return base;
  const r = params.annualRatePercent / 100 / 12;
  const schedule: { month: number; depositedToDate: number; approximateBalance: number }[] = [];
  let balance = 0;
  for (let m = 1; m <= params.months; m++) {
    balance = (balance + params.monthlyDeposit) * (1 + r);
    schedule.push({
      month: m,
      depositedToDate: params.monthlyDeposit * m,
      approximateBalance: balance,
    });
  }
  return {
    maturityValue: base.maturityValue,
    totalDeposited: base.totalDeposited,
    interestEarned: base.interestEarned,
    schedule,
  };
}

export function savingsGrowthRegular(params: {
  startingBalance: number;
  monthlyDeposit: number;
  annualRatePercent: number;
  years: number;
}): {
  endingBalance: number;
  totalDeposited: number;
  interestEarned: number;
} | { error: string } {
  if (params.startingBalance < 0) return { error: "Starting balance cannot be negative." };
  if (params.monthlyDeposit < 0) return { error: "Monthly deposit cannot be negative." };
  if (params.years <= 0) return { error: "Years must be positive." };
  const months = Math.round(params.years * 12);
  const r = params.annualRatePercent / 100 / 12;
  let balance = params.startingBalance;
  for (let m = 0; m < months; m++) {
    balance = balance * (1 + r) + params.monthlyDeposit;
  }
  const totalDeposited = params.startingBalance + params.monthlyDeposit * months;
  return {
    endingBalance: balance,
    totalDeposited,
    interestEarned: balance - totalDeposited,
  };
}

export function goalBasedSavings(params: {
  goalAmount: number;
  years: number;
  annualRatePercent: number;
  existingSavings?: number;
}): {
  requiredMonthlyDeposit: number;
  totalDeposits: number;
  growthFromInterest: number;
} | { error: string } {
  if (params.goalAmount <= 0) return { error: "Goal amount must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  const existing = params.existingSavings ?? 0;
  if (existing < 0) return { error: "Existing savings cannot be negative." };

  const months = Math.round(params.years * 12);
  const r = params.annualRatePercent / 100 / 12;
  const futureOfExisting = existing * Math.pow(1 + r, months);
  const shortfall = Math.max(0, params.goalAmount - futureOfExisting);

  let requiredMonthlyDeposit: number;
  if (shortfall === 0) {
    requiredMonthlyDeposit = 0;
  } else if (r === 0) {
    requiredMonthlyDeposit = shortfall / months;
  } else {
    requiredMonthlyDeposit = shortfall * (r / (Math.pow(1 + r, months) - 1));
  }

  const totalDeposits = requiredMonthlyDeposit * months;
  return {
    requiredMonthlyDeposit,
    totalDeposits,
    growthFromInterest: Math.max(0, params.goalAmount - existing - totalDeposits),
  };
}
