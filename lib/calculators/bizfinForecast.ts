/** Business finance — planning & forecasting teaching estimates. */
import { pos, nonNeg, finite } from "./bizfinHelpers";

export type BizfinForecastSlug =
  | "bizfin-revenue-forecast-calculator"
  | "bizfin-profit-forecast-calculator"
  | "bizfin-budget-calculator"
  | "bizfin-scenario-analysis-calculator"
  | "bizfin-break-even-analysis-tool"
  | "bizfin-financial-projection-calculator";
export const BIZFIN_FORECAST_SLUGS: BizfinForecastSlug[] = [
  "bizfin-revenue-forecast-calculator",
  "bizfin-profit-forecast-calculator",
  "bizfin-budget-calculator",
  "bizfin-scenario-analysis-calculator",
  "bizfin-break-even-analysis-tool",
  "bizfin-financial-projection-calculator",
];


export type BizfinForecastInput = {
  base?: number;
  growthPct?: number;
  years?: number;
  costs?: number;
  costGrowthPct?: number;
  planned?: number;
  actual?: number;
  baseCase?: number;
  bestCase?: number;
  worstCase?: number;
  fixedCosts?: number;
  pricePerUnit?: number;
  variablePerUnit?: number;
};

export type BizfinForecastResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinForecast(slug: BizfinForecastSlug, input: BizfinForecastInput): BizfinForecastResult {
  switch (slug) {
    case "bizfin-revenue-forecast-calculator": {
      const base = pos(input.base, "Base revenue");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const g = finite(input.growthPct ?? 0, "Growth %");
      if (typeof g !== "number") return { ok: false, error: g.error };
      const years = pos(input.years ?? 1, "Years");
      if (typeof years !== "number") return { ok: false, error: years.error };
      return { ok: true, value: base * Math.pow(1 + g / 100, years), note: "Forecast = base × (1 + g)^years." };
    }
    case "bizfin-profit-forecast-calculator": {
      const rev0 = pos(input.base, "Base revenue");
      if (typeof rev0 !== "number") return { ok: false, error: rev0.error };
      const g = finite(input.growthPct ?? 0, "Revenue growth %");
      if (typeof g !== "number") return { ok: false, error: g.error };
      const costs0 = nonNeg(input.costs ?? 0, "Base costs");
      if (typeof costs0 !== "number") return { ok: false, error: costs0.error };
      const cg = finite(input.costGrowthPct ?? g, "Cost growth %");
      if (typeof cg !== "number") return { ok: false, error: cg.error };
      const years = pos(input.years ?? 1, "Years");
      if (typeof years !== "number") return { ok: false, error: years.error };
      const rev = rev0 * Math.pow(1 + g / 100, years);
      const costs = costs0 * Math.pow(1 + cg / 100, years);
      return { ok: true, value: rev - costs, secondary: rev, tertiary: costs, note: "Profit forecast = grown revenue − grown costs." };
    }
    case "bizfin-budget-calculator": {
      const planned = finite(input.planned ?? input.base, "Planned / budget");
      if (typeof planned !== "number") return { ok: false, error: planned.error };
      const actual = finite(input.actual, "Actual");
      if (typeof actual !== "number") return { ok: false, error: actual.error };
      const variance = actual - planned;
      return {
        ok: true,
        value: variance,
        pct: planned !== 0 ? (variance / Math.abs(planned)) * 100 : 0,
        note: "Variance = actual − planned.",
      };
    }
    case "bizfin-scenario-analysis-calculator": {
      const base = finite(input.baseCase ?? input.base, "Base case");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const best = finite(input.bestCase, "Best case");
      if (typeof best !== "number") return { ok: false, error: best.error };
      const worst = finite(input.worstCase, "Worst case");
      if (typeof worst !== "number") return { ok: false, error: worst.error };
      const expected = (worst + base + best) / 3;
      return { ok: true, value: expected, secondary: best, tertiary: worst, note: "Simple expected = (worst + base + best) ÷ 3." };
    }
    case "bizfin-break-even-analysis-tool": {
      const fixed = pos(input.fixedCosts, "Fixed costs");
      if (typeof fixed !== "number") return { ok: false, error: fixed.error };
      const price = pos(input.pricePerUnit, "Price / unit");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const vc = nonNeg(input.variablePerUnit ?? 0, "Variable / unit");
      if (typeof vc !== "number") return { ok: false, error: vc.error };
      const contrib = price - vc;
      if (contrib <= 0) return { ok: false, error: "Contribution per unit must be positive." };
      return {
        ok: true,
        value: fixed / contrib,
        secondary: fixed / (contrib / price),
        note: "Break-even units and revenue (secondary).",
      };
    }
    case "bizfin-financial-projection-calculator": {
      const base = pos(input.base, "Base revenue");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const g = finite(input.growthPct ?? 0, "Growth %");
      if (typeof g !== "number") return { ok: false, error: g.error };
      const years = pos(input.years ?? 3, "Years");
      if (typeof years !== "number") return { ok: false, error: years.error };
      const costs0 = nonNeg(input.costs ?? base * 0.7, "Base costs");
      if (typeof costs0 !== "number") return { ok: false, error: costs0.error };
      const rev = base * Math.pow(1 + g / 100, years);
      const costs = costs0 * Math.pow(1 + g / 100, years);
      return { ok: true, value: rev, secondary: costs, tertiary: rev - costs, note: "Year-N revenue, costs, and profit projection." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
