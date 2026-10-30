/** Shop e-commerce seller — daily-life estimates. */
import { pos, nonNeg } from "./shopHelpers";

export type ShopSellerSlug =
  | "shop-marketplace-commission-calculator"
  | "shop-platform-fee-calculator"
  | "shop-payment-gateway-fee-calculator"
  | "shop-seller-payout-calculator"
  | "shop-net-revenue-calculator"
  | "shop-free-shipping-threshold-calculator"
  | "shop-shipping-included-price-calculator"
  | "shop-return-rate-impact-calculator"
  | "shop-cogs-calculator"
  | "shop-inventory-turnover-calculator";

export type ShopSellerInput = {
  sale?: number;
  commissionPct?: number;
  fixedFee?: number;
  gatewayPct?: number;
  shipping?: number;
  cart?: number;
  threshold?: number;
  returnPct?: number;
  units?: number;
  unitCost?: number;
  cogs?: number;
  avgInventory?: number;
};

export type ShopSellerResult =
  | { ok: false; error: string }
  | {
      ok: true;
      fee?: number;
      payout?: number;
      net?: number;
      price?: number;
      gap?: number;
      turnover?: number;
      note: string;
    };

export function computeShopSeller(slug: ShopSellerSlug, input: ShopSellerInput): ShopSellerResult {
  switch (slug) {
    case "shop-marketplace-commission-calculator":
    case "shop-platform-fee-calculator": {
      const sale = pos(input.sale, "Sale amount");
      if (typeof sale !== "number") return { ok: false, error: sale.error };
      const pct = nonNeg(input.commissionPct ?? 0, "Fee %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const fixed = input.fixedFee && input.fixedFee > 0 ? input.fixedFee : 0;
      const fee = sale * (pct / 100) + fixed;
      return { ok: true, fee, payout: sale - fee, note: "Fee = % of sale + fixed." };
    }
    case "shop-payment-gateway-fee-calculator": {
      const sale = pos(input.sale, "Transaction");
      if (typeof sale !== "number") return { ok: false, error: sale.error };
      const pct = nonNeg(input.gatewayPct ?? input.commissionPct ?? 2, "Gateway %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const fixed = input.fixedFee ?? 0;
      return { ok: true, fee: sale * (pct / 100) + fixed, note: "Gateway fee = % + fixed." };
    }
    case "shop-seller-payout-calculator":
    case "shop-net-revenue-calculator": {
      const sale = pos(input.sale, "Gross sale");
      if (typeof sale !== "number") return { ok: false, error: sale.error };
      const comm = nonNeg(input.commissionPct ?? 0, "Commission %");
      if (typeof comm !== "number") return { ok: false, error: comm.error };
      const gw = nonNeg(input.gatewayPct ?? 0, "Gateway %");
      if (typeof gw !== "number") return { ok: false, error: gw.error };
      const ship = input.shipping && input.shipping > 0 ? input.shipping : 0;
      const fixed = input.fixedFee ?? 0;
      const fees = sale * ((comm + gw) / 100) + fixed + ship;
      return { ok: true, fee: fees, payout: sale - fees, net: sale - fees, note: "Net = sale − fees − shipping." };
    }
    case "shop-free-shipping-threshold-calculator": {
      const cart = nonNeg(input.cart ?? 0, "Cart");
      if (typeof cart !== "number") return { ok: false, error: cart.error };
      const thresh = pos(input.threshold, "Threshold");
      if (typeof thresh !== "number") return { ok: false, error: thresh.error };
      return {
        ok: true,
        gap: Math.max(0, thresh - cart),
        note: cart >= thresh ? "Free shipping unlocked." : `Need ${thresh - cart} more.`,
      };
    }
    case "shop-shipping-included-price-calculator": {
      const sale = pos(input.sale, "Product price");
      if (typeof sale !== "number") return { ok: false, error: sale.error };
      const ship = pos(input.shipping, "Shipping cost");
      if (typeof ship !== "number") return { ok: false, error: ship.error };
      return { ok: true, price: sale + ship, note: "All-in price = product + shipping." };
    }
    case "shop-return-rate-impact-calculator": {
      const sale = pos(input.sale, "Gross sales");
      if (typeof sale !== "number") return { ok: false, error: sale.error };
      const ret = nonNeg(input.returnPct ?? 0, "Return %");
      if (typeof ret !== "number") return { ok: false, error: ret.error };
      const lost = sale * (ret / 100);
      return { ok: true, fee: lost, net: sale - lost, note: "Return impact ≈ sales × return%." };
    }
    case "shop-cogs-calculator": {
      const units = pos(input.units, "Units");
      if (typeof units !== "number") return { ok: false, error: units.error };
      const cost = pos(input.unitCost, "Unit cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      return { ok: true, net: units * cost, note: "COGS = units × unit cost." };
    }
    case "shop-inventory-turnover-calculator": {
      const cogs = pos(input.cogs ?? input.sale, "COGS");
      if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const inv = pos(input.avgInventory, "Avg inventory");
      if (typeof inv !== "number") return { ok: false, error: inv.error };
      return { ok: true, turnover: cogs / inv, note: "Turnover = COGS ÷ average inventory." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
