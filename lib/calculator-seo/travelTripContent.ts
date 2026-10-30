import type { RichArticle } from "./types";

const SHELL =
  "Daily travel planning tools that run in your browser. Not financial, legal, or insurance advice. Fares, hotel rates, cruise terms, and holiday surcharges change — verify with carriers, OTAs, and operators before booking.";

const CHART = {
  kind: "none" as const,
  title: "Overview",
  caption:
    "Share URL preserves your travel inputs. Planning estimate only — fares, fees, FX, and policies vary.",
};

const PLANNING_HUB = {
  href: "/daily/travel/travel-trip-planning",
  label: "Daily life · Travel · Trip planning calculators",
};

const VACATION_HUB = {
  href: "/daily/travel/travel-vacation-holiday",
  label: "Daily life · Travel · Vacation and holiday calculators",
};

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  hub: { href: string; label: string } = PLANNING_HUB,
  tableRows: string[][] = [
    ["Trip budget", "Lodging + food + transport + activities"],
    ["Daily budget", "Daily × days × people"],
    ["Multi-city", "Sum of city leg budgets"],
    ["Contingency", "Base × contingency %"],
    ["Duration cost", "Daily cost × days"],
    ["Family vacation", "Category rollup ÷ people"],
    ["Cruise compare", "Lower package wins"],
    ["Peak vs off-season", "Peak − off-season savings"],
    ["Holiday surcharge", "Base × surcharge %"],
  ],
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "daily",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Trip and vacation tools",
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

