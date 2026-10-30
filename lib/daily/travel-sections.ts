import type { SectionNode } from "../hub-section-types";

const live = (slug: string, title: string) => ({ slug, title });

export const DAILY_TRAVEL_SECTIONS: SectionNode[] = [
  {
    slug: "travel-fuel-vehicle",
    title: "Fuel and vehicle travel calculators",
    description: "Trip fuel, mileage costs, EV range, and simple operating cost estimates.",
    calculators: [
      live("travel-fuel-cost-calculator", "Fuel Cost Calculator"),
      live("travel-mileage-calculator", "Mileage Calculator"),
      live("travel-mpg-calculator", "MPG Calculator"),
      live("travel-km-per-liter-calculator", "km per Liter Calculator"),
      live("travel-gas-price-trip-calculator", "Gas Price Trip Calculator"),
      live("travel-ev-charging-cost-trip-calculator", "EV Charging Cost Trip Calculator"),
      live("travel-range-estimator", "Range Estimator"),
      live("travel-toll-cost-estimator", "Toll Cost Estimator"),
    ],
  },
  {
    slug: "travel-trip-planning",
    title: "Trip planning calculators",
    description: "Budget envelopes, daily spend, multi-city costs, and buffer planning.",
    calculators: [
      live("travel-trip-budget-calculator", "Trip Budget Calculator"),
      live("travel-daily-travel-budget-calculator", "Daily Travel Budget Calculator"),
      live("travel-multi-city-cost-estimator", "Multi-city Cost Estimator"),
      live("travel-contingency-fund-calculator", "Contingency Fund Calculator"),
      live("travel-trip-duration-cost-calculator", "Trip Duration Cost Calculator"),
    ],
  },
  {
    slug: "travel-accommodation",
    title: "Accommodation calculators",
    description: "Nightly rates with fees, length of stay, and resort or cleaning extras.",
    calculators: [
      live("travel-hotel-stay-cost-calculator", "Hotel Stay Cost Calculator"),
      live("travel-nightly-rate-with-fees-calculator", "Nightly Rate with Fees Calculator"),
      live("travel-resort-fee-total-calculator", "Resort Fee Total Calculator"),
      live("travel-extended-stay-discount-calculator", "Extended Stay Discount Calculator"),
      live("travel-cleaning-fee-amortization-calculator", "Cleaning Fee Amortization Calculator"),
    ],
  },
  {
    slug: "travel-flights",
    title: "Flight and airfare calculators",
    description: "Per-mile costs, baggage fees, seat upgrades, and reward mile value.",
    calculators: [
      live("travel-airfare-per-mile-calculator", "Airfare per Mile Calculator"),
      live("travel-baggage-fee-total-calculator", "Baggage Fee Total Calculator"),
      live("travel-seat-upgrade-value-calculator", "Seat Upgrade Value Calculator"),
      live("travel-miles-to-dollar-value-calculator", "Miles to Dollar Value Calculator"),
      live("travel-layover-time-cost-calculator", "Layover Time Cost Calculator"),
    ],
  },
  {
    slug: "travel-currency-international",
    title: "Currency and international travel calculators",
    description: "FX budgets, fee-adjusted rates, and tipping abroad.",
    calculators: [
      live("travel-currency-exchange-budget-calculator", "Currency Exchange Budget Calculator"),
      live("travel-atm-fee-adjusted-rate-calculator", "ATM Fee-adjusted Rate Calculator"),
      live("travel-tipping-abroad-calculator", "Tipping Abroad Calculator"),
      live("travel-purchasing-power-comparison-calculator", "Purchasing Power Comparison Calculator"),
    ],
  },
  {
    slug: "travel-food-expenses",
    title: "Food and dining travel calculators",
    description: "Per diem meals, group splits, and all-inclusive value checks.",
    calculators: [
      live("travel-meal-per-diem-calculator", "Meal Per Diem Calculator"),
      live("travel-restaurant-bill-split-travel-calculator", "Restaurant Bill Split (Travel)"),
      live("travel-all-inclusive-value-calculator", "All-inclusive Value Calculator"),
      live("travel-street-food-budget-calculator", "Street Food Budget Calculator"),
    ],
  },
  {
    slug: "travel-luggage-packing",
    title: "Luggage and packing calculators",
    description: "Weight limits, linear inches, and carry-on compliance hints.",
    calculators: [
      live("travel-luggage-weight-allowance-calculator", "Luggage Weight Allowance Calculator"),
      live("travel-linear-inches-bag-calculator", "Linear Inches Bag Calculator"),
      live("travel-carry-on-compliance-estimator", "Carry-on Compliance Estimator"),
      live("travel-packing-list-cost-estimator", "Packing List Cost Estimator"),
    ],
  },
  {
    slug: "travel-public-transport",
    title: "Public transport calculators",
    description: "Passes versus pay-per-ride, commuter totals, and zone fares.",
    calculators: [
      live("travel-transit-pass-vs-pay-per-ride-calculator", "Transit Pass vs Pay-per-ride Calculator"),
      live("travel-monthly-commute-cost-calculator", "Monthly Commute Cost Calculator"),
      live("travel-zone-fare-estimator", "Zone Fare Estimator"),
      live("travel-multi-day-transit-card-calculator", "Multi-day Transit Card Calculator"),
    ],
  },
  {
    slug: "travel-taxi-rideshare",
    title: "Taxi and rideshare calculators",
    description: "Fare estimates, surge multipliers, and tip-inclusive totals.",
    calculators: [
      live("travel-taxi-fare-estimator", "Taxi Fare Estimator"),
      live("travel-rideshare-cost-comparison-calculator", "Rideshare Cost Comparison Calculator"),
      live("travel-surge-pricing-impact-calculator", "Surge Pricing Impact Calculator"),
      live("travel-airport-transfer-cost-calculator", "Airport Transfer Cost Calculator"),
    ],
  },
  {
    slug: "travel-time-distance",
    title: "Time and distance travel calculators",
    description: "Drive time, time zones, jet lag windows, and average speed.",
    calculators: [
      live("travel-drive-time-calculator", "Drive Time Calculator"),
      live("travel-time-zone-difference-calculator", "Time Zone Difference Calculator"),
      live("travel-jet-lag-adjustment-estimator", "Jet Lag Adjustment Estimator"),
      live("travel-average-speed-trip-calculator", "Average Speed Trip Calculator"),
    ],
  },
  {
    slug: "travel-vacation-holiday",
    title: "Vacation and holiday calculators",
    description: "Family trip budgets, cruise packages, and peak versus off-season savings.",
    calculators: [
      live("travel-family-vacation-budget-calculator", "Family Vacation Budget Calculator"),
      live("travel-cruise-package-comparison-calculator", "Cruise Package Comparison Calculator"),
      live("travel-peak-vs-off-season-savings-calculator", "Peak vs Off-season Savings Calculator"),
      live("travel-holiday-surcharge-estimator", "Holiday Surcharge Estimator"),
    ],
  },
  {
    slug: "travel-insurance",
    title: "Travel insurance calculators",
    description: "Premium versus risk, cancellation cover, and medical add-on value.",
    calculators: [
      live("travel-insurance-premium-estimator", "Travel Insurance Premium Estimator"),
      live("travel-cancellation-cover-value-calculator", "Cancellation Cover Value Calculator"),
      live("travel-medical-cover-comparison-calculator", "Medical Cover Comparison Calculator"),
      live("travel-gear-cover-calculator", "Gear Cover Calculator"),
    ],
  },
  {
    slug: "travel-group-split",
    title: "Group and split-cost travel calculators",
    description: "Shared lodging, pooled fuel, and fair expense splits for groups.",
    calculators: [
      live("travel-group-expense-split-calculator", "Group Expense Split Calculator"),
      live("travel-shared-accommodation-per-person-calculator", "Shared Accommodation per Person Calculator"),
      live("travel-pooled-fuel-split-calculator", "Pooled Fuel Split Calculator"),
      live("travel-tour-package-per-head-calculator", "Tour Package per Head Calculator"),
    ],
  },
  {
    slug: "travel-eco-sustainability",
    title: "Eco and sustainable travel calculators",
    description: "Trip emissions, offset costs, and train versus fly comparisons.",
    calculators: [
      live("travel-trip-carbon-footprint-estimator", "Trip Carbon Footprint Estimator"),
      live("travel-carbon-offset-cost-calculator", "Carbon Offset Cost Calculator"),
      live("travel-train-vs-fly-emissions-calculator", "Train vs Fly Emissions Calculator"),
      live("travel-eco-hotel-premium-calculator", "Eco Hotel Premium Calculator"),
    ],
  },
  {
    slug: "travel-business",
    title: "Business travel calculators",
    description: "Per diems, reimbursable mileage, and blended trip deductions.",
    calculators: [
      live("travel-business-per-diem-calculator", "Business Per Diem Calculator"),
      live("travel-reimbursable-mileage-calculator", "Reimbursable Mileage Calculator"),
      live("travel-blended-business-leisure-cost-calculator", "Blended Business-leisure Cost Calculator"),
      live("travel-client-billable-travel-calculator", "Client Billable Travel Calculator"),
    ],
  },
  {
    slug: "travel-ai-tools",
    title: "AI-assisted travel planning calculators",
    description: "Itinerary cost envelopes, prompt-based budget drafts, and scenario tweaks.",
    calculators: [
      live("travel-ai-itinerary-budget-envelope-calculator", "AI Itinerary Budget Envelope Calculator"),
      live("travel-ai-scenario-cost-tweak-calculator", "AI Scenario Cost Tweak Calculator"),
      live("travel-ai-alternative-destination-cost-calculator", "AI Alternative Destination Cost Calculator"),
    ],
  },
  {
    slug: "travel-bonus-comparisons",
    title: "Quote and comparison travel calculators",
    description: "Side-by-side quotes for packages, insurance, and transport bundles.",
    calculators: [
      live("travel-package-quote-comparison-calculator", "Package Quote Comparison Calculator"),
      live("travel-insurance-quote-comparison-calculator", "Insurance Quote Comparison Calculator"),
      live("travel-transport-bundle-comparison-calculator", "Transport Bundle Comparison Calculator"),
      live("travel-ota-vs-direct-booking-calculator", "OTA vs Direct Booking Calculator"),
    ],
  },
];
