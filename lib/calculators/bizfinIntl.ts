/** Business finance — international business teaching estimates. */
import { pos, nonNeg, finite } from "./bizfinHelpers";

export type BizfinIntlSlug =
  | "bizfin-currency-exchange-calculator"
  | "bizfin-import-duty-calculator"
  | "bizfin-export-profit-calculator"
  | "bizfin-inflation-calculator"
  | "bizfin-purchasing-power-calculator";
export const BIZFIN_INTL_SLUGS: BizfinIntlSlug[] = [
  "bizfin-currency-exchange-calculator",
  "bizfin-import-duty-calculator",
  "bizfin-export-profit-calculator",
  "bizfin-inflation-calculator",
  "bizfin-purchasing-power-calculator",
];


export type BizfinIntlInput = {
  amount?: number;
  rate?: number;
  cifValue?: number;
  dutyPct?: number;
  otherFees?: number;
  exportRevenue?: number;
  exportCost?: number;
  duties?: number;
  present?: number;
  inflationPct?: number;
  years?: number;
};

export type BizfinIntlResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinIntl(slug: BizfinIntlSlug, input: BizfinIntlInput): BizfinIntlResult {
  switch (slug) {
    case "bizfin-currency-exchange-calculator": {
      const amount = pos(input.amount ?? input.present, "Amount");
      if (typeof amount !== "number") return { ok: false, error: amount.error };
      const rate = pos(input.rate, "FX rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, value: amount * rate, note: "Converted = amount × FX rate." };
    }
    case "bizfin-import-duty-calculator": {
      const cif = pos(input.cifValue ?? input.amount, "CIF / import value");
      if (typeof cif !== "number") return { ok: false, error: cif.error };
      const dutyPct = nonNeg(input.dutyPct ?? 0, "Duty %");
      if (typeof dutyPct !== "number") return { ok: false, error: dutyPct.error };
      const fees = nonNeg(input.otherFees ?? 0, "Other fees");
      if (typeof fees !== "number") return { ok: false, error: fees.error };
      const duty = cif * (dutyPct / 100);
      return { ok: true, value: duty + fees, secondary: cif + duty + fees, note: "Duty = CIF × duty%; landed ≈ CIF + duty + fees." };
    }
    case "bizfin-export-profit-calculator": {
      const rev = pos(input.exportRevenue ?? input.amount, "Export revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      const cost = nonNeg(input.exportCost ?? 0, "Export cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const duties = nonNeg(input.duties ?? 0, "Duties / fees");
      if (typeof duties !== "number") return { ok: false, error: duties.error };
      return { ok: true, value: rev - cost - duties, note: "Export profit = revenue − cost − duties/fees." };
    }
    case "bizfin-inflation-calculator": {
      const present = pos(input.present ?? input.amount, "Present amount");
      if (typeof present !== "number") return { ok: false, error: present.error };
      const inf = finite(input.inflationPct ?? 0, "Inflation %");
      if (typeof inf !== "number") return { ok: false, error: inf.error };
      const years = pos(input.years ?? 1, "Years");
      if (typeof years !== "number") return { ok: false, error: years.error };
      return { ok: true, value: present * Math.pow(1 + inf / 100, years), note: "Future ≈ present × (1 + inflation)^years." };
    }
    case "bizfin-purchasing-power-calculator": {
      const present = pos(input.present ?? input.amount, "Present amount");
      if (typeof present !== "number") return { ok: false, error: present.error };
      const inf = finite(input.inflationPct ?? 0, "Inflation %");
      if (typeof inf !== "number") return { ok: false, error: inf.error };
      const years = pos(input.years ?? 1, "Years");
      if (typeof years !== "number") return { ok: false, error: years.error };
      const real = present / Math.pow(1 + inf / 100, years);
      return { ok: true, value: real, pct: (real / present) * 100, note: "Real purchasing power ≈ present ÷ (1+i)^n." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
