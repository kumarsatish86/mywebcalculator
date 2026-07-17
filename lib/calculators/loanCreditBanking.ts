import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import {
  amortizationSchedule,
  amortizationTotals,
  monthlyLoanPayment,
} from "./loanPayment";
import { compareFlatVsReducing } from "./emiInverse";

export type LoanCreditBankingCurrencyCode = LoanCurrencyCode;

export const LOAN_CREDIT_BANKING_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
  F: "f",
  S: "s",
} as const;

export function formatLoanCreditBankingMoney(
  amount: number,
  currency: LoanCreditBankingCurrencyCode,
): string {
  return formatLoanMoney(amount, currency);
}

export function parseLoanCreditBankingSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(LOAN_CREDIT_BANKING_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function loanInterestTotal(params: {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
}): ReturnType<typeof monthlyLoanPayment> {
  return monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.annualRatePercent,
    termMonths: params.termMonths,
  });
}

export function loanAffordability(params: {
  monthlyIncome: number;
  existingEmi: number;
  maxDtiPercent: number;
  annualRatePercent: number;
  termMonths: number;
}): {
  maxEmi: number;
  affordablePrincipal: number;
  dtiHeadroomPercent: number;
} | { error: string } {
  if (params.monthlyIncome <= 0) return { error: "Income must be positive." };
  if (params.termMonths < 1) return { error: "Term must be at least 1 month." };
  const maxEmi = Math.max(0, params.monthlyIncome * (params.maxDtiPercent / 100) - params.existingEmi);
  if (maxEmi <= 0) {
    return { error: "No EMI capacity under this DTI cap — reduce existing EMIs or raise income." };
  }
  const r = params.annualRatePercent / 100 / 12;
  const n = params.termMonths;
  let affordablePrincipal: number;
  if (r === 0) {
    affordablePrincipal = maxEmi * n;
  } else {
    affordablePrincipal = maxEmi * ((1 - Math.pow(1 + r, -n)) / r);
  }
  return {
    maxEmi,
    affordablePrincipal,
    dtiHeadroomPercent: (maxEmi / params.monthlyIncome) * 100,
  };
}

export function loanAmortizationFull(params: {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
}): {
  emi: number;
  totalPaid: number;
  totalInterest: number;
  rows: { month: number; payment: number; interest: number; principal: number; balance: number }[];
} | { error: string } {
  const pay = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.annualRatePercent,
    termMonths: params.termMonths,
  });
  if ("error" in pay) return pay;
  const rows = amortizationSchedule(params.principal, params.annualRatePercent, {
    termMonths: params.termMonths,
  });
  if ("error" in rows) return rows;
  const totals = amortizationTotals(rows);
  return {
    emi: pay.payment,
    totalPaid: totals.totalPaid,
    totalInterest: totals.totalInterest,
    rows,
  };
}

/** One-time foreclosure after N months of EMI. */
export function prepaymentForeclosure(params: {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
  closureMonth: number;
  feePercent?: number;
}): {
  outstanding: number;
  fee: number;
  totalToClose: number;
  interestPaidToDate: number;
  interestSavedVsFullTerm: number;
} | { error: string } {
  if (params.closureMonth < 1) return { error: "Closure month must be at least 1." };
  if (params.closureMonth > params.termMonths) {
    return { error: "Closure month cannot exceed loan term." };
  }
  const full = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.annualRatePercent,
    termMonths: params.termMonths,
  });
  if ("error" in full) return full;
  const rows = amortizationSchedule(params.principal, params.annualRatePercent, {
    termMonths: params.termMonths,
  });
  if ("error" in rows) return rows;
  const atClose = rows[params.closureMonth - 1]!;
  const interestPaidToDate = rows
    .slice(0, params.closureMonth)
    .reduce((s, row) => s + row.interest, 0);
  const feePct = params.feePercent ?? 0;
  const fee = atClose.balance * (feePct / 100);
  return {
    outstanding: atClose.balance,
    fee,
    totalToClose: atClose.balance + fee,
    interestPaidToDate,
    interestSavedVsFullTerm: full.totalInterest - interestPaidToDate,
  };
}

export function partPaymentImpact(params: {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
  partPayment: number;
  afterMonth: number;
}): {
  originalEmi: number;
  newEmiSameTenure: number;
  emiReduction: number;
  interestSaved: number;
} | { error: string } {
  if (params.partPayment <= 0) return { error: "Part payment must be positive." };
  if (params.afterMonth < 1 || params.afterMonth >= params.termMonths) {
    return { error: "Part-payment month must be within the loan term." };
  }
  const orig = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.annualRatePercent,
    termMonths: params.termMonths,
  });
  if ("error" in orig) return orig;
  const rows = amortizationSchedule(params.principal, params.annualRatePercent, {
    termMonths: params.termMonths,
  });
  if ("error" in rows) return rows;
  const bal = Math.max(0, rows[params.afterMonth - 1]!.balance - params.partPayment);
  const remaining = params.termMonths - params.afterMonth;
  const next = monthlyLoanPayment({
    principal: bal,
    annualRatePercent: params.annualRatePercent,
    termMonths: remaining,
  });
  if ("error" in next) return next;
  const interestAfter =
    rows.slice(0, params.afterMonth).reduce((s, row) => s + row.interest, 0) + next.totalInterest;
  return {
    originalEmi: orig.payment,
    newEmiSameTenure: next.payment,
    emiReduction: Math.max(0, orig.payment - next.payment),
    interestSaved: Math.max(0, orig.totalInterest - interestAfter),
  };
}

