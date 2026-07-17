import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";

export type CreditCardBankingCurrencyCode = LoanCurrencyCode;

export const CREDIT_CARD_BANKING_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
  F: "f",
  S: "s",
} as const;

export function formatCreditCardBankingMoney(
  amount: number,
  currency: CreditCardBankingCurrencyCode,
): string {
  return formatLoanMoney(amount, currency);
}

export function parseCreditCardBankingSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CREDIT_CARD_BANKING_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function minimumPayment(params: {
  balance: number;
  minPercent: number;
  minFloor?: number;
}): { minimumDue: number; percentOfBalance: number } | { error: string } {
  if (params.balance < 0) return { error: "Balance cannot be negative." };
  if (params.minPercent <= 0 || params.minPercent > 100) {
    return { error: "Minimum % must be between 0 and 100." };
  }
  const floor = params.minFloor ?? 0;
  const byPercent = params.balance * (params.minPercent / 100);
  const minimumDue = Math.min(params.balance, Math.max(byPercent, floor));
  return { minimumDue, percentOfBalance: params.balance > 0 ? (minimumDue / params.balance) * 100 : 0 };
}

export function creditCardPayoff(params: {
  balance: number;
  annualRatePercent: number;
  monthlyPayment: number;
}): {
  months: number;
  totalPaid: number;
  totalInterest: number;
} | { error: string } {
  if (params.balance <= 0) return { error: "Balance must be positive." };
  if (params.monthlyPayment <= 0) return { error: "Monthly payment must be positive." };
  if (params.annualRatePercent < 0) return { error: "APR cannot be negative." };

  const r = params.annualRatePercent / 100 / 12;
  let bal = params.balance;
  let months = 0;
  let totalPaid = 0;
  let totalInterest = 0;
  const maxMonths = 1200;

  while (bal > 0.01 && months < maxMonths) {
    const interest = bal * r;
    if (params.monthlyPayment <= interest + 0.01 && r > 0) {
      return { error: "Payment is too low to cover monthly interest — balance never pays off." };
    }
    const paid = Math.min(params.monthlyPayment, bal + interest);
    bal = bal + interest - paid;
    totalPaid += paid;
    totalInterest += interest;
    months += 1;
  }

  return { months, totalPaid, totalInterest };
}

/** Extra monthly payment vs minimum — months saved. */
export function creditCardDebtReduction(params: {
  balance: number;
  annualRatePercent: number;
  minPercent: number;
  extraMonthly: number;
}): {
  monthsAtMinimum: number;
  monthsWithExtra: number;
  monthsSaved: number;
  interestSaved: number;
} | { error: string } {
  const min = minimumPayment({ balance: params.balance, minPercent: params.minPercent, minFloor: 100 });
  if ("error" in min) return min;
  const basePay = min.minimumDue;
  const withExtra = basePay + Math.max(0, params.extraMonthly);

  const a = creditCardPayoff({
    balance: params.balance,
    annualRatePercent: params.annualRatePercent,
    monthlyPayment: basePay,
  });
  if ("error" in a) return a;
  const b = creditCardPayoff({
    balance: params.balance,
    annualRatePercent: params.annualRatePercent,
    monthlyPayment: withExtra,
  });
  if ("error" in b) return b;

  return {
    monthsAtMinimum: a.months,
    monthsWithExtra: b.months,
    monthsSaved: Math.max(0, a.months - b.months),
    interestSaved: Math.max(0, a.totalInterest - b.totalInterest),
  };
}

export function balanceTransferSavings(params: {
  balance: number;
  currentAprPercent: number;
  transferAprPercent: number;
  transferFeePercent: number;
  months: number;
}): {
  interestStay: number;
  interestTransfer: number;
  transferFee: number;
  netSavings: number;
} | { error: string } {
  if (params.balance <= 0) return { error: "Balance must be positive." };
  if (params.months <= 0) return { error: "Months must be positive." };
  const fee = params.balance * (params.transferFeePercent / 100);
  const interestStay = params.balance * (params.currentAprPercent / 100) * (params.months / 12);
  const interestTransfer = params.balance * (params.transferAprPercent / 100) * (params.months / 12);
  return {
    interestStay,
    interestTransfer,
    transferFee: fee,
    netSavings: interestStay - interestTransfer - fee,
  };
}