export const TRAVEL_TRIP_ARTICLES: Record<string, RichArticle> = {
  "travel-trip-budget-calculator": article(
    "travel-trip-budget-calculator",
    "Trip budget",
    [
      "Rolls lodging, food, transport, and activities into a trip total, with optional per-person split.",
      "Leave taxes, tips, and visas as separate lines if they are not in your category totals yet.",
    ],
    {
      question: "What categories should I always include?",
      answer:
        "At minimum lodging, food, local transport, and activities. Add flights and insurance as their own lines when known.",
    },
    "Trip Budget Calculator — Total Travel Cost Rollup",
    "Build a trip budget from lodging, food, transport, and activities. Planning estimate — prices change.",
    ["trip budget calculator", "travel cost estimate", "vacation budget planner"],
  ),
  "travel-daily-travel-budget-calculator": article(
    "travel-daily-travel-budget-calculator",
    "Daily travel budget",
    [
      "Multiplies a daily spend target by days and travelers to size the overall envelope.",
      "City days often cost more than beach or nature days — use a higher daily rate for expensive hubs.",
    ],
    {
      question: "Does daily budget include lodging?",
      answer:
        "Only if you fold hotel into the daily figure. Many planners keep lodging separate and use daily for food and local costs.",
    },
    "Daily Travel Budget Calculator — Spend per Day × Days",
    "Estimate total trip cost from daily budget, days, and people. Travel planning aid — verify live rates.",
    ["daily travel budget calculator", "per day trip cost", "travel daily spend"],
  ),
  "travel-multi-city-cost-estimator": article(
    "travel-multi-city-cost-estimator",
    "Multi-city cost",
    [
      "Sums planned budgets for up to three city legs so open-jaw and hop itineraries stay in one total.",
      "Intercity trains or flights between legs belong in transport for each city or as a separate transit line.",
    ],
    {
      question: "How do I handle overlapping nights?",
      answer:
        "Assign each night to one city only. Split arrival/departure days or put transit nights in the next leg.",
    },
    "Multi-city Cost Estimator — Sum City Leg Budgets",
    "Add multi-city trip costs across destinations. Itinerary planning aid — fares and hotels vary.",
    ["multi city trip cost", "multi-city travel budget", "city hop cost estimator"],
  ),
  "travel-contingency-fund-calculator": article(
    "travel-contingency-fund-calculator",
    "Contingency fund",
    [
      "Adds a percentage buffer on top of your base trip budget for delays, medical co-pays, or price spikes.",
      "International trips often need a larger buffer than domestic weekends — 10–15% is a common starting point.",
    ],
    {
      question: "Is contingency the same as travel insurance?",
      answer:
        "No. Contingency is cash buffer; insurance is a policy. Many travelers keep both for different risks.",
    },
    "Contingency Fund Calculator — Trip Budget Buffer %",
    "Calculate a travel contingency buffer as a percent of base budget. Planning aid — not insurance advice.",
    ["travel contingency fund", "trip budget buffer", "emergency travel fund calculator"],
  ),
  "travel-trip-duration-cost-calculator": article(
    "travel-trip-duration-cost-calculator",
    "Trip duration cost",
    [
      "Scales a fixed cost-per-day by trip length to see how adding nights changes the total.",
      "Longer stays may unlock weekly hotel discounts — adjust daily cost if your rate drops after a threshold.",
    ],
    {
      question: "Why does a longer trip not scale linearly?",
      answer:
        "Flights are often fixed while lodging is linear. Weekly rates, passes, and rental cars change the slope.",
    },
    "Trip Duration Cost Calculator — Daily Rate × Nights",
    "Estimate how trip length affects total cost at a daily rate. Planning estimate — rates vary by stay length.",
    ["trip duration cost calculator", "cost by number of days", "longer trip budget"],
  ),
  "travel-family-vacation-budget-calculator": article(
    "travel-family-vacation-budget-calculator",
    "Family vacation budget",
    [
      "Rolls family lodging, food, transport, and activities into a total and per-person share.",
      "Kids' tickets, cot fees, and park age bands change the math — enter realistic category totals for your ages.",
    ],
    {
      question: "Should kids count in per-person split?",
      answer:
        "For equal split yes. For budgeting, weight kids lower if meals and tickets are discounted — adjust categories first.",
    },
    "Family Vacation Budget Calculator — Group Trip Costs",
    "Estimate family vacation totals from lodging, food, transport, and activities. Planning aid — policies vary.",
    ["family vacation budget calculator", "family trip cost", "group vacation budget"],
    VACATION_HUB,
  ),
  "travel-cruise-package-comparison-calculator": article(
    "travel-cruise-package-comparison-calculator",
    "Cruise package comparison",
    [
      "Compares two cruise package all-in prices and highlights the cheaper option for side-by-side shopping.",
      "Include gratuities, Wi-Fi, drinks, and transfers in each package total so the comparison stays fair.",
    ],
    {
      question: "Is the lower fare always better?",
      answer:
        "Not if inclusions differ. Normalize both quotes to the same cabin class and included amenities first.",
    },
    "Cruise Package Comparison Calculator — Pick the Lower Quote",
    "Compare two cruise package totals and see which is cheaper. Vacation planning — verify inclusions with the line.",
    ["cruise package comparison", "cruise deal compare", "cruise quote calculator"],
    VACATION_HUB,
  ),
  "travel-peak-vs-off-season-savings-calculator": article(
    "travel-peak-vs-off-season-savings-calculator",
    "Peak vs off-season savings",
    [
      "Subtracts off-season price from peak price to show absolute savings from shifting travel dates.",
      "Weather, crowds, and school calendars matter as much as price — balance savings against trip quality.",
    ],
    {
      question: "What counts as peak season?",
      answer:
        "Usually school holidays, major festivals, and destination high season. Use the same room or fare class for both quotes.",
    },
    "Peak vs Off-season Savings Calculator — Date Shift Value",
    "Calculate savings by traveling off-peak instead of peak dates. Holiday planning aid — availability varies.",
    ["peak vs off season savings", "off peak travel savings", "shoulder season price compare"],
    VACATION_HUB,
  ),
  "travel-holiday-surcharge-estimator": article(
    "travel-holiday-surcharge-estimator",
    "Holiday surcharge",
    [
      "Applies a holiday surcharge percent to a base rate to estimate peak-date premiums on hotels or tours.",
      "Some properties quote surcharge as a flat fee per night — convert to percent or enter the all-in holiday rate instead.",
    ],
    {
      question: "Are holiday surcharges refundable?",
      answer:
        "Usually they follow the same cancellation rules as the base rate. Read the property or tour terms carefully.",
    },
    "Holiday Surcharge Estimator — Peak Date Premium %",
    "Estimate holiday surcharge on a base travel rate. Vacation planning — confirm with the property or operator.",
    ["holiday surcharge estimator", "peak date hotel premium", "holiday travel surcharge"],
    VACATION_HUB,
  ),
};
