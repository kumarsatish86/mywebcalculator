/**
 * Daily interest decision engine — Actual/365 teaching aid (not bank statement truth).
 */

import { computeDailyInterest } from "./loanMicroInterest";

export type LoanPresetId =
  | "home"
  | "personal"
  | "car"
  | "education"
  | "business"
  | "credit_card"
  | "od"
  | "gold"
  | "mortgage";

export type DiMode =
  | "quick"
  | "planner"
  | "compare"
  | "delay"
  | "prepay"
  | "penalty";

export type DiRisk = "LOW" | "MEDIUM" | "HIGH";

export type LoanPreset = {
  id: LoanPresetId;
  label: string;
  /** Illustrative average APR % */
  apr: number;
  /** Market “good” APR band upper bound for scoring */
  goodAprMax: number;
  /** Market “high” APR threshold */
  highAprMin: number;
};

export const LOAN_PRESETS: Record<LoanPresetId, LoanPreset> = {
  home: { id: "home", label: "Home Loan", apr: 8.5, goodAprMax: 9.0, highAprMin: 10.5 },
  personal: { id: "personal", label: "Personal Loan", apr: 14, goodAprMax: 13, highAprMin: 18 },
  car: { id: "car", label: "Car Loan", apr: 10, goodAprMax: 10.5, highAprMin: 14 },
  education: { id: "education", label: "Education Loan", apr: 9.5, goodAprMax: 10, highAprMin: 13 },
  business: { id: "business", label: "Business Loan", apr: 12, goodAprMax: 12, highAprMin: 16 },
  credit_card: { id: "credit_card", label: "Credit Card", apr: 36, goodAprMax: 30, highAprMin: 40 },
  od: { id: "od", label: "Overdraft", apr: 12.5, goodAprMax: 12, highAprMin: 16 },
  gold: { id: "gold", label: "Gold Loan", apr: 9, goodAprMax: 10, highAprMin: 14 },
  mortgage: { id: "mortgage", label: "Mortgage", apr: 8.2, goodAprMax: 8.8, highAprMin: 10.5 },
};

export type BankId = "hdfc" | "sbi" | "icici" | "axis";

/** Illustrative APR offsets by bank for a preset’s base APR (teaching only). */
const BANK_APR_DELTA: Record<BankId, number> = {
  hdfc: 0,
  sbi: -0.25,
  icici: 0.15,
  axis: 0.35,
};

export const BANK_LABELS: Record<BankId, string> = {
  hdfc: "HDFC",
  sbi: "SBI",
  icici: "ICICI",
  axis: "Axis",
};

export type TimelinePoint = { label: string; days: number; interest: number };

export type BankCompareRow = {
  bankId: BankId;
  label: string;
  apr: number;
  daily: number;
  annual: number;
};

export type DecisionOptionId = "prepay_lump" | "extra_emi" | "refinance";

export type DecisionOption = {
  id: DecisionOptionId;
  label: string;
  action: string;
  savingsEstimate: number;
  blurb: string;
  patch: Partial<{ prepayAmount: number; extraMonthly: number; apr: number }>;
};

export type IntelligenceRow = {
  question: string;
  answer: string;
};

export type CoachTip = { prompt: string; reply: string };

export type DailyInterestDecisionInput = {
  principal: number;
  apr: number;
  days: number;
  presetId: LoanPresetId;
  delayDays?: number;
  /** Flat late-fee band for delay/penalty modes */
  penaltyFlat?: number;
  prepayAmount?: number;
  extraMonthly?: number;
  inflationPercent?: number;
  /** Optional remaining tenure months for prepay heuristic */
  remainingMonths?: number;
};

