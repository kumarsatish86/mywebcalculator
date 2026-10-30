/** Shop currency & global — daily-life estimates. */
import { pos, nonNeg } from "./shopHelpers";

export type ShopCurrencySlug =
  | "shop-currency-converter-purchase-calculator"
  | "shop-import-duty-estimator"
  | "shop-landed-cost-calculator"
  | "shop-tax-refund-tourist-calculator"
  | "shop-international-shipping-total-calculator";

export type ShopCurrencyInput = {
  amount?: number;
  rate?: number;
  dutyPct?: number;
  taxPct?: number;
  shipping?: number;
  fees?: number;
  refundPct?: number;
};

export type ShopCurrencyResult =
  | { ok: false; error: string }
  | {
      ok: true;
      converted?: number;
      duty?: number;
      tax?: number;
      landed?: number;
      refund?: number;
      total?: number;
      note: string;
    };

export function computeShopCurrency(slug: ShopCurrencySlug, input: ShopCurrencyInput): ShopCurrencyResult {
  switch (slug) {
    case "shop-currency-converter-purchase-calculator": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate, "FX rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, converted: amt * rate, note: "Converted = amount × FX rate." };
    }
    case "shop-import-duty-estimator": {
      const amt = pos(input.amount, "Customs value");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const pct = nonNeg(input.dutyPct ?? 0, "Duty %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      return { ok: true, duty: amt * (pct / 100), note: "Duty ≈ value × duty%." };
    }
    case "shop-landed-cost-calculator": {
      const amt = pos(input.amount, "Product");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const dutyPct = nonNeg(input.dutyPct ?? 0, "Duty %");
      if (typeof dutyPct !== "number") return { ok: false, error: dutyPct.error };
      const taxPct = nonNeg(input.taxPct ?? 0, "Tax %");
      if (typeof taxPct !== "number") return { ok: false, error: taxPct.error };
      const ship = input.shipping ?? 0;
      const fees = input.fees ?? 0;
      const duty = amt * (dutyPct / 100);
      const taxable = amt + duty;
      const tax = taxable * (taxPct / 100);
      const landed = amt + duty + tax + ship + fees;
      return { ok: true, duty, tax, landed, note: "Landed = product + duty + tax + shipping + fees." };
    }
    case "shop-tax-refund-tourist-calculator": {
      const amt = pos(input.amount, "Purchase");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const pct = nonNeg(input.refundPct ?? input.taxPct ?? 0, "Refundable tax %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      // Assume inclusive: refund ≈ amount × pct/(100+pct) or simple amount*pct if exclusive teaching
      const refund = amt * (pct / (100 + pct));
      return { ok: true, refund, note: "Tourist VAT refund estimate (inclusive teaching form)." };
    }
    case "shop-international-shipping-total-calculator": {
      const amt = pos(input.amount, "Product");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const ship = pos(input.shipping, "Shipping");
      if (typeof ship !== "number") return { ok: false, error: ship.error };
      const fees = input.fees ?? 0;
      const dutyPct = input.dutyPct ?? 0;
      const duty = amt * (dutyPct / 100);
      return { ok: true, total: amt + ship + fees + duty, duty, note: "Intl total = product + ship + fees + duty." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
