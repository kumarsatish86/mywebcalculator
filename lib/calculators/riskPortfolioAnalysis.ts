import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";

export type RiskPortfolioCurrencyCode = LoanCurrencyCode;

export const RISK_PORTFOLIO_URL = {
  A: "a",
  B: "b",
  C: "c",
  D: "d",
  E: "e",
  F: "f",
  G: "g",
  H: "h",
  R: "r",
  V: "v",
  Y: "y",
  P: "p",
  T: "t",
  S: "s",
  MV: "mv",
  CR: "cr",
  RC: "rc",
  PY: "py",
  VC: "vc",
} as const;

export type RiskProfile = "conservative" | "moderate" | "aggressive";

export function formatRiskMoney(amount: number, currency: RiskPortfolioCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseRiskPortfolioSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(RISK_PORTFOLIO_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export type AllocationMix = {
  equity: number;
  debt: number;
  gold: number;
  cash: number;
};

const PROFILE_MIX: Record<RiskProfile, AllocationMix> = {
  conservative: { equity: 30, debt: 50, gold: 10, cash: 10 },
  moderate: { equity: 55, debt: 30, gold: 10, cash: 5 },
  aggressive: { equity: 75, debt: 15, gold: 7, cash: 3 },
};

/** Age-based rule-of-thumb then blend toward risk profile. */
export function assetAllocation(params: {
  age: number;
  riskProfile: RiskProfile;
  portfolioValue?: number;
}): {
  ageBasedEquity: number;
  mix: AllocationMix;
  amounts: AllocationMix | null;
} | { error: string } {
  if (params.age < 18 || params.age > 100) return { error: "Age must be between 18 and 100." };
  const ageBasedEquity = Math.max(20, Math.min(90, 100 - params.age));
  const profile = PROFILE_MIX[params.riskProfile];
  // Blend: 40% age rule equity, 60% profile equity — then renormalize remaining buckets
  const equity = Math.round(0.4 * ageBasedEquity + 0.6 * profile.equity);
  const remaining = 100 - equity;
  const otherTotal = profile.debt + profile.gold + profile.cash;
  const debt = Math.round((profile.debt / otherTotal) * remaining);
  const gold = Math.round((profile.gold / otherTotal) * remaining);
  const cash = remaining - debt - gold;
  const mix: AllocationMix = { equity, debt, gold, cash };
  let amounts: AllocationMix | null = null;
  if (params.portfolioValue !== undefined && params.portfolioValue > 0) {
    amounts = {
      equity: (params.portfolioValue * equity) / 100,
      debt: (params.portfolioValue * debt) / 100,
      gold: (params.portfolioValue * gold) / 100,
      cash: (params.portfolioValue * cash) / 100,
    };
  }
  return { ageBasedEquity, mix, amounts };
}

/** Diversification via Herfindahl–Hirschman Index on weights (%). */
export function portfolioDiversification(params: {
  weightA: number;
  weightB: number;
  weightC?: number;
  weightD?: number;
}): {
  weights: number[];
  hhi: number;
  effectiveHoldings: number;
  concentration: "high" | "moderate" | "diversified";
} | { error: string } {
  const weights = [params.weightA, params.weightB, params.weightC ?? 0, params.weightD ?? 0].filter(
    (w) => w > 0,
  );
  if (weights.length < 2) return { error: "Enter at least two positive weights." };
  if (weights.some((w) => w < 0)) return { error: "Weights cannot be negative." };
  const sum = weights.reduce((s, w) => s + w, 0);
  if (Math.abs(sum - 100) > 2 && Math.abs(sum - 1) > 0.02) {
    // allow raw proportions — normalize
  }
  const norm = weights.map((w) => w / sum);
  const hhi = norm.reduce((s, w) => s + w * w, 0);
  const effectiveHoldings = hhi > 0 ? 1 / hhi : 0;
  let concentration: "high" | "moderate" | "diversified" = "moderate";
  if (hhi >= 0.4) concentration = "high";
  else if (hhi <= 0.25) concentration = "diversified";
  return {
    weights: norm.map((w) => w * 100),
    hhi,
    effectiveHoldings,
    concentration,
  };
}

export function riskTolerance(params: {
  age: number;
  yearsUntilGoal: number;
  incomeStability: number; // 1–5
  maxLossPercentComfortable: number;
}): {
  score: number;
  profile: RiskProfile;
  suggestedEquityPercent: number;
} | { error: string } {
  if (params.age < 18 || params.age > 100) return { error: "Age must be between 18 and 100." };
  if (params.yearsUntilGoal < 0) return { error: "Years until goal cannot be negative." };
  if (params.incomeStability < 1 || params.incomeStability > 5) {
    return { error: "Income stability must be 1–5." };
  }
  if (params.maxLossPercentComfortable < 0 || params.maxLossPercentComfortable > 100) {
    return { error: "Max loss comfort must be 0–100%." };
  }

  let score = 40;
  score += Math.min(25, params.yearsUntilGoal * 1.5);
  score += (params.incomeStability - 1) * 6;
  score += params.maxLossPercentComfortable * 0.5;
  score -= Math.max(0, params.age - 45) * 0.8;
  score = Math.max(0, Math.min(100, Math.round(score)));

  let profile: RiskProfile = "moderate";
  if (score >= 70) profile = "aggressive";
  else if (score < 45) profile = "conservative";

  const suggestedEquityPercent =
    profile === "aggressive" ? 75 : profile === "conservative" ? 35 : 55;

  return { score, profile, suggestedEquityPercent };
}

export function sharpeRatio(params: {
  portfolioReturnPercent: number;
  riskFreePercent: number;
  volatilityPercent: number;
}): {
  excessReturnPercent: number;
  sharpe: number;
  grade: string;
} | { error: string } {
  if (params.volatilityPercent <= 0) return { error: "Volatility must be positive." };
  const excessReturnPercent = params.portfolioReturnPercent - params.riskFreePercent;
  const sharpe = excessReturnPercent / params.volatilityPercent;
  let grade = "Fair";
  if (sharpe >= 1) grade = "Excellent";
  else if (sharpe >= 0.5) grade = "Good";
  else if (sharpe < 0) grade = "Poor";
  return { excessReturnPercent, sharpe, grade };
}

/** Beta ≈ (σ_asset / σ_market) × correlation, or from excess returns ratio. */
export function betaCalc(params: {
  assetVolatilityPercent: number;
  marketVolatilityPercent: number;
  correlation: number;
}): {
  beta: number;
  interpretation: string;
} | { error: string } {
  if (params.assetVolatilityPercent < 0 || params.marketVolatilityPercent <= 0) {
    return { error: "Volatilities must be valid (market vol > 0)." };
  }
  if (params.correlation < -1 || params.correlation > 1) {
    return { error: "Correlation must be between -1 and 1." };
  }
  const beta =
    (params.assetVolatilityPercent / params.marketVolatilityPercent) * params.correlation;
  let interpretation = "Moves with the market";
  if (beta > 1.2) interpretation = "More volatile than the market";
  else if (beta < 0.8 && beta >= 0) interpretation = "Less volatile than the market";
  else if (beta < 0) interpretation = "Tends to move opposite the market";
  return { beta, interpretation };
}

function parseReturnList(raw: string): number[] | { error: string } {
  const parts = raw
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 2) return { error: "Enter at least 2 period returns (comma-separated %)." };
  const values: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (!Number.isFinite(n)) return { error: `Invalid return value: ${p}` };
    values.push(n);
  }
  return values;
}

