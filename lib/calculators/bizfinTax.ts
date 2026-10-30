/** Business finance — tax & compliance teaching estimates. */
import { pos, nonNeg } from "./bizfinHelpers";

export type BizfinTaxSlug =
  | "bizfin-corporate-tax-calculator"
  | "bizfin-gst-calculator-india"
  | "bizfin-vat-calculator"
  | "bizfin-sales-tax-calculator"
  | "bizfin-taxable-income-calculator"
  | "bizfin-depreciation-calculator"
  | "bizfin-straight-line-depreciation-calculator"
  | "bizfin-declining-balance-depreciation-calculator";
export const BIZFIN_TAX_SLUGS: BizfinTaxSlug[] = [
  "bizfin-corporate-tax-calculator",
  "bizfin-gst-calculator-india",
  "bizfin-vat-calculator",
  "bizfin-sales-tax-calculator",
  "bizfin-taxable-income-calculator",
  "bizfin-depreciation-calculator",
  "bizfin-straight-line-depreciation-calculator",
  "bizfin-declining-balance-depreciation-calculator",
];


export type BizfinTaxInput = {
  income?: number;
  taxRatePct?: number;
  amount?: number;
  gstPct?: number;
  inclusive?: number;
  deductions?: number;
  cost?: number;
  salvage?: number;
  lifeYears?: number;
  bookValue?: number;
  dbRatePct?: number;
};

export type BizfinTaxResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinTax(slug: BizfinTaxSlug, input: BizfinTaxInput): BizfinTaxResult {
  switch (slug) {
    case "bizfin-corporate-tax-calculator": {
      const income = pos(input.income ?? input.amount, "Taxable income");
      if (typeof income !== "number") return { ok: false, error: income.error };
      const rate = nonNeg(input.taxRatePct ?? 25, "Tax rate %");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const tax = income * (rate / 100);
      return { ok: true, value: tax, secondary: income - tax, note: "Corporate tax = income × rate%." };
    }
    case "bizfin-gst-calculator-india":
    case "bizfin-vat-calculator":
    case "bizfin-sales-tax-calculator": {
      const rate = nonNeg(input.gstPct ?? input.taxRatePct ?? 18, "Tax %");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      if (input.inclusive === 1 || (input.amount !== undefined && input.inclusive)) {
        const gross = pos(input.amount, "Tax-inclusive amount");
        if (typeof gross !== "number") return { ok: false, error: gross.error };
        const net = gross / (1 + rate / 100);
        const tax = gross - net;
        return { ok: true, value: tax, secondary: net, tertiary: gross, note: "Extracts tax from inclusive price." };
      }
      const net = pos(input.amount ?? input.income, "Net / exclusive amount");
      if (typeof net !== "number") return { ok: false, error: net.error };
      const tax = net * (rate / 100);
      return { ok: true, value: tax, secondary: net + tax, note: "Tax = net × rate%; total = net + tax." };
    }
    case "bizfin-taxable-income-calculator": {
      const income = pos(input.income ?? input.amount, "Gross income");
      if (typeof income !== "number") return { ok: false, error: income.error };
      const ded = nonNeg(input.deductions ?? 0, "Deductions");
      if (typeof ded !== "number") return { ok: false, error: ded.error };
      return { ok: true, value: Math.max(0, income - ded), note: "Taxable income = income − deductions." };
    }
    case "bizfin-depreciation-calculator":
    case "bizfin-straight-line-depreciation-calculator": {
      const cost = pos(input.cost ?? input.bookValue, "Asset cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const salvage = nonNeg(input.salvage ?? 0, "Salvage");
      if (typeof salvage !== "number") return { ok: false, error: salvage.error };
      const life = pos(input.lifeYears, "Useful life (years)");
      if (typeof life !== "number") return { ok: false, error: life.error };
      if (cost < salvage) return { ok: false, error: "Cost must be ≥ salvage." };
      const annual = (cost - salvage) / life;
      return { ok: true, value: annual, secondary: cost - salvage, note: "Straight-line = (cost − salvage) ÷ life." };
    }
    case "bizfin-declining-balance-depreciation-calculator": {
      const book = pos(input.bookValue ?? input.cost, "Book value");
      if (typeof book !== "number") return { ok: false, error: book.error };
      const rate = pos(input.dbRatePct ?? input.taxRatePct, "Declining-balance rate %");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const dep = book * (rate / 100);
      return { ok: true, value: dep, secondary: book - dep, note: "DB depreciation = book × rate%." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
