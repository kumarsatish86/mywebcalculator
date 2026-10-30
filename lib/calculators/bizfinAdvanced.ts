/** Business finance — advanced / AI-style teaching estimates. */
import { pos, nonNeg, finite } from "./bizfinHelpers";

export type BizfinAdvancedSlug =
  | "bizfin-ai-business-profit-predictor"
  | "bizfin-ai-pricing-optimizer"
  | "bizfin-business-health-score-calculator"
  | "bizfin-startup-funding-dilution-calculator"
  | "bizfin-investor-return-calculator";
export const BIZFIN_ADVANCED_SLUGS: BizfinAdvancedSlug[] = [
  "bizfin-ai-business-profit-predictor",
  "bizfin-ai-pricing-optimizer",
  "bizfin-business-health-score-calculator",
  "bizfin-startup-funding-dilution-calculator",
  "bizfin-investor-return-calculator",
];


export type BizfinAdvancedInput = {
  recentProfit?: number;
  growthPct?: number;
  years?: number;
  cost?: number;
  elasticity?: number;
  targetMarginPct?: number;
  currentPrice?: number;
  marginPct?: number;
  currentRatio?: number;
  debtToEquity?: number;
  revenueGrowthPct?: number;
  preMoney?: number;
  raise?: number;
  founderPct?: number;
  invest?: number;
  exitValue?: number;
  ownershipPct?: number;
};

export type BizfinAdvancedResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinAdvanced(slug: BizfinAdvancedSlug, input: BizfinAdvancedInput): BizfinAdvancedResult {
  switch (slug) {
    case "bizfin-ai-business-profit-predictor": {
      const p0 = finite(input.recentProfit, "Recent profit");
      if (typeof p0 !== "number") return { ok: false, error: p0.error };
      const g = finite(input.growthPct ?? 0, "Assumed growth %");
      if (typeof g !== "number") return { ok: false, error: g.error };
      const years = pos(input.years ?? 1, "Years ahead");
      if (typeof years !== "number") return { ok: false, error: years.error };
      return { ok: true, value: p0 * Math.pow(1 + g / 100, years), note: "Simple trend: profit × (1+g)^n — not ML." };
    }
    case "bizfin-ai-pricing-optimizer": {
      const cost = pos(input.cost, "Unit cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const margin = pos(input.targetMarginPct ?? 30, "Target margin %");
      if (typeof margin !== "number") return { ok: false, error: margin.error };
      if (margin >= 100) return { ok: false, error: "Margin % must be < 100." };
      let price = cost / (1 - margin / 100);
      if (input.elasticity !== undefined && input.currentPrice !== undefined) {
        const e = finite(input.elasticity, "Elasticity");
        if (typeof e !== "number") return { ok: false, error: e.error };
        const cur = pos(input.currentPrice, "Current price");
        if (typeof cur !== "number") return { ok: false, error: cur.error };
        // Nudge toward cost-plus if highly elastic (|e|>1): blend 70/30
        const blend = Math.abs(e) > 1 ? 0.7 : 0.4;
        price = blend * price + (1 - blend) * cur;
      }
      return { ok: true, value: price, note: "Heuristic price from target margin (+ optional elasticity blend)." };
    }
    case "bizfin-business-health-score-calculator": {
      const margin = finite(input.marginPct ?? 0, "Profit margin %");
      if (typeof margin !== "number") return { ok: false, error: margin.error };
      const cr = pos(input.currentRatio ?? 1, "Current ratio");
      if (typeof cr !== "number") return { ok: false, error: cr.error };
      const de = nonNeg(input.debtToEquity ?? 0, "Debt-to-equity");
      if (typeof de !== "number") return { ok: false, error: de.error };
      const growth = finite(input.revenueGrowthPct ?? 0, "Revenue growth %");
      if (typeof growth !== "number") return { ok: false, error: growth.error };
      const marginScore = Math.max(0, Math.min(25, (margin / 20) * 25));
      const liquidityScore = Math.max(0, Math.min(25, (cr / 2) * 25));
      const leverageScore = Math.max(0, Math.min(25, (1 / (1 + de)) * 25));
      const growthScore = Math.max(0, Math.min(25, ((growth + 10) / 30) * 25));
      const score = marginScore + liquidityScore + leverageScore + growthScore;
      return { ok: true, value: score, note: "Health score 0–100 from margin, liquidity, leverage, growth (teaching)." };
    }
    case "bizfin-startup-funding-dilution-calculator": {
      const pre = pos(input.preMoney, "Pre-money valuation");
      if (typeof pre !== "number") return { ok: false, error: pre.error };
      const raise = pos(input.raise, "Raise amount");
      if (typeof raise !== "number") return { ok: false, error: raise.error };
      const founder = nonNeg(input.founderPct ?? 100, "Founder ownership % pre-round");
      if (typeof founder !== "number") return { ok: false, error: founder.error };
      const post = pre + raise;
      const investorPct = (raise / post) * 100;
      const founderPost = founder * (pre / post);
      return {
        ok: true,
        value: founderPost,
        secondary: investorPct,
        tertiary: post,
        note: "Post-money = pre + raise; founder % dilutes by pre/post.",
      };
    }
    case "bizfin-investor-return-calculator": {
      const invest = pos(input.invest, "Investment");
      if (typeof invest !== "number") return { ok: false, error: invest.error };
      const exit = pos(input.exitValue, "Exit equity value");
      if (typeof exit !== "number") return { ok: false, error: exit.error };
      const own = pos(input.ownershipPct ?? 100, "Ownership % at exit");
      if (typeof own !== "number") return { ok: false, error: own.error };
      const years = pos(input.years ?? 1, "Years held");
      if (typeof years !== "number") return { ok: false, error: years.error };
      const proceeds = exit * (own / 100);
      const moic = proceeds / invest;
      const irr = Math.pow(moic, 1 / years) - 1;
      return { ok: true, value: proceeds, secondary: moic, pct: irr * 100, note: "Proceeds, MOIC, and annualized IRR (teaching)." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
