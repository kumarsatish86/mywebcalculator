/** Shop tax & billing — daily-life estimates. */
import { pos, nonNeg } from "./shopHelpers";

export type ShopTaxSlug =
  | "shop-sales-tax-calculator"
  | "shop-gst-calculator"
  | "shop-vat-calculator"
  | "shop-tax-inclusive-price-calculator"
  | "shop-tax-exclusive-price-calculator"
  | "shop-reverse-tax-calculator"
  | "shop-multi-rate-tax-calculator"
  | "shop-invoice-total-calculator"
  | "shop-line-item-discount-calculator"
  | "shop-service-charge-calculator"
  | "shop-tip-calculator-bill-split"
  | "shop-rounding-adjustment-calculator";

export type ShopTaxInput = {
  amount?: number;
  taxPct?: number;
  taxPct2?: number;
  amount2?: number;
  discountPct?: number;
  tipPct?: number;
  people?: number;
  servicePct?: number;
  roundTo?: number;
};

export type ShopTaxResult =
  | { ok: false; error: string }
  | {
      ok: true;
      tax?: number;
      total?: number;
      base?: number;
      perPerson?: number;
      note: string;
    };

export function computeShopTax(slug: ShopTaxSlug, input: ShopTaxInput): ShopTaxResult {
  switch (slug) {
    case "shop-sales-tax-calculator":
    case "shop-gst-calculator":
    case "shop-vat-calculator":
    case "shop-tax-exclusive-price-calculator": {
      const base = pos(input.amount, "Amount");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const pct = nonNeg(input.taxPct ?? 0, "Tax %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const tax = base * (pct / 100);
      return { ok: true, base, tax, total: base + tax, note: "Tax on exclusive amount." };
    }
    case "shop-tax-inclusive-price-calculator":
    case "shop-reverse-tax-calculator": {
      const total = pos(input.amount, "Inclusive amount");
      if (typeof total !== "number") return { ok: false, error: total.error };
      const pct = nonNeg(input.taxPct ?? 0, "Tax %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const base = total / (1 + pct / 100);
      return { ok: true, base, tax: total - base, total, note: "Reverse out tax from inclusive price." };
    }
    case "shop-multi-rate-tax-calculator": {
      const a1 = pos(input.amount, "Amount 1");
      if (typeof a1 !== "number") return { ok: false, error: a1.error };
      const p1 = nonNeg(input.taxPct ?? 0, "Rate 1");
      if (typeof p1 !== "number") return { ok: false, error: p1.error };
      const a2 = input.amount2 && input.amount2 > 0 ? input.amount2 : 0;
      const p2 = input.taxPct2 !== undefined && input.taxPct2 >= 0 ? input.taxPct2 : 0;
      const tax = a1 * (p1 / 100) + a2 * (p2 / 100);
      return { ok: true, tax, total: a1 + a2 + tax, note: "Multi-rate line taxes summed." };
    }
    case "shop-invoice-total-calculator": {
      const base = pos(input.amount, "Subtotal");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const taxPct = nonNeg(input.taxPct ?? 0, "Tax %");
      if (typeof taxPct !== "number") return { ok: false, error: taxPct.error };
      const svc = nonNeg(input.servicePct ?? 0, "Service %");
      if (typeof svc !== "number") return { ok: false, error: svc.error };
      const disc = nonNeg(input.discountPct ?? 0, "Discount %");
      if (typeof disc !== "number") return { ok: false, error: disc.error };
      const afterDisc = base * (1 - disc / 100);
      const tax = afterDisc * (taxPct / 100);
      const service = afterDisc * (svc / 100);
      return { ok: true, base: afterDisc, tax, total: afterDisc + tax + service, note: "Invoice = subtotal − disc + tax + service." };
    }
    case "shop-line-item-discount-calculator": {
      const amount = pos(input.amount, "Line amount");
      if (typeof amount !== "number") return { ok: false, error: amount.error };
      const disc = nonNeg(input.discountPct ?? 0, "Discount %");
      if (typeof disc !== "number") return { ok: false, error: disc.error };
      return { ok: true, total: amount * (1 - disc / 100), note: "Line after discount." };
    }
    case "shop-service-charge-calculator": {
      const amount = pos(input.amount, "Bill");
      if (typeof amount !== "number") return { ok: false, error: amount.error };
      const pct = nonNeg(input.servicePct ?? input.taxPct ?? 10, "Service %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const svc = amount * (pct / 100);
      return { ok: true, tax: svc, total: amount + svc, note: "Service charge added to bill." };
    }
    case "shop-tip-calculator-bill-split": {
      const amount = pos(input.amount, "Bill");
      if (typeof amount !== "number") return { ok: false, error: amount.error };
      const tipPct = nonNeg(input.tipPct ?? 10, "Tip %");
      if (typeof tipPct !== "number") return { ok: false, error: tipPct.error };
      const people = pos(input.people ?? 1, "People");
      if (typeof people !== "number") return { ok: false, error: people.error };
      const tip = amount * (tipPct / 100);
      const total = amount + tip;
      return { ok: true, tax: tip, total, perPerson: total / people, note: "Tip + equal split." };
    }
    case "shop-rounding-adjustment-calculator": {
      const amount = pos(input.amount, "Amount");
      if (typeof amount !== "number") return { ok: false, error: amount.error };
      const step = pos(input.roundTo ?? 1, "Round step");
      if (typeof step !== "number") return { ok: false, error: step.error };
      const rounded = Math.round(amount / step) * step;
      return { ok: true, total: rounded, tax: rounded - amount, note: `Rounded to nearest ${step}.` };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
