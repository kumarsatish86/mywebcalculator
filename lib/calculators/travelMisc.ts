/** Travel time/distance + insurance + eco + group/business/ai/compare — daily-life estimates. */
import { pos, nonNeg } from "./travelHelpers";

export type TravelMiscSlug =
  | "travel-drive-time-calculator"
  | "travel-time-zone-difference-calculator"
  | "travel-jet-lag-adjustment-estimator"
  | "travel-average-speed-trip-calculator"
  | "travel-insurance-premium-estimator"
  | "travel-cancellation-cover-value-calculator"
  | "travel-medical-cover-comparison-calculator"
  | "travel-gear-cover-calculator"
  | "travel-trip-carbon-footprint-estimator"
  | "travel-carbon-offset-cost-calculator"
  | "travel-train-vs-fly-emissions-calculator"
  | "travel-eco-hotel-premium-calculator"
  | "travel-group-expense-split-calculator"
  | "travel-shared-accommodation-per-person-calculator"
  | "travel-pooled-fuel-split-calculator"
  | "travel-tour-package-per-head-calculator"
  | "travel-business-per-diem-calculator"
  | "travel-reimbursable-mileage-calculator"
  | "travel-blended-business-leisure-cost-calculator"
  | "travel-client-billable-travel-calculator"
  | "travel-ai-itinerary-budget-envelope-calculator"
  | "travel-ai-scenario-cost-tweak-calculator"
  | "travel-ai-alternative-destination-cost-calculator"
  | "travel-package-quote-comparison-calculator"
  | "travel-insurance-quote-comparison-calculator"
  | "travel-transport-bundle-comparison-calculator"
  | "travel-ota-vs-direct-booking-calculator";

export type TravelMiscInput = {
  distanceKm?: number;
  speedKmh?: number;
  hours?: number;
  tzFrom?: number;
  tzTo?: number;
  zonesCrossed?: number;
  tripCost?: number;
  premiumPct?: number;
  premium?: number;
  claimValue?: number;
  coverA?: number;
  coverB?: number;
  gearValue?: number;
  coverPct?: number;
  kgCo2PerKm?: number;
  offsetPricePerTon?: number;
  flyKg?: number;
  trainKg?: number;
  hotelStd?: number;
  hotelEco?: number;
  expense?: number;
  people?: number;
  lodging?: number;
  fuel?: number;
  packageTotal?: number;
  perDiem?: number;
  days?: number;
  miles?: number;
  ratePerMile?: number;
  businessSharePct?: number;
  markupPct?: number;
  baseBudget?: number;
  tweakPct?: number;
  destA?: number;
  destB?: number;
  quoteA?: number;
  quoteB?: number;
  ota?: number;
  direct?: number;
};

export type TravelMiscResult =
  | { ok: false; error: string }
  | {
      ok: true;
      hours?: number;
      tzDiff?: number;
      jetLagDays?: number;
      speed?: number;
      total?: number;
      value?: number;
      kgCo2?: number;
      cheaper?: string;
      perPerson?: number;
      note: string;
    };

