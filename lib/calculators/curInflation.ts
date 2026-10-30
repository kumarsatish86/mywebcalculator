/** Inflation and purchasing power — teaching value-over-time estimates. */
import { nonNeg, pos } from "./curHelpers";

export type CurInflationSlug =
  | "cur-inflation-calculator-currency-value"
  | "cur-purchasing-power-calculator"
  | "cur-historical-currency-value-calculator"
  | "cur-cost-of-living-comparison-tool";

export const ALL_CUR_INFLATION_SLUGS: CurInflationSlug[] = [
  "cur-inflation-calculator-currency-value",
  "cur-purchasing-power-calculator",
  "cur-historical-currency-value-calculator",
  "cur-cost-of-living-comparison-tool",
];

export type CurInflationInput = {
  amount?: number;
  inflationPct?: number;
  years?: number;
  oldRate?: number;
  newRate?: number;
  basketA?: number;
  basketB?: number;
  income?: number;
};

export type CurInflationResult =
  | { ok: false; error: string }
  | {
      ok: true;
      futureValue?: number;
      realValue?: number;
      historicalValue?: number;
      equivalentIncome?: number;
      colIndex?: number;
      note: string;
    };

export function computeCurInflation(slug: CurInflationSlug, input: CurInflationInput): CurInflationResult {
  switch (slug) {
    case "cur-inflation-calculator-currency-value": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const r = nonNeg(input.inflationPct ?? 0, "Inflation %");
      if (typeof r !== "number") return { ok: false, error: r.error };
      const years = pos(input.years ?? 1, "Years");
      if (typeof years !== "number") return { ok: false, error: years.error };
      return {
        ok: true,
        futureValue: amt * (1 + r / 100) ** years,
        note: "Future nominal ≈ amount × (1+i)^years.",
      };
    }
    case "cur-purchasing-power-calculator": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const r = nonNeg(input.inflationPct ?? 0, "Inflation %");
      if (typeof r !== "number") return { ok: false, error: r.error };
      const years = pos(input.years ?? 1, "Years");
      if (typeof years !== "number") return { ok: false, error: years.error };
      return {
        ok: true,
        realValue: amt / (1 + r / 100) ** years,
        note: "Real purchasing power ≈ amount ÷ (1+i)^years.",
      };
    }
    case "cur-historical-currency-value-calculator": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const oldR = pos(input.oldRate, "Past rate");
      if (typeof oldR !== "number") return { ok: false, error: oldR.error };
      const newR = pos(input.newRate, "Current rate");
      if (typeof newR !== "number") return { ok: false, error: newR.error };
      return {
        ok: true,
        historicalValue: amt * (oldR / newR),
        note: "Scaled value ≈ amount × (past rate ÷ current rate).",
      };
    }
    case "cur-cost-of-living-comparison-tool": {
      const a = pos(input.basketA, "Basket A");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = pos(input.basketB, "Basket B");
      if (typeof b !== "number") return { ok: false, error: b.error };
      const income = pos(input.income ?? input.amount, "Income in A");
      if (typeof income !== "number") return { ok: false, error: income.error };
      return {
        ok: true,
        colIndex: a / b,
        equivalentIncome: income * (b / a),
        note: "Equivalent income in B ≈ incomeA × (basketB ÷ basketA).",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
