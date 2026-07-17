import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { fixedDeposit, recurringDeposit } from "./fixedIncomeSafe";
import { monthlyLoanPayment } from "./loanPayment";
import { creditCardPayoff } from "./creditCardBanking";

export type IndiaSpecificBankingCurrencyCode = LoanCurrencyCode;

export const INDIA_SPECIFIC_BANKING_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
  F: "f",
} as const;

/** Planning defaults — not live bank quotes. */
export const INDIA_FD_BANK_RATES: { bank: string; ratePercent: number }[] = [
  { bank: "SBI (indicative)", ratePercent: 6.8 },
  { bank: "HDFC (indicative)", ratePercent: 7.0 },
  { bank: "ICICI (indicative)", ratePercent: 7.0 },
  { bank: "Axis (indicative)", ratePercent: 6.9 },
  { bank: "Custom", ratePercent: 7.0 },
];

export function formatIndiaSpecificBankingMoney(
  amount: number,
  currency: IndiaSpecificBankingCurrencyCode,
): string {
  return formatLoanMoney(amount, currency);
}

export function parseIndiaSpecificBankingSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(INDIA_SPECIFIC_BANKING_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function fdIndiaBankWise(params: {
  principal: number;
  years: number;
  ratePercent: number;
  bankLabel?: string;
}): {
  bankLabel: string;
  maturityValue: number;
  interestEarned: number;
} | { error: string } {
  const fd = fixedDeposit({
    principal: params.principal,
    annualRatePercent: params.ratePercent,
    years: params.years,
    compoundsPerYear: 4,
  });
  if ("error" in fd) return fd;
  return {
    bankLabel: params.bankLabel ?? "Custom",
    maturityValue: fd.maturityValue,
    interestEarned: fd.interestEarned,
  };
}

export function rdIndia(params: {
  monthlyDeposit: number;
  annualRatePercent: number;
  months: number;
}): ReturnType<typeof recurringDeposit> {
  return recurringDeposit(params);
}

export function creditCardInterestIndia(params: {
  balance: number;
  annualRatePercent: number;
  monthlyPayment: number;
}): ReturnType<typeof creditCardPayoff> {
  return creditCardPayoff(params);
}

export function loanEmiIndia(params: {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
}): ReturnType<typeof monthlyLoanPayment> {
  return monthlyLoanPayment(params);
}

export function bankInterestComparison(params: {
  principal: number;
  years: number;
  rateA: number;
  rateB: number;
  rateC?: number;
  labelA?: string;
  labelB?: string;
  labelC?: string;
}): {
  options: { label: string; rate: number; maturity: number; interest: number }[];
  bestLabel: string;
} | { error: string } {
  const rows = [
    { label: params.labelA ?? "Bank A", rate: params.rateA },
    { label: params.labelB ?? "Bank B", rate: params.rateB },
    ...(params.rateC !== undefined
      ? [{ label: params.labelC ?? "Bank C", rate: params.rateC }]
      : []),
  ];
  const options: { label: string; rate: number; maturity: number; interest: number }[] = [];
  for (const row of rows) {
    const fd = fixedDeposit({
      principal: params.principal,
      annualRatePercent: row.rate,
      years: params.years,
    });
    if ("error" in fd) return fd;
    options.push({
      label: row.label,
      rate: row.rate,
      maturity: fd.maturityValue,
      interest: fd.interestEarned,
    });
  }
  const best = options.reduce((a, b) => (b.maturity > a.maturity ? b : a));
  return { options, bestLabel: best.label };
}
