/** Shop smart / advanced retail — daily-life estimates. */
import { pos, nonNeg } from "./shopHelpers";

export type ShopSmartSlug =
  | "shop-price-elasticity-estimator"
  | "shop-dynamic-pricing-scenario-calculator"
  | "shop-segmented-discount-calculator"
  | "shop-cart-abandonment-recovery-discount-calculator"
  | "shop-lifetime-value-discount-calculator";

export type ShopSmartInput = {
  pctPriceChange?: number;
  pctQtyChange?: number;
  basePrice?: number;
  scenarioPct?: number;
  demandFactor?: number;
  price?: number;
  segmentPct?: number;
  cart?: number;
  recoveryPct?: number;
  ltv?: number;
  maxDiscountPct?: number;
  targetMarginPct?: number;
};

export type ShopSmartResult =
  | { ok: false; error: string }
  | {
      ok: true;
      elasticity?: number;
      newPrice?: number;
      expectedRevenue?: number;
      discount?: number;
      final?: number;
      maxOffer?: number;
      note: string;
    };

export function computeShopSmart(slug: ShopSmartSlug, input: ShopSmartInput): ShopSmartResult {
  switch (slug) {
    case "shop-price-elasticity-estimator": {
      const dp = input.pctPriceChange;
      const dq = input.pctQtyChange;
      if (dp === undefined || !Number.isFinite(dp) || dp === 0) {
        return { ok: false, error: "% price change must be non-zero." };
      }
      if (dq === undefined || !Number.isFinite(dq)) {
        return { ok: false, error: "% quantity change required." };
      }
      return {
        ok: true,
        elasticity: dq / dp,
        note: "Elasticity ≈ %ΔQ ÷ %ΔP (teaching estimate).",
      };
    }
    case "shop-dynamic-pricing-scenario-calculator": {
      const base = pos(input.basePrice ?? input.price, "Base price");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const pct = input.scenarioPct ?? 0;
      const factor = input.demandFactor && input.demandFactor > 0 ? input.demandFactor : 1;
      const newPrice = base * (1 + pct / 100) * factor;
      return {
        ok: true,
        newPrice,
        expectedRevenue: newPrice,
        note: "Scenario price = base × (1+%) × demand factor.",
      };
    }
    case "shop-segmented-discount-calculator": {
      const price = pos(input.price, "Price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const pct = nonNeg(input.segmentPct ?? 0, "Segment discount %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const disc = price * (pct / 100);
      return { ok: true, discount: disc, final: price - disc, note: "Segment-specific discount." };
    }
    case "shop-cart-abandonment-recovery-discount-calculator": {
      const cart = pos(input.cart ?? input.price, "Cart value");
      if (typeof cart !== "number") return { ok: false, error: cart.error };
      const pct = nonNeg(input.recoveryPct ?? 10, "Recovery offer %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const disc = cart * (pct / 100);
      return { ok: true, discount: disc, final: cart - disc, note: "Recovery offer on abandoned cart." };
    }
    case "shop-lifetime-value-discount-calculator": {
      const ltv = pos(input.ltv, "Customer LTV");
      if (typeof ltv !== "number") return { ok: false, error: ltv.error };
      const maxPct = nonNeg(input.maxDiscountPct ?? 20, "Max discount % of LTV");
      if (typeof maxPct !== "number") return { ok: false, error: maxPct.error };
      const offer = ltv * (maxPct / 100);
      return {
        ok: true,
        maxOffer: offer,
        note: "Max promo budget ≈ LTV × max% (teaching CAC/LTV guardrail).",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
