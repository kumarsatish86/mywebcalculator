/** Shop coupons & offers — daily-life estimates. */
import { pos, nonNeg } from "./shopHelpers";

export type ShopCouponSlug =
  | "shop-coupon-stack-calculator"
  | "shop-cashback-equivalent-discount-calculator"
  | "shop-bank-offer-effective-discount-calculator"
  | "shop-wallet-cashback-calculator"
  | "shop-buy-x-get-y-calculator"
  | "shop-minimum-purchase-offer-calculator"
  | "shop-first-order-bonus-calculator";

export type ShopCouponInput = {
  price?: number;
  pct1?: number;
  pct2?: number;
  cashback?: number;
  bankPct?: number;
  cap?: number;
  buyX?: number;
  getY?: number;
  cart?: number;
  minPurchase?: number;
  discountAmt?: number;
  bonusAmt?: number;
};

export type ShopCouponResult =
  | { ok: false; error: string }
  | {
      ok: true;
      final?: number;
      saved?: number;
      effectivePct?: number;
      eligible?: boolean;
      note: string;
    };

export function computeShopCoupon(slug: ShopCouponSlug, input: ShopCouponInput): ShopCouponResult {
  switch (slug) {
    case "shop-coupon-stack-calculator": {
      const price = pos(input.price, "Price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const p1 = nonNeg(input.pct1 ?? 0, "Coupon 1 %");
      if (typeof p1 !== "number") return { ok: false, error: p1.error };
      const p2 = nonNeg(input.pct2 ?? 0, "Coupon 2 %");
      if (typeof p2 !== "number") return { ok: false, error: p2.error };
      const final = price * (1 - p1 / 100) * (1 - p2 / 100);
      return { ok: true, final, saved: price - final, note: "Stacked coupons (multiplicative)." };
    }
    case "shop-cashback-equivalent-discount-calculator":
    case "shop-wallet-cashback-calculator": {
      const price = pos(input.price, "Price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const cb = nonNeg(input.cashback ?? 0, "Cashback");
      if (typeof cb !== "number") return { ok: false, error: cb.error };
      const net = Math.max(0, price - cb);
      return {
        ok: true,
        final: net,
        saved: cb,
        effectivePct: (cb / price) * 100,
        note: "Effective discount ≈ cashback ÷ price.",
      };
    }
    case "shop-bank-offer-effective-discount-calculator": {
      const price = pos(input.price, "Price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const pct = nonNeg(input.bankPct ?? input.pct1 ?? 0, "Bank offer %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      let saved = price * (pct / 100);
      if (input.cap !== undefined && input.cap >= 0) saved = Math.min(saved, input.cap);
      return { ok: true, final: price - saved, saved, effectivePct: (saved / price) * 100, note: "Bank offer with optional cap." };
    }
    case "shop-buy-x-get-y-calculator": {
      const price = pos(input.price, "Unit price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const x = pos(input.buyX ?? 2, "Buy X");
      if (typeof x !== "number") return { ok: false, error: x.error };
      const y = nonNeg(input.getY ?? 1, "Get Y");
      if (typeof y !== "number") return { ok: false, error: y.error };
      const pack = x + y;
      const pay = x * price;
      return {
        ok: true,
        final: pay,
        saved: y * price,
        effectivePct: (y / pack) * 100,
        note: `Pay for ${x}, get ${pack} items.`,
      };
    }
    case "shop-minimum-purchase-offer-calculator": {
      const cart = nonNeg(input.cart ?? 0, "Cart");
      if (typeof cart !== "number") return { ok: false, error: cart.error };
      const min = pos(input.minPurchase, "Minimum");
      if (typeof min !== "number") return { ok: false, error: min.error };
      const disc = nonNeg(input.discountAmt ?? 0, "Discount");
      if (typeof disc !== "number") return { ok: false, error: disc.error };
      const ok = cart >= min;
      return {
        ok: true,
        eligible: ok,
        final: ok ? Math.max(0, cart - disc) : cart,
        saved: ok ? disc : 0,
        note: ok ? "Offer unlocked." : `Need ${min - cart} more.`,
      };
    }
    case "shop-first-order-bonus-calculator": {
      const price = pos(input.price ?? input.cart, "Order");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const bonus = nonNeg(input.bonusAmt ?? input.discountAmt ?? 0, "Bonus");
      if (typeof bonus !== "number") return { ok: false, error: bonus.error };
      return { ok: true, final: Math.max(0, price - bonus), saved: bonus, note: "First-order bonus applied." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
