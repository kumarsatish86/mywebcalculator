/** Business finance — pricing strategy teaching estimates. */
import { pos, nonNeg, finite } from "./bizfinHelpers";

export type BizfinPricingSlug =
  | "bizfin-markup-calculator"
  | "bizfin-markdown-calculator"
  | "bizfin-pricing-strategy-calculator"
  | "bizfin-dynamic-pricing-calculator"
  | "bizfin-wholesale-price-calculator"
  | "bizfin-retail-price-calculator"
  | "bizfin-discount-pricing-calculator"
  | "bizfin-price-elasticity-calculator"
  | "bizfin-value-based-pricing-calculator";
export const BIZFIN_PRICING_SLUGS: BizfinPricingSlug[] = [
  "bizfin-markup-calculator",
  "bizfin-markdown-calculator",
  "bizfin-pricing-strategy-calculator",
  "bizfin-dynamic-pricing-calculator",
  "bizfin-wholesale-price-calculator",
  "bizfin-retail-price-calculator",
  "bizfin-discount-pricing-calculator",
  "bizfin-price-elasticity-calculator",
  "bizfin-value-based-pricing-calculator",
];


export type BizfinPricingInput = {
  cost?: number;
  price?: number;
  originalPrice?: number;
  salePrice?: number;
  markupPct?: number;
  marginPct?: number;
  demandFactor?: number;
  wholesale?: number;
  retailMarginPct?: number;
  discountPct?: number;
  pctPriceChange?: number;
  pctQtyChange?: number;
  perceivedValue?: number;
  valueCapturePct?: number;
};

export type BizfinPricingResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinPricing(slug: BizfinPricingSlug, input: BizfinPricingInput): BizfinPricingResult {
  switch (slug) {
    case "bizfin-markup-calculator": {
      const cost = pos(input.cost, "Cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const price = pos(input.price, "Price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      return { ok: true, value: price - cost, pct: ((price - cost) / cost) * 100, note: "Markup % = (price − cost) ÷ cost." };
    }
    case "bizfin-markdown-calculator": {
      const original = pos(input.originalPrice ?? input.price, "Original price");
      if (typeof original !== "number") return { ok: false, error: original.error };
      const sale = pos(input.salePrice, "Sale price");
      if (typeof sale !== "number") return { ok: false, error: sale.error };
      const md = original - sale;
      return { ok: true, value: md, pct: (md / original) * 100, note: "Markdown % = (original − sale) ÷ original." };
    }
    case "bizfin-pricing-strategy-calculator": {
      const cost = pos(input.cost, "Cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const markup = nonNeg(input.markupPct ?? 0, "Cost-plus markup %");
      if (typeof markup !== "number") return { ok: false, error: markup.error };
      const costPlus = cost * (1 + markup / 100);
      if (input.marginPct !== undefined) {
        const m = pos(input.marginPct, "Target margin %");
        if (typeof m !== "number") return { ok: false, error: m.error };
        if (m >= 100) return { ok: false, error: "Margin % must be < 100." };
        const target = cost / (1 - m / 100);
        return { ok: true, value: target, secondary: costPlus, note: "Compares target-margin price vs cost-plus price." };
      }
      return { ok: true, value: costPlus, note: "Cost-plus price = cost × (1 + markup%)." };
    }
    case "bizfin-dynamic-pricing-calculator": {
      const base = pos(input.price ?? input.cost, "Base price");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const factor = pos(input.demandFactor ?? 1, "Demand factor");
      if (typeof factor !== "number") return { ok: false, error: factor.error };
      return { ok: true, value: base * factor, note: "Dynamic price ≈ base × demand factor." };
    }
    case "bizfin-wholesale-price-calculator": {
      if (input.cost !== undefined) {
        const cost = pos(input.cost, "Cost");
        if (typeof cost !== "number") return { ok: false, error: cost.error };
        const markup = nonNeg(input.markupPct ?? 0, "Wholesale markup %");
        if (typeof markup !== "number") return { ok: false, error: markup.error };
        return { ok: true, value: cost * (1 + markup / 100), note: "Wholesale = cost × (1 + markup%)." };
      }
      const retail = pos(input.price, "Retail price");
      if (typeof retail !== "number") return { ok: false, error: retail.error };
      const rm = nonNeg(input.retailMarginPct ?? 0, "Retail margin %");
      if (typeof rm !== "number") return { ok: false, error: rm.error };
      if (rm >= 100) return { ok: false, error: "Retail margin % must be < 100." };
      return { ok: true, value: retail * (1 - rm / 100), note: "Wholesale ≈ retail × (1 − retail margin%)." };
    }
    case "bizfin-retail-price-calculator": {
      const wholesale = pos(input.wholesale ?? input.cost, "Wholesale / cost");
      if (typeof wholesale !== "number") return { ok: false, error: wholesale.error };
      const markup = nonNeg(input.markupPct ?? input.retailMarginPct ?? 0, "Retail markup %");
      if (typeof markup !== "number") return { ok: false, error: markup.error };
      return { ok: true, value: wholesale * (1 + markup / 100), note: "Retail = wholesale × (1 + markup%)." };
    }
    case "bizfin-discount-pricing-calculator": {
      const price = pos(input.price ?? input.originalPrice, "List price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const disc = nonNeg(input.discountPct ?? 0, "Discount %");
      if (typeof disc !== "number") return { ok: false, error: disc.error };
      const sale = price * (1 - disc / 100);
      return { ok: true, value: sale, secondary: price - sale, note: "Sale price = list × (1 − discount%)." };
    }
    case "bizfin-price-elasticity-calculator": {
      const dq = finite(input.pctQtyChange, "% quantity change");
      if (typeof dq !== "number") return { ok: false, error: dq.error };
      const dp = finite(input.pctPriceChange, "% price change");
      if (typeof dp !== "number") return { ok: false, error: dp.error };
      if (dp === 0) return { ok: false, error: "Price change % cannot be zero." };
      return { ok: true, value: dq / dp, note: "Elasticity ≈ %ΔQ ÷ %ΔP (teaching approx)." };
    }
    case "bizfin-value-based-pricing-calculator": {
      const value = pos(input.perceivedValue, "Perceived / delivered value");
      if (typeof value !== "number") return { ok: false, error: value.error };
      const capture = nonNeg(input.valueCapturePct ?? 50, "Value capture %");
      if (typeof capture !== "number") return { ok: false, error: capture.error };
      return { ok: true, value: value * (capture / 100), note: "Value-based price ≈ value × capture %." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