export type DailyInterestDecision = {
  dailyInterest: number;
  monthlyInterest: number;
  yearlyInterest: number;
  totalForDays: number;
  days: number;
  healthScore: number;
  interestEfficiency: number;
  risk: DiRisk;
  statusLabel: string;
  statusTone: "good" | "warn" | "bad" | "neutral";
  recommendation: string;
  timeline: TimelinePoint[];
  delay: {
    days: number;
    interest: number;
    penalty: number;
    total: number;
  };
  prepay: {
    amount: number;
    interestSaved: number;
    monthsEarlier: number;
  };
  extraPayment: {
    monthly: number;
    interestSaved: number;
    monthsReduced: number;
  };
  inflation: {
    apr: number;
    inflation: number;
    realCost: number;
  };
  bankCompare: BankCompareRow[];
  aprScenarios: { apr: number; label: string; daily: number; yearly: number }[];
  chartByDay: { day: number; interest: number }[];
  decisionOptions: DecisionOption[];
  intelligence: IntelligenceRow[];
  insights: string[];
  coachTips: CoachTip[];
  relatedSlugs: { slug: string; reason: string }[];
  disclaimer: string;
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function dailyRate(apr: number, principal: number): number {
  return (principal * (apr / 100)) / 365;
}

export function computeDailyInterestDecision(
  input: DailyInterestDecisionInput,
): DailyInterestDecision | { error: string } {
  const core = computeDailyInterest({
    principal: input.principal,
    apr: input.apr,
    days: input.days,
  });
  if ("error" in core) return core;

  const preset = LOAN_PRESETS[input.presetId];
  const { dailyInterest, totalForDays, days } = core;
  const monthlyInterest = dailyInterest * 30;
  const yearlyInterest = dailyInterest * 365;

  const delayDays = Math.max(0, Math.round(input.delayDays ?? 0));
  const penaltyFlat = Math.max(0, input.penaltyFlat ?? (delayDays > 0 ? Math.max(100, dailyInterest * 5) : 0));
  const delayInterest = dailyInterest * delayDays;
  const delayTotal = delayInterest + (delayDays > 0 ? penaltyFlat : 0);

  const prepayAmount = clamp(input.prepayAmount ?? 0, 0, input.principal);
  const remainingMonths = Math.max(1, input.remainingMonths ?? 60);
  // Teaching heuristic: interest saved ≈ prepay × APR × remainingYears × 0.55 (not amortization)
  const interestSavedPrepay =
    prepayAmount > 0 ? prepayAmount * (input.apr / 100) * (remainingMonths / 12) * 0.55 : 0;
  const monthsEarlier =
    prepayAmount > 0
      ? Math.max(1, Math.round((prepayAmount / Math.max(input.principal / remainingMonths, 1)) * 0.85))
      : 0;

  const extraMonthly = Math.max(0, input.extraMonthly ?? 0);
  const interestSavedExtra =
    extraMonthly > 0 ? extraMonthly * 12 * (input.apr / 100) * (remainingMonths / 12) * 0.4 : 0;
  const monthsReduced =
    extraMonthly > 0 ? Math.max(1, Math.round((extraMonthly / Math.max(monthlyInterest, 1)) * 2)) : 0;

  const inflation = input.inflationPercent ?? 5;
  const realCost = input.apr - inflation;

  // Health score: better if APR below good band, balance not tiny teaching edge cases
  const aprScore =
    input.apr <= preset.goodAprMax ? 92 : input.apr >= preset.highAprMin ? 45 : 70;
  const sizeScore = input.principal >= 10000 ? 85 : 65;
  const healthScore = Math.round(clamp(aprScore * 0.65 + sizeScore * 0.35, 0, 100));
  const interestEfficiency = Math.round(
    clamp(100 - (input.apr / Math.max(preset.highAprMin, 1)) * 40, 35, 98),
  );

  let risk: DiRisk = "MEDIUM";
  let statusTone: DailyInterestDecision["statusTone"] = "neutral";
  let statusLabel = "Review";
  if (input.apr <= preset.goodAprMax && healthScore >= 80) {
    risk = "LOW";
    statusTone = "good";
    statusLabel = "Healthy";
  } else if (input.apr >= preset.highAprMin) {
    risk = "HIGH";
    statusTone = "bad";
    statusLabel = "High cost";
  } else {
    statusTone = "warn";
    statusLabel = "Watch APR";
  }

  const recommendation =
    risk === "LOW"
      ? "Continue — no urgent action required"
      : risk === "HIGH"
        ? `Consider prepaying or refinancing this ${preset.label.toLowerCase()}`
        : "Optional savings via modest prepayment";

  const timeline: TimelinePoint[] = [
    { label: "Today", days: 1, interest: dailyInterest },
    { label: "7 Days", days: 7, interest: dailyInterest * 7 },
    { label: "30 Days", days: 30, interest: monthlyInterest },
    { label: "90 Days", days: 90, interest: dailyInterest * 90 },
    { label: "365 Days", days: 365, interest: yearlyInterest },
  ];

  const bankCompare: BankCompareRow[] = (Object.keys(BANK_APR_DELTA) as BankId[]).map((bankId) => {
    const apr = Math.max(0.1, preset.apr + BANK_APR_DELTA[bankId]);
    const daily = dailyRate(apr, input.principal);
    return {
      bankId,
      label: BANK_LABELS[bankId],
      apr,
      daily,
      annual: daily * 365,
    };
  });

  const aprScenarios = [
    { apr: input.apr, label: "Current", daily: dailyInterest, yearly: yearlyInterest },
    {
      apr: input.apr + 0.7,
      label: "+0.7%",
      daily: dailyRate(input.apr + 0.7, input.principal),
      yearly: dailyRate(input.apr + 0.7, input.principal) * 365,
    },
    {
      apr: input.apr + 1.5,
      label: "+1.5%",
      daily: dailyRate(input.apr + 1.5, input.principal),
      yearly: dailyRate(input.apr + 1.5, input.principal) * 365,
    },
  ];

  const chartByDay: { day: number; interest: number }[] = [];
  const maxDay = Math.max(days, 30);
  for (let d = 1; d <= Math.min(365, Math.max(maxDay, 60)); d += Math.max(1, Math.floor(maxDay / 40))) {
    chartByDay.push({ day: d, interest: dailyInterest * d });
  }
  if (chartByDay[chartByDay.length - 1]?.day !== Math.min(365, maxDay)) {
    chartByDay.push({ day: Math.min(365, maxDay), interest: dailyInterest * Math.min(365, maxDay) });
  }

  const defaultPrepay = Math.min(input.principal * 0.1, Math.max(10000, input.principal * 0.05));
  const optPrepaySaved = defaultPrepay * (input.apr / 100) * (remainingMonths / 12) * 0.55;
  const refinanceApr = Math.max(preset.goodAprMax - 0.5, input.apr - 1.2);
  const refinanceDailySave = Math.max(0, dailyInterest - dailyRate(refinanceApr, input.principal));

  const decisionOptions: DecisionOption[] = [
    {
      id: "prepay_lump",
      label: "OPTION A",
      action: `Prepay ~${Math.round(defaultPrepay).toLocaleString()} today`,
      savingsEstimate: optPrepaySaved,
      blurb: "Teaching estimate of interest avoided over remaining tenure",
      patch: { prepayAmount: Math.round(defaultPrepay) },
    },
    {
      id: "extra_emi",
      label: "OPTION B",
      action: "Add modest extra monthly payment",
      savingsEstimate: 500 * 12 * (input.apr / 100) * (remainingMonths / 12) * 0.4,
      blurb: "Small recurring extras compound into tenure reduction",
      patch: { extraMonthly: 500 },
    },
    {
      id: "refinance",
      label: "OPTION C",
      action: `Explore refinance near ${refinanceApr.toFixed(1)}%`,
      savingsEstimate: refinanceDailySave * 365,
      blurb: "Illustrative annual save if you land a lower band — verify with lenders",
      patch: { apr: Math.round(refinanceApr * 10) / 10 },
    },
  ];

  const interestHigh = input.apr >= preset.highAprMin;
  const intelligence: IntelligenceRow[] = [
    {
      question: "Is my interest high?",
      answer: interestHigh ? "Yes — above typical band for this loan type" : "No — within or below study band",
    },
    {
      question: "Should I refinance?",
      answer: interestHigh ? "Recommended to compare offers" : "Not urgent",
    },
    {
      question: "Should I prepay?",
      answer: risk !== "LOW" || dailyInterest > 50 ? "Yes — if surplus cash after emergency fund" : "Optional",
    },
    {
      question: "Daily cost acceptable?",
      answer: risk === "LOW" ? "Good" : risk === "MEDIUM" ? "Moderate" : "Elevated",
    },
    {
      question: "Bank charging correctly?",
      answer: "Unknown — verify statement day-count; this is Actual/365 teaching math only",
    },
    {
      question: "Interest vs market",
      answer:
        input.apr <= preset.goodAprMax
          ? "Better than / near average (illustrative)"
          : input.apr >= preset.highAprMin
            ? "Worse than average (illustrative)"
            : "Around average (illustrative)",
    },
    {
      question: "Delay impact",
      answer: `${dailyInterest.toFixed(2)} per day (interest only)`,
    },
    {
      question: "Savings opportunity",
      answer: `~${(optPrepaySaved).toFixed(0)} interest if you prepay ~${Math.round(defaultPrepay)} (heuristic)`,
    },
  ];

  const insights = [
    risk === "LOW" ? "Interest rate looks comfortable for this loan type (study band)." : "APR sits above the comfortable study band — watch total cost.",
    `Daily cost is ${dailyInterest.toFixed(2)} — about ${monthlyInterest.toFixed(0)} over 30 days.`,
    `Delaying by 30 days costs ~${(dailyInterest * 30).toFixed(0)} in interest alone (Actual/365).`,
    realCost > 0
      ? `After ${inflation}% inflation, real rate ≈ ${realCost.toFixed(1)}%.`
      : `APR is at or below assumed inflation (${inflation}%) — real cost is low/negative in this sketch.`,
  ];

  const coachTips: CoachTip[] = [
    {
      prompt: "Should I repay early?",
      reply: `If you prepay ~${Math.round(defaultPrepay).toLocaleString()}, a teaching estimate saves ~${optPrepaySaved.toFixed(0)} interest and may shorten tenure by ~${Math.max(1, monthsEarlier || Math.round(defaultPrepay / Math.max(input.principal / remainingMonths, 1)))} months. Confirm with your lender’s schedule.`,
    },
    {
      prompt: "What if I delay EMI by 5 days?",
      reply: `Interest alone ≈ ${(dailyInterest * 5).toFixed(2)}. Lenders may also levy late fees — use Delay / Penalty mode for a combined sketch.`,
    },
    {
      prompt: "Is my bank expensive?",
      reply: `Your ${input.apr}% vs ${preset.label} study band (good ≤${preset.goodAprMax}%, high ≥${preset.highAprMin}%). Compare the bank table — rates are illustrative, not live quotes.`,
    },
    {
      prompt: "How is daily interest calculated?",
      reply: `Actual/365: daily = principal × (APR/100) / 365. Banks may use Actual/360, monthly rests, or compound EMI schedules — always check your agreement.`,
    },
  ];

  const relatedSlugs = [
    { slug: "loan-payment", reason: "Full payment + interest totals" },
    { slug: "loan-emi-calculator", reason: "Classic EMI view" },
    { slug: "outstanding-balance-calculator", reason: "Remaining balance after EMIs" },
    { slug: "loan-prepayment-savings-calculator", reason: "Deeper prepayment savings" },
    { slug: "loan-foreclosure-calculator", reason: "Foreclosure / closure sketch" },
    { slug: "home-loan-eligibility-calculator", reason: "Eligibility before borrowing" },
    { slug: "emi-reduction-vs-tenure-reduction-calculator", reason: "EMI vs tenure tradeoff" },
  ];

  return {
    dailyInterest,
    monthlyInterest,
    yearlyInterest,
    totalForDays,
    days,
    healthScore,
    interestEfficiency,
    risk,
    statusLabel,
    statusTone,
    recommendation,
    timeline,
    delay: {
      days: delayDays,
      interest: delayInterest,
      penalty: delayDays > 0 ? penaltyFlat : 0,
      total: delayTotal,
    },
    prepay: {
      amount: prepayAmount,
      interestSaved: interestSavedPrepay,
      monthsEarlier,
    },
    extraPayment: {
      monthly: extraMonthly,
      interestSaved: interestSavedExtra,
      monthsReduced,
    },
    inflation: { apr: input.apr, inflation, realCost },
    bankCompare,
    aprScenarios,
    chartByDay,
    decisionOptions,
    intelligence,
    insights,
    coachTips,
    relatedSlugs,
    disclaimer:
      "Actual/365 educational estimate only. Lenders use their own day-count, compounding, fees, and rounding — verify against your statement and agreement.",
  };
}

export const DI_URL = {
  P: "p",
  A: "a",
  U: "u", // days
  PRESET: "lp",
  MODE: "mode",
  DELAY: "dd",
  PREPAY: "pp",
  EXTRA: "ex",
  INF: "inf",
  PEN: "pen",
} as const;

export function parseDiSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(DI_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}
