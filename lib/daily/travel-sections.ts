import type { SectionNode } from "../hub-section-types";

const p = (slug: string, title: string) => ({ slug, title, status: "planned" as const });

export const DAILY_TRAVEL_SECTIONS: SectionNode[] = [
  {
    slug: "travel-fuel-vehicle",
    title: "Fuel and vehicle travel calculators",
    description: "Trip fuel, mileage costs, EV range, and simple operating cost estimates.",
    calculators: [
      p("travel-fuel-cost-calculator", "Fuel Cost Calculator"),
      p("travel-mileage-calculator", "Mileage Calculator"),
      p("travel-mpg-calculator", "MPG Calculator"),
      p("travel-km-per-liter-calculator", "km per Liter Calculator"),
      p("travel-gas-price-trip-calculator", "Gas Price Trip Calculator"),
      p("travel-ev-charging-cost-trip-calculator", "EV Charging Cost Trip Calculator"),
      p("travel-range-estimator", "Range Estimator"),
      p("travel-toll-cost-estimator", "Toll Cost Estimator"),
    ],
  },
  {
    slug: "travel-trip-planning",
    title: "Trip planning calculators",
    description: "Budget envelopes, daily spend, multi-city costs, and buffer planning.",
    calculators: [
      p("travel-trip-budget-calculator", "Trip Budget Calculator"),
      p("travel-daily-travel-budget-calculator", "Daily Travel Budget Calculator"),
      p("travel-multi-city-cost-estimator", "Multi-city Cost Estimator"),
      p("travel-contingency-fund-calculator", "Contingency Fund Calculator"),
      p("travel-trip-duration-cost-calculator", "Trip Duration Cost Calculator"),
    ],
  },
  {
    slug: "travel-accommodation",
    title: "Accommodation calculators",
    description: "Nightly rates with fees, length of stay, and resort or cleaning extras.",
    calculators: [
      p("travel-hotel-stay-cost-calculator", "Hotel Stay Cost Calculator"),
      p("travel-nightly-rate-with-fees-calculator", "Nightly Rate with Fees Calculator"),
      p("travel-resort-fee-total-calculator", "Resort Fee Total Calculator"),
      p("travel-extended-stay-discount-calculator", "Extended Stay Discount Calculator"),
      p("travel-cleaning-fee-amortization-calculator", "Cleaning Fee Amortization Calculator"),
    ],
  },
  {
    slug: "travel-flights",
    title: "Flight and airfare calculators",
    description: "Per-mile costs, baggage fees, seat upgrades, and reward mile value.",
    calculators: [
      p("travel-airfare-per-mile-calculator", "Airfare per Mile Calculator"),
      p("travel-baggage-fee-total-calculator", "Baggage Fee Total Calculator"),
      p("travel-seat-upgrade-value-calculator", "Seat Upgrade Value Calculator"),
      p("travel-miles-to-dollar-value-calculator", "Miles to Dollar Value Calculator"),
      p("travel-layover-time-cost-calculator", "Layover Time Cost Calculator"),
    ],
  },
  {
    slug: "travel-currency-international",
    title: "Currency and international travel calculators",
    description: "FX budgets, fee-adjusted rates, and tipping abroad.",
    calculators: [
      p("travel-currency-exchange-budget-calculator", "Currency Exchange Budget Calculator"),
      p("travel-atm-fee-adjusted-rate-calculator", "ATM Fee-adjusted Rate Calculator"),
      p("travel-tipping-abroad-calculator", "Tipping Abroad Calculator"),
      p("travel-purchasing-power-comparison-calculator", "Purchasing Power Comparison Calculator"),
    ],
  },
  {
    slug: "travel-food-expenses",
    title: "Food and dining travel calculators",
    description: "Per diem meals, group splits, and all-inclusive value checks.",
    calculators: [
      p("travel-meal-per-diem-calculator", "Meal Per Diem Calculator"),
      p("travel-restaurant-bill-split-travel-calculator", "Restaurant Bill Split (Travel)"),
      p("travel-all-inclusive-value-calculator", "All-inclusive Value Calculator"),
      p("travel-street-food-budget-calculator", "Street Food Budget Calculator"),
    ],
  },
  {
    slug: "travel-luggage-packing",
    title: "Luggage and packing calculators",
    description: "Weight limits, linear inches, and carry-on compliance hints.",
    calculators: [
      p("travel-luggage-weight-allowance-calculator", "Luggage Weight Allowance Calculator"),
      p("travel-linear-inches-bag-calculator", "Linear Inches Bag Calculator"),
      p("travel-carry-on-compliance-estimator", "Carry-on Compliance Estimator"),
      p("travel-packing-list-cost-estimator", "Packing List Cost Estimator"),
    ],
  },
  {
    slug: "travel-public-transport",
    title: "Public transport calculators",
    description: "Passes versus pay-per-ride, commuter totals, and zone fares.",
    calculators: [
      p("travel-transit-pass-vs-pay-per-ride-calculator", "Transit Pass vs Pay-per-ride Calculator"),
      p("travel-monthly-commute-cost-calculator", "Monthly Commute Cost Calculator"),
      p("travel-zone-fare-estimator", "Zone Fare Estimator"),
      p("travel-multi-day-transit-card-calculator", "Multi-day Transit Card Calculator"),
    ],
  },
  {
    slug: "travel-taxi-rideshare",
    title: "Taxi and rideshare calculators",
    description: "Fare estimates, surge multipliers, and tip-inclusive totals.",
    calculators: [
      p("travel-taxi-fare-estimator", "Taxi Fare Estimator"),
      p("travel-rideshare-cost-comparison-calculator", "Rideshare Cost Comparison Calculator"),
      p("travel-surge-pricing-impact-calculator", "Surge Pricing Impact Calculator"),
      p("travel-airport-transfer-cost-calculator", "Airport Transfer Cost Calculator"),
    ],
  },
  {
    slug: "travel-time-distance",
    title: "Time and distance travel calculators",
    description: "Drive time, time zones, jet lag windows, and average speed.",
    calculators: [
      p("travel-drive-time-calculator", "Drive Time Calculator"),
      p("travel-time-zone-difference-calculator", "Time Zone Difference Calculator"),
      p("travel-jet-lag-adjustment-estimator", "Jet Lag Adjustment Estimator"),
      p("travel-average-speed-trip-calculator", "Average Speed Trip Calculator"),
    ],
  },
  {
    slug: "travel-vacation-holiday",
    title: "Vacation and holiday calculators",
    description: "Family trip budgets, cruise packages, and peak versus off-season savings.",
    calculators: [
      p("travel-family-vacation-budget-calculator", "Family Vacation Budget Calculator"),
      p("travel-cruise-package-comparison-calculator", "Cruise Package Comparison Calculator"),
      p("travel-peak-vs-off-season-savings-calculator", "Peak vs Off-season Savings Calculator"),
      p("travel-holiday-surcharge-estimator", "Holiday Surcharge Estimator"),
    ],
  },
  {
    slug: "travel-insurance",
    title: "Travel insurance calculators",
    description: "Premium versus risk, cancellation cover, and medical add-on value.",
    calculators: [
      p("travel-insurance-premium-estimator", "Travel Insurance Premium Estimator"),
      p("travel-cancellation-cover-value-calculator", "Cancellation Cover Value Calculator"),
      p("travel-medical-cover-comparison-calculator", "Medical Cover Comparison Calculator"),
      p("travel-gear-cover-calculator", "Gear Cover Calculator"),
    ],
  },
  {
    slug: "travel-group-split",
    title: "Group and split-cost travel calculators",
    description: "Shared lodging, pooled fuel, and fair expense splits for groups.",
    calculators: [
      p("travel-group-expense-split-calculator", "Group Expense Split Calculator"),
      p("travel-shared-accommodation-per-person-calculator", "Shared Accommodation per Person Calculator"),
      p("travel-pooled-fuel-split-calculator", "Pooled Fuel Split Calculator"),
      p("travel-tour-package-per-head-calculator", "Tour Package per Head Calculator"),
    ],
  },
  {
    slug: "travel-eco-sustainability",
    title: "Eco and sustainable travel calculators",
    description: "Trip emissions, offset costs, and train versus fly comparisons.",
    calculators: [
      p("travel-trip-carbon-footprint-estimator", "Trip Carbon Footprint Estimator"),
      p("travel-carbon-offset-cost-calculator", "Carbon Offset Cost Calculator"),
      p("travel-train-vs-fly-emissions-calculator", "Train vs Fly Emissions Calculator"),
      p("travel-eco-hotel-premium-calculator", "Eco Hotel Premium Calculator"),
    ],
  },
  {
    slug: "travel-business",
    title: "Business travel calculators",
    description: "Per diems, reimbursable mileage, and blended trip deductions.",
    calculators: [
      p("travel-business-per-diem-calculator", "Business Per Diem Calculator"),
      p("travel-reimbursable-mileage-calculator", "Reimbursable Mileage Calculator"),
      p("travel-blended-business-leisure-cost-calculator", "Blended Business-leisure Cost Calculator"),
      p("travel-client-billable-travel-calculator", "Client Billable Travel Calculator"),
    ],
  },
  {
    slug: "travel-ai-tools",
    title: "AI-assisted travel planning calculators",
    description: "Itinerary cost envelopes, prompt-based budget drafts, and scenario tweaks.",
    calculators: [
      p("travel-ai-itinerary-budget-envelope-calculator", "AI Itinerary Budget Envelope Calculator"),
      p("travel-ai-scenario-cost-tweak-calculator", "AI Scenario Cost Tweak Calculator"),
      p("travel-ai-alternative-destination-cost-calculator", "AI Alternative Destination Cost Calculator"),
    ],
  },
  {
    slug: "travel-bonus-comparisons",
    title: "Quote and comparison travel calculators",
    description: "Side-by-side quotes for packages, insurance, and transport bundles.",
    calculators: [
      p("travel-package-quote-comparison-calculator", "Package Quote Comparison Calculator"),
      p("travel-insurance-quote-comparison-calculator", "Insurance Quote Comparison Calculator"),
      p("travel-transport-bundle-comparison-calculator", "Transport Bundle Comparison Calculator"),
      p("travel-ota-vs-direct-booking-calculator", "OTA vs Direct Booking Calculator"),
    ],
  },
];
