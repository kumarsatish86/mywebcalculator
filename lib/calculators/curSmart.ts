/** Smart / scenario currency tools — illustrative planners, not predictions. */
import { nonNeg, pos } from "./curHelpers";

export type CurSmartSlug =
  | "cur-ai-currency-prediction-tool"
  | "cur-ai-forex-advisor"
  | "cur-ai-travel-budget-planner"
  | "cur-ai-investment-currency-optimizer";

export const ALL_CUR_SMART_SLUGS: CurSmartSlug[] = [
  "cur-ai-currency-prediction-tool",
  "cur-ai-forex-advisor",
  "cur-ai-travel-budget-planner",
  "cur-ai-investment-currency-optimizer",
];

export type CurSmartInput = {
  rate?: number;
  expectedMovePct?: number;
  trendScore?: number;
  volatility?: number;
  daily?: number;
  days?: number;
  bufferPct?: number;
  amount?: number;
  returnA?: number;
  returnB?: number;
  weightA?: number;
};

export type CurSmartResult =
  | { ok: false; error: string }
  | {
      ok: true;
      projectedRate?: number;
      adviceScore?: number;
      advice?: string;
      budget?: number;
      allocA?: number;
      allocB?: number;
      blendedReturn?: number;
      note: string;
    };

export function computeCurSmart(slug: CurSmartSlug, input: CurSmartInput): CurSmartResult {
  switch (slug) {
    case "cur-ai-currency-prediction-tool": {
      const rate = pos(input.rate, "Current rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const move = input.expectedMovePct ?? 0;
      if (!Number.isFinite(move)) return { ok: false, error: "Expected move % must be a number." };
      return {
        ok: true,
        projectedRate: rate * (1 + move / 100),
        note: "Scenario rate = current × (1 + expected move%). Not a forecast — verify live quotes.",
      };
    }
    case "cur-ai-forex-advisor": {
      const trend = input.trendScore ?? 0;
      const vol = nonNeg(input.volatility ?? 0, "Volatility");
      if (typeof vol !== "number") return { ok: false, error: vol.error };
      if (!Number.isFinite(trend)) return { ok: false, error: "Trend score must be a number." };
      const score = trend - vol / 10;
      let advice = "Neutral — wait for clearer signal.";
      if (score > 1) advice = "Bias: constructive on trend (teaching heuristic).";
      else if (score < -1) advice = "Bias: cautious — trend weak vs volatility.";
      return {
        ok: true,
        adviceScore: score,
        advice,
        note: "Heuristic score = trend − vol/10. Not investment advice.",
      };
    }
    case "cur-ai-travel-budget-planner": {
      const daily = pos(input.daily ?? input.amount, "Daily spend");
      if (typeof daily !== "number") return { ok: false, error: daily.error };
      const days = pos(input.days ?? 1, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      const rate = pos(input.rate ?? 1, "FX rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const buffer = nonNeg(input.bufferPct ?? 10, "Buffer %");
      if (typeof buffer !== "number") return { ok: false, error: buffer.error };
      const base = daily * days * rate;
      return {
        ok: true,
        budget: base * (1 + buffer / 100),
        note: "Planner budget = daily × days × FX × (1 + buffer%).",
      };
    }
    case "cur-ai-investment-currency-optimizer": {
      const amt = pos(input.amount, "Capital");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const ra = input.returnA ?? 0;
      const rb = input.returnB ?? 0;
      if (!Number.isFinite(ra) || !Number.isFinite(rb)) {
        return { ok: false, error: "Expected returns must be numbers." };
      }
      const wa = nonNeg(input.weightA ?? 50, "Weight A %");
      if (typeof wa !== "number") return { ok: false, error: wa.error };
      const wA = Math.min(100, wa) / 100;
      const wB = 1 - wA;
      return {
        ok: true,
        allocA: amt * wA,
        allocB: amt * wB,
        blendedReturn: ra * wA + rb * wB,
        note: "Split capital by weights; blended return = Σ(w×r). Scenario only.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
