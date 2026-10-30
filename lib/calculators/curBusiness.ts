/** Business and e-commerce currency tools — pricing/margin teaching estimates. */
import { nonNeg, pos } from "./curHelpers";

export type CurBusinessSlug =
  | "cur-import-export-cost-calculator"
  | "cur-currency-pricing-calculator"
  | "cur-cross-border-pricing-calculator"
  | "cur-shopify-currency-converter-tool"
  | "cur-international-pricing-margin-calculator";

export const ALL_CUR_BUSINESS_SLUGS: CurBusinessSlug[] = [
  "cur-import-export-cost-calculator",
  "cur-currency-pricing-calculator",
  "cur-cross-border-pricing-calculator",
  "cur-shopify-currency-converter-tool",
  "cur-international-pricing-margin-calculator",
];

export type CurBusinessInput = {
  amount?: number;
  rate?: number;
  dutyPct?: number;
  freight?: number;
  marginPct?: number;
  sellPrice?: number;
  cost?: number;
  markupPct?: number;
};

export type CurBusinessResult =
  | { ok: false; error: string }
  | {
      ok: true;
      landed?: number;
      price?: number;
      converted?: number;
      marginPct?: number;
      profit?: number;
      note: string;
    };

export function computeCurBusiness(slug: CurBusinessSlug, input: CurBusinessInput): CurBusinessResult {
  switch (slug) {
    case "cur-import-export-cost-calculator": {
      const amt = pos(input.amount, "Goods cost");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate ?? 1, "FX rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const dutyPct = nonNeg(input.dutyPct ?? 0, "Duty %");
      if (typeof dutyPct !== "number") return { ok: false, error: dutyPct.error };
      const freight = nonNeg(input.freight ?? 0, "Freight");
      if (typeof freight !== "number") return { ok: false, error: freight.error };
      const local = amt * rate;
      const duty = local * (dutyPct / 100);
      return {
        ok: true,
        landed: local + duty + freight,
        converted: local,
        note: "Landed ≈ goods×FX + duty + freight.",
      };
    }
    case "cur-currency-pricing-calculator": {
      const cost = pos(input.cost ?? input.amount, "Cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const rate = pos(input.rate ?? 1, "FX rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const margin = nonNeg(input.marginPct ?? 0, "Margin %");
      if (typeof margin !== "number") return { ok: false, error: margin.error };
      const base = cost * rate;
      return {
        ok: true,
        price: base * (1 + margin / 100),
        converted: base,
        note: "Price = cost×FX × (1 + margin%).",
      };
    }
    case "cur-cross-border-pricing-calculator": {
      const local = pos(input.amount, "Local price");
      if (typeof local !== "number") return { ok: false, error: local.error };
      const rate = pos(input.rate, "FX rate (home per local)");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const markup = nonNeg(input.markupPct ?? 0, "Markup %");
      if (typeof markup !== "number") return { ok: false, error: markup.error };
      return {
        ok: true,
        price: (local / rate) * (1 + markup / 100),
        converted: local / rate,
        note: "Home list ≈ (local ÷ FX) × (1 + markup%).",
      };
    }
    case "cur-shopify-currency-converter-tool": {
      const amt = pos(input.amount, "Store price");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate, "FX rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return {
        ok: true,
        converted: amt * rate,
        note: "Storefront display ≈ price × illustrative FX.",
      };
    }
    case "cur-international-pricing-margin-calculator": {
      const sell = pos(input.sellPrice ?? input.amount, "Sell price (home)");
      if (typeof sell !== "number") return { ok: false, error: sell.error };
      const cost = pos(input.cost, "Cost (foreign)");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const rate = pos(input.rate, "FX rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const costHome = cost * rate;
      const profit = sell - costHome;
      return {
        ok: true,
        profit,
        marginPct: (profit / sell) * 100,
        converted: costHome,
        note: "Margin% = (sell − cost×FX) ÷ sell × 100.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
