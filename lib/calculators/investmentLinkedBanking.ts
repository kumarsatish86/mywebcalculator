import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { fixedDeposit, recurringDeposit } from "./fixedIncomeSafe";
import { inflationAdjustedReturn } from "./coreInvestment";

export type InvestmentLinkedBankingCurrencyCode = LoanCurrencyCode;

export const INVESTMENT_LINKED_BANKING_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  F: "f",
} as const;

export function formatInvestmentLinkedBankingMoney(
  amount: number,
  currency: InvestmentLinkedBankingCurrencyCode,
): string {
  return formatLoanMoney(amount, currency);
}

export function parseInvestmentLinkedBankingSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(INVESTMENT_LINKED_BANKING_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function fdVsRd(params: {
  principalOrMonthly: number;
  annualRatePercent: number;
  years: number;
}): {
  fdMaturity: number;
  rdMaturity: number;
  fdInterest: number;
  rdInterest: number;
  rdTotalDeposited: number;
  winner: "FD" | "RD" | "tie";
} | { error: string } {
  const years = params.years;
  const fd = fixedDeposit({
    principal: params.principalOrMonthly,
    annualRatePercent: params.annualRatePercent,
    years,
  });
  if ("error" in fd) return fd;
  const months = Math.round(years * 12);
  const rd = recurringDeposit({
    monthlyDeposit: params.principalOrMonthly,
    annualRatePercent: params.annualRatePercent,
    months,
  });
  if ("error" in rd) return rd;
  const winner =
    Math.abs(fd.maturityValue - rd.maturityValue) < 1
      ? "tie"
      : fd.maturityValue > rd.maturityValue
        ? "FD"
        : "RD";
  return {
    fdMaturity: fd.maturityValue,
    rdMaturity: rd.maturityValue,
    fdInterest: fd.interestEarned,
    rdInterest: rd.interestEarned,
    rdTotalDeposited: rd.totalDeposited,
    winner,
  };
}

export function fdVsMutualFund(params: {
  principal: number;
  fdRatePercent: number;
  mfReturnPercent: number;
  years: number;
}): {
  fdMaturity: number;
  mfMaturity: number;
  difference: number;
  winner: "FD" | "MF" | "tie";
} | { error: string } {
  const fd = fixedDeposit({
    principal: params.principal,
    annualRatePercent: params.fdRatePercent,
    years: params.years,
  });
  if ("error" in fd) return fd;
  if (params.principal <= 0) return { error: "Principal must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  const mfMaturity = params.principal * Math.pow(1 + params.mfReturnPercent / 100, params.years);
  const difference = mfMaturity - fd.maturityValue;
  return {
    fdMaturity: fd.maturityValue,
    mfMaturity,
    difference,
    winner: Math.abs(difference) < 1 ? "tie" : difference > 0 ? "MF" : "FD",
  };
}

export function savingsVsInvestment(params: {
  monthlyAmount: number;
  savingsRatePercent: number;
  investmentReturnPercent: number;
  years: number;
}): {
  savingsFuture: number;
  investmentFuture: number;
  difference: number;
} | { error: string } {
  if (params.monthlyAmount <= 0) return { error: "Monthly amount must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  const months = Math.round(params.years * 12);
  const grow = (annual: number) => {
    const r = annual / 100 / 12;
    if (r === 0) return params.monthlyAmount * months;
    return params.monthlyAmount * ((Math.pow(1 + r, months) - 1) / r);
  };
  const savingsFuture = grow(params.savingsRatePercent);
  const investmentFuture = grow(params.investmentReturnPercent);
  return {
    savingsFuture,
    investmentFuture,
    difference: investmentFuture - savingsFuture,
  };
}

export function inflationImpactOnSavings(params: {
  principal: number;
  nominalRatePercent: number;
  inflationPercent: number;
  years: number;
}): {
  nominalFuture: number;
  realPurchasingPower: number;
  erodedByInflation: number;
  realRatePercent: number;
} | { error: string } {
  if (params.principal <= 0) return { error: "Principal must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  const real = inflationAdjustedReturn({
    nominalReturnPercent: params.nominalRatePercent,
    inflationPercent: params.inflationPercent,
  });
  const nominalFuture = params.principal * Math.pow(1 + params.nominalRatePercent / 100, params.years);
  const realPurchasingPower =
    params.principal * Math.pow(1 + real.realReturnPercent / 100, params.years);
  return {
    nominalFuture,
    realPurchasingPower,
    erodedByInflation: nominalFuture - realPurchasingPower,
    realRatePercent: real.realReturnPercent,
  };
}

export function realInterestRate(params: {
  nominalRatePercent: number;
  inflationPercent: number;
}): { realRatePercent: number } {
  return {
    realRatePercent: inflationAdjustedReturn({
      nominalReturnPercent: params.nominalRatePercent,
      inflationPercent: params.inflationPercent,
    }).realReturnPercent,
  };
}

export function taxOnInterest(params: {
  interestIncome: number;
  taxRatePercent: number;
}): {
  tax: number;
  afterTaxInterest: number;
  afterTaxYieldFactor: number;
} | { error: string } {
  if (params.interestIncome < 0) return { error: "Interest cannot be negative." };
  if (params.taxRatePercent < 0 || params.taxRatePercent > 100) {
    return { error: "Tax rate must be 0–100." };
  }
  const tax = params.interestIncome * (params.taxRatePercent / 100);
  return {
    tax,
    afterTaxInterest: params.interestIncome - tax,
    afterTaxYieldFactor: 1 - params.taxRatePercent / 100,
  };
}
