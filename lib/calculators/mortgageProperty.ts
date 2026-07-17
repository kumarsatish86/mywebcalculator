import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { amortizationSchedule, amortizationTotals, monthlyLoanPayment } from "./loanPayment";

export type MortgagePropertyCurrencyCode = LoanCurrencyCode;

export const MORTGAGE_PROPERTY_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
  F: "f",
  D: "d",
} as const;

export function formatMortgagePropertyMoney(amount: number, currency: MortgagePropertyCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseMortgagePropertySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MORTGAGE_PROPERTY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function mortgageCalc(params: {
  homePrice: number;
  downPayment: number;
  annualRatePercent: number;
  termYears: number;
}): {
  loanAmount: number;
  emi: number;
  totalInterest: number;
  totalPaid: number;
} | { error: string } {
  if (params.homePrice <= 0) return { error: "Home price must be positive." };
  if (params.downPayment < 0) return { error: "Down payment cannot be negative." };
  const loanAmount = params.homePrice - params.downPayment;
  if (loanAmount <= 0) return { error: "Down payment covers the full price — no mortgage needed." };
  const pay = monthlyLoanPayment({
    principal: loanAmount,
    annualRatePercent: params.annualRatePercent,
    termYears: params.termYears,
  });
  if ("error" in pay) return pay;
  return {
    loanAmount,
    emi: pay.payment,
    totalInterest: pay.totalInterest,
    totalPaid: pay.totalPaid,
  };
}

export function downPaymentCalc(params: {
  homePrice: number;
  downPaymentPercent: number;
}): {
  downPayment: number;
  loanAmount: number;
} | { error: string } {
  if (params.homePrice <= 0) return { error: "Home price must be positive." };
  if (params.downPaymentPercent < 0 || params.downPaymentPercent > 100) {
    return { error: "Down payment % must be 0–100." };
  }
  const downPayment = params.homePrice * (params.downPaymentPercent / 100);
  return { downPayment, loanAmount: params.homePrice - downPayment };
}

export function mortgageAmortization(params: {
  principal: number;
  annualRatePercent: number;
  termYears: number;
}): {
  emi: number;
  totalInterest: number;
  rows: { month: number; payment: number; interest: number; principal: number; balance: number }[];
} | { error: string } {
  const pay = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.annualRatePercent,
    termYears: params.termYears,
  });
  if ("error" in pay) return pay;
  const rows = amortizationSchedule(params.principal, params.annualRatePercent, {
    termYears: params.termYears,
  });
  if ("error" in rows) return rows;
  const totals = amortizationTotals(rows);
  return { emi: pay.payment, totalInterest: totals.totalInterest, rows };
}

export function refinanceCalc(params: {
  remainingPrincipal: number;
  currentRatePercent: number;
  remainingMonths: number;
  newRatePercent: number;
  closingCosts: number;
}): {
  currentEmi: number;
  newEmi: number;
  monthlySavings: number;
  breakEvenMonths: number | null;
  interestSavings: number;
} | { error: string } {
  const cur = monthlyLoanPayment({
    principal: params.remainingPrincipal,
    annualRatePercent: params.currentRatePercent,
    termMonths: params.remainingMonths,
  });
  if ("error" in cur) return cur;
  const neu = monthlyLoanPayment({
    principal: params.remainingPrincipal,
    annualRatePercent: params.newRatePercent,
    termMonths: params.remainingMonths,
  });
  if ("error" in neu) return neu;
  const monthlySavings = cur.payment - neu.payment;
  const interestSavings = cur.totalInterest - neu.totalInterest - params.closingCosts;
  const breakEvenMonths =
    monthlySavings > 0 ? Math.ceil(params.closingCosts / monthlySavings) : null;
  return {
    currentEmi: cur.payment,
    newEmi: neu.payment,
    monthlySavings,
    breakEvenMonths,
    interestSavings,
  };
}

export function homeAffordability(params: {
  monthlyIncome: number;
  existingEmi: number;
  maxHousingPercent: number;
  annualRatePercent: number;
  termYears: number;
  downPaymentAvailable: number;
}): {
  maxEmi: number;
  maxLoan: number;
  maxHomePrice: number;
} | { error: string } {
  if (params.monthlyIncome <= 0) return { error: "Income must be positive." };
  const maxEmi = Math.max(
    0,
    params.monthlyIncome * (params.maxHousingPercent / 100) - params.existingEmi,
  );
  if (maxEmi <= 0) return { error: "No housing EMI capacity under this payment ratio." };
  const months = Math.round(params.termYears * 12);
  const r = params.annualRatePercent / 100 / 12;
  const maxLoan =
    r === 0 ? maxEmi * months : maxEmi * ((1 - Math.pow(1 + r, -months)) / r);
  return {
    maxEmi,
    maxLoan,
    maxHomePrice: maxLoan + Math.max(0, params.downPaymentAvailable),
  };
}
