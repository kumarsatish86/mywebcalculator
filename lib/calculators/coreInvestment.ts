import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { compoundFutureValue } from "./compoundInterest";

export type CoreInvestmentCurrencyCode = LoanCurrencyCode;

export const CORE_INVESTMENT_URL = {
  A: "a",
  B: "b",
  R: "r",
  Y: "y",
  N: "n",
} as const;

export function formatCoreInvestmentMoney(
  amount: number,
  currency: CoreInvestmentCurrencyCode,
): string {
  return formatLoanMoney(amount, currency);
}

export function parseCoreInvestmentSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CORE_INVESTMENT_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Future value of equal monthly SIP: FV = P × [((1+r)^n − 1) / r] × (1+r) */
export function sipFutureValue(params: {
  monthlyInvestment: number;
  annualRatePercent: number;
  years: number;
}): {
  monthlyInvestment: number;
  years: number;
  months: number;
  totalInvested: number;
  futureValue: number;
  gains: number;
} | { error: string } {
  if (params.monthlyInvestment <= 0) return { error: "Monthly investment must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.annualRatePercent < 0) return { error: "Expected return cannot be negative." };

  const months = Math.round(params.years * 12);
  const r = params.annualRatePercent / 100 / 12;
  const totalInvested = params.monthlyInvestment * months;
  let futureValue: number;
  if (r === 0) {
    futureValue = totalInvested;
  } else {
    futureValue = params.monthlyInvestment * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  }
  return {
    monthlyInvestment: params.monthlyInvestment,
    years: params.years,
    months,
    totalInvested,
    futureValue,
    gains: futureValue - totalInvested,
  };
}

export function lumpsumInvestment(params: {
  principal: number;
  annualRatePercent: number;
  years: number;
  compoundsPerYear?: number;
}): {
  principal: number;
  futureValue: number;
  gains: number;
  years: number;
} | { error: string } {
  if (params.principal <= 0) return { error: "Investment amount must be positive." };
  const result = compoundFutureValue({
    principal: params.principal,
    annualRatePercent: params.annualRatePercent,
    years: params.years,
    compoundsPerYear: params.compoundsPerYear ?? 1,
  });
  if ("error" in result) return result;
  return {
    principal: params.principal,
    futureValue: result.futureValue,
    gains: result.interestEarned,
    years: params.years,
  };
}

export function compoundInterestCalc(params: {
  principal: number;
  annualRatePercent: number;
  years: number;
  compoundsPerYear: number;
}): ReturnType<typeof compoundFutureValue> {
  return compoundFutureValue(params);
}

export function simpleInterestCalc(params: {
  principal: number;
  annualRatePercent: number;
  years: number;
}): {
  principal: number;
  interest: number;
  totalAmount: number;
  years: number;
} | { error: string } {
  if (params.principal < 0) return { error: "Principal cannot be negative." };
  if (params.years < 0) return { error: "Years cannot be negative." };
  const interest = (params.principal * params.annualRatePercent * params.years) / 100;
  return {
    principal: params.principal,
    interest,
    totalAmount: params.principal + interest,
    years: params.years,
  };
}

/** Lumpsum + monthly SIP combined growth. */
export function investmentGrowth(params: {
  initialAmount: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
}): {
  initialAmount: number;
  monthlyContribution: number;
  totalInvested: number;
  futureValue: number;
  gains: number;
} | { error: string } {
  if (params.initialAmount < 0) return { error: "Initial amount cannot be negative." };
  if (params.monthlyContribution < 0) return { error: "Monthly contribution cannot be negative." };
  if (params.years <= 0) return { error: "Years must be positive." };

  const months = Math.round(params.years * 12);
  const r = params.annualRatePercent / 100 / 12;
  const lumpsumFv =
    r === 0
      ? params.initialAmount
      : params.initialAmount * Math.pow(1 + r, months);
  let sipFv = 0;
  if (params.monthlyContribution > 0) {
    if (r === 0) {
      sipFv = params.monthlyContribution * months;
    } else {
      sipFv = params.monthlyContribution * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    }
  }
  const futureValue = lumpsumFv + sipFv;
  const totalInvested = params.initialAmount + params.monthlyContribution * months;
  return {
    initialAmount: params.initialAmount,
    monthlyContribution: params.monthlyContribution,
    totalInvested,
    futureValue,
    gains: futureValue - totalInvested,
  };
}

export function futureValueCalc(params: {
  presentValue: number;
  annualRatePercent: number;
  years: number;
  compoundsPerYear?: number;
}): { presentValue: number; futureValue: number; interestEarned: number } | { error: string } {
  if (params.presentValue < 0) return { error: "Present value cannot be negative." };
  const result = compoundFutureValue({
    principal: params.presentValue,
    annualRatePercent: params.annualRatePercent,
    years: params.years,
    compoundsPerYear: params.compoundsPerYear ?? 1,
  });
  if ("error" in result) return result;
  return {
    presentValue: params.presentValue,
    futureValue: result.futureValue,
    interestEarned: result.interestEarned,
  };
}

export function presentValueCalc(params: {
  futureValue: number;
  annualRatePercent: number;
  years: number;
  compoundsPerYear?: number;
}): { futureValue: number; presentValue: number; discount: number } | { error: string } {
  if (params.futureValue < 0) return { error: "Future value cannot be negative." };
  if (params.years < 0) return { error: "Years cannot be negative." };
  const n = params.compoundsPerYear ?? 1;
  if (n < 1) return { error: "Compounds per year must be at least 1." };
  const r = params.annualRatePercent / 100;
  const presentValue = params.futureValue / Math.pow(1 + r / n, n * params.years);
  return {
    futureValue: params.futureValue,
    presentValue,
    discount: params.futureValue - presentValue,
  };
}

/** Absolute / total return and annualized (CAGR-style) when years > 0. */
export function rateOfReturn(params: {
  initialValue: number;
  finalValue: number;
  years?: number;
}): {
  initialValue: number;
  finalValue: number;
  absoluteReturn: number;
  absoluteReturnPercent: number;
  annualizedReturnPercent: number | null;
} | { error: string } {
  if (params.initialValue <= 0) return { error: "Initial value must be positive." };
  if (params.finalValue < 0) return { error: "Final value cannot be negative." };
  const absoluteReturn = params.finalValue - params.initialValue;
  const absoluteReturnPercent = (absoluteReturn / params.initialValue) * 100;
  let annualizedReturnPercent: number | null = null;
  if (params.years !== undefined && params.years > 0) {
    annualizedReturnPercent =
      (Math.pow(params.finalValue / params.initialValue, 1 / params.years) - 1) * 100;
  }
  return {
    initialValue: params.initialValue,
    finalValue: params.finalValue,
    absoluteReturn,
    absoluteReturnPercent,
    annualizedReturnPercent,
  };
}

/** CAGR / annualized return over a holding period. */
export function annualReturn(params: {
  initialValue: number;
  finalValue: number;
  years: number;
}): {
  initialValue: number;
  finalValue: number;
  years: number;
  cagrPercent: number;
  absoluteReturnPercent: number;
} | { error: string } {
  if (params.initialValue <= 0) return { error: "Initial value must be positive." };
  if (params.finalValue < 0) return { error: "Final value cannot be negative." };
  if (params.years <= 0) return { error: "Years must be positive." };
  const cagrPercent =
    (Math.pow(params.finalValue / params.initialValue, 1 / params.years) - 1) * 100;
  const absoluteReturnPercent =
    ((params.finalValue - params.initialValue) / params.initialValue) * 100;
  return {
    initialValue: params.initialValue,
    finalValue: params.finalValue,
    years: params.years,
    cagrPercent,
    absoluteReturnPercent,
  };
}

/** Real return ≈ ((1 + nominal) / (1 + inflation)) − 1 */
export function inflationAdjustedReturn(params: {
  nominalReturnPercent: number;
  inflationPercent: number;
}): {
  nominalReturnPercent: number;
  inflationPercent: number;
  realReturnPercent: number;
} {
  const realReturnPercent =
    ((1 + params.nominalReturnPercent / 100) / (1 + params.inflationPercent / 100) - 1) * 100;
  return {
    nominalReturnPercent: params.nominalReturnPercent,
    inflationPercent: params.inflationPercent,
    realReturnPercent,
  };
}
