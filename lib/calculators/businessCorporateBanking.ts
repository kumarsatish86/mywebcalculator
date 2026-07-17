import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { monthlyLoanPayment } from "./loanPayment";

export type BusinessCorporateBankingCurrencyCode = LoanCurrencyCode;

export const BUSINESS_CORPORATE_BANKING_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  F: "f",
  P: "p",
} as const;

export function formatBusinessCorporateBankingMoney(
  amount: number,
  currency: BusinessCorporateBankingCurrencyCode,
): string {
  return formatLoanMoney(amount, currency);
}

export function parseBusinessCorporateBankingSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BUSINESS_CORPORATE_BANKING_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function workingCapitalLoan(params: {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
}): ReturnType<typeof monthlyLoanPayment> {
  return monthlyLoanPayment(params);
}

export function cashFlowCalc(params: {
  inflows: number;
  outflows: number;
  openingCash?: number;
}): {
  netCashFlow: number;
  closingCash: number;
  status: "surplus" | "deficit" | "breakeven";
} | { error: string } {
  if (params.inflows < 0 || params.outflows < 0) return { error: "Cash flows cannot be negative." };
  const opening = params.openingCash ?? 0;
  if (opening < 0) return { error: "Opening cash cannot be negative in this simple model." };
  const netCashFlow = params.inflows - params.outflows;
  const closingCash = opening + netCashFlow;
  return {
    netCashFlow,
    closingCash,
    status: netCashFlow > 0 ? "surplus" : netCashFlow < 0 ? "deficit" : "breakeven",
  };
}

export function businessCreditLine(params: {
  creditLimit: number;
  drawnAmount: number;
  annualRatePercent: number;
  daysDrawn: number;
}): {
  available: number;
  utilizationPercent: number;
  interestEstimate: number;
} | { error: string } {
  if (params.creditLimit <= 0) return { error: "Credit limit must be positive." };
  if (params.drawnAmount < 0) return { error: "Drawn amount cannot be negative." };
  if (params.daysDrawn < 0) return { error: "Days cannot be negative." };
  const available = Math.max(0, params.creditLimit - params.drawnAmount);
  const interestEstimate =
    (params.drawnAmount * params.annualRatePercent * params.daysDrawn) / (100 * 365);
  return {
    available,
    utilizationPercent: (params.drawnAmount / params.creditLimit) * 100,
    interestEstimate,
  };
}

export function invoiceFinancing(params: {
  invoiceAmount: number;
  advancePercent: number;
  feePercent: number;
  daysUntilPayment: number;
}): {
  advanceAmount: number;
  fee: number;
  netReceived: number;
  effectiveCostPercent: number;
} | { error: string } {
  if (params.invoiceAmount <= 0) return { error: "Invoice amount must be positive." };
  if (params.advancePercent <= 0 || params.advancePercent > 100) {
    return { error: "Advance % must be between 0 and 100." };
  }
  if (params.feePercent < 0) return { error: "Fee % cannot be negative." };
  const advanceAmount = params.invoiceAmount * (params.advancePercent / 100);
  const fee = advanceAmount * (params.feePercent / 100);
  const netReceived = advanceAmount - fee;
  const annualized =
    params.daysUntilPayment > 0
      ? (fee / advanceAmount) * (365 / params.daysUntilPayment) * 100
      : params.feePercent;
  return {
    advanceAmount,
    fee,
    netReceived,
    effectiveCostPercent: annualized,
  };
}
