/** Travel trip planning + vacation — daily-life estimates. */
import { pos, nonNeg } from "./travelHelpers";

export type TravelTripSlug =
  | "travel-trip-budget-calculator"
  | "travel-daily-travel-budget-calculator"
  | "travel-multi-city-cost-estimator"
  | "travel-contingency-fund-calculator"
  | "travel-trip-duration-cost-calculator"
  | "travel-family-vacation-budget-calculator"
  | "travel-cruise-package-comparison-calculator"
  | "travel-peak-vs-off-season-savings-calculator"
  | "travel-holiday-surcharge-estimator";

export type TravelTripInput = {
  lodging?: number;
  food?: number;
  transport?: number;
  activities?: number;
  days?: number;
  people?: number;
  dailyBudget?: number;
  cityA?: number;
  cityB?: number;
  cityC?: number;
  baseBudget?: number;
  contingencyPct?: number;
  cruiseA?: number;
  cruiseB?: number;
  peakPrice?: number;
  offPrice?: number;
  surchargePct?: number;
};

export type TravelTripResult =
  | { ok: false; error: string }
  | {
      ok: true;
      total?: number;
      perDay?: number;
      perPerson?: number;
      buffer?: number;
      cheaper?: string;
      savings?: number;
      note: string;
    };

function sum(...vals: (number | undefined)[]) {
  return vals.reduce<number>((s, v) => s + (v && v > 0 ? v : 0), 0);
}

export function computeTravelTrip(slug: TravelTripSlug, input: TravelTripInput): TravelTripResult {
  switch (slug) {
    case "travel-trip-budget-calculator":
    case "travel-family-vacation-budget-calculator": {
      const total = sum(input.lodging, input.food, input.transport, input.activities);
      if (total <= 0) return { ok: false, error: "Enter at least one cost category." };
      const people = input.people && input.people > 0 ? input.people : 1;
      return { ok: true, total, perPerson: total / people, note: "Trip total from category rollup." };
    }
    case "travel-daily-travel-budget-calculator": {
      const daily = pos(input.dailyBudget ?? input.food, "Daily budget");
      if (typeof daily !== "number") return { ok: false, error: daily.error };
      const days = pos(input.days, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      const people = input.people && input.people > 0 ? input.people : 1;
      return { ok: true, total: daily * days * people, perDay: daily, note: "Total = daily × days × people." };
    }
    case "travel-multi-city-cost-estimator": {
      const total = sum(input.cityA, input.cityB, input.cityC);
      if (total <= 0) return { ok: false, error: "Enter at least one city cost." };
      return { ok: true, total, note: "Multi-city sum of leg budgets." };
    }
    case "travel-contingency-fund-calculator": {
      const base = pos(input.baseBudget ?? input.lodging, "Base budget");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const pct = nonNeg(input.contingencyPct ?? 10, "Contingency %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const buffer = base * (pct / 100);
      return { ok: true, buffer, total: base + buffer, note: "Contingency = base × %." };
    }
    case "travel-trip-duration-cost-calculator": {
      const perDay = pos(input.dailyBudget ?? input.food, "Cost/day");
      if (typeof perDay !== "number") return { ok: false, error: perDay.error };
      const days = pos(input.days, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      return { ok: true, total: perDay * days, perDay, note: "Duration cost = daily × days." };
    }
    case "travel-cruise-package-comparison-calculator": {
      const a = pos(input.cruiseA, "Package A");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = pos(input.cruiseB, "Package B");
      if (typeof b !== "number") return { ok: false, error: b.error };
      return { ok: true, cheaper: a <= b ? "A" : "B", total: Math.min(a, b), note: "Lower cruise package wins." };
    }
    case "travel-peak-vs-off-season-savings-calculator": {
      const peak = pos(input.peakPrice, "Peak price");
      if (typeof peak !== "number") return { ok: false, error: peak.error };
      const off = pos(input.offPrice, "Off-season price");
      if (typeof off !== "number") return { ok: false, error: off.error };
      return { ok: true, savings: peak - off, note: "Savings = peak − off-season." };
    }
    case "travel-holiday-surcharge-estimator": {
      const base = pos(input.baseBudget ?? input.lodging, "Base");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const pct = nonNeg(input.surchargePct ?? 15, "Surcharge %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      const extra = base * (pct / 100);
      return { ok: true, buffer: extra, total: base + extra, note: "Holiday surcharge added." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
