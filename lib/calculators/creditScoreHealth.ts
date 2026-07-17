import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";

export type CreditScoreHealthCurrencyCode = LoanCurrencyCode;

export const CREDIT_SCORE_HEALTH_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
  S: "s",
  U: "u",
} as const;

export function formatCreditScoreHealthMoney(
  amount: number,
  currency: CreditScoreHealthCurrencyCode,
): string {
  return formatLoanMoney(amount, currency);
}

export function parseCreditScoreHealthSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CREDIT_SCORE_HEALTH_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function clampScore(n: number): number {
  return Math.round(Math.min(900, Math.max(300, n)));
}

/** Educational weighted simulator — not a bureau model. */
export function creditScoreSimulator(params: {
  paymentHistoryScore: number; // 0-100
  utilizationPercent: number;
  ageOfCreditYears: number;
  inquiriesLastYear: number;
  mixScore: number; // 0-100
}): {
  estimatedScore: number;
  band: string;
  drivers: string[];
} | { error: string } {
  if (params.paymentHistoryScore < 0 || params.paymentHistoryScore > 100) {
    return { error: "Payment history score must be 0–100." };
  }
  if (params.utilizationPercent < 0 || params.utilizationPercent > 100) {
    return { error: "Utilization must be 0–100%." };
  }
  const utilScore = Math.max(0, 100 - params.utilizationPercent * 1.2);
  const ageScore = Math.min(100, params.ageOfCreditYears * 8);
  const inquiryPenalty = Math.min(40, params.inquiriesLastYear * 8);
  const mix = Math.min(100, Math.max(0, params.mixScore));

  const raw =
    300 +
    params.paymentHistoryScore * 2.1 +
    utilScore * 1.5 +
    ageScore * 0.9 +
    mix * 0.7 -
    inquiryPenalty * 2;

  const estimatedScore = clampScore(raw);
  const band =
    estimatedScore >= 750
      ? "Excellent"
      : estimatedScore >= 700
        ? "Good"
        : estimatedScore >= 650
          ? "Fair"
          : estimatedScore >= 550
            ? "Needs work"
            : "Poor";

  const drivers: string[] = [];
  if (params.utilizationPercent > 30) drivers.push("High utilization is weighing the score down.");
  if (params.paymentHistoryScore < 80) drivers.push("Strengthen on-time payment history.");
  if (params.inquiriesLastYear >= 3) drivers.push("Multiple recent inquiries may be a drag.");
  if (params.ageOfCreditYears < 3) drivers.push("Thin/young credit history limits the score.");
  if (drivers.length === 0) drivers.push("Key factors look balanced for a healthy educational score.");

  return { estimatedScore, band, drivers };
}

export function creditUtilization(params: {
  balancesCsv: string;
  limitsCsv: string;
}): {
  totalBalance: number;
  totalLimit: number;
  utilizationPercent: number;
  band: string;
} | { error: string } {
  const balances = params.balancesCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  const limits = params.limitsCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (balances.length === 0 || limits.length === 0) {
    return { error: "Enter balances and limits (comma-separated)." };
  }
  if (balances.length !== limits.length) {
    return { error: "Balances and limits must have the same count." };
  }
  const totalBalance = balances.reduce((s, n) => s + n, 0);
  const totalLimit = limits.reduce((s, n) => s + n, 0);
  if (totalLimit <= 0) return { error: "Total credit limit must be positive." };
  const utilizationPercent = (totalBalance / totalLimit) * 100;
  const band =
    utilizationPercent <= 10
      ? "Excellent"
      : utilizationPercent <= 30
        ? "Healthy"
        : utilizationPercent <= 50
          ? "Elevated"
          : "High risk";
  return { totalBalance, totalLimit, utilizationPercent, band };
}

export function creditScoreImprovement(params: {
  currentScore: number;
  utilizationNow: number;
  utilizationTarget: number;
  onTimeMonthsAdded: number;
}): {
  projectedScore: number;
  scoreGain: number;
  tips: string[];
} | { error: string } {
  if (params.currentScore < 300 || params.currentScore > 900) {
    return { error: "Score must be between 300 and 900." };
  }
  const utilGain = Math.max(0, (params.utilizationNow - params.utilizationTarget) * 1.5);
  const payGain = Math.min(40, params.onTimeMonthsAdded * 3);
  const projectedScore = clampScore(params.currentScore + utilGain + payGain);
  return {
    projectedScore,
    scoreGain: projectedScore - params.currentScore,
    tips: [
      "Keep utilization under ~30% across cards.",
      "Never miss statement due dates.",
      "Avoid unnecessary new hard inquiries.",
    ],
  };
}

