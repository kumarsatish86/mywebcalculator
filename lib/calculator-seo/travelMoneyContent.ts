import type { RichArticle } from "./types";

const SHELL =
  "Daily travel planning tools that run in your browser. Not financial, legal, or tax advice. FX rates, ATM fees, tipping norms, and meal prices vary — verify with banks, card issuers, and local customs before you spend.";

const CHART = {
  kind: "none" as const,
  title: "Overview",
  caption:
    "Share URL preserves your travel inputs. Planning estimate only — fares, fees, FX, and policies vary.",
};

const CURRENCY_HUB = {
  href: "/daily/travel/travel-currency-international",
  label: "Daily life · Travel · Currency and international travel calculators",
};

const FOOD_HUB = {
  href: "/daily/travel/travel-food-expenses",
  label: "Daily life · Travel · Food and dining travel calculators",
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
        title: "Travel money and food tools",
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

const CURRENCY_ROWS = [
  ["Currency budget", "Home amount × FX rate"],
  ["ATM fee-adjusted rate", "Net after fees × rate"],
  ["Tipping abroad", "Bill × tip %"],
  ["Purchasing power", "Home price ÷ abroad price"],
];

const FOOD_ROWS = [
  ["Meal per diem", "Daily meals × days × people"],
  ["Restaurant split", "(bill + tip) ÷ people"],
  ["All-inclusive value", "Inclusive cost vs meal value"],
  ["Street food budget", "Daily street × days × people"],
];

export const TRAVEL_MONEY_ARTICLES: Record<string, RichArticle> = {
  "travel-currency-exchange-budget-calculator": article(
    "travel-currency-exchange-budget-calculator",
    "Currency exchange budget",
    [
      "Converts a home-currency travel budget into local currency at the FX rate you enter.",
      "Card and bureau rates include markup over mid-market — use your bank's effective rate when known.",
    ],
    {
      question: "Should I exchange cash or use a card?",
      answer:
        "Cards usually beat airport bureaux for spending. Keep a small cash float for places that do not take cards.",
    },
    "Currency Exchange Budget Calculator — Home to Local FX",
    "Convert travel budget to local currency at your FX rate. International planning — bank fees may apply.",
    ["currency exchange budget", "travel FX calculator", "trip budget in local currency"],
    CURRENCY_HUB,
    CURRENCY_ROWS,
  ),
  "travel-atm-fee-adjusted-rate-calculator": article(
    "travel-atm-fee-adjusted-rate-calculator",
    "ATM fee-adjusted rate",
    [
      "Shows how percent and fixed ATM fees worsen the effective exchange rate on a withdrawal.",
      "Foreign ATMs may add operator fees on top of your bank's fee — enter the full fee stack.",
    ],
    {
      question: "How can I reduce ATM FX cost?",
      answer:
        "Withdraw larger amounts less often (if safe), use fee-rebate cards, and decline dynamic currency conversion.",
    },
    "ATM Fee-adjusted Rate Calculator — True Withdrawal FX",
    "Estimate effective FX after ATM percent and fixed fees. Travel cash aid — operator fees vary.",
    ["atm fee adjusted rate", "travel atm fee calculator", "effective withdrawal fx"],
    CURRENCY_HUB,
    CURRENCY_ROWS,
  ),
  "travel-tipping-abroad-calculator": article(
    "travel-tipping-abroad-calculator",
    "Tipping abroad",
    [
      "Calculates tip amount and bill total from a restaurant or service bill and a tip percent you choose.",
      "Norms differ widely by country — research local custom; some places include service charge already.",
    ],
    {
      question: "Do I tip on top of service charge?",
      answer:
        "If a mandatory service charge is listed, extra tip is optional. When unsure, ask staff or check local guides.",
    },
    "Tipping Abroad Calculator — Tip % on Foreign Bills",
    "Calculate tip and total on overseas restaurant or service bills. Travel etiquette aid — customs vary.",
    ["tipping abroad calculator", "international tip percent", "travel tip calculator"],
    CURRENCY_HUB,
    CURRENCY_ROWS,
  ),
  "travel-purchasing-power-comparison-calculator": article(
    "travel-purchasing-power-comparison-calculator",
    "Purchasing power comparison",
    [
      "Compares the price of a similar basket at home versus abroad to gauge relative purchasing power.",
      "Use the same item quality (coffee, meal, transit ride) so the ratio is meaningful for budgeting.",
    ],
    {
      question: "Is this the same as PPP from economics?",
      answer:
        "It is a simplified basket ratio for travelers, not official PPP statistics from statistical agencies.",
    },
    "Purchasing Power Comparison Calculator — Home vs Abroad",
    "Compare same-basket prices at home and abroad for trip budgeting. Planning estimate — baskets differ.",
    ["purchasing power travel", "home vs abroad price", "travel cost of living compare"],
    CURRENCY_HUB,
    CURRENCY_ROWS,
  ),
  "travel-meal-per-diem-calculator": article(
    "travel-meal-per-diem-calculator",
    "Meal per diem",
    [
      "Multiplies a daily meal allowance by days and people for food budget planning on a trip.",
      "Business travelers may need employer per-diem caps — personal trips can set a comfort-based daily target.",
    ],
    {
      question: "Should breakfast be included in hotel?",
      answer:
        "If lodging includes breakfast, lower the daily meal rate for those days so you do not double-count.",
    },
    "Meal Per Diem Calculator — Daily Food Budget × Days",
    "Estimate trip meal spend from daily per diem, days, and people. Food planning — prices vary by city.",
    ["meal per diem calculator", "travel food budget", "daily meal allowance trip"],
    FOOD_HUB,
    FOOD_ROWS,
  ),
  "travel-restaurant-bill-split-travel-calculator": article(
    "travel-restaurant-bill-split-travel-calculator",
    "Restaurant bill split (travel)",
    [
      "Splits a restaurant bill equally after an optional tip percent — handy for group dinners on the road.",
      "Uneven orders or shared appetizers may need manual adjustments after the equal split.",
    ],
    {
      question: "Who pays the FX or card fee?",
      answer:
        "Agree before paying. Often the cardholder absorbs FX and others repay the shared local total.",
    },
    "Restaurant Bill Split Calculator — Travel Group Dining",
    "Split travel restaurant bills with tip among diners. Group trip aid — tipping customs vary.",
    ["travel restaurant bill split", "group dinner split abroad", "tip and split calculator"],
    FOOD_HUB,
    FOOD_ROWS,
  ),
  "travel-all-inclusive-value-calculator": article(
    "travel-all-inclusive-value-calculator",
    "All-inclusive value",
    [
      "Compares an all-inclusive package cost against the estimated value of included meals (and similar extras).",
      "Drinks packages, kids clubs, and beach clubs change value — expand meal value if those matter to you.",
    ],
    {
      question: "When is all-inclusive worth it?",
      answer:
        "When your expected à-la-carte food and drink spend approaches or exceeds the premium over room-only.",
    },
    "All-inclusive Value Calculator — Package vs Meal Spend",
    "Compare all-inclusive cost to estimated meal value. Resort planning — inclusions and taxes vary.",
    ["all inclusive value calculator", "resort meal package worth", "all inclusive vs pay as you go"],
    FOOD_HUB,
    FOOD_ROWS,
  ),
  "travel-street-food-budget-calculator": article(
    "travel-street-food-budget-calculator",
    "Street food budget",
    [
      "Projects street-food and casual dining spend from a daily street-food target × days × people.",
      "Hygiene and location matter more than price — budget a buffer for occasional sit-down meals.",
    ],
    {
      question: "Is street food always cheaper?",
      answer:
        "Often yes for filling meals, but tourist-heavy stalls can match café prices. Sample local averages.",
    },
    "Street Food Budget Calculator — Casual Meal Trip Spend",
    "Estimate street-food trip budget from daily spend, days, and travelers. Food planning — prices vary.",
    ["street food budget calculator", "travel casual dining budget", "street food trip cost"],
    FOOD_HUB,
    FOOD_ROWS,
  ),
};
