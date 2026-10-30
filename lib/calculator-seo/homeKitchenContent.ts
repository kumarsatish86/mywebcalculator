import type { RichArticle } from "./types";

const HUB_HREF = "/daily/home-utility/home-kitchen-cooking";
const HUB_LABEL = "Daily life · Home utility · Kitchen and cooking utility calculators";
const SHELL =
  "Daily home and utility estimation tools that run in your browser. Not financial, legal, or contract advice. Tariffs, taxes, utility rates, and local regulations vary by region — verify fuel prices and grocery costs locally.";

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
        title: "Kitchen and cooking tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Gas consumption", "Burner load × cooking minutes"],
          ["Cooking cost", "Ingredients + fuel per meal"],
          ["Induction vs gas", "Compare kWh tariff vs LPG per hour"],
          ["Grocery budget", "Household size × per-person food spend"],
          ["Monthly food expense", "Meals × cost per meal rollup"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your kitchen inputs. Planning estimate only — fuel subsidies and food prices vary by region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HOME_KITCHEN_ARTICLES: Record<string, RichArticle> = {
  "home-gas-consumption-calculator": article(
    "home-gas-consumption-calculator",
    "Gas consumption",
    [
      "Relates burner BTU or kW rating, flame setting, and cooking minutes to LPG grams or piped gas volume used.",
      "Simmer vs high flame changes flow — use average flame factor or measured cylinder days-between-refills for calibration.",
    ],
    {
      question: "How much LPG does one hour of cooking use?",
      answer:
        "A full burner might use 150–250 g/h at high flame; simmer is far less. Track cylinder weight over a week for your kitchen.",
    },
    "Gas Consumption Calculator — LPG or Piped Gas Use",
    "Estimate cooking gas use from burner load and cook time. Kitchen budgeting — cylinder prices vary by region.",
    ["gas consumption calculator", "LPG cooking usage estimate", "burner gas per hour"],
  ),
  "home-cooking-cost-calculator": article(
    "home-cooking-cost-calculator",
    "Cooking cost",
    [
      "Adds ingredient cost and fuel or electricity per serving for home-cooked meals versus eating out comparisons.",
      "Bulk buying and pantry staples amortize over many meals — enter per-meal incremental cost for fair takeout contrast.",
    ],
    {
      question: "Should I include my time?",
      answer:
        "This tool covers cash costs only. Value your time separately when deciding cook vs order for busy weeknights.",
    },
    "Cooking Cost Calculator — Meal Cost at Home",
    "Calculate cost per home-cooked meal from ingredients and fuel. Food budgeting aid — prices vary locally.",
    ["cooking cost calculator", "meal cost at home", "home cooked vs takeaway cost"],
  ),
  "home-induction-vs-gas-cost-calculator": article(
    "home-induction-vs-gas-cost-calculator",
    "Induction vs gas cost",
    [
      "Compares energy cost per cooking hour using induction kWh × tariff versus LPG or piped gas consumption rate.",
      "Induction efficiency (~90%) beats open flame (~40–55%) — less energy wasted to the room, not just tariff math.",
    ],
    {
      question: "Is induction always cheaper?",
      answer:
        "Often on kWh vs subsidized LPG, but piped gas and solar-backed electricity change the winner. Run your local numbers.",
    },
    "Induction vs Gas Cost Calculator — Cooking Energy Compare",
    "Compare induction electricity cost to LPG or gas per cooking hour. Kitchen planning — tariffs vary by region.",
    ["induction vs gas cost calculator", "induction or gas cheaper", "cooking fuel cost compare"],
  ),
  "home-grocery-budget-calculator": article(
    "home-grocery-budget-calculator",
    "Grocery budget",
    [
      "Sets monthly food spend from household size and per-person grocery allowance, with optional dining-out line.",
      "Inflation and dietary preferences (organic, specialty) shift baselines — revisit monthly from receipt totals.",
    ],
    {
      question: "What per-person grocery budget is reasonable?",
      answer:
        "Highly local. Track four weeks of receipts, divide by people, then use that average as your calculator input.",
    },
    "Grocery Budget Calculator — Monthly Food Shopping Plan",
    "Plan monthly grocery spend from household size and per-person budget. Daily budgeting — not financial advice.",
    ["grocery budget calculator", "monthly food shopping budget", "household grocery plan"],
  ),
  "home-monthly-food-expense-calculator": article(
    "home-monthly-food-expense-calculator",
    "Monthly food expense",
    [
      "Rolls up groceries, dining out, delivery apps, and school lunch into total monthly food outflow.",
      "Separate alcohol and entertaining if you want clearer discretionary trimming targets.",
    ],
    {
      question: "Include delivery fees and tips?",
      answer:
        "Yes for true food spend. Fees and tips often add 15–30% on apps — include them or you'll under-budget.",
    },
    "Monthly Food Expense Calculator — Total Food Spend",
    "Sum monthly food costs from groceries, dining, and delivery. Household budgeting aid — prices vary.",
    ["monthly food expense calculator", "total food spend monthly", "household food budget total"],
  ),
};
