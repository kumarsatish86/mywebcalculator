import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { annualReturn, lumpsumInvestment, sipFutureValue } from "./coreInvestment";

export type MutualFundCurrencyCode = LoanCurrencyCode;

export const MUTUAL_FUND_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  Y: "y",
  S: "s",
  W: "w",
  E: "e",
  N: "n",
  D: "d",
} as const;

export function formatMutualFundMoney(amount: number, currency: MutualFundCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseMutualFundSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MUTUAL_FUND_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Absolute + CAGR style returns for a mutual fund holding. */
export function mutualFundReturns(params: {
  invested: number;
  currentValue: number;
  years: number;
}): {
  invested: number;
  currentValue: number;
  absoluteGain: number;
  absoluteReturnPercent: number;
  cagrPercent: number;
} | { error: string } {
  if (params.invested <= 0) return { error: "Invested amount must be positive." };
  if (params.currentValue < 0) return { error: "Current value cannot be negative." };
  if (params.years <= 0) return { error: "Years must be positive." };
  const absoluteGain = params.currentValue - params.invested;
  const absoluteReturnPercent = (absoluteGain / params.invested) * 100;
  const cagr = annualReturn({
    initialValue: params.invested,
    finalValue: params.currentValue,
    years: params.years,
  });
  if ("error" in cagr) return cagr;
  return {
    invested: params.invested,
    currentValue: params.currentValue,
    absoluteGain,
    absoluteReturnPercent,
    cagrPercent: cagr.cagrPercent,
  };
}

export function sipVsLumpsum(params: {
  monthlySip: number;
  lumpsumAmount: number;
  annualRatePercent: number;
  years: number;
}): {
  sipFutureValue: number;
  sipInvested: number;
  sipGains: number;
  lumpsumFutureValue: number;
  lumpsumInvested: number;
  lumpsumGains: number;
  better: "sip" | "lumpsum" | "equal";
  difference: number;
} | { error: string } {
  const sip = sipFutureValue({
    monthlyInvestment: params.monthlySip,
    annualRatePercent: params.annualRatePercent,
    years: params.years,
  });
  if ("error" in sip) return sip;
  const lump = lumpsumInvestment({
    principal: params.lumpsumAmount,
    annualRatePercent: params.annualRatePercent,
    years: params.years,
  });
  if ("error" in lump) return lump;
  const difference = sip.futureValue - lump.futureValue;
  let better: "sip" | "lumpsum" | "equal" = "equal";
  if (difference > 1) better = "sip";
  else if (difference < -1) better = "lumpsum";
  return {
    sipFutureValue: sip.futureValue,
    sipInvested: sip.totalInvested,
    sipGains: sip.gains,
    lumpsumFutureValue: lump.futureValue,
    lumpsumInvested: lump.principal,
    lumpsumGains: lump.gains,
    better,
    difference,
  };
}

/** SIP with annual step-up % applied each year. */
export function sipStepUp(params: {
  startingMonthly: number;
  annualRatePercent: number;
  years: number;
  stepUpPercent: number;
}): {
  startingMonthly: number;
  endingMonthly: number;
  totalInvested: number;
  futureValue: number;
  gains: number;
  months: number;
} | { error: string } {
  if (params.startingMonthly <= 0) return { error: "Starting monthly SIP must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.stepUpPercent < 0) return { error: "Step-up % cannot be negative." };
  if (params.annualRatePercent < 0) return { error: "Expected return cannot be negative." };

  const months = Math.round(params.years * 12);
  const r = params.annualRatePercent / 100 / 12;
  let sip = params.startingMonthly;
  let balance = 0;
  let totalInvested = 0;
  let endingMonthly = sip;

  for (let m = 1; m <= months; m += 1) {
    if (m > 1 && m % 12 === 1) {
      sip *= 1 + params.stepUpPercent / 100;
    }
    balance = balance * (1 + r) + sip;
    totalInvested += sip;
    endingMonthly = sip;
  }

  return {
    startingMonthly: params.startingMonthly,
    endingMonthly,
    totalInvested,
    futureValue: balance,
    gains: balance - totalInvested,
    months,
  };
}

/** SWP: start with corpus, withdraw monthly, remaining balance at end. */
export function swpCalc(params: {
  initialCorpus: number;
  monthlyWithdrawal: number;
  annualRatePercent: number;
  years: number;
}): {
  initialCorpus: number;
  monthlyWithdrawal: number;
  totalWithdrawn: number;
  endingCorpus: number;
  monthsSurvived: number;
  depleted: boolean;
} | { error: string } {
  if (params.initialCorpus <= 0) return { error: "Initial corpus must be positive." };
  if (params.monthlyWithdrawal <= 0) return { error: "Monthly withdrawal must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };

  const months = Math.round(params.years * 12);
  const r = params.annualRatePercent / 100 / 12;
  let balance = params.initialCorpus;
  let totalWithdrawn = 0;
  let monthsSurvived = 0;

  for (let m = 1; m <= months; m += 1) {
    balance = balance * (1 + r);
    if (balance < params.monthlyWithdrawal) {
      totalWithdrawn += Math.max(0, balance);
      balance = 0;
      monthsSurvived = m;
      return {
        initialCorpus: params.initialCorpus,
        monthlyWithdrawal: params.monthlyWithdrawal,
        totalWithdrawn,
        endingCorpus: 0,
        monthsSurvived,
        depleted: true,
      };
    }
    balance -= params.monthlyWithdrawal;
    totalWithdrawn += params.monthlyWithdrawal;
    monthsSurvived = m;
  }

  return {
    initialCorpus: params.initialCorpus,
    monthlyWithdrawal: params.monthlyWithdrawal,
    totalWithdrawn,
    endingCorpus: balance,
    monthsSurvived,
    depleted: false,
  };
}

/**
 * STP: move fixed amount monthly from source (debt-like) into equity-like destination.
 * Both pots earn their respective returns.
 */
export function stpCalc(params: {
  sourceCorpus: number;
  monthlyTransfer: number;
  sourceRatePercent: number;
  destinationRatePercent: number;
  years: number;
}): {
  sourceEnding: number;
  destinationEnding: number;
  totalTransferred: number;
  totalEnding: number;
  months: number;
} | { error: string } {
  if (params.sourceCorpus <= 0) return { error: "Source corpus must be positive." };
  if (params.monthlyTransfer <= 0) return { error: "Monthly transfer must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };

  const months = Math.round(params.years * 12);
  const rs = params.sourceRatePercent / 100 / 12;
  const rd = params.destinationRatePercent / 100 / 12;
  let source = params.sourceCorpus;
  let dest = 0;
  let totalTransferred = 0;

  for (let m = 1; m <= months; m += 1) {
    source *= 1 + rs;
    dest *= 1 + rd;
    const transfer = Math.min(params.monthlyTransfer, source);
    source -= transfer;
    dest += transfer;
    totalTransferred += transfer;
    if (source <= 0 && transfer < params.monthlyTransfer) break;
  }

  return {
    sourceEnding: source,
    destinationEnding: dest,
    totalTransferred,
    totalEnding: source + dest,
    months,
  };
}

/** Compare corpus with and without expense ratio drag on returns. */
export function expenseRatioImpact(params: {
  monthlySip: number;
  grossReturnPercent: number;
  expenseRatioPercent: number;
  years: number;
}): {
  grossFutureValue: number;
  netFutureValue: number;
  costOfExpenses: number;
  netReturnPercent: number;
  totalInvested: number;
} | { error: string } {
  if (params.expenseRatioPercent < 0) return { error: "Expense ratio cannot be negative." };
  if (params.expenseRatioPercent >= params.grossReturnPercent && params.grossReturnPercent > 0) {
    // still allow; net can be low/negative
  }
  const netReturnPercent = params.grossReturnPercent - params.expenseRatioPercent;
  const gross = sipFutureValue({
    monthlyInvestment: params.monthlySip,
    annualRatePercent: params.grossReturnPercent,
    years: params.years,
  });
  if ("error" in gross) return gross;
  const net = sipFutureValue({
    monthlyInvestment: params.monthlySip,
    annualRatePercent: Math.max(0, netReturnPercent),
    years: params.years,
  });
  if ("error" in net) return net;
  return {
    grossFutureValue: gross.futureValue,
    netFutureValue: net.futureValue,
    costOfExpenses: gross.futureValue - net.futureValue,
    netReturnPercent,
    totalInvested: gross.totalInvested,
  };
}

export function cagrCalc(params: {
  initialValue: number;
  finalValue: number;
  years: number;
}): ReturnType<typeof annualReturn> {
  return annualReturn(params);
}

type CashFlow = { amount: number; yearsFromStart: number };

/**
 * XIRR via Newton–Raphson on NPV of dated cash flows.
 * Cash flows: negative = investment/outflow, positive = redemption/inflow.
 */
export function xirrFromCashFlows(flows: CashFlow[]):
  | { xirrPercent: number; iterations: number }
  | { error: string } {
  if (flows.length < 2) return { error: "Need at least two cash flows." };
  const hasNeg = flows.some((f) => f.amount < 0);
  const hasPos = flows.some((f) => f.amount > 0);
  if (!hasNeg || !hasPos) return { error: "Need both investments (negative) and returns (positive)." };

  const npv = (rate: number) =>
    flows.reduce((sum, f) => sum + f.amount / Math.pow(1 + rate, f.yearsFromStart), 0);
  const dNpv = (rate: number) =>
    flows.reduce(
      (sum, f) => sum - (f.yearsFromStart * f.amount) / Math.pow(1 + rate, f.yearsFromStart + 1),
      0,
    );

  let rate = 0.1;
  for (let i = 0; i < 80; i += 1) {
    const f = npv(rate);
    const df = dNpv(rate);
    if (Math.abs(df) < 1e-12) break;
    const next = rate - f / df;
    if (!Number.isFinite(next)) break;
    if (Math.abs(next - rate) < 1e-8) {
      return { xirrPercent: next * 100, iterations: i + 1 };
    }
    rate = next;
  }
  if (Math.abs(npv(rate)) < 1e-4) return { xirrPercent: rate * 100, iterations: 80 };
  return { error: "XIRR did not converge—check cash flow amounts and timing." };
}

/** Common MF case: lumpsum at t=0, optional monthly SIP, final redemption at end. */
export function xirrMutualFund(params: {
  initialInvestment: number;
  monthlySip: number;
  finalValue: number;
  years: number;
}): ReturnType<typeof xirrFromCashFlows> {
  if (params.initialInvestment < 0) return { error: "Initial investment cannot be negative." };
  if (params.monthlySip < 0) return { error: "Monthly SIP cannot be negative." };
  if (params.finalValue <= 0) return { error: "Final value must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.initialInvestment <= 0 && params.monthlySip <= 0) {
    return { error: "Provide an initial investment and/or monthly SIP." };
  }

  const months = Math.round(params.years * 12);
  const flows: CashFlow[] = [];
  if (params.initialInvestment > 0) {
    flows.push({ amount: -params.initialInvestment, yearsFromStart: 0 });
  }
  for (let m = 1; m <= months; m += 1) {
    if (params.monthlySip > 0) {
      flows.push({ amount: -params.monthlySip, yearsFromStart: m / 12 });
    }
  }
  flows.push({ amount: params.finalValue, yearsFromStart: params.years });
  return xirrFromCashFlows(flows);
}
