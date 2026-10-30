import type { RichArticle } from "./types";

const SHELL =
  "Daily travel planning tools that run in your browser. Not financial, legal, or insurance advice. Airline bag rules, transit fares, and taxi/rideshare prices change — verify with carriers, transit agencies, and apps before you travel.";

const CHART = {
  kind: "none" as const,
  title: "Overview",
  caption:
    "Share URL preserves your travel inputs. Planning estimate only — fares, fees, FX, and policies vary.",
};

const LUGGAGE_HUB = {
  href: "/daily/travel/travel-luggage-packing",
  label: "Daily life · Travel · Luggage and packing calculators",
};

const TRANSIT_HUB = {
  href: "/daily/travel/travel-public-transport",
  label: "Daily life · Travel · Public transport calculators",
};

const TAXI_HUB = {
  href: "/daily/travel/travel-taxi-rideshare",
  label: "Daily life · Travel · Taxi and rideshare calculators",
};

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  hub: { href: string; label: string },
  tableRows: string[][],
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "daily",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Local travel tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: tableRows,
      },
    ],
    chart: CHART,
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: hub.href,
    hubLabel: hub.label,
  };
}

const LUGGAGE_ROWS = [
  ["Weight allowance", "Bag vs limit; over-by kg"],
  ["Linear inches", "L + W + H vs max"],
  ["Carry-on compliance", "Linear size vs cabin limit"],
  ["Packing list cost", "Items × avg cost"],
];

const TRANSIT_ROWS = [
  ["Pass vs pay-per-ride", "Pass cost vs rides × fare"],
  ["Monthly commute", "Commute days × daily fares"],
  ["Zone fare", "Zones × fare per zone"],
  ["Multi-day transit card", "Card cost vs pay-as-you-go"],
];

const TAXI_ROWS = [
  ["Taxi fare", "Base + per-km × distance + tip"],
  ["Rideshare compare", "Option A vs B totals"],
  ["Surge impact", "Base fare × surge multiplier"],
  ["Airport transfer", "Transfer quote or estimate"],
];