export function latePaymentFee(params: {
  balance: number;
  flatFee?: number;
  feePercent?: number;
}): { fee: number } | { error: string } {
  if (params.balance < 0) return { error: "Balance cannot be negative." };
  const flat = params.flatFee ?? 0;
  const pct = params.feePercent ?? 0;
  if (flat < 0 || pct < 0) return { error: "Fee inputs cannot be negative." };
  return { fee: Math.max(flat, params.balance * (pct / 100)) };
}

export function interestFreePeriod(params: {
  statementDateDay: number;
  dueDateDay: number;
  purchaseDay: number;
}): { interestFreeDays: number; note: string } | { error: string } {
  const clamp = (d: number) => Math.min(28, Math.max(1, Math.round(d)));
  const stmt = clamp(params.statementDateDay);
  const due = clamp(params.dueDateDay);
  const purchase = clamp(params.purchaseDay);
  // Simplified same-month model: days from purchase to due after next statement
  let toStatement = stmt >= purchase ? stmt - purchase : stmt + (30 - purchase);
  let grace = due >= stmt ? due - stmt : due + (30 - stmt);
  const interestFreeDays = toStatement + grace;
  return {
    interestFreeDays,
    note: "Educational calendar-day estimate assuming a ~30-day statement cycle.",
  };
}

export function creditCardRewards(params: {
  monthlySpend: number;
  pointsPerCurrency: number;
  pointValue: number;
  months?: number;
}): {
  totalPoints: number;
  rewardsValue: number;
} | { error: string } {
  if (params.monthlySpend < 0) return { error: "Spend cannot be negative." };
  if (params.pointsPerCurrency < 0 || params.pointValue < 0) {
    return { error: "Reward rates cannot be negative." };
  }
  const months = params.months ?? 12;
  const totalPoints = params.monthlySpend * params.pointsPerCurrency * months;
  return { totalPoints, rewardsValue: totalPoints * params.pointValue };
}

export function cashbackCalc(params: {
  spend: number;
  cashbackPercent: number;
  cap?: number;
}): { cashback: number; effectivePercent: number } | { error: string } {
  if (params.spend < 0) return { error: "Spend cannot be negative." };
  if (params.cashbackPercent < 0) return { error: "Cashback % cannot be negative." };
  let cashback = params.spend * (params.cashbackPercent / 100);
  if (params.cap !== undefined && params.cap >= 0) cashback = Math.min(cashback, params.cap);
  return {
    cashback,
    effectivePercent: params.spend > 0 ? (cashback / params.spend) * 100 : 0,
  };
}

export function annualFeeValue(params: {
  annualFee: number;
  annualRewardsValue: number;
  otherBenefitsValue?: number;
}): {
  netCost: number;
  breakEven: boolean;
  valueMultiple: number;
} | { error: string } {
  if (params.annualFee < 0) return { error: "Annual fee cannot be negative." };
  const other = params.otherBenefitsValue ?? 0;
  const totalValue = params.annualRewardsValue + other;
  return {
    netCost: params.annualFee - totalValue,
    breakEven: totalValue >= params.annualFee,
    valueMultiple: params.annualFee > 0 ? totalValue / params.annualFee : 0,
  };
}

export function revolvingCreditCost(params: {
  balance: number;
  annualRatePercent: number;
  months: number;
}): {
  interestCost: number;
  endingBalanceIfInterestOnly: number;
} | { error: string } {
  if (params.balance <= 0) return { error: "Balance must be positive." };
  if (params.months <= 0) return { error: "Months must be positive." };
  const interestCost = params.balance * (params.annualRatePercent / 100) * (params.months / 12);
  return {
    interestCost,
    endingBalanceIfInterestOnly: params.balance + interestCost,
  };
}
