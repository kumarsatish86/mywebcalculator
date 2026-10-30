"use client";

import type { TravelFuelSlug } from "@/lib/calculators/travelFuel";
import type { TravelTripSlug } from "@/lib/calculators/travelTrip";
import type { TravelStaySlug } from "@/lib/calculators/travelStay";
import type { TravelFlightSlug } from "@/lib/calculators/travelFlight";
import type { TravelMoneySlug } from "@/lib/calculators/travelMoney";
import type { TravelLocalSlug } from "@/lib/calculators/travelLocal";
import type { TravelMiscSlug } from "@/lib/calculators/travelMisc";
import { TravelFuelCalculatorHost } from "./TravelFuelCalculatorHost";
import { TravelTripCalculatorHost } from "./TravelTripCalculatorHost";
import { TravelStayCalculatorHost } from "./TravelStayCalculatorHost";
import { TravelFlightCalculatorHost } from "./TravelFlightCalculatorHost";
import { TravelMoneyCalculatorHost } from "./TravelMoneyCalculatorHost";
import { TravelLocalCalculatorHost } from "./TravelLocalCalculatorHost";
import { TravelMiscCalculatorHost } from "./TravelMiscCalculatorHost";

const FUEL = new Set<string>([
  "travel-fuel-cost-calculator",
  "travel-mileage-calculator",
  "travel-mpg-calculator",
  "travel-km-per-liter-calculator",
  "travel-gas-price-trip-calculator",
  "travel-ev-charging-cost-trip-calculator",
  "travel-range-estimator",
  "travel-toll-cost-estimator",
] satisfies TravelFuelSlug[]);

const TRIP = new Set<string>([
  "travel-trip-budget-calculator",
  "travel-daily-travel-budget-calculator",
  "travel-multi-city-cost-estimator",
  "travel-contingency-fund-calculator",
  "travel-trip-duration-cost-calculator",
  "travel-family-vacation-budget-calculator",
  "travel-cruise-package-comparison-calculator",
  "travel-peak-vs-off-season-savings-calculator",
  "travel-holiday-surcharge-estimator",
] satisfies TravelTripSlug[]);

const STAY = new Set<string>([
  "travel-hotel-stay-cost-calculator",
  "travel-nightly-rate-with-fees-calculator",
  "travel-resort-fee-total-calculator",
  "travel-extended-stay-discount-calculator",
  "travel-cleaning-fee-amortization-calculator",
] satisfies TravelStaySlug[]);

const FLIGHT = new Set<string>([
  "travel-airfare-per-mile-calculator",
  "travel-baggage-fee-total-calculator",
  "travel-seat-upgrade-value-calculator",
  "travel-miles-to-dollar-value-calculator",
  "travel-layover-time-cost-calculator",
] satisfies TravelFlightSlug[]);

const MONEY = new Set<string>([
  "travel-currency-exchange-budget-calculator",
  "travel-atm-fee-adjusted-rate-calculator",
  "travel-tipping-abroad-calculator",
  "travel-purchasing-power-comparison-calculator",
  "travel-meal-per-diem-calculator",
  "travel-restaurant-bill-split-travel-calculator",
  "travel-all-inclusive-value-calculator",
  "travel-street-food-budget-calculator",
] satisfies TravelMoneySlug[]);

const LOCAL = new Set<string>([
  "travel-luggage-weight-allowance-calculator",
  "travel-linear-inches-bag-calculator",
  "travel-carry-on-compliance-estimator",
  "travel-packing-list-cost-estimator",
  "travel-transit-pass-vs-pay-per-ride-calculator",
  "travel-monthly-commute-cost-calculator",
  "travel-zone-fare-estimator",
  "travel-multi-day-transit-card-calculator",
  "travel-taxi-fare-estimator",
  "travel-rideshare-cost-comparison-calculator",
  "travel-surge-pricing-impact-calculator",
  "travel-airport-transfer-cost-calculator",
] satisfies TravelLocalSlug[]);

const MISC = new Set<string>([
  "travel-drive-time-calculator",
  "travel-time-zone-difference-calculator",
  "travel-jet-lag-adjustment-estimator",
  "travel-average-speed-trip-calculator",
  "travel-insurance-premium-estimator",
  "travel-cancellation-cover-value-calculator",
  "travel-medical-cover-comparison-calculator",
  "travel-gear-cover-calculator",
  "travel-trip-carbon-footprint-estimator",
  "travel-carbon-offset-cost-calculator",
  "travel-train-vs-fly-emissions-calculator",
  "travel-eco-hotel-premium-calculator",
  "travel-group-expense-split-calculator",
  "travel-shared-accommodation-per-person-calculator",
  "travel-pooled-fuel-split-calculator",
  "travel-tour-package-per-head-calculator",
  "travel-business-per-diem-calculator",
  "travel-reimbursable-mileage-calculator",
  "travel-blended-business-leisure-cost-calculator",
  "travel-client-billable-travel-calculator",
  "travel-ai-itinerary-budget-envelope-calculator",
  "travel-ai-scenario-cost-tweak-calculator",
  "travel-ai-alternative-destination-cost-calculator",
  "travel-package-quote-comparison-calculator",
  "travel-insurance-quote-comparison-calculator",
  "travel-transport-bundle-comparison-calculator",
  "travel-ota-vs-direct-booking-calculator",
] satisfies TravelMiscSlug[]);

export function TravelCalculatorRouter({ slug }: { slug: string }) {
  if (FUEL.has(slug)) return <TravelFuelCalculatorHost slug={slug} />;
  if (TRIP.has(slug)) return <TravelTripCalculatorHost slug={slug} />;
  if (STAY.has(slug)) return <TravelStayCalculatorHost slug={slug} />;
  if (FLIGHT.has(slug)) return <TravelFlightCalculatorHost slug={slug} />;
  if (MONEY.has(slug)) return <TravelMoneyCalculatorHost slug={slug} />;
  if (LOCAL.has(slug)) return <TravelLocalCalculatorHost slug={slug} />;
  if (MISC.has(slug)) return <TravelMiscCalculatorHost slug={slug} />;
  return <TravelFuelCalculatorHost slug={slug} />;
}