/** Sample standard deviation of period returns (%); optional annualize with periods/year. */
export function volatilityCalc(params: {
  periodReturnsPercent: number[];
  periodsPerYear?: number;
}): {
  meanReturnPercent: number;
  stdDevPercent: number;
  annualizedVolatilityPercent: number | null;
  count: number;
} | { error: string } {
  const returns = params.periodReturnsPercent;
  if (returns.length < 2) return { error: "Need at least 2 returns." };
  const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
  const variance =
    returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);
  const ppy = params.periodsPerYear;
  const annualized =
    ppy !== undefined && ppy > 0 ? stdDev * Math.sqrt(ppy) : null;
  return {
    meanReturnPercent: mean,
    stdDevPercent: stdDev,
    annualizedVolatilityPercent: annualized,
    count: returns.length,
  };
}

export function volatilityFromCsv(
  csv: string,
  periodsPerYear?: number,
): ReturnType<typeof volatilityCalc> {
  const parsed = parseReturnList(csv);
  if ("error" in parsed) return parsed;
  return volatilityCalc({ periodReturnsPercent: parsed, periodsPerYear });
}

/** Max drawdown from a value series (portfolio NAV or prices). */
export function drawdownCalc(params: {
  values: number[];
}): {
  maxDrawdownPercent: number;
  peakValue: number;
  troughValue: number;
  recoveryNeededPercent: number;
} | { error: string } {
  if (params.values.length < 2) return { error: "Enter at least 2 portfolio values." };
  if (params.values.some((v) => v <= 0)) return { error: "All values must be positive." };

  let peak = params.values[0]!;
  let maxDd = 0;
  let peakAtMax = peak;
  let troughAtMax = peak;

  for (const v of params.values) {
    if (v > peak) peak = v;
    const dd = ((peak - v) / peak) * 100;
    if (dd > maxDd) {
      maxDd = dd;
      peakAtMax = peak;
      troughAtMax = v;
    }
  }

  const recoveryNeededPercent =
    troughAtMax > 0 ? ((peakAtMax - troughAtMax) / troughAtMax) * 100 : 0;

  return {
    maxDrawdownPercent: maxDd,
    peakValue: peakAtMax,
    troughValue: troughAtMax,
    recoveryNeededPercent,
  };
}

export function drawdownFromCsv(csv: string): ReturnType<typeof drawdownCalc> {
  const parts = csv
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 2) return { error: "Enter at least 2 values (comma-separated)." };
  const values: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (!Number.isFinite(n)) return { error: `Invalid value: ${p}` };
    values.push(n);
  }
  return drawdownCalc({ values });
}

export { parseReturnList };
