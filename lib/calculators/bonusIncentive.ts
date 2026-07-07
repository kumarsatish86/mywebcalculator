import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";

export type BonusCurrencyCode = LoanCurrencyCode;

export const BONUS_URL = {
  A: "a",
  B: "b",
  C: "c",
  P: "p",
  T: "t",
  X: "x",
} as const;

export function formatBonusMoney(amount: number, currency: BonusCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseBonusIncentiveSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BONUS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function annualBonus(params: {
  annualSalary: number;
  bonusPercent: number;
}): {
  annualSalary: number;
  bonusPercent: number;
  annualBonus: number;
  monthlyBonus: number;
  totalCompensation: number;
} {
  const annualBonusAmount = params.annualSalary * (params.bonusPercent / 100);
  return {
    annualSalary: params.annualSalary,
    bonusPercent: params.bonusPercent,
    annualBonus: annualBonusAmount,
    monthlyBonus: annualBonusAmount / 12,
    totalCompensation: params.annualSalary + annualBonusAmount,
  };
}

export function performanceBonus(params: {
  annualSalary: number;
  targetBonusPercent: number;
  performanceScore: number;
}): {
  annualSalary: number;
  targetBonusPercent: number;
  performanceScore: number;
  targetBonus: number;
  earnedBonus: number;
  monthlyEarned: number;
} {
  const targetBonus = params.annualSalary * (params.targetBonusPercent / 100);
  const scoreFactor = Math.max(0, Math.min(params.performanceScore, 100)) / 100;
  const earnedBonus = targetBonus * scoreFactor;
  return {
    annualSalary: params.annualSalary,
    targetBonusPercent: params.targetBonusPercent,
    performanceScore: params.performanceScore,
    targetBonus,
    earnedBonus,
    monthlyEarned: earnedBonus / 12,
  };
}

export function salesCommission(params: {
  salesAmount: number;
  commissionPercent: number;
  baseSalary?: number;
}): {
  salesAmount: number;
  commissionPercent: number;
  commission: number;
  baseSalary: number;
  totalPayout: number;
} {
  const commission = params.salesAmount * (params.commissionPercent / 100);
  const baseSalary = params.baseSalary ?? 0;
  return {
    salesAmount: params.salesAmount,
    commissionPercent: params.commissionPercent,
    commission,
    baseSalary,
    totalPayout: baseSalary + commission,
  };
}

export function incentivePayout(params: {
  targetAmount: number;
  achievedAmount: number;
  incentiveAt100: number;
}): {
  targetAmount: number;
  achievedAmount: number;
  achievementPercent: number;
  incentiveAt100: number;
  payout: number;
} | { error: string } {
  if (params.targetAmount <= 0) return { error: "Target amount must be positive." };
  const achievementPercent = (params.achievedAmount / params.targetAmount) * 100;
  const cappedFactor = Math.min(params.achievedAmount / params.targetAmount, 1);
  const payout = params.incentiveAt100 * cappedFactor;
  return {
    targetAmount: params.targetAmount,
    achievedAmount: params.achievedAmount,
    achievementPercent,
    incentiveAt100: params.incentiveAt100,
    payout,
  };
}

export function profitSharing(params: {
  companyProfit: number;
  sharePercent: number;
}): {
  companyProfit: number;
  sharePercent: number;
  profitShare: number;
  monthlyEquivalent: number;
} {
  const profitShare = params.companyProfit * (params.sharePercent / 100);
  return {
    companyProfit: params.companyProfit,
    sharePercent: params.sharePercent,
    profitShare,
    monthlyEquivalent: profitShare / 12,
  };
}

export function variablePay(params: {
  fixedAnnual: number;
  variablePercent: number;
  achievementPercent: number;
}): {
  fixedAnnual: number;
  variablePercent: number;
  achievementPercent: number;
  variableAt100: number;
  variableEarned: number;
  totalAnnual: number;
  totalMonthly: number;
} {
  const achievementFactor = Math.max(0, params.achievementPercent) / 100;
  const variableAt100 = params.fixedAnnual * (params.variablePercent / 100);
  const variableEarned = variableAt100 * achievementFactor;
  const totalAnnual = params.fixedAnnual + variableEarned;
  return {
    fixedAnnual: params.fixedAnnual,
    variablePercent: params.variablePercent,
    achievementPercent: params.achievementPercent,
    variableAt100,
    variableEarned,
    totalAnnual,
    totalMonthly: totalAnnual / 12,
  };
}
