import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";

export type BankingChargesCurrencyCode = LoanCurrencyCode;

export const BANKING_CHARGES_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  F: "f",
  N: "n",
} as const;

export function formatBankingChargesMoney(amount: number, currency: BankingChargesCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseBankingChargesSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BANKING_CHARGES_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function bankChargesTotal(params: {
  monthlyFee: number;
  annualFee: number;
  otherFeesPerYear: number;
}): { annualTotal: number; monthlyEquivalent: number } | { error: string } {
  if (params.monthlyFee < 0 || params.annualFee < 0 || params.otherFeesPerYear < 0) {
    return { error: "Fees cannot be negative." };
  }
  const annualTotal = params.monthlyFee * 12 + params.annualFee + params.otherFeesPerYear;
  return { annualTotal, monthlyEquivalent: annualTotal / 12 };
}

export function atmWithdrawalFee(params: {
  withdrawals: number;
  freeLimit: number;
  feePerExtra: number;
}): { chargedWithdrawals: number; totalFee: number } | { error: string } {
  if (params.withdrawals < 0 || params.freeLimit < 0 || params.feePerExtra < 0) {
    return { error: "Inputs cannot be negative." };
  }
  const chargedWithdrawals = Math.max(0, params.withdrawals - params.freeLimit);
  return { chargedWithdrawals, totalFee: chargedWithdrawals * params.feePerExtra };
}

export function overdraftInterest(params: {
  overdraftAmount: number;
  annualRatePercent: number;
  days: number;
}): { interest: number } | { error: string } {
  if (params.overdraftAmount < 0) return { error: "Overdraft amount cannot be negative." };
  if (params.annualRatePercent < 0) return { error: "Rate cannot be negative." };
  if (params.days <= 0) return { error: "Days must be positive." };
  return {
    interest: (params.overdraftAmount * params.annualRatePercent * params.days) / (100 * 365),
  };
}

export function penaltyMinBalanceLate(params: {
  mode: "min-balance" | "late-fee";
  shortfall?: number;
  penaltyFlat?: number;
  penaltyPercentOfShortfall?: number;
  lateFlatFee?: number;
  daysLate?: number;
  dailyLatePercent?: number;
  balance?: number;
}): { penalty: number; modeLabel: string } | { error: string } {
  if (params.mode === "min-balance") {
    const shortfall = params.shortfall ?? 0;
    const flat = params.penaltyFlat ?? 0;
    const pct = params.penaltyPercentOfShortfall ?? 0;
    if (shortfall < 0 || flat < 0 || pct < 0) return { error: "Penalty inputs cannot be negative." };
    return {
      penalty: Math.max(flat, shortfall * (pct / 100)),
      modeLabel: "Minimum balance penalty",
    };
  }
  const lateFlat = params.lateFlatFee ?? 0;
  const days = params.daysLate ?? 0;
  const dailyPct = params.dailyLatePercent ?? 0;
  const balance = params.balance ?? 0;
  if (lateFlat < 0 || days < 0 || dailyPct < 0 || balance < 0) {
    return { error: "Late fee inputs cannot be negative." };
  }
  return {
    penalty: lateFlat + balance * (dailyPct / 100) * days,
    modeLabel: "Late payment fee",
  };
}

export function accountMaintenanceFee(params: {
  monthlyFee: number;
  months: number;
  waivers?: number;
}): { totalFees: number; monthsCharged: number } | { error: string } {
  if (params.monthlyFee < 0 || params.months < 0) return { error: "Inputs cannot be negative." };
  const waivers = params.waivers ?? 0;
  const monthsCharged = Math.max(0, params.months - waivers);
  return { totalFees: monthsCharged * params.monthlyFee, monthsCharged };
}

export function loanProcessingFee(params: {
  loanAmount: number;
  feePercent: number;
  gstPercent?: number;
  flatFee?: number;
}): {
  baseFee: number;
  gst: number;
  totalFee: number;
  netDisbursal: number;
} | { error: string } {
  if (params.loanAmount <= 0) return { error: "Loan amount must be positive." };
  if (params.feePercent < 0) return { error: "Fee % cannot be negative." };
  const gstPct = params.gstPercent ?? 0;
  const flat = params.flatFee ?? 0;
  if (gstPct < 0 || flat < 0) return { error: "GST/flat fee cannot be negative." };
  const baseFee = params.loanAmount * (params.feePercent / 100) + flat;
  const gst = baseFee * (gstPct / 100);
  const totalFee = baseFee + gst;
  return { baseFee, gst, totalFee, netDisbursal: params.loanAmount - totalFee };
}
