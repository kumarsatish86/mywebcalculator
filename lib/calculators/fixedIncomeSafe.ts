import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { compoundFutureValue } from "./compoundInterest";

export type FixedIncomeCurrencyCode = LoanCurrencyCode;

export const FIXED_INCOME_URL = {
  A: "a",
  B: "b",
  R: "r",
  Y: "y",
  N: "n",
  M: "m",
  P: "p",
  T: "t",
} as const;

/** Indicative planning defaults (rates change—verify with current RBI / scheme notifications). */
export const DEFAULT_PPF_RATE = 7.1;
export const DEFAULT_EPF_RATE = 8.25;
export const DEFAULT_SSY_RATE = 8.2;
export const DEFAULT_SCSS_RATE = 8.2;
export const DEFAULT_PO_SAVINGS_RATE = 4.0;
export const PPF_MAX_YEARS = 15;
export const SSY_MAX_YEARS = 21;
export const SSY_DEPOSIT_YEARS = 15;

export function formatFixedIncomeMoney(amount: number, currency: FixedIncomeCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseFixedIncomeSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(FIXED_INCOME_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function fixedDeposit(params: {
  principal: number;
  annualRatePercent: number;
  years: number;
  compoundsPerYear?: number;
}): {
  principal: number;
  maturityValue: number;
  interestEarned: number;
  effectiveAnnualYield: number;
} | { error: string } {
  if (params.principal <= 0) return { error: "Deposit amount must be positive." };
  const n = params.compoundsPerYear ?? 4;
  const result = compoundFutureValue({
    principal: params.principal,
    annualRatePercent: params.annualRatePercent,
    years: params.years,
    compoundsPerYear: n,
  });
  if ("error" in result) return result;
  const r = params.annualRatePercent / 100;
  const effectiveAnnualYield = (Math.pow(1 + r / n, n) - 1) * 100;
  return {
    principal: params.principal,
    maturityValue: result.futureValue,
    interestEarned: result.interestEarned,
    effectiveAnnualYield,
  };
}

/** Monthly RD: deposit at month start/end with monthly compounding approximation. */
export function recurringDeposit(params: {
  monthlyDeposit: number;
  annualRatePercent: number;
  months: number;
}): {
  monthlyDeposit: number;
  months: number;
  totalDeposited: number;
  maturityValue: number;
  interestEarned: number;
} | { error: string } {
  if (params.monthlyDeposit <= 0) return { error: "Monthly deposit must be positive." };
  if (params.months <= 0) return { error: "Tenure must be positive." };
  if (params.annualRatePercent < 0) return { error: "Interest rate cannot be negative." };

  const r = params.annualRatePercent / 100 / 12;
  const n = params.months;
  const totalDeposited = params.monthlyDeposit * n;
  let maturityValue: number;
  if (r === 0) {
    maturityValue = totalDeposited;
  } else {
    // Standard bank-style approximation: M = R × [(1+i)^n − 1] / i
    maturityValue = params.monthlyDeposit * ((Math.pow(1 + r, n) - 1) / r);
  }
  return {
    monthlyDeposit: params.monthlyDeposit,
    months: n,
    totalDeposited,
    maturityValue,
    interestEarned: maturityValue - totalDeposited,
  };
}

/** Annual contribution PPF/SSY-style: deposit at year start, annual compounding. */
export function annualContributionScheme(params: {
  annualDeposit: number;
  annualRatePercent: number;
  years: number;
  depositYears?: number;
}): {
  annualDeposit: number;
  years: number;
  totalDeposited: number;
  maturityValue: number;
  interestEarned: number;
} | { error: string } {
  if (params.annualDeposit <= 0) return { error: "Annual deposit must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.annualRatePercent < 0) return { error: "Interest rate cannot be negative." };

  const depositYears = params.depositYears ?? params.years;
  const r = params.annualRatePercent / 100;
  let balance = 0;
  let totalDeposited = 0;

  for (let y = 1; y <= params.years; y += 1) {
    if (y <= depositYears) {
      balance += params.annualDeposit;
      totalDeposited += params.annualDeposit;
    }
    balance *= 1 + r;
  }

  return {
    annualDeposit: params.annualDeposit,
    years: params.years,
    totalDeposited,
    maturityValue: balance,
    interestEarned: balance - totalDeposited,
  };
}

export function ppfCalc(params: {
  annualDeposit: number;
  annualRatePercent?: number;
  years?: number;
}): ReturnType<typeof annualContributionScheme> {
  return annualContributionScheme({
    annualDeposit: params.annualDeposit,
    annualRatePercent: params.annualRatePercent ?? DEFAULT_PPF_RATE,
    years: params.years ?? PPF_MAX_YEARS,
  });
}

export function ssyCalc(params: {
  annualDeposit: number;
  annualRatePercent?: number;
  years?: number;
}): ReturnType<typeof annualContributionScheme> {
  const years = params.years ?? SSY_MAX_YEARS;
  return annualContributionScheme({
    annualDeposit: params.annualDeposit,
    annualRatePercent: params.annualRatePercent ?? DEFAULT_SSY_RATE,
    years,
    depositYears: Math.min(SSY_DEPOSIT_YEARS, years),
  });
}

/** EPF: monthly employee + employer contribution with monthly compounding. */
export function epfCalc(params: {
  monthlyContribution: number;
  annualRatePercent?: number;
  years: number;
}): {
  monthlyContribution: number;
  totalContributed: number;
  maturityValue: number;
  interestEarned: number;
} | { error: string } {
  if (params.monthlyContribution <= 0) return { error: "Monthly contribution must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  const rate = params.annualRatePercent ?? DEFAULT_EPF_RATE;
  const months = Math.round(params.years * 12);
  const r = rate / 100 / 12;
  let corpus = 0;
  for (let i = 0; i < months; i += 1) {
    corpus = (corpus + params.monthlyContribution) * (1 + r);
  }
  const totalContributed = params.monthlyContribution * months;
  return {
    monthlyContribution: params.monthlyContribution,
    totalContributed,
    maturityValue: corpus,
    interestEarned: corpus - totalContributed,
  };
}

/** NPS: monthly contribution, corpus at retirement; optional 40% annuity purchase rest lump sum. */
export function npsCalc(params: {
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
  annuityPercent?: number;
  annuityRatePercent?: number;
}): {
  monthlyContribution: number;
  totalContributed: number;
  retirementCorpus: number;
  lumpSum: number;
  annuityCorpus: number;
  estimatedMonthlyPension: number;
} | { error: string } {
  if (params.monthlyContribution <= 0) return { error: "Monthly contribution must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  const months = Math.round(params.years * 12);
  const r = params.annualRatePercent / 100 / 12;
  let corpus = 0;
  for (let i = 0; i < months; i += 1) {
    corpus = (corpus + params.monthlyContribution) * (1 + r);
  }
  const annuityPercent = params.annuityPercent ?? 40;
  const annuityRate = params.annuityRatePercent ?? 6;
  const annuityCorpus = corpus * (annuityPercent / 100);
  const lumpSum = corpus - annuityCorpus;
  // Rough permanent draw: annual pension ≈ annuityCorpus × annuityRate; monthly / 12
  const estimatedMonthlyPension = (annuityCorpus * (annuityRate / 100)) / 12;
  return {
    monthlyContribution: params.monthlyContribution,
    totalContributed: params.monthlyContribution * months,
    retirementCorpus: corpus,
    lumpSum,
    annuityCorpus,
    estimatedMonthlyPension,
  };
}

/** SCSS: interest paid out quarterly; principal returned at maturity. */
export function scssCalc(params: {
  principal: number;
  annualRatePercent?: number;
  years?: number;
}): {
  principal: number;
  annualInterest: number;
  quarterlyInterest: number;
  totalInterestOverTenure: number;
  maturityPrincipal: number;
  years: number;
} | { error: string } {
  if (params.principal <= 0) return { error: "Deposit amount must be positive." };
  const rate = params.annualRatePercent ?? DEFAULT_SCSS_RATE;
  const years = params.years ?? 5;
  if (years <= 0) return { error: "Years must be positive." };
  const annualInterest = params.principal * (rate / 100);
  return {
    principal: params.principal,
    annualInterest,
    quarterlyInterest: annualInterest / 4,
    totalInterestOverTenure: annualInterest * years,
    maturityPrincipal: params.principal,
    years,
  };
}

/** Post office savings: simple interest annual (illustrative). */
export function postOfficeSavings(params: {
  principal: number;
  annualRatePercent?: number;
  years: number;
}): {
  principal: number;
  interestEarned: number;
  maturityValue: number;
} | { error: string } {
  if (params.principal <= 0) return { error: "Deposit amount must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  const rate = params.annualRatePercent ?? DEFAULT_PO_SAVINGS_RATE;
  const interestEarned = (params.principal * rate * params.years) / 100;
  return {
    principal: params.principal,
    interestEarned,
    maturityValue: params.principal + interestEarned,
  };
}

/**
 * T-bill (discount): buy below face, mature at face.
 * Bond approximate: coupon + redemption; YTM approx from price.
 */
export function treasuryBillBond(params: {
  faceValue: number;
  purchasePrice: number;
  yearsToMaturity: number;
  couponPercent?: number;
}): {
  faceValue: number;
  purchasePrice: number;
  discountOrPremium: number;
  absoluteReturnPercent: number;
  ytmApproxPercent: number;
  totalCoupons: number;
  maturityProceeds: number;
} | { error: string } {
  if (params.faceValue <= 0) return { error: "Face value must be positive." };
  if (params.purchasePrice <= 0) return { error: "Purchase price must be positive." };
  if (params.yearsToMaturity <= 0) return { error: "Years to maturity must be positive." };

  const couponPercent = params.couponPercent ?? 0;
  const annualCoupon = params.faceValue * (couponPercent / 100);
  const totalCoupons = annualCoupon * params.yearsToMaturity;
  const maturityProceeds = params.faceValue + totalCoupons;
  const discountOrPremium = params.faceValue - params.purchasePrice;
  const absoluteReturnPercent =
    ((maturityProceeds - params.purchasePrice) / params.purchasePrice) * 100;

  // Approximate YTM when coupon ≈ 0 (T-bill) or small: solve (1+y)^t = face/price for zero-coupon;
  // with coupon: rough (C + (F-P)/t) / ((F+P)/2)
  let ytmApproxPercent: number;
  if (couponPercent === 0) {
    ytmApproxPercent =
      (Math.pow(params.faceValue / params.purchasePrice, 1 / params.yearsToMaturity) - 1) * 100;
  } else {
    ytmApproxPercent =
      ((annualCoupon + discountOrPremium / params.yearsToMaturity) /
        ((params.faceValue + params.purchasePrice) / 2)) *
      100;
  }

  return {
    faceValue: params.faceValue,
    purchasePrice: params.purchasePrice,
    discountOrPremium,
    absoluteReturnPercent,
    ytmApproxPercent,
    totalCoupons,
    maturityProceeds,
  };
}
