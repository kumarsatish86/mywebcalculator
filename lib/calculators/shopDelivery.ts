/** Shop delivery & logistics — daily-life estimates. */
import { pos, nonNeg } from "./shopHelpers";

export type ShopDeliverySlug =
  | "shop-shipping-cost-estimator"
  | "shop-dimensional-weight-calculator"
  | "shop-cod-extra-fee-calculator"
  | "shop-free-shipping-cart-threshold-calculator"
  | "shop-split-shipment-cost-calculator";

export type ShopDeliveryInput = {
  weightKg?: number;
  ratePerKg?: number;
  baseFee?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  dimDivisor?: number;
  orderAmount?: number;
  codPct?: number;
  codFixed?: number;
  cart?: number;
  threshold?: number;
  shipA?: number;
  shipB?: number;
};

export type ShopDeliveryResult =
  | { ok: false; error: string }
  | {
      ok: true;
      cost?: number;
      dimWeightKg?: number;
      billableKg?: number;
      gap?: number;
      note: string;
    };

export function computeShopDelivery(slug: ShopDeliverySlug, input: ShopDeliveryInput): ShopDeliveryResult {
  switch (slug) {
    case "shop-shipping-cost-estimator": {
      const w = pos(input.weightKg, "Weight kg");
      if (typeof w !== "number") return { ok: false, error: w.error };
      const rate = pos(input.ratePerKg, "Rate/kg");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const base = input.baseFee && input.baseFee > 0 ? input.baseFee : 0;
      return { ok: true, cost: base + w * rate, note: "Shipping ≈ base + weight×rate." };
    }
    case "shop-dimensional-weight-calculator": {
      const L = pos(input.lengthCm, "Length cm");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = pos(input.widthCm, "Width cm");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const H = pos(input.heightCm, "Height cm");
      if (typeof H !== "number") return { ok: false, error: H.error };
      const div = pos(input.dimDivisor ?? 5000, "Divisor");
      if (typeof div !== "number") return { ok: false, error: div.error };
      const dim = (L * W * H) / div;
      const actual = input.weightKg && input.weightKg > 0 ? input.weightKg : dim;
      return {
        ok: true,
        dimWeightKg: dim,
        billableKg: Math.max(dim, actual),
        note: "Billable = max(actual, dimensional).",
      };
    }
    case "shop-cod-extra-fee-calculator": {
      const order = pos(input.orderAmount, "Order amount");
      if (typeof order !== "number") return { ok: false, error: order.error };
      const pct = nonNeg(input.codPct ?? 0, "COD %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const fixed = input.codFixed ?? 0;
      return { ok: true, cost: order * (pct / 100) + fixed, note: "COD fee = % of order + fixed." };
    }
    case "shop-free-shipping-cart-threshold-calculator": {
      const cart = nonNeg(input.cart ?? 0, "Cart");
      if (typeof cart !== "number") return { ok: false, error: cart.error };
      const thresh = pos(input.threshold, "Threshold");
      if (typeof thresh !== "number") return { ok: false, error: thresh.error };
      return {
        ok: true,
        gap: Math.max(0, thresh - cart),
        note: cart >= thresh ? "Free shipping unlocked." : `Add ${thresh - cart} more.`,
      };
    }
    case "shop-split-shipment-cost-calculator": {
      const a = pos(input.shipA, "Shipment A");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = pos(input.shipB, "Shipment B");
      if (typeof b !== "number") return { ok: false, error: b.error };
      return { ok: true, cost: a + b, note: "Split shipment total = A + B." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
