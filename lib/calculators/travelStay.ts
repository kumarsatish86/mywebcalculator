/** Travel accommodation — daily-life estimates. */
import { pos, nonNeg } from "./travelHelpers";

export type TravelStaySlug =
  | "travel-hotel-stay-cost-calculator"
  | "travel-nightly-rate-with-fees-calculator"
  | "travel-resort-fee-total-calculator"
  | "travel-extended-stay-discount-calculator"
  | "travel-cleaning-fee-amortization-calculator";

export type TravelStayInput = {
  nightly?: number;
  nights?: number;
  taxPct?: number;
  resortFeePerNight?: number;
  cleaningFee?: number;
  discountPct?: number;
};

export type TravelStayResult =
  | { ok: false; error: string }
  | { ok: true; total?: number; effectiveNightly?: number; note: string };

export function computeTravelStay(slug: TravelStaySlug, input: TravelStayInput): TravelStayResult {
  switch (slug) {
    case "travel-hotel-stay-cost-calculator":
    case "travel-nightly-rate-with-fees-calculator": {
      const nightly = pos(input.nightly, "Nightly rate");
      if (typeof nightly !== "number") return { ok: false, error: nightly.error };
      const nights = pos(input.nights, "Nights");
      if (typeof nights !== "number") return { ok: false, error: nights.error };
      const tax = nonNeg(input.taxPct ?? 0, "Tax %");
      if (typeof tax !== "number") return { ok: false, error: tax.error };
      const resort = input.resortFeePerNight && input.resortFeePerNight > 0 ? input.resortFeePerNight : 0;
      const clean = input.cleaningFee && input.cleaningFee > 0 ? input.cleaningFee : 0;
      const sub = (nightly + resort) * nights;
      const total = sub * (1 + tax / 100) + clean;
      return { ok: true, total, effectiveNightly: total / nights, note: "Stay = (nightly+resort)×nights + tax + cleaning." };
    }
    case "travel-resort-fee-total-calculator": {
      const fee = pos(input.resortFeePerNight, "Resort fee/night");
      if (typeof fee !== "number") return { ok: false, error: fee.error };
      const nights = pos(input.nights, "Nights");
      if (typeof nights !== "number") return { ok: false, error: nights.error };
      return { ok: true, total: fee * nights, note: "Resort fees = nightly fee × nights." };
    }
    case "travel-extended-stay-discount-calculator": {
      const nightly = pos(input.nightly, "Nightly");
      if (typeof nightly !== "number") return { ok: false, error: nightly.error };
      const nights = pos(input.nights, "Nights");
      if (typeof nights !== "number") return { ok: false, error: nights.error };
      const disc = nonNeg(input.discountPct ?? 0, "Discount %");
      if (typeof disc !== "number") return { ok: false, error: disc.error };
      const total = nightly * nights * (1 - disc / 100);
      return { ok: true, total, effectiveNightly: total / nights, note: "Extended-stay discount applied." };
    }
    case "travel-cleaning-fee-amortization-calculator": {
      const clean = pos(input.cleaningFee, "Cleaning fee");
      if (typeof clean !== "number") return { ok: false, error: clean.error };
      const nights = pos(input.nights, "Nights");
      if (typeof nights !== "number") return { ok: false, error: nights.error };
      return { ok: true, effectiveNightly: clean / nights, total: clean, note: "Cleaning fee per night = fee ÷ nights." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
