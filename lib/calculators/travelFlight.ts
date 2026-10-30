/** Travel flights — daily-life estimates. */
import { pos, nonNeg } from "./travelHelpers";

export type TravelFlightSlug =
  | "travel-airfare-per-mile-calculator"
  | "travel-baggage-fee-total-calculator"
  | "travel-seat-upgrade-value-calculator"
  | "travel-miles-to-dollar-value-calculator"
  | "travel-layover-time-cost-calculator";

export type TravelFlightInput = {
  fare?: number;
  miles?: number;
  bagFee?: number;
  bags?: number;
  upgradeCost?: number;
  hoursGained?: number;
  hourlyValue?: number;
  points?: number;
  cpp?: number;
  layoverHours?: number;
};

export type TravelFlightResult =
  | { ok: false; error: string }
  | {
      ok: true;
      perMile?: number;
      total?: number;
      value?: number;
      worthIt?: boolean;
      note: string;
    };

export function computeTravelFlight(slug: TravelFlightSlug, input: TravelFlightInput): TravelFlightResult {
  switch (slug) {
    case "travel-airfare-per-mile-calculator": {
      const fare = pos(input.fare, "Fare");
      if (typeof fare !== "number") return { ok: false, error: fare.error };
      const miles = pos(input.miles, "Miles");
      if (typeof miles !== "number") return { ok: false, error: miles.error };
      return { ok: true, perMile: fare / miles, note: "¢/mile teaching = fare ÷ miles." };
    }
    case "travel-baggage-fee-total-calculator": {
      const fee = pos(input.bagFee, "Fee/bag");
      if (typeof fee !== "number") return { ok: false, error: fee.error };
      const n = pos(input.bags ?? 1, "Bags");
      if (typeof n !== "number") return { ok: false, error: n.error };
      return { ok: true, total: fee * n, note: "Baggage = fee × bags." };
    }
    case "travel-seat-upgrade-value-calculator": {
      const cost = pos(input.upgradeCost, "Upgrade cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const hrs = pos(input.hoursGained ?? 1, "Comfort hours");
      if (typeof hrs !== "number") return { ok: false, error: hrs.error };
      const hv = pos(input.hourlyValue ?? 20, "$/hour value");
      if (typeof hv !== "number") return { ok: false, error: hv.error };
      const value = hrs * hv;
      return { ok: true, value, worthIt: value >= cost, total: cost, note: "Worth it if comfort value ≥ upgrade cost." };
    }
    case "travel-miles-to-dollar-value-calculator": {
      const pts = pos(input.points ?? input.miles, "Miles/points");
      if (typeof pts !== "number") return { ok: false, error: pts.error };
      const cpp = pos(input.cpp ?? 0.01, "Cents per point");
      if (typeof cpp !== "number") return { ok: false, error: cpp.error };
      return { ok: true, value: (pts * cpp) / 100, note: "Value = points × ¢/point ÷ 100." };
    }
    case "travel-layover-time-cost-calculator": {
      const hrs = pos(input.layoverHours, "Layover hours");
      if (typeof hrs !== "number") return { ok: false, error: hrs.error };
      const hv = pos(input.hourlyValue ?? 15, "Hourly opportunity cost");
      if (typeof hv !== "number") return { ok: false, error: hv.error };
      return { ok: true, total: hrs * hv, note: "Layover opportunity cost = hours × $/hr." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
