/** Shop discounts & pricing — daily-life estimates. */
import { pos, nonNeg } from "./shopHelpers";

export type ShopPricingSlug =
  | "shop-discount-calculator"
  | "shop-percentage-off-calculator"
  | "shop-multiple-discount-calculator"
  | "shop-buy-one-get-one-calculator"
  | "shop-price-after-discount-calculator"
  | "shop-original-price-calculator"
  | "shop-markup-calculator"
  | "shop-markdown-calculator"
  | "shop-sale-price-calculator"
  | "shop-clearance-price-calculator"
  | "shop-bundle-discount-calculator"
  | "shop-tiered-discount-calculator"
  | "shop-volume-discount-calculator"
  | "shop-wholesale-price-calculator"
  | "shop-retail-price-calculator"
  | "shop-cost-plus-pricing-calculator"
  | "shop-price-per-unit-calculator"
  | "shop-msrp-vs-selling-price-calculator"
  | "shop-trade-in-value-calculator"
  | "shop-membership-discount-calculator"
  | "shop-loyalty-points-value-calculator";

export type ShopPricingInput = {
  price?: number;
  pct?: number;
  pct2?: number;
  cost?: number;
  qty?: number;
  units?: number;
  msrp?: number;
  selling?: number;
  tradeIn?: number;
  points?: number;
  pointValue?: number;
  tierQty?: number;
  tierPct?: number;
};

export type ShopPricingResult =
  | { ok: false; error: string }
  | {
      ok: true;
      final?: number;
      saved?: number;
      pct?: number;
      perUnit?: number;
      note: string;
    };

export function computeShopPricing(slug: ShopPricingSlug, input: ShopPricingInput): ShopPricingResult {
  switch (slug) {
    case "shop-discount-calculator":
    case "shop-percentage-off-calculator":
    case "shop-price-after-discount-calculator":
    case "shop-sale-price-calculator":
    case "shop-clearance-price-calculator":
    case "shop-membership-discount-calculator": {
      const price = pos(input.price, "Price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const pct = nonNeg(input.pct ?? 0, "Discount %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const saved = price * (pct / 100);
      return { ok: true, final: price - saved, saved, note: `Final = price × (1 − ${pct}%).` };
    }
    case "shop-multiple-discount-calculator": {
      const price = pos(input.price, "Price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const p1 = nonNeg(input.pct ?? 0, "Discount 1 %");
      if (typeof p1 !== "number") return { ok: false, error: p1.error };
      const p2 = nonNeg(input.pct2 ?? 0, "Discount 2 %");
      if (typeof p2 !== "number") return { ok: false, error: p2.error };
      const after = price * (1 - p1 / 100) * (1 - p2 / 100);
      return { ok: true, final: after, saved: price - after, note: "Stacked discounts multiply (not add)." };
    }
    case "shop-buy-one-get-one-calculator":
    case "shop-bundle-discount-calculator": {
      const price = pos(input.price, "Unit price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const qty = pos(input.qty ?? 2, "Qty");
      if (typeof qty !== "number") return { ok: false, error: qty.error };
      const freePct = input.pct !== undefined ? nonNeg(input.pct, "Free item %") : 100;
      if (typeof freePct !== "number") return { ok: false, error: freePct.error };
      // BOGO: pay for ceil(qty/2) at full, rest at (100-freePct)
      const paid = Math.ceil(qty / 2);
      const free = qty - paid;
      const final = paid * price + free * price * (1 - freePct / 100);
      return { ok: true, final, saved: qty * price - final, note: "BOGO/bundle teaching model." };
    }
    case "shop-original-price-calculator": {
      const final = pos(input.price, "Sale price");
      if (typeof final !== "number") return { ok: false, error: final.error };
      const pct = pos(input.pct, "Discount %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      if (pct >= 100) return { ok: false, error: "Discount % must be < 100." };
      const original = final / (1 - pct / 100);
      return { ok: true, final: original, note: "Original = sale ÷ (1 − discount%)." };
    }
    case "shop-markup-calculator":
    case "shop-cost-plus-pricing-calculator":
    case "shop-retail-price-calculator": {
      const cost = pos(input.cost ?? input.price, "Cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const pct = nonNeg(input.pct ?? 0, "Markup %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      return { ok: true, final: cost * (1 + pct / 100), note: "Price = cost × (1 + markup%)." };
    }
    case "shop-markdown-calculator": {
      const price = pos(input.price, "List price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const pct = nonNeg(input.pct ?? 0, "Markdown %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      return { ok: true, final: price * (1 - pct / 100), saved: price * (pct / 100), note: "Markdown = list × (1 − %)." };
    }
    case "shop-tiered-discount-calculator":
    case "shop-volume-discount-calculator": {
      const price = pos(input.price, "Unit price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const qty = pos(input.qty, "Quantity");
      if (typeof qty !== "number") return { ok: false, error: qty.error };
      const thresh = input.tierQty && input.tierQty > 0 ? input.tierQty : 10;
      const tierPct = input.tierPct !== undefined ? input.tierPct : input.pct ?? 10;
      const pct = qty >= thresh ? tierPct : 0;
      const final = price * qty * (1 - pct / 100);
      return { ok: true, final, saved: price * qty - final, note: qty >= thresh ? `Tier ${pct}% applied.` : "Below tier threshold." };
    }
    case "shop-wholesale-price-calculator": {
      const retail = pos(input.price, "Retail");
      if (typeof retail !== "number") return { ok: false, error: retail.error };
      const pct = nonNeg(input.pct ?? 30, "Wholesale off %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      return { ok: true, final: retail * (1 - pct / 100), note: "Wholesale ≈ retail × (1 − off%)." };
    }
    case "shop-price-per-unit-calculator": {
      const price = pos(input.price, "Price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const units = pos(input.units ?? input.qty, "Units");
      if (typeof units !== "number") return { ok: false, error: units.error };
      return { ok: true, perUnit: price / units, final: price, note: "Per-unit = price ÷ units." };
    }
    case "shop-msrp-vs-selling-price-calculator": {
      const msrp = pos(input.msrp ?? input.price, "MSRP");
      if (typeof msrp !== "number") return { ok: false, error: msrp.error };
      const sell = pos(input.selling ?? input.cost, "Selling price");
      if (typeof sell !== "number") return { ok: false, error: sell.error };
      return {
        ok: true,
        saved: msrp - sell,
        pct: ((msrp - sell) / msrp) * 100,
        final: sell,
        note: "Discount vs MSRP.",
      };
    }
    case "shop-trade-in-value-calculator": {
      const price = pos(input.price, "Purchase price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const trade = nonNeg(input.tradeIn ?? 0, "Trade-in");
      if (typeof trade !== "number") return { ok: false, error: trade.error };
      return { ok: true, final: Math.max(0, price - trade), saved: trade, note: "Net = price − trade-in." };
    }
    case "shop-loyalty-points-value-calculator": {
      const pts = pos(input.points, "Points");
      if (typeof pts !== "number") return { ok: false, error: pts.error };
      const val = pos(input.pointValue ?? 0.01, "Value per point");
      if (typeof val !== "number") return { ok: false, error: val.error };
      return { ok: true, final: pts * val, note: "Points value = points × value/point." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
