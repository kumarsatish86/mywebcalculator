/** Travel fuel & vehicle — daily-life estimates. */
import { pos, nonNeg } from "./travelHelpers";

export type TravelFuelSlug =
  | "travel-fuel-cost-calculator"
  | "travel-mileage-calculator"
  | "travel-mpg-calculator"
  | "travel-km-per-liter-calculator"
  | "travel-gas-price-trip-calculator"
  | "travel-ev-charging-cost-trip-calculator"
  | "travel-range-estimator"
  | "travel-toll-cost-estimator";

export type TravelFuelInput = {
  distanceKm?: number;
  efficiency?: number;
  pricePerLiter?: number;
  gallons?: number;
  miles?: number;
  kwhPer100km?: number;
  pricePerKwh?: number;
  tankLiters?: number;
  tolls?: number;
  tollCount?: number;
};

export type TravelFuelResult =
  | { ok: false; error: string }
  | {
      ok: true;
      cost?: number;
      liters?: number;
      mpg?: number;
      kmPerL?: number;
      rangeKm?: number;
      note: string;
    };

export function computeTravelFuel(slug: TravelFuelSlug, input: TravelFuelInput): TravelFuelResult {
  switch (slug) {
    case "travel-fuel-cost-calculator":
    case "travel-gas-price-trip-calculator": {
      const dist = pos(input.distanceKm, "Distance km");
      if (typeof dist !== "number") return { ok: false, error: dist.error };
      const eff = pos(input.efficiency, "km/L");
      if (typeof eff !== "number") return { ok: false, error: eff.error };
      const price = pos(input.pricePerLiter, "Price/L");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const liters = dist / eff;
      return { ok: true, liters, cost: liters * price, note: "Fuel cost = (distance÷efficiency)×price." };
    }
    case "travel-mileage-calculator":
    case "travel-km-per-liter-calculator": {
      const dist = pos(input.distanceKm ?? input.miles, "Distance");
      if (typeof dist !== "number") return { ok: false, error: dist.error };
      const liters = pos(input.efficiency ?? input.gallons, "Fuel used");
      if (typeof liters !== "number") return { ok: false, error: liters.error };
      return { ok: true, kmPerL: dist / liters, note: "Efficiency = distance ÷ fuel used." };
    }
    case "travel-mpg-calculator": {
      const miles = pos(input.miles ?? input.distanceKm, "Miles");
      if (typeof miles !== "number") return { ok: false, error: miles.error };
      const gal = pos(input.gallons, "Gallons");
      if (typeof gal !== "number") return { ok: false, error: gal.error };
      return { ok: true, mpg: miles / gal, note: "MPG = miles ÷ gallons." };
    }
    case "travel-ev-charging-cost-trip-calculator": {
      const dist = pos(input.distanceKm, "Distance km");
      if (typeof dist !== "number") return { ok: false, error: dist.error };
      const kwh100 = pos(input.kwhPer100km ?? input.efficiency, "kWh/100km");
      if (typeof kwh100 !== "number") return { ok: false, error: kwh100.error };
      const rate = pos(input.pricePerKwh, "Price/kWh");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const kwh = (dist / 100) * kwh100;
      return { ok: true, cost: kwh * rate, note: "EV cost = (km/100)×kWh/100km×rate." };
    }
    case "travel-range-estimator": {
      const tank = pos(input.tankLiters, "Tank liters");
      if (typeof tank !== "number") return { ok: false, error: tank.error };
      const eff = pos(input.efficiency, "km/L");
      if (typeof eff !== "number") return { ok: false, error: eff.error };
      return { ok: true, rangeKm: tank * eff, note: "Range ≈ tank × efficiency." };
    }
    case "travel-toll-cost-estimator": {
      const per = nonNeg(input.tolls ?? 0, "Toll per plaza");
      if (typeof per !== "number") return { ok: false, error: per.error };
      const n = pos(input.tollCount ?? 1, "Toll count");
      if (typeof n !== "number") return { ok: false, error: n.error };
      return { ok: true, cost: per * n, note: "Tolls = rate × count." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