export function reducingBalanceSummary(params: {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
}): ReturnType<typeof monthlyLoanPayment> {
  return monthlyLoanPayment(params);
}

export function loanComparisonMultiBank(params: {
  principal: number;
  termMonths: number;
  rateA: number;
  rateB: number;
  rateC?: number;
}): {
  options: { label: string; rate: number; emi: number; totalInterest: number }[];
  cheapestLabel: string;
} | { error: string } {
  if (params.principal <= 0) return { error: "Principal must be positive." };
  const rates = [
    { label: "Bank A", rate: params.rateA },
    { label: "Bank B", rate: params.rateB },
    ...(params.rateC !== undefined ? [{ label: "Bank C", rate: params.rateC }] : []),
  ];
  const options: { label: string; rate: number; emi: number; totalInterest: number }[] = [];
  for (const opt of rates) {
    const r = monthlyLoanPayment({
      principal: params.principal,
      annualRatePercent: opt.rate,
      termMonths: params.termMonths,
    });
    if ("error" in r) return r;
    options.push({
      label: opt.label,
      rate: opt.rate,
      emi: r.payment,
      totalInterest: r.totalInterest,
    });
  }
  const cheapest = options.reduce((best, cur) =>
    cur.totalInterest < best.totalInterest ? cur : best,
  );
  return { options, cheapestLabel: cheapest.label };
}

export function floatingVsFixed(params: {
  principal: number;
  termMonths: number;
  fixedRatePercent: number;
  floatingStartPercent: number;
  floatingAfterYears: number;
  floatingLaterPercent: number;
}): {
  fixedTotalInterest: number;
  floatingTotalInterest: number;
  difference: number;
  cheaper: "fixed" | "floating" | "similar";
} | { error: string } {
  const fixed = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.fixedRatePercent,
    termMonths: params.termMonths,
  });
  if ("error" in fixed) return fixed;

  // Approximate floating: first segment + second segment on remaining principal
  const firstMonths = Math.min(params.termMonths, Math.round(params.floatingAfterYears * 12));
  const first = amortizationSchedule(params.principal, params.floatingStartPercent, {
    termMonths: params.termMonths,
  });
  if ("error" in first) return first;
  if (firstMonths >= params.termMonths) {
    const interest = first.reduce((s, row) => s + row.interest, 0);
    const difference = fixed.totalInterest - interest;
    return {
      fixedTotalInterest: fixed.totalInterest,
      floatingTotalInterest: interest,
      difference,
      cheaper:
        Math.abs(difference) < 1 ? "similar" : difference > 0 ? "floating" : "fixed",
    };
  }
  const bal = first[firstMonths - 1]!.balance;
  const interest1 = first.slice(0, firstMonths).reduce((s, row) => s + row.interest, 0);
  const second = monthlyLoanPayment({
    principal: bal,
    annualRatePercent: params.floatingLaterPercent,
    termMonths: params.termMonths - firstMonths,
  });
  if ("error" in second) return second;
  const floatingTotalInterest = interest1 + second.totalInterest;
  const difference = fixed.totalInterest - floatingTotalInterest;
  return {
    fixedTotalInterest: fixed.totalInterest,
    floatingTotalInterest,
    difference,
    cheaper: Math.abs(difference) < 1 ? "similar" : difference > 0 ? "floating" : "fixed",
  };
}

export function interestRateSensitivity(params: {
  principal: number;
  termMonths: number;
  baseRatePercent: number;
  shockPercentPoints: number;
}): {
  baseEmi: number;
  upEmi: number;
  downEmi: number;
  emiIncrease: number;
  interestIncrease: number;
} | { error: string } {
  const base = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.baseRatePercent,
    termMonths: params.termMonths,
  });
  if ("error" in base) return base;
  const up = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.baseRatePercent + params.shockPercentPoints,
    termMonths: params.termMonths,
  });
  if ("error" in up) return up;
  const down = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: Math.max(0, params.baseRatePercent - params.shockPercentPoints),
    termMonths: params.termMonths,
  });
  if ("error" in down) return down;
  return {
    baseEmi: base.payment,
    upEmi: up.payment,
    downEmi: down.payment,
    emiIncrease: up.payment - base.payment,
    interestIncrease: up.totalInterest - base.totalInterest,
  };
}

export function totalLoanCost(params: {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
  processingFeePercent?: number;
  otherFees?: number;
}): {
  emi: number;
  totalInterest: number;
  fees: number;
  totalCost: number;
} | { error: string } {
  const pay = monthlyLoanPayment(params);
  if ("error" in pay) return pay;
  const feePct = params.processingFeePercent ?? 0;
  const other = params.otherFees ?? 0;
  const fees = params.principal * (feePct / 100) + other;
  return {
    emi: pay.payment,
    totalInterest: pay.totalInterest,
    fees,
    totalCost: pay.totalPaid + fees,
  };
}

/** Expose flat vs reducing for banking reducing-balance educational compare when needed. */
export { compareFlatVsReducing };
