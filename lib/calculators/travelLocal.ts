/** Travel luggage + public transit + taxi — daily-life estimates. */
import { pos, nonNeg } from "./travelHelpers";

export type TravelLocalSlug =
  | "travel-luggage-weight-allowance-calculator"
  | "travel-linear-inches-bag-calculator"
  | "travel-carry-on-compliance-estimator"
  | "travel-packing-list-cost-estimator"
  | "travel-transit-pass-vs-pay-per-ride-calculator"
  | "travel-monthly-commute-cost-calculator"
  | "travel-zone-fare-estimator"
  | "travel-multi-day-transit-card-calculator"
  | "travel-taxi-fare-estimator"
  | "travel-rideshare-cost-comparison-calculator"
  | "travel-surge-pricing-impact-calculator"
  | "travel-airport-transfer-cost-calculator";

export type TravelLocalInput = {
  weightKg?: number;
  limitKg?: number;
  lengthIn?: number;
  widthIn?: number;
  heightIn?: number;
  maxLinear?: number;
  itemCost?: number;
  items?: number;
  passCost?: number;
  rides?: number;
  rideFare?: number;
  days?: number;
  zones?: number;
  farePerZone?: number;
  baseFare?: number;
  perKm?: number;
  distanceKm?: number;
  tipPct?: number;
  optionA?: number;
  optionB?: number;
  surgeMult?: number;
};

export type TravelLocalResult =
  | { ok: false; error: string }
  | {
      ok: true;
      overBy?: number;
      linear?: number;
      compliant?: boolean;
      total?: number;
      cheaper?: string;
      note: string;
    };

export function computeTravelLocal(slug: TravelLocalSlug, input: TravelLocalInput): TravelLocalResult {
  switch (slug) {
    case "travel-luggage-weight-allowance-calculator": {
      const w = pos(input.weightKg, "Bag weight");
      if (typeof w !== "number") return { ok: false, error: w.error };
      const lim = pos(input.limitKg, "Allowance");
      if (typeof lim !== "number") return { ok: false, error: lim.error };
      return {
        ok: true,
        overBy: Math.max(0, w - lim),
        compliant: w <= lim,
        note: w <= lim ? "Within allowance." : `Over by ${w - lim} kg.`,
      };
    }
    case "travel-linear-inches-bag-calculator":
    case "travel-carry-on-compliance-estimator": {
      const L = pos(input.lengthIn, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = pos(input.widthIn, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const H = pos(input.heightIn, "Height");
      if (typeof H !== "number") return { ok: false, error: H.error };
      const linear = L + W + H;
      const max = input.maxLinear && input.maxLinear > 0 ? input.maxLinear : 45;
      return {
        ok: true,
        linear,
        compliant: linear <= max,
        overBy: Math.max(0, linear - max),
        note: `Linear = L+W+H (${linear}); limit ${max}.`,
      };
    }
    case "travel-packing-list-cost-estimator": {
      const cost = pos(input.itemCost, "Avg item cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const n = pos(input.items, "Items");
      if (typeof n !== "number") return { ok: false, error: n.error };
      return { ok: true, total: cost * n, note: "Packing spend = items × avg cost." };
    }
    case "travel-transit-pass-vs-pay-per-ride-calculator": {
      const pass = pos(input.passCost, "Pass cost");
      if (typeof pass !== "number") return { ok: false, error: pass.error };
      const rides = pos(input.rides, "Rides");
      if (typeof rides !== "number") return { ok: false, error: rides.error };
      const fare = pos(input.rideFare, "Fare/ride");
      if (typeof fare !== "number") return { ok: false, error: fare.error };
      const payg = rides * fare;
      return {
        ok: true,
        total: Math.min(pass, payg),
        cheaper: pass <= payg ? "pass" : "pay-per-ride",
        note: `Pass ${pass} vs pay-as-you-go ${payg}.`,
      };
    }
    case "travel-monthly-commute-cost-calculator": {
      const rides = pos(input.rides ?? 40, "Rides/month");
      if (typeof rides !== "number") return { ok: false, error: rides.error };
      const fare = pos(input.rideFare, "Fare");
      if (typeof fare !== "number") return { ok: false, error: fare.error };
      return { ok: true, total: rides * fare, note: "Monthly commute = rides × fare." };
    }
    case "travel-zone-fare-estimator": {
      const zones = pos(input.zones, "Zones");
      if (typeof zones !== "number") return { ok: false, error: zones.error };
      const per = pos(input.farePerZone ?? input.rideFare, "Fare/zone");
      if (typeof per !== "number") return { ok: false, error: per.error };
      return { ok: true, total: zones * per, note: "Zone fare = zones × rate." };
    }
    case "travel-multi-day-transit-card-calculator": {
      const pass = pos(input.passCost, "Card cost");
      if (typeof pass !== "number") return { ok: false, error: pass.error };
      const days = pos(input.days, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      return { ok: true, total: pass, note: `Per day ≈ ${(pass / days).toFixed(2)}.` };
    }
    case "travel-taxi-fare-estimator":
    case "travel-airport-transfer-cost-calculator": {
      const base = nonNeg(input.baseFare ?? 0, "Base fare");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const perKm = pos(input.perKm ?? input.rideFare, "Per km");
      if (typeof perKm !== "number") return { ok: false, error: perKm.error };
      const dist = pos(input.distanceKm, "Distance");
      if (typeof dist !== "number") return { ok: false, error: dist.error };
      const tipPct = nonNeg(input.tipPct ?? 0, "Tip %");
      if (typeof tipPct !== "number") return { ok: false, error: tipPct.error };
      const sub = base + perKm * dist;
      return { ok: true, total: sub * (1 + tipPct / 100), note: "Fare = base + km×rate (+ tip)." };
    }
    case "travel-rideshare-cost-comparison-calculator": {
      const a = pos(input.optionA, "Option A");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = pos(input.optionB, "Option B");
      if (typeof b !== "number") return { ok: false, error: b.error };
      return { ok: true, cheaper: a <= b ? "A" : "B", total: Math.min(a, b), note: "Cheaper rideshare option." };
    }
    case "travel-surge-pricing-impact-calculator": {
      const base = pos(input.baseFare ?? input.optionA, "Base fare");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const mult = pos(input.surgeMult ?? 1.5, "Surge multiplier");
      if (typeof mult !== "number") return { ok: false, error: mult.error };
      return { ok: true, total: base * mult, note: `Surged fare = base × ${mult}.` };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
