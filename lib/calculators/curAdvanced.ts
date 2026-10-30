/** Advanced currency tools — multi-currency, fees, comparison teaching estimates. */
import { nonNeg, pos } from "./curHelpers";

export type CurAdvancedSlug =
  | "cur-multi-currency-converter"
  | "cur-bulk-currency-converter-csv"
  | "cur-reverse-currency-calculator"
  | "cur-currency-rate-comparison-tool"
  | "cur-currency-conversion-with-fees"
  | "cur-currency-converter-historical-rates";

export const ALL_CUR_ADVANCED_SLUGS: CurAdvancedSlug[] = [
  "cur-multi-currency-converter",
  "cur-bulk-currency-converter-csv",
  "cur-reverse-currency-calculator",
  "cur-currency-rate-comparison-tool",
  "cur-currency-conversion-with-fees",
  "cur-currency-converter-historical-rates",
];

export type CurAdvancedInput = {
  amount?: number;
  rate?: number;
  rateB?: number;
  rateC?: number;
  rows?: number;
  feePct?: number;
  fixedFee?: number;
  target?: number;
};

export type CurAdvancedResult =
  | { ok: false; error: string }
  | {
      ok: true;
      converted?: number;
      convertedB?: number;
      convertedC?: number;
      sourceNeeded?: number;
      betterLabel?: string;
      savings?: number;
      effectiveRate?: number;
      note: string;
    };

export function computeCurAdvanced(slug: CurAdvancedSlug, input: CurAdvancedInput): CurAdvancedResult {
  switch (slug) {
    case "cur-multi-currency-converter": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const r1 = pos(input.rate, "Rate A");
      if (typeof r1 !== "number") return { ok: false, error: r1.error };
      const r2 = pos(input.rateB, "Rate B");
      if (typeof r2 !== "number") return { ok: false, error: r2.error };
      const r3 = pos(input.rateC, "Rate C");
      if (typeof r3 !== "number") return { ok: false, error: r3.error };
      return {
        ok: true,
        converted: amt * r1,
        convertedB: amt * r2,
        convertedC: amt * r3,
        note: "Same source amount × three illustrative rates.",
      };
    }
    case "cur-bulk-currency-converter-csv": {
      const amt = pos(input.amount, "Per-row amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate, "Rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const rows = pos(input.rows ?? 1, "Rows");
      if (typeof rows !== "number") return { ok: false, error: rows.error };
      return {
        ok: true,
        converted: amt * rate * rows,
        note: "Bulk total ≈ rows × amount × rate (CSV teaching proxy).",
      };
    }
    case "cur-reverse-currency-calculator": {
      const target = pos(input.target ?? input.amount, "Target amount");
      if (typeof target !== "number") return { ok: false, error: target.error };
      const rate = pos(input.rate, "Rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return {
        ok: true,
        sourceNeeded: target / rate,
        converted: target,
        note: "Source needed = target ÷ rate.",
      };
    }
    case "cur-currency-rate-comparison-tool": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const r1 = pos(input.rate, "Rate A");
      if (typeof r1 !== "number") return { ok: false, error: r1.error };
      const r2 = pos(input.rateB, "Rate B");
      if (typeof r2 !== "number") return { ok: false, error: r2.error };
      const a = amt * r1;
      const b = amt * r2;
      const better = a >= b ? "Rate A" : "Rate B";
      return {
        ok: true,
        converted: a,
        convertedB: b,
        betterLabel: better,
        savings: Math.abs(a - b),
        note: `${better} yields more destination currency for this amount.`,
      };
    }
    case "cur-currency-conversion-with-fees": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate, "Rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const feePct = nonNeg(input.feePct ?? 0, "Fee %");
      if (typeof feePct !== "number") return { ok: false, error: feePct.error };
      const fixed = nonNeg(input.fixedFee ?? 0, "Fixed fee");
      if (typeof fixed !== "number") return { ok: false, error: fixed.error };
      const net = amt * (1 - feePct / 100) - fixed;
      if (net <= 0) return { ok: false, error: "Fees exceed amount." };
      return {
        ok: true,
        converted: net * rate,
        effectiveRate: (net * rate) / amt,
        note: "Net after % and fixed fee, then × rate.",
      };
    }
    case "cur-currency-converter-historical-rates": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate, "Historical rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return {
        ok: true,
        converted: amt * rate,
        effectiveRate: rate,
        note: "Historical snapshot = amount × entered past rate (teaching).",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
