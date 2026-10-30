/** Home utility bonus / high-intent — daily-life estimates. */

export type HomeBonusSlug =
  | "home-electricity-bill-split-roommates-calculator"
  | "home-cost-per-appliance-usage-calculator"
  | "home-peak-hour-electricity-cost-calculator"
  | "home-daily-vs-monthly-utility-analyzer"
  | "home-utility-comparison-city-wise-calculator"
  | "home-rent-plus-utility-combined-calculator";

export type HomeBonusInput = {
  bill?: number;
  roommates?: number;
  watts?: number;
  hours?: number;
  ratePerKwh?: number;
  peakKwh?: number;
  peakRate?: number;
  offKwh?: number;
  offRate?: number;
  dailyCost?: number;
  cityA?: number;
  cityB?: number;
  rent?: number;
  utilities?: number;
};

export type HomeBonusResult =
  | { ok: false; error: string }
  | {
      ok: true;
      perPerson?: number;
      cost?: number;
      monthly?: number;
      cheaperCity?: string;
      total?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeHomeBonus(slug: HomeBonusSlug, input: HomeBonusInput): HomeBonusResult {
  switch (slug) {
    case "home-electricity-bill-split-roommates-calculator": {
      const bill = p(input.bill, "Bill");
      if (typeof bill !== "number") return { ok: false, error: bill.error };
      const n = p(input.roommates ?? 2, "Roommates");
      if (typeof n !== "number") return { ok: false, error: n.error };
      return { ok: true, perPerson: bill / n, total: bill, note: "Equal roommate split." };
    }
    case "home-cost-per-appliance-usage-calculator": {
      const w = p(input.watts, "Watts");
      if (typeof w !== "number") return { ok: false, error: w.error };
      const h = p(input.hours, "Hours");
      if (typeof h !== "number") return { ok: false, error: h.error };
      const rate = p(input.ratePerKwh, "Rate/kWh");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, cost: (w * h * rate) / 1000, note: "Cost = W×h×rate ÷ 1000." };
    }
    case "home-peak-hour-electricity-cost-calculator": {
      const pk = p(input.peakKwh, "Peak kWh");
      if (typeof pk !== "number") return { ok: false, error: pk.error };
      const pr = p(input.peakRate, "Peak rate");
      if (typeof pr !== "number") return { ok: false, error: pr.error };
      const okWh = input.offKwh && input.offKwh > 0 ? input.offKwh : 0;
      const or = input.offRate && input.offRate > 0 ? input.offRate : 0;
      return { ok: true, cost: pk * pr + okWh * or, note: "TOU cost = peak×rate + off-peak×rate." };
    }
    case "home-daily-vs-monthly-utility-analyzer": {
      const daily = p(input.dailyCost, "Daily cost");
      if (typeof daily !== "number") return { ok: false, error: daily.error };
      return { ok: true, monthly: daily * 30, cost: daily * 365, note: "Monthly ≈ daily×30; annual ≈ daily×365." };
    }
    case "home-utility-comparison-city-wise-calculator": {
      const a = p(input.cityA, "City A bill");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = p(input.cityB, "City B bill");
      if (typeof b !== "number") return { ok: false, error: b.error };
      return {
        ok: true,
        cheaperCity: a <= b ? "A" : "B",
        cost: Math.abs(a - b),
        note: `City ${a <= b ? "A" : "B"} lower by ${Math.abs(a - b).toFixed(2)}.`,
      };
    }
    case "home-rent-plus-utility-combined-calculator": {
      const rent = p(input.rent, "Rent");
      if (typeof rent !== "number") return { ok: false, error: rent.error };
      const util = input.utilities && input.utilities >= 0 ? input.utilities : 0;
      return { ok: true, total: rent + util, note: "Housing cash = rent + utilities." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