export function loanEligibilityByScore(params: {
  creditScore: number;
  monthlyIncome: number;
  requestedAmount: number;
}): {
  eligible: boolean;
  maxSuggestedAmount: number;
  tier: string;
  note: string;
} | { error: string } {
  if (params.creditScore < 300 || params.creditScore > 900) {
    return { error: "Score must be between 300 and 900." };
  }
  if (params.monthlyIncome <= 0) return { error: "Income must be positive." };
  const multiplier =
    params.creditScore >= 750
      ? 30
      : params.creditScore >= 700
        ? 24
        : params.creditScore >= 650
          ? 18
          : params.creditScore >= 600
            ? 12
            : 6;
  const tier =
    params.creditScore >= 750
      ? "Prime"
      : params.creditScore >= 700
        ? "Near prime"
        : params.creditScore >= 650
          ? "Standard"
          : "Subprime / limited";
  const maxSuggestedAmount = params.monthlyIncome * multiplier;
  const eligible = params.creditScore >= 600 && params.requestedAmount <= maxSuggestedAmount;
  return {
    eligible,
    maxSuggestedAmount,
    tier,
    note: "Indicative planning only — lenders use full underwriting, income proof, and bureau data.",
  };
}

export function creditLimitRecommendation(params: {
  monthlyIncome: number;
  existingLimits: number;
  creditScore: number;
}): {
  suggestedTotalLimit: number;
  headroom: number;
} | { error: string } {
  if (params.monthlyIncome <= 0) return { error: "Income must be positive." };
  const factor =
    params.creditScore >= 750 ? 4 : params.creditScore >= 700 ? 3 : params.creditScore >= 650 ? 2.5 : 1.5;
  const suggestedTotalLimit = params.monthlyIncome * factor * 12 * 0.15; // ~1.8–7.2× monthly
  // clearer: 2–5× monthly income style
  const alt = params.monthlyIncome * (params.creditScore >= 700 ? 5 : 3);
  const suggested = Math.max(suggestedTotalLimit, alt);
  return {
    suggestedTotalLimit: suggested,
    headroom: Math.max(0, suggested - params.existingLimits),
  };
}

export function howLongToImproveScore(params: {
  currentScore: number;
  targetScore: number;
  monthlyUtilizationDropPercent: number;
}): {
  estimatedMonths: number;
  feasible: boolean;
  plan: string;
} | { error: string } {
  if (params.targetScore <= params.currentScore) {
    return {
      estimatedMonths: 0,
      feasible: true,
      plan: "You are already at or above the target in this simple model.",
    };
  }
  const gap = params.targetScore - params.currentScore;
  const monthlyGain = Math.max(1, params.monthlyUtilizationDropPercent * 1.2 + 2);
  const estimatedMonths = Math.ceil(gap / monthlyGain);
  return {
    estimatedMonths,
    feasible: estimatedMonths <= 36,
    plan: `At ~${monthlyGain.toFixed(1)} points/month from utilization and on-time payments, expect about ${estimatedMonths} months (educational estimate).`,
  };
}

export function creditRiskAssessment(params: {
  creditScore: number;
  utilizationPercent: number;
  dtiPercent: number;
  latePaymentsLastYear: number;
}): {
  riskScore: number;
  riskBand: string;
  factors: string[];
} | { error: string } {
  let risk = 20;
  if (params.creditScore < 650) risk += 25;
  else if (params.creditScore < 700) risk += 12;
  if (params.utilizationPercent > 50) risk += 20;
  else if (params.utilizationPercent > 30) risk += 10;
  if (params.dtiPercent > 50) risk += 20;
  else if (params.dtiPercent > 35) risk += 10;
  risk += Math.min(25, params.latePaymentsLastYear * 8);
  risk = Math.min(100, risk);

  const riskBand =
    risk >= 70 ? "High" : risk >= 45 ? "Moderate" : risk >= 25 ? "Low-moderate" : "Low";

  const factors: string[] = [];
  if (params.creditScore < 700) factors.push("Credit score below prime tiers.");
  if (params.utilizationPercent > 30) factors.push("Elevated revolving utilization.");
  if (params.dtiPercent > 35) factors.push("Debt-to-income pressure.");
  if (params.latePaymentsLastYear > 0) factors.push("Recent late payments.");
  if (factors.length === 0) factors.push("No major red flags in the inputs provided.");

  return { riskScore: risk, riskBand, factors };
}
