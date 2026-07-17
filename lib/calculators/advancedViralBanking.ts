import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { monthlyLoanPayment } from "./loanPayment";
import { prepaymentForeclosure } from "./loanCreditBanking";

export type AdvancedViralBankingCurrencyCode = LoanCurrencyCode;

export const ADVANCED_VIRAL_BANKING_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
  S: "s",
} as const;

export function formatAdvancedViralBankingMoney(
  amount: number,
  currency: AdvancedViralBankingCurrencyCode,
): string {
  return formatLoanMoney(amount, currency);
}

export function parseAdvancedViralBankingSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(ADVANCED_VIRAL_BANKING_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function loanBurden(params: {
  monthlyEmi: number;
  monthlyIncome: number;
}): {
  burdenPercent: number;
  band: string;
} | { error: string } {
  if (params.monthlyIncome <= 0) return { error: "Income must be positive." };
  if (params.monthlyEmi < 0) return { error: "EMI cannot be negative." };
  const burdenPercent = (params.monthlyEmi / params.monthlyIncome) * 100;
  const band =
    burdenPercent <= 30 ? "Comfortable" : burdenPercent <= 40 ? "Elevated" : "High burden";
  return { burdenPercent, band };
}

export function interestSavedByPrepayment(params: {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
  closureMonth: number;
  feePercent?: number;
}): ReturnType<typeof prepaymentForeclosure> {
  return prepaymentForeclosure(params);
}

export function emergencyFund(params: {
  monthlyExpenses: number;
  monthsDesired: number;
  currentSavings?: number;
}): {
  target: number;
  shortfall: number;
  monthsCoveredNow: number;
} | { error: string } {
  if (params.monthlyExpenses <= 0) return { error: "Expenses must be positive." };
  if (params.monthsDesired <= 0) return { error: "Months desired must be positive." };
  const current = params.currentSavings ?? 0;
  if (current < 0) return { error: "Current savings cannot be negative." };
  const target = params.monthlyExpenses * params.monthsDesired;
  return {
    target,
    shortfall: Math.max(0, target - current),
    monthsCoveredNow: current / params.monthlyExpenses,
  };
}

export function financialHealthScore(params: {
  emergencyMonths: number;
  dtiPercent: number;
  savingsRatePercent: number;
  investmentRatePercent: number;
}): {
  score: number;
  band: string;
  tips: string[];
} | { error: string } {
  let score = 40;
  score += Math.min(25, params.emergencyMonths * 4);
  score += Math.max(0, 20 - params.dtiPercent / 2);
  score += Math.min(15, params.savingsRatePercent);
  score += Math.min(10, params.investmentRatePercent / 2);
  score = Math.round(Math.min(100, Math.max(0, score)));
  const band = score >= 80 ? "Strong" : score >= 60 ? "OK" : score >= 40 ? "Needs work" : "At risk";
  const tips: string[] = [];
  if (params.emergencyMonths < 3) tips.push("Build at least 3 months of emergency reserves.");
  if (params.dtiPercent > 40) tips.push("Reduce EMI burden relative to income.");
  if (params.savingsRatePercent < 10) tips.push("Aim to save ~10%+ of income.");
  if (tips.length === 0) tips.push("Keep investing consistently and reviewing debt yearly.");
  return { score, band, tips };
}

/** Re-export EMI helper for viral loan context if host needs it. */
export { monthlyLoanPayment };
