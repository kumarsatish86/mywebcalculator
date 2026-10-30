/** Home parking, garage, EV — daily-life estimates. */

export type HomeParkingSlug =
  | "home-parking-space-calculator"
  | "home-garage-size-calculator"
  | "home-ev-charging-cost-calculator";

export type HomeParkingInput = {
  lengthM?: number;
  widthM?: number;
  cars?: number;
  kwhPerCharge?: number;
  ratePerKwh?: number;
  chargesPerMonth?: number;
};

export type HomeParkingResult =
  | { ok: false; error: string }
  | { ok: true; areaM2?: number; cost?: number; note: string };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeHomeParking(slug: HomeParkingSlug, input: HomeParkingInput): HomeParkingResult {
  switch (slug) {
    case "home-parking-space-calculator":
    case "home-garage-size-calculator": {
      const L = p(input.lengthM ?? 5, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM ?? 2.5, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const cars = input.cars && input.cars > 0 ? input.cars : 1;
      return { ok: true, areaM2: L * W * cars, note: "Stall/garage area ≈ L×W×cars." };
    }
    case "home-ev-charging-cost-calculator": {
      const kwh = p(input.kwhPerCharge, "kWh per charge");
      if (typeof kwh !== "number") return { ok: false, error: kwh.error };
      const rate = p(input.ratePerKwh, "Rate/kWh");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const n = input.chargesPerMonth && input.chargesPerMonth > 0 ? input.chargesPerMonth : 1;
      return { ok: true, cost: kwh * rate * n, note: "EV charge cost = kWh × rate × charges." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