export function computeTravelMisc(slug: TravelMiscSlug, input: TravelMiscInput): TravelMiscResult {
  switch (slug) {
    case "travel-drive-time-calculator": {
      const dist = pos(input.distanceKm, "Distance");
      if (typeof dist !== "number") return { ok: false, error: dist.error };
      const spd = pos(input.speedKmh, "Speed km/h");
      if (typeof spd !== "number") return { ok: false, error: spd.error };
      return { ok: true, hours: dist / spd, note: "Time = distance ÷ speed." };
    }
    case "travel-time-zone-difference-calculator": {
      const a = input.tzFrom;
      const b = input.tzTo;
      if (a === undefined || !Number.isFinite(a) || b === undefined || !Number.isFinite(b)) {
        return { ok: false, error: "Enter both UTC offsets." };
      }
      return { ok: true, tzDiff: b - a, note: "TZ difference = dest offset − origin offset." };
    }
    case "travel-jet-lag-adjustment-estimator": {
      const zones = pos(input.zonesCrossed ?? Math.abs((input.tzTo ?? 0) - (input.tzFrom ?? 0)), "Zones crossed");
      if (typeof zones !== "number") return { ok: false, error: zones.error };
      return { ok: true, jetLagDays: zones / 1.5, note: "Rough recovery days ≈ zones ÷ 1.5." };
    }
    case "travel-average-speed-trip-calculator": {
      const dist = pos(input.distanceKm, "Distance");
      if (typeof dist !== "number") return { ok: false, error: dist.error };
      const hrs = pos(input.hours, "Hours");
      if (typeof hrs !== "number") return { ok: false, error: hrs.error };
      return { ok: true, speed: dist / hrs, note: "Avg speed = distance ÷ time." };
    }
    case "travel-insurance-premium-estimator": {
      const trip = pos(input.tripCost, "Trip cost");
      if (typeof trip !== "number") return { ok: false, error: trip.error };
      const pct = nonNeg(input.premiumPct ?? 5, "Premium %");
      if (typeof pct !== "number") return { ok: false, error: pct.error };
      return { ok: true, total: trip * (pct / 100), note: "Premium ≈ trip × %." };
    }
    case "travel-cancellation-cover-value-calculator":
    case "travel-gear-cover-calculator": {
      const value = pos(input.claimValue ?? input.gearValue, "Covered value");
      if (typeof value !== "number") return { ok: false, error: value.error };
      const prem = nonNeg(input.premium ?? 0, "Premium");
      if (typeof prem !== "number") return { ok: false, error: prem.error };
      const pct = input.coverPct !== undefined ? input.coverPct / 100 : 1;
      return { ok: true, value: value * pct - prem, total: prem, note: "Net cover value − premium." };
    }
    case "travel-medical-cover-comparison-calculator": {
      const a = pos(input.coverA, "Cover A");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = pos(input.coverB, "Cover B");
      if (typeof b !== "number") return { ok: false, error: b.error };
      return { ok: true, cheaper: a >= b ? "A" : "B", value: Math.max(a, b), note: "Higher medical limit wins (teaching)." };
    }
    case "travel-trip-carbon-footprint-estimator": {
      const dist = pos(input.distanceKm, "Distance");
      if (typeof dist !== "number") return { ok: false, error: dist.error };
      const f = input.kgCo2PerKm && input.kgCo2PerKm > 0 ? input.kgCo2PerKm : 0.12;
      return { ok: true, kgCo2: dist * f, note: `CO₂ ≈ km × ${f} kg/km.` };
    }
    case "travel-carbon-offset-cost-calculator": {
      const kg = pos(input.kgCo2PerKm ?? input.tripCost, "kg CO₂");
      if (typeof kg !== "number") return { ok: false, error: kg.error };
      const price = pos(input.offsetPricePerTon ?? 20, "$/ton");
      if (typeof price !== "number") return { ok: false, error: price.error };
      return { ok: true, total: (kg / 1000) * price, note: "Offset cost = tons × $/ton." };
    }
    case "travel-train-vs-fly-emissions-calculator": {
      const fly = pos(input.flyKg, "Fly kg CO₂");
      if (typeof fly !== "number") return { ok: false, error: fly.error };
      const train = pos(input.trainKg, "Train kg CO₂");
      if (typeof train !== "number") return { ok: false, error: train.error };
      return {
        ok: true,
        kgCo2: Math.min(fly, train),
        cheaper: train <= fly ? "train" : "fly",
        note: `Train ${train} vs fly ${fly} kg CO₂.`,
      };
    }
    case "travel-eco-hotel-premium-calculator": {
      const std = pos(input.hotelStd, "Standard hotel");
      if (typeof std !== "number") return { ok: false, error: std.error };
      const eco = pos(input.hotelEco, "Eco hotel");
      if (typeof eco !== "number") return { ok: false, error: eco.error };
      return { ok: true, total: eco - std, note: "Eco premium = eco − standard." };
    }
    case "travel-group-expense-split-calculator":
    case "travel-shared-accommodation-per-person-calculator":
    case "travel-pooled-fuel-split-calculator":
    case "travel-tour-package-per-head-calculator": {
      const total = pos(input.expense ?? input.lodging ?? input.fuel ?? input.packageTotal, "Total");
      if (typeof total !== "number") return { ok: false, error: total.error };
      const people = pos(input.people ?? 1, "People");
      if (typeof people !== "number") return { ok: false, error: people.error };
      return { ok: true, total, perPerson: total / people, note: "Per person = total ÷ people." };
    }
    case "travel-business-per-diem-calculator": {
      const pd = pos(input.perDiem, "Per diem");
      if (typeof pd !== "number") return { ok: false, error: pd.error };
      const days = pos(input.days, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      return { ok: true, total: pd * days, note: "Per diem total = rate × days." };
    }
    case "travel-reimbursable-mileage-calculator": {
      const miles = pos(input.miles ?? input.distanceKm, "Miles");
      if (typeof miles !== "number") return { ok: false, error: miles.error };
      const rate = pos(input.ratePerMile, "Rate/mile");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, total: miles * rate, note: "Mileage reimbursement = miles × rate." };
    }
    case "travel-blended-business-leisure-cost-calculator": {
      const trip = pos(input.tripCost, "Trip cost");
      if (typeof trip !== "number") return { ok: false, error: trip.error };
      const biz = nonNeg(input.businessSharePct ?? 50, "Business %");
      if (typeof biz !== "number") return { ok: false, error: biz.error };
      return { ok: true, total: trip * (biz / 100), note: "Business share of blended trip." };
    }
    case "travel-client-billable-travel-calculator": {
      const cost = pos(input.tripCost, "Travel cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const markup = nonNeg(input.markupPct ?? 0, "Markup %");
      if (typeof markup !== "number") return { ok: false, error: markup.error };
      return { ok: true, total: cost * (1 + markup / 100), note: "Billable = cost × (1+markup)." };
    }
    case "travel-ai-itinerary-budget-envelope-calculator": {
      const base = pos(input.baseBudget ?? input.tripCost, "Envelope");
      if (typeof base !== "number") return { ok: false, error: base.error };
      return { ok: true, total: base, note: "Itinerary budget envelope (planning aid)." };
    }
    case "travel-ai-scenario-cost-tweak-calculator": {
      const base = pos(input.baseBudget ?? input.tripCost, "Base");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const tweak = input.tweakPct ?? 0;
      return { ok: true, total: base * (1 + tweak / 100), note: "Scenario tweak applied to base." };
    }
    case "travel-ai-alternative-destination-cost-calculator":
    case "travel-package-quote-comparison-calculator":
    case "travel-insurance-quote-comparison-calculator":
    case "travel-transport-bundle-comparison-calculator": {
      const a = pos(input.destA ?? input.quoteA, "Option A");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = pos(input.destB ?? input.quoteB, "Option B");
      if (typeof b !== "number") return { ok: false, error: b.error };
      return { ok: true, cheaper: a <= b ? "A" : "B", total: Math.min(a, b), note: "Lower option wins." };
    }
    case "travel-ota-vs-direct-booking-calculator": {
      const ota = pos(input.ota, "OTA price");
      if (typeof ota !== "number") return { ok: false, error: ota.error };
      const direct = pos(input.direct, "Direct price");
      if (typeof direct !== "number") return { ok: false, error: direct.error };
      return {
        ok: true,
        cheaper: ota <= direct ? "OTA" : "direct",
        total: Math.min(ota, direct),
        note: `OTA ${ota} vs direct ${direct}.`,
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
