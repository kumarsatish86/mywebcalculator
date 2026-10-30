/** Time-based currency tools — trend/volatility teaching estimates. */
import { pos } from "./curHelpers";

export type CurTimeSlug =
  | "cur-currency-rate-history-chart"
  | "cur-currency-trend-analyzer"
  | "cur-best-time-to-exchange-calculator"
  | "cur-currency-volatility-calculator";

export const ALL_CUR_TIME_SLUGS: CurTimeSlug[] = [
  "cur-currency-rate-history-chart",
  "cur-currency-trend-analyzer",
  "cur-best-time-to-exchange-calculator",
  "cur-currency-volatility-calculator",
];

export type CurTimeInput = {
  startRate?: number;
  endRate?: number;
  highRate?: number;
  lowRate?: number;
  rateA?: number;
  rateB?: number;
  amount?: number;
};

export type CurTimeResult =
  | { ok: false; error: string }
  | {
      ok: true;
      average?: number;
      high?: number;
      low?: number;
      changePct?: number;
      betterLabel?: string;
      savings?: number;
      volatilityPct?: number;
      note: string;
    };

export function computeCurTime(slug: CurTimeSlug, input: CurTimeInput): CurTimeResult {
  switch (slug) {
    case "cur-currency-rate-history-chart": {
      const start = pos(input.startRate, "Start rate");
      if (typeof start !== "number") return { ok: false, error: start.error };
      const end = pos(input.endRate, "End rate");
      if (typeof end !== "number") return { ok: false, error: end.error };
      const high = pos(input.highRate ?? Math.max(start, end), "High");
      if (typeof high !== "number") return { ok: false, error: high.error };
      const low = pos(input.lowRate ?? Math.min(start, end), "Low");
      if (typeof low !== "number") return { ok: false, error: low.error };
      return {
        ok: true,
        average: (start + end) / 2,
        high,
        low,
        note: "Simple history snapshot from start/end/high/low (teaching).",
      };
    }
    case "cur-currency-trend-analyzer": {
      const start = pos(input.startRate, "Start rate");
      if (typeof start !== "number") return { ok: false, error: start.error };
      const end = pos(input.endRate, "End rate");
      if (typeof end !== "number") return { ok: false, error: end.error };
      return {
        ok: true,
        changePct: ((end - start) / start) * 100,
        note: "Change% = (end − start) ÷ start × 100.",
      };
    }
    case "cur-best-time-to-exchange-calculator": {
      const amt = pos(input.amount ?? 1, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const a = pos(input.rateA ?? input.startRate, "Rate A");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = pos(input.rateB ?? input.endRate, "Rate B");
      if (typeof b !== "number") return { ok: false, error: b.error };
      const better = a >= b ? "Rate A (earlier/option A)" : "Rate B (later/option B)";
      return {
        ok: true,
        betterLabel: better,
        savings: Math.abs(amt * a - amt * b),
        note: `${better} gives more destination currency in this comparison.`,
      };
    }
    case "cur-currency-volatility-calculator": {
      const high = pos(input.highRate, "High");
      if (typeof high !== "number") return { ok: false, error: high.error };
      const low = pos(input.lowRate, "Low");
      if (typeof low !== "number") return { ok: false, error: low.error };
      const mid = (high + low) / 2;
      if (mid <= 0) return { ok: false, error: "Mid rate must be positive." };
      return {
        ok: true,
        volatilityPct: ((high - low) / mid) * 100,
        high,
        low,
        average: mid,
        note: "Range volatility% ≈ (high − low) ÷ mid × 100.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
