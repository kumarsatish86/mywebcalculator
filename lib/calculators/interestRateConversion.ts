import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { compareFlatVsReducing } from "./emiInverse";

export type InterestRateConversionCurrencyCode = LoanCurrencyCode;

export const INTEREST_RATE_CONVERSION_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  N: "n",
  M: "m",
} as const;

export function formatInterestRateConversionMoney(
  amount: number,
  currency: InterestRateConversionCurrencyCode,
): string {
  return formatLoanMoney(amount, currency);
}

export function parseInterestRateConversionSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(INTEREST_RATE_CONVERSION_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** APR from fees + interest over loan term (simplified). */
export function aprFromFees(params: {
  principal: number;
  annualInterestPercent: number;
  fees: number;
  years: number;
}): { aprPercent: number; totalCost: number } | { error: string } {
  if (params.principal <= 0) return { error: "Principal must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.fees < 0) return { error: "Fees cannot be negative." };
  const interest = params.principal * (params.annualInterestPercent / 100) * params.years;
  const totalCost = interest + params.fees;
  const aprPercent = (totalCost / params.principal / params.years) * 100;
  return { aprPercent, totalCost };
}

export function apyFromNominal(params: {
  nominalRatePercent: number;
  compoundsPerYear: number;
}): { apyPercent: number } | { error: string } {
  if (params.compoundsPerYear <= 0) return { error: "Compounds per year must be positive." };
  const r = params.nominalRatePercent / 100;
  const n = params.compoundsPerYear;
  const apyPercent = (Math.pow(1 + r / n, n) - 1) * 100;
  return { apyPercent };
}

export function nominalVsEffective(params: {
  nominalRatePercent: number;
  compoundsPerYear: number;
}): {
  nominalRatePercent: number;
  effectiveRatePercent: number;
  differencePoints: number;
} | { error: string } {
  const apy = apyFromNominal(params);
  if ("error" in apy) return apy;
  return {
    nominalRatePercent: params.nominalRatePercent,
    effectiveRatePercent: apy.apyPercent,
    differencePoints: apy.apyPercent - params.nominalRatePercent,
  };
}

export function monthlyAnnualInterestConverter(params: {
  mode: "monthly-to-annual" | "annual-to-monthly";
  ratePercent: number;
}): { resultPercent: number; formula: string } | { error: string } {
  if (!Number.isFinite(params.ratePercent)) return { error: "Enter a valid rate." };
  if (params.mode === "monthly-to-annual") {
    return {
      resultPercent: params.ratePercent * 12,
      formula: "Annual ≈ monthly × 12 (simple)",
    };
  }
  return {
    resultPercent: params.ratePercent / 12,
    formula: "Monthly ≈ annual ÷ 12 (simple)",
  };
}

export function reducingVsFlatConverter(params: {
  principal: number;
  flatAnnualPercent: number;
  reducingAprPercent: number;
  termMonths: number;
}): ReturnType<typeof compareFlatVsReducing> {
  return compareFlatVsReducing(params);
}
