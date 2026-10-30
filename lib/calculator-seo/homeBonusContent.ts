import type { RichArticle } from "./types";

const HUB_HREF = "/daily/home-utility/home-utility-bonus";
const HUB_LABEL = "Daily life · Home utility · High-intent home utility calculators";
const SHELL =
  "Daily home and utility estimation tools that run in your browser. Not financial, legal, or contract advice. Tariffs, taxes, utility rates, and local regulations vary by region — verify amounts on your actual bill or lease.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "daily",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "High-intent home utility tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Electricity bill split", "Roommates share kWh or bill total"],
          ["Cost per appliance usage", "Single device run × tariff"],
          ["Peak hour electricity cost", "TOU rate × peak kWh"],
          ["Daily vs monthly utility", "Daily average vs billing cycle compare"],
          ["Utility comparison (city)", "Same usage × city tariff index"],
          ["Rent + utility combined", "Rent + power + water + gas rollup"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your utility inputs. Planning estimate only — time-of-use tariffs and city rates vary by region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HOME_BONUS_ARTICLES: Record<string, RichArticle> = {
  "home-electricity-bill-split-roommates-calculator": article(
    "home-electricity-bill-split-roommates-calculator",
    "Electricity bill split (roommates)",
    [
      "Splits total electricity bill or metered kWh among roommates by equal share, room weight, or sub-meter readings.",
      "Common-area loads (fridge, router) need agreed allocation — equal split is simplest but not always fairest.",
    ],
    {
      question: "Split by kWh or by bill amount?",
      answer:
        "If one sub-meter tracks a room, use kWh. Otherwise split the bill total after fixed charges — agree how fixed fees are shared.",
    },
    "Electricity Bill Split Calculator — Roommates Share",
    "Split home electricity bill fairly among roommates. Household budgeting — not legal advice.",
    ["electricity bill split roommates", "share power bill calculator", "roommate utility split"],
  ),
  "home-cost-per-appliance-usage-calculator": article(
    "home-cost-per-appliance-usage-calculator",
    "Cost per appliance usage",
    [
      "Shows cost per hour, day, or month for one appliance from wattage, run time, and your effective tariff.",
      "Useful for deciding whether to retire an old AC or run laundry off-peak when time-of-use rates apply.",
    ],
    {
      question: "Why track single-appliance cost?",
      answer:
        "It isolates the biggest bill drivers. Compare cost per use before buying a second fridge or space heater.",
    },
    "Cost per Appliance Usage Calculator — $/h or ₹/month",
    "Calculate running cost for one appliance from watts and hours. Energy literacy — tariffs vary by region.",
    ["cost per appliance usage calculator", "appliance cost per hour", "device electricity cost"],
  ),
  "home-peak-hour-electricity-cost-calculator": article(
    "home-peak-hour-electricity-cost-calculator",
    "Peak hour electricity cost",
    [
      "Applies peak time-of-use tariff to kWh consumed during on-peak windows versus off-peak for bill sensitivity analysis.",
      "Utility peak definitions (afternoon summer vs evening winter) differ — enter windows from your tariff sheet.",
    ],
    {
      question: "Can shifting load really lower bills?",
      answer:
        "Yes under strong TOU spreads. Shift dishwasher, EV charging, and laundry to off-peak when your plan rewards it.",
    },
    "Peak Hour Electricity Cost Calculator — TOU Bill Impact",
    "Estimate cost of peak vs off-peak electricity usage. Tariff planning aid — TOU rules vary by utility.",
    ["peak hour electricity cost calculator", "time of use bill estimate", "on peak kWh cost"],
  ),
  "home-daily-vs-monthly-utility-analyzer": article(
    "home-daily-vs-monthly-utility-analyzer",
    "Daily vs monthly utility",
    [
      "Compares average daily spend derived from meter trends against monthly billing cycle totals to spot drift or leaks.",
      "Short monitoring windows miss seasonal HVAC — align comparison length to at least one full billing cycle.",
    ],
    {
      question: "Why don't daily and monthly averages match?",
      answer:
        "Fixed charges, slab step-ups, and estimate-vs-actual reads make monthly bills non-linear. Daily averages smooth those effects.",
    },
    "Daily vs Monthly Utility Analyzer — Spend Pattern Check",
    "Compare daily average utility cost to monthly bill totals. Budgeting aid — billing cycles vary by provider.",
    ["daily vs monthly utility analyzer", "utility spend pattern", "average daily electricity cost"],
  ),
  "home-utility-comparison-city-wise-calculator": article(
    "home-utility-comparison-city-wise-calculator",
    "Utility comparison (city-wise)",
    [
      "Runs the same household usage profile against different city tariff assumptions for relocation or remote-work planning.",
      "Index multipliers are illustrative unless you enter current rent and utility rates from each city's bills.",
    ],
    {
      question: "Should I include rent in utility comparison?",
      answer:
        "This tool focuses on utility tariffs. Pair with rent data separately — total cost of living needs both housing and utilities.",
    },
    "Home Utility Comparison Calculator — City-wise Tariffs",
    "Compare home utility costs across cities with the same usage profile. Planning aid — enter local rates for accuracy.",
    ["utility comparison city wise calculator", "compare electricity cost cities", "home utility cost by city"],
  ),
  "home-rent-plus-utility-combined-calculator": article(
    "home-rent-plus-utility-combined-calculator",
    "Rent + utility combined",
    [
      "Adds rent to estimated electricity, water, gas, and internet for total monthly housing outflow — the number landlords omit.",
      "Seasonal utility swings can exceed rent escalation — budget worst-month utilities, not annual averages only.",
    ],
    {
      question: "What utilities are usually extra to rent?",
      answer:
        "Often electricity, water, gas, internet, and trash. Some leases include water or heat — read whether yours is gross or net of utilities.",
    },
    "Rent + Utility Combined Calculator — Total Housing Cost",
    "Calculate total monthly housing cost as rent plus utilities. Budgeting aid — tariffs and leases vary by region.",
    ["rent plus utility calculator", "total housing cost monthly", "rent and bills combined"],
  ),
};
