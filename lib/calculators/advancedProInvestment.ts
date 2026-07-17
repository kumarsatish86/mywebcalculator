import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";

export type AdvancedProCurrencyCode = LoanCurrencyCode;

export const ADVANCED_PRO_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  I: "i",
  M: "m",
  G: "g",
  H: "h",
  S: "s",
  N: "n",
  P: "p",
} as const;

export function formatAdvancedProMoney(amount: number, currency: AdvancedProCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseAdvancedProSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(ADVANCED_PRO_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Deterministic LCG for reproducible Monte Carlo paths. */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randn(rand: () => number): number {
  // Box–Muller
  const u = Math.max(1e-12, rand());
  const v = Math.max(1e-12, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo]!;
  const w = idx - lo;
  return sorted[lo]! * (1 - w) + sorted[hi]! * w;
}

export function monteCarloInvestment(params: {
  principal: number;
  annualReturnMeanPercent: number;
  annualVolPercent: number;
  years: number;
  simulations: number;
  seed?: number;
  monthlyContribution?: number;
}): {
  simulations: number;
  years: number;
  p10: number;
  p50: number;
  p90: number;
  meanEnding: number;
  probabilityAbovePrincipal: number;
} | { error: string } {
  if (params.principal <= 0) return { error: "Principal must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.simulations < 10) return { error: "Use at least 10 simulations." };
  if (params.simulations > 5000) return { error: "Cap simulations at 5,000 for browser performance." };
  if (params.annualVolPercent < 0) return { error: "Volatility cannot be negative." };

  const months = Math.round(params.years * 12);
  const mu = params.annualReturnMeanPercent / 100;
  const sigma = params.annualVolPercent / 100;
  const monthlyMu = Math.pow(1 + mu, 1 / 12) - 1;
  const monthlySigma = sigma / Math.sqrt(12);
  const contrib = params.monthlyContribution ?? 0;
  const rand = mulberry32(params.seed ?? 42);

  const endings: number[] = [];
  let above = 0;

  for (let s = 0; s < params.simulations; s++) {
    let value = params.principal;
    for (let m = 0; m < months; m++) {
      const r = monthlyMu + monthlySigma * randn(rand);
      value = value * (1 + r) + contrib;
    }
    endings.push(value);
    if (value > params.principal) above += 1;
  }

  endings.sort((a, b) => a - b);
  const meanEnding = endings.reduce((sum, v) => sum + v, 0) / endings.length;

  return {
    simulations: params.simulations,
    years: params.years,
    p10: percentile(endings, 10),
    p50: percentile(endings, 50),
    p90: percentile(endings, 90),
    meanEnding,
    probabilityAbovePrincipal: (above / params.simulations) * 100,
  };
}

/** DCA: fixed periodic investment across a CSV of prices. */
export function dollarCostAveraging(params: {
  amountPerPeriod: number;
  pricesCsv: string;
}): {
  periods: number;
  totalInvested: number;
  totalShares: number;
  averageCost: number;
  lastPrice: number;
  marketValue: number;
  gain: number;
  gainPercent: number;
} | { error: string } {
  if (params.amountPerPeriod <= 0) return { error: "Amount per period must be positive." };
  const prices = params.pricesCsv
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0);
  if (prices.length < 2) return { error: "Enter at least 2 positive prices (comma-separated)." };

  let totalShares = 0;
  let totalInvested = 0;
  for (const price of prices) {
    totalShares += params.amountPerPeriod / price;
    totalInvested += params.amountPerPeriod;
  }
  const lastPrice = prices[prices.length - 1]!;
  const marketValue = totalShares * lastPrice;
  const averageCost = totalInvested / totalShares;
  const gain = marketValue - totalInvested;

  return {
    periods: prices.length,
    totalInvested,
    totalShares,
    averageCost,
    lastPrice,
    marketValue,
    gain,
    gainPercent: (gain / totalInvested) * 100,
  };
}

/** Time-weighted return from period percentage returns (CSV). */
export function timeWeightedReturn(params: {
  periodReturnsCsv: string;
  annualize?: boolean;
  periodsPerYear?: number;
}): {
  periods: number;
  twrPercent: number;
  annualizedTwrPercent: number | null;
} | { error: string } {
  const rets = params.periodReturnsCsv
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (rets.length < 1) return { error: "Enter at least one period return %." };

  let growth = 1;
  for (const r of rets) growth *= 1 + r / 100;
  const twrPercent = (growth - 1) * 100;
  const ppy = params.periodsPerYear ?? 12;
  let annualizedTwrPercent: number | null = null;
  if (params.annualize && rets.length > 0) {
    const years = rets.length / ppy;
    annualizedTwrPercent = years > 0 ? (Math.pow(growth, 1 / years) - 1) * 100 : twrPercent;
  }

  return { periods: rets.length, twrPercent, annualizedTwrPercent };
}

/**
 * Money-weighted return (IRR) from cash flows.
 * Convention: negative = outflow (invest), positive = inflow (withdraw / ending value).
 * Cash flows CSV pairs optional "amount" only — times assumed equal spacing in years from 0.
 * Or simple mode: initialOutflow, endingValue, years.
 */
export function moneyWeightedReturn(params: {
  mode: "simple" | "cashflows";
  initialInvestment?: number;
  endingValue?: number;
  years?: number;
  cashflowsCsv?: string;
}): {
  mwrAnnualPercent: number;
  totalInvestedApprox: number;
  endingValue: number;
} | { error: string } {
  let flows: { t: number; cf: number }[] = [];

  if (params.mode === "simple") {
    const inv = params.initialInvestment ?? 0;
    const end = params.endingValue ?? 0;
    const years = params.years ?? 0;
    if (inv <= 0) return { error: "Initial investment must be positive." };
    if (end < 0) return { error: "Ending value cannot be negative." };
    if (years <= 0) return { error: "Years must be positive." };
    flows = [
      { t: 0, cf: -inv },
      { t: years, cf: end },
    ];
  } else {
    const parts = (params.cashflowsCsv ?? "")
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isFinite(n));
    if (parts.length < 2) return { error: "Enter at least 2 cash flows (e.g. -10000, -2000, 15000)." };
    flows = parts.map((cf, i) => ({ t: i, cf }));
  }

  const npv = (rate: number) =>
    flows.reduce((sum, { t, cf }) => sum + cf / Math.pow(1 + rate, t), 0);

  // Bisection on annual rate
  let lo = -0.99;
  let hi = 5;
  let fLo = npv(lo);
  let fHi = npv(hi);
  if (fLo * fHi > 0) {
    // widen
    hi = 20;
    fHi = npv(hi);
    if (fLo * fHi > 0) return { error: "Could not solve IRR for these cash flows." };
  }
  for (let iter = 0; iter < 80; iter++) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid);
    if (Math.abs(fMid) < 1e-8) {
      lo = hi = mid;
      break;
    }
    if (fLo * fMid <= 0) {
      hi = mid;
      fHi = fMid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  const rate = (lo + hi) / 2;
  const invested = flows.filter((f) => f.cf < 0).reduce((s, f) => s + -f.cf, 0);
  const ending = flows[flows.length - 1]!.cf > 0 ? flows[flows.length - 1]!.cf : 0;

  return {
    mwrAnnualPercent: rate * 100,
    totalInvestedApprox: invested,
    endingValue: ending,
  };
}

export function investmentFeeImpact(params: {
  principal: number;
  annualReturnPercent: number;
  annualFeePercent: number;
  years: number;
  monthlyContribution?: number;
}): {
  endingGross: number;
  endingNet: number;
  feeDrag: number;
  feeDragPercentOfGrossGain: number;
} | { error: string } {
  if (params.principal <= 0) return { error: "Principal must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.annualFeePercent < 0) return { error: "Fee cannot be negative." };

  const months = Math.round(params.years * 12);
  const contrib = params.monthlyContribution ?? 0;
  const rGross = params.annualReturnPercent / 100 / 12;
  const rNet = (params.annualReturnPercent - params.annualFeePercent) / 100 / 12;

  let gross = params.principal;
  let net = params.principal;
  for (let m = 0; m < months; m++) {
    gross = gross * (1 + rGross) + contrib;
    net = net * (1 + rNet) + contrib;
  }
  const feeDrag = gross - net;
  const grossGain = gross - params.principal - contrib * months;

  return {
    endingGross: gross,
    endingNet: net,
    feeDrag,
    feeDragPercentOfGrossGain: grossGain > 0 ? (feeDrag / grossGain) * 100 : 0,
  };
}

export function rebalancingCalc(params: {
  portfolioValue: number;
  /** Target weights % — CSV of 2–6 numbers summing ~100 */
  targetWeightsCsv: string;
  /** Current values of each sleeve — CSV matching target count */
  currentValuesCsv: string;
}): {
  sleeves: {
    index: number;
    currentValue: number;
    currentWeightPercent: number;
    targetWeightPercent: number;
    targetValue: number;
    tradeAmount: number;
    action: "buy" | "sell" | "hold";
  }[];
  totalValue: number;
} | { error: string } {
  if (params.portfolioValue <= 0) return { error: "Portfolio value must be positive." };

  const targets = params.targetWeightsCsv
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number);
  const currents = params.currentValuesCsv
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number);

  if (targets.length < 2) return { error: "Enter at least 2 target weights (%)." };
  if (targets.length !== currents.length) {
    return { error: "Target weights and current values must have the same count." };
  }
  if (targets.some((n) => !Number.isFinite(n) || n < 0)) {
    return { error: "Target weights must be non-negative numbers." };
  }
  if (currents.some((n) => !Number.isFinite(n) || n < 0)) {
    return { error: "Current values must be non-negative numbers." };
  }

  const sumW = targets.reduce((s, w) => s + w, 0);
  if (sumW <= 0) return { error: "Target weights must sum to a positive number." };

  // Prefer sum of current values if provided and > 0; else portfolioValue
  const sumCurrent = currents.reduce((s, v) => s + v, 0);
  const totalValue = sumCurrent > 0 ? sumCurrent : params.portfolioValue;

  const sleeves = targets.map((tw, index) => {
    const targetWeightPercent = (tw / sumW) * 100;
    const currentValue = currents[index]!;
    const currentWeightPercent = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
    const targetValue = totalValue * (targetWeightPercent / 100);
    const tradeAmount = targetValue - currentValue;
    const action: "buy" | "sell" | "hold" =
      Math.abs(tradeAmount) < 0.01 * (totalValue / 1000 || 1)
        ? "hold"
        : tradeAmount > 0
          ? "buy"
          : "sell";
    return {
      index: index + 1,
      currentValue,
      currentWeightPercent,
      targetWeightPercent,
      targetValue,
      tradeAmount,
      action,
    };
  });

  return { sleeves, totalValue };
}

export function netWorthGrowth(params: {
  startingNetWorth: number;
  annualSavings: number;
  annualReturnPercent: number;
  years: number;
}): {
  endingNetWorth: number;
  totalSavingsContributed: number;
  growthFromReturns: number;
  path: { year: number; netWorth: number }[];
} | { error: string } {
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.startingNetWorth < 0) return { error: "Starting net worth cannot be negative." };

  const r = params.annualReturnPercent / 100;
  let nw = params.startingNetWorth;
  const path: { year: number; netWorth: number }[] = [{ year: 0, netWorth: nw }];

  for (let y = 1; y <= Math.round(params.years); y++) {
    nw = nw * (1 + r) + params.annualSavings;
    path.push({ year: y, netWorth: nw });
  }

  const totalSavingsContributed = params.annualSavings * Math.round(params.years);
  const growthFromReturns = nw - params.startingNetWorth - totalSavingsContributed;

  return {
    endingNetWorth: nw,
    totalSavingsContributed,
    growthFromReturns,
    path,
  };
}
