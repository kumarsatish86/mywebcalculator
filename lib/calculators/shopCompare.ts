/** Shop comparison — daily-life estimates. */
import { pos, nonNeg } from "./shopHelpers";

export type ShopCompareSlug =
  | "shop-unit-price-comparison-calculator"
  | "shop-pack-size-comparison-calculator"
  | "shop-bulk-vs-retail-comparison-calculator"
  | "shop-subscription-vs-one-time-calculator"
  | "shop-cheapest-option-calculator"
  | "shop-value-for-money-calculator"
  | "shop-inflation-adjusted-comparison-calculator";

export type ShopCompareInput = {
  priceA?: number;
  unitsA?: number;
  priceB?: number;
  unitsB?: number;
  subMonthly?: number;
  months?: number;
  oneTime?: number;
  priceC?: number;
  qualityScore?: number;
  oldPrice?: number;
  inflationPct?: number;
  years?: number;
};

export type ShopCompareResult =
  | { ok: false; error: string }
  | {
      ok: true;
      perUnitA?: number;
      perUnitB?: number;
      cheaper?: string;
      totalSub?: number;
      totalOne?: number;
      vfm?: number;
      adjusted?: number;
      note: string;
    };

export function computeShopCompare(slug: ShopCompareSlug, input: ShopCompareInput): ShopCompareResult {
  switch (slug) {
    case "shop-unit-price-comparison-calculator":
    case "shop-pack-size-comparison-calculator":
    case "shop-bulk-vs-retail-comparison-calculator": {
      const pA = pos(input.priceA, "Price A");
      if (typeof pA !== "number") return { ok: false, error: pA.error };
      const uA = pos(input.unitsA, "Units A");
      if (typeof uA !== "number") return { ok: false, error: uA.error };
      const pB = pos(input.priceB, "Price B");
      if (typeof pB !== "number") return { ok: false, error: pB.error };
      const uB = pos(input.unitsB, "Units B");
      if (typeof uB !== "number") return { ok: false, error: uB.error };
      const perA = pA / uA;
      const perB = pB / uB;
      return {
        ok: true,
        perUnitA: perA,
        perUnitB: perB,
        cheaper: perA <= perB ? "A" : "B",
        note: "Lower per-unit wins.",
      };
    }
    case "shop-subscription-vs-one-time-calculator": {
      const sub = pos(input.subMonthly, "Subscription/month");
      if (typeof sub !== "number") return { ok: false, error: sub.error };
      const months = pos(input.months ?? 12, "Months");
      if (typeof months !== "number") return { ok: false, error: months.error };
      const one = pos(input.oneTime, "One-time price");
      if (typeof one !== "number") return { ok: false, error: one.error };
      const totalSub = sub * months;
      return {
        ok: true,
        totalSub,
        totalOne: one,
        cheaper: totalSub <= one ? "subscription" : "one-time",
        note: `${months}-month cash comparison.`,
      };
    }
    case "shop-cheapest-option-calculator": {
      const a = pos(input.priceA, "Option A");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = pos(input.priceB, "Option B");
      if (typeof b !== "number") return { ok: false, error: b.error };
      const c = input.priceC && input.priceC > 0 ? input.priceC : Infinity;
      const min = Math.min(a, b, c);
      const cheaper = min === a ? "A" : min === b ? "B" : "C";
      return { ok: true, cheaper, note: `Cheapest option: ${cheaper}.` };
    }
    case "shop-value-for-money-calculator": {
      const price = pos(input.priceA, "Price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const score = pos(input.qualityScore ?? input.unitsA, "Quality/score");
      if (typeof score !== "number") return { ok: false, error: score.error };
      return { ok: true, vfm: score / price, note: "VFM = score ÷ price (higher better)." };
    }
    case "shop-inflation-adjusted-comparison-calculator": {
      const old = pos(input.oldPrice ?? input.priceA, "Old price");
      if (typeof old !== "number") return { ok: false, error: old.error };
      const infl = nonNeg(input.inflationPct ?? 0, "Inflation %/yr");
      if (typeof infl !== "number") return { ok: false, error: infl.error };
      const years = pos(input.years ?? 1, "Years");
      if (typeof years !== "number") return { ok: false, error: years.error };
      const adjusted = old * Math.pow(1 + infl / 100, years);
      const now = input.priceB;
      return {
        ok: true,
        adjusted,
        cheaper: now !== undefined && now > 0 ? (now <= adjusted ? "B-now" : "A-adjusted") : undefined,
        note: "Inflation-adjusted historical price.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