export const TRAVEL_LOCAL_ARTICLES: Record<string, RichArticle> = {
  "travel-luggage-weight-allowance-calculator": article(
    "travel-luggage-weight-allowance-calculator",
    "Luggage weight allowance",
    [
      "Compares bag weight to the airline allowance and shows how many kilograms you are over (if any).",
      "Piece-based vs weight-based systems differ — use the limit printed on your ticket or fare rules.",
    ],
    {
      question: "Do carry-ons count toward checked weight?",
      answer:
        "Usually no — carry-on has its own size/weight rules. Checked allowance is separate unless the fare says otherwise.",
    },
    "Luggage Weight Allowance Calculator — Over-limit kg",
    "Check bag weight against airline allowance and overage. Packing aid — airline limits vary by fare.",
    ["luggage weight allowance", "baggage weight limit calculator", "overweight bag kg"],
    LUGGAGE_HUB,
    LUGGAGE_ROWS,
  ),
  "travel-linear-inches-bag-calculator": article(
    "travel-linear-inches-bag-calculator",
    "Linear inches bag",
    [
      "Adds length + width + height to get linear inches (or cm) and compares against a maximum you enter.",
      "Airlines measure differently (wheels/handles in or out) — check the carrier's measurement method.",
    ],
    {
      question: "What is a typical checked linear limit?",
      answer:
        "Many carriers use about 62 linear inches for checked bags, but always confirm your airline's rule.",
    },
    "Linear Inches Bag Calculator — L+W+H Size Check",
    "Calculate linear bag dimensions and compare to airline max. Packing compliance — measurement rules vary.",
    ["linear inches bag calculator", "luggage linear dimensions", "LWH bag size"],
    LUGGAGE_HUB,
    LUGGAGE_ROWS,
  ),
  "travel-carry-on-compliance-estimator": article(
    "travel-carry-on-compliance-estimator",
    "Carry-on compliance",
    [
      "Checks whether your cabin bag's linear size fits under a typical or custom carry-on maximum.",
      "Soft bags can compress in sizers; hard shells cannot — leave margin if the gate agent is strict.",
    ],
    {
      question: "Do personal items have a separate limit?",
      answer:
        "Yes on most airlines. Under-seat bags have their own size rules independent of the main carry-on.",
    },
    "Carry-on Compliance Estimator — Cabin Bag Size Check",
    "Estimate whether your carry-on meets linear size limits. Airline packing aid — sizer rules vary.",
    ["carry on compliance", "cabin bag size calculator", "carry-on linear inches"],
    LUGGAGE_HUB,
    LUGGAGE_ROWS,
  ),
  "travel-packing-list-cost-estimator": article(
    "travel-packing-list-cost-estimator",
    "Packing list cost",
    [
      "Estimates spend on new packing items from average item cost × number of items on your buy list.",
      "Borrowing or using what you already own beats buying gear for a single short trip.",
    ],
    {
      question: "Should toiletries be in the packing cost?",
      answer:
        "Include only items you must buy for this trip. Travel-size liquids and adapters add up quickly.",
    },
    "Packing List Cost Estimator — Gear Buy Budget",
    "Estimate cost of packing-list purchases from item count and average price. Trip prep aid — prices vary.",
    ["packing list cost estimator", "travel gear budget", "packing shopping cost"],
    LUGGAGE_HUB,
    LUGGAGE_ROWS,
  ),
  "travel-transit-pass-vs-pay-per-ride-calculator": article(
    "travel-transit-pass-vs-pay-per-ride-calculator",
    "Transit pass vs pay-per-ride",
    [
      "Compares a transit pass price against pay-per-ride cost for a planned number of rides.",
      "Daily caps and transfer windows on smart cards can beat both pure pass and pure single-ticket math.",
    ],
    {
      question: "When does a pass win?",
      answer:
        "When rides × single fare exceed the pass price (or daily cap). Tourists riding many times a day often win with passes.",
    },
    "Transit Pass vs Pay-per-ride Calculator — Which Is Cheaper?",
    "Compare transit pass cost to pay-per-ride totals. City travel aid — fare rules vary by agency.",
    ["transit pass vs pay per ride", "metro pass calculator", "day pass worth it"],
    TRANSIT_HUB,
    TRANSIT_ROWS,
  ),
  "travel-monthly-commute-cost-calculator": article(
    "travel-monthly-commute-cost-calculator",
    "Monthly commute cost",
    [
      "Projects monthly public-transit or mixed commute spend from typical daily fares and workdays.",
      "Hybrid work weeks lower totals — enter actual commute days, not a full 22-day default if you WFH.",
    ],
    {
      question: "Include parking or rideshare first/last mile?",
      answer:
        "Yes if those are regular. Add them into the daily fare figure or as a separate monthly line.",
    },
    "Monthly Commute Cost Calculator — Transit Workdays Total",
    "Estimate monthly commute spend from daily fares and days. Budgeting aid — agency fares change.",
    ["monthly commute cost calculator", "transit commute budget", "work commute fare total"],
    TRANSIT_HUB,
    TRANSIT_ROWS,
  ),
  "travel-zone-fare-estimator": article(
    "travel-zone-fare-estimator",
    "Zone fare",
    [
      "Estimates fare from number of zones crossed × fare per zone for systems that price by zone rings.",
      "Peak vs off-peak and rail vs bus zone maps differ — use the mode and time you will actually ride.",
    ],
    {
      question: "Do return trips count zones twice?",
      answer:
        "Yes for separate tickets. Round-trip or day tickets may price differently — check the agency product.",
    },
    "Zone Fare Estimator — Zones × Fare per Zone",
    "Estimate public transit fare by zone count. City travel planning — zone maps and peaks vary.",
    ["zone fare estimator", "transit zone calculator", "metro zone ticket cost"],
    TRANSIT_HUB,
    TRANSIT_ROWS,
  ),
  "travel-multi-day-transit-card-calculator": article(
    "travel-multi-day-transit-card-calculator",
    "Multi-day transit card",
    [
      "Checks whether a multi-day tourist transit card beats paying per ride over the same visit length.",
      "Some cards include airport links or ferries — count only the modes you will use when comparing.",
    ],
    {
      question: "Are tourist cards worth it for two days?",
      answer:
        "Only if you ride enough. Light users often save with pay-as-you-go or daily caps instead.",
    },
    "Multi-day Transit Card Calculator — Tourist Pass Value",
    "Compare multi-day transit cards to pay-as-you-go spend. Visitor planning — inclusions vary by city.",
    ["multi day transit card", "tourist metro pass calculator", "city travel card worth"],
    TRANSIT_HUB,
    TRANSIT_ROWS,
  ),
  "travel-taxi-fare-estimator": article(
    "travel-taxi-fare-estimator",
    "Taxi fare",
    [
      "Estimates taxi cost from base fare, per-km rate, distance, and optional tip percent.",
      "Waiting time, night surcharges, and tolls are extra in many cities — add them when known.",
    ],
    {
      question: "Is the meter always cheaper than a fixed quote?",
      answer:
        "Not always. Airport fixed rates can beat meters in traffic. Compare both when both are offered.",
    },
    "Taxi Fare Estimator — Base + Distance + Tip",
    "Estimate taxi fare from base, per-km rate, and tip. Local travel aid — surcharges vary by city.",
    ["taxi fare estimator", "taxi cost calculator", "cab fare tip estimate"],
    TAXI_HUB,
    TAXI_ROWS,
  ),
  "travel-rideshare-cost-comparison-calculator": article(
    "travel-rideshare-cost-comparison-calculator",
    "Rideshare cost comparison",
    [
      "Compares two rideshare or taxi quote totals so you can pick the cheaper option for the same trip.",
      "ETAs and cancellation fees matter too — cheapest is not best if pickup time ruins your connection.",
    ],
    {
      question: "Should I compare before surge?",
      answer:
        "Refresh quotes close to request time. Surge and driver availability change minute to minute.",
    },
    "Rideshare Cost Comparison Calculator — Option A vs B",
    "Compare two rideshare or taxi quotes side by side. Local transfer aid — app prices fluctuate.",
    ["rideshare cost comparison", "uber vs taxi compare", "ride quote comparison"],
    TAXI_HUB,
    TAXI_ROWS,
  ),
  "travel-surge-pricing-impact-calculator": article(
    "travel-surge-pricing-impact-calculator",
    "Surge pricing impact",
    [
      "Multiplies a base rideshare fare by a surge multiplier to show peak-demand price impact.",
      "Waiting 10–15 minutes or walking to a quieter pickup zone sometimes drops the multiplier.",
    ],
    {
      question: "Is surge the same as a booking fee?",
      answer:
        "No. Surge scales the fare; booking or service fees are often flat add-ons on top.",
    },
    "Surge Pricing Impact Calculator — Multiplier × Base Fare",
    "Estimate rideshare cost under surge multipliers. Peak demand planning — multipliers change quickly.",
    ["surge pricing impact", "rideshare surge calculator", "uber surge cost"],
    TAXI_HUB,
    TAXI_ROWS,
  ),
  "travel-airport-transfer-cost-calculator": article(
    "travel-airport-transfer-cost-calculator",
    "Airport transfer cost",
    [
      "Budgets airport-to-city transfer cost from a quote or simple distance-based estimate you enter.",
      "Compare official taxi desks, rideshare, hotel shuttles, and rail links — time vs price trade-offs differ.",
    ],
    {
      question: "Are airport tolls included in quotes?",
      answer:
        "Often not. Ask whether expressway and airport access fees are included before accepting a fixed price.",
    },
    "Airport Transfer Cost Calculator — Arrival Ride Budget",
    "Estimate airport transfer cost for taxis, shuttles, or rideshares. Arrival planning — fees and tolls vary.",
    ["airport transfer cost calculator", "airport taxi estimate", "arrival transfer budget"],
    TAXI_HUB,
    TAXI_ROWS,
  ),
};
