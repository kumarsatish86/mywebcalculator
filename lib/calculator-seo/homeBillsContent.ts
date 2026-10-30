import type { RichArticle } from "./types";

const HUB_HREF = "/daily/home-utility/home-bills-expenses";
const HUB_LABEL = "Daily life · Home utility · Bills and monthly expense calculators";
const SHELL =
  "Daily home and utility estimation tools that run in your browser. Not financial, legal, or contract advice. Tariffs, taxes, utility rates, and local regulations vary by region — verify amounts on your actual bill or bank statement.";

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
        title: "Bills and expense tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Monthly expense", "Sum fixed + variable household lines"],
          ["Household budget", "Income − planned categories − savings"],
          ["Cost of living", "Housing + food + transport + utilities index"],
          ["OTT subscription cost", "Plans × months + annual discounts"],
          ["Internet bill", "Plan fee + tax + equipment rental"],
          ["Mobile recharge", "Prepaid packs or postpaid ARPU"],
          ["Gas bill", "Therms or SCM × tariff + fixed fee"],
          ["LPG usage", "Cylinder frequency × cylinder price"],
          ["Garbage/utility fee", "Municipal flat or volume charge"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your expense inputs. Planning estimate only — tariffs, taxes, and promo pricing vary by region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HOME_BILLS_ARTICLES: Record<string, RichArticle> = {
  "home-monthly-expense-calculator": article(
    "home-monthly-expense-calculator",
    "Monthly expense",
    [
      "Adds recurring household lines — rent, utilities, groceries, transport, subscriptions — into one monthly total.",
      "Annual or quarterly bills (insurance, school fees) should be normalized to a monthly equivalent for fair comparison.",
    ],
    {
      question: "Should I use cash or accrual timing?",
      answer:
        "For budgeting, accrual (spread annual costs monthly) smooths spikes. Cash view matches bank outflows — pick one lens and stick to it.",
    },
    "Monthly Expense Calculator — Household Spending Total",
    "Sum monthly household expenses across categories. Daily budgeting aid — not tax or financial advice.",
    ["monthly expense calculator", "household spending total", "home budget monthly"],
  ),
  "home-household-budget-calculator": article(
    "home-household-budget-calculator",
    "Household budget",
    [
      "Allocates income across needs, wants, and savings targets using your category caps or a 50/30/20-style split.",
      "Irregular income needs a buffer line — average three to six months of net pay when setting category limits.",
    ],
    {
      question: "What if expenses exceed income?",
      answer:
        "Flag the gap and trim discretionary lines first, then renegotiate fixed bills (plans, insurance) before touching emergency savings.",
    },
    "Household Budget Calculator — Income vs Categories",
    "Build a home budget from income and category limits. Planning tool — adjust for local cost of living.",
    ["household budget calculator", "family budget planner", "monthly budget categories"],
  ),
  "home-cost-of-living-calculator": article(
    "home-cost-of-living-calculator",
    "Cost of living",
    [
      "Combines housing, food, utilities, and transport into a monthly snapshot for comparing lifestyles or cities.",
      "Index multipliers are illustrative unless you enter local rents and tariffs from current listings and bills.",
    ],
    {
      question: "Can I compare two cities with this?",
      answer:
        "Yes if you enter city-specific rent and utility assumptions side by side. Generic defaults are not relocation advice.",
    },
    "Cost of Living Calculator — Monthly Home Expense Snapshot",
    "Estimate monthly cost of living from housing, food, and utilities. Comparison aid — verify local prices.",
    ["cost of living calculator", "monthly living expenses", "household cost index"],
  ),
  "home-ott-subscription-cost-calculator": article(
    "home-ott-subscription-cost-calculator",
    "OTT subscription cost",
    [
      "Totals streaming and digital subscriptions by plan tier, billing cycle, and shared family seats.",
      "Promo pricing, annual prepay discounts, and tax-inclusive display differ by platform — enter what your card is charged.",
    ],
    {
      question: "Annual vs monthly — which is cheaper?",
      answer:
        "Annual plans often save 15–20% if you keep the service all year. Factor cancellation policies before prepaying.",
    },
    "OTT Subscription Cost Calculator — Streaming Monthly Total",
    "Add up Netflix-style subscriptions and annual plan savings. Budgeting aid — prices change by region.",
    ["OTT subscription cost calculator", "streaming services monthly cost", "Netflix Disney total bill"],
  ),
  "home-internet-bill-calculator": article(
    "home-internet-bill-calculator",
    "Internet bill",
    [
      "Estimates broadband cost from plan speed tier, monthly fee, router rental, and applicable taxes.",
      "Data caps, bundle discounts with mobile, and installation amortization may not be modeled — add manually.",
    ],
    {
      question: "Is advertised speed the same as billed price?",
      answer:
        "Promo rates often expire after 12 months. Budget at the post-promo price and add equipment fees shown in fine print.",
    },
    "Internet Bill Calculator — Broadband Monthly Cost",
    "Estimate home internet bill from plan fee and add-ons. Utility budgeting — tariffs vary by ISP and region.",
    ["internet bill calculator", "broadband monthly cost", "wifi plan price estimate"],
  ),
  "home-mobile-recharge-cost-calculator": article(
    "home-mobile-recharge-cost-calculator",
    "Mobile recharge cost",
    [
      "Projects monthly mobile spend from prepaid top-ups or postpaid plan ARPU across family lines.",
      "Roaming, international packs, and device EMI on the same invoice should be split for true telecom cost.",
    ],
    {
      question: "Prepaid or postpaid — which to budget?",
      answer:
        "Use actual three-month average recharge or bill history. Postpaid family plans need per-line add-on math.",
    },
    "Mobile Recharge Cost Calculator — Monthly Phone Spend",
    "Estimate monthly mobile cost from prepaid or postpaid inputs. Budgeting aid — carrier taxes vary.",
    ["mobile recharge cost calculator", "monthly phone bill estimate", "prepaid recharge budget"],
  ),
  "home-gas-bill-calculator": article(
    "home-gas-bill-calculator",
    "Gas bill",
    [
      "Estimates piped natural gas or utility gas charges from consumption units (SCM, therm, or kWh gas) and tariff.",
      "Slab tariffs and fixed customer charges mirror electricity — use blended rate from a recent bill when tiers apply.",
    ],
    {
      question: "How is cooking gas different from piped gas?",
      answer:
        "LPG cylinders use count × cylinder price; piped gas uses metered SCM. This tool expects metered utility-style inputs.",
    },
    "Gas Bill Calculator — Monthly Piped Gas Cost",
    "Estimate monthly gas utility bill from consumption and tariff. Home budgeting — rates and taxes vary by region.",
    ["gas bill calculator", "piped gas monthly cost", "natural gas bill estimate"],
  ),
  "home-lpg-usage-calculator": article(
    "home-lpg-usage-calculator",
    "LPG usage",
    [
      "Relates cylinder size, refill frequency, and household cooking load to monthly LPG spend.",
      "Commercial cylinders, subsidized quotas, and dual-fuel kitchens need separate line items.",
    ],
    {
      question: "How long should one cylinder last?",
      answer:
        "Varies by family size and cuisine (2–8 weeks for typical 14.2 kg domestic cylinders). Track your own refill dates for accuracy.",
    },
    "LPG Usage Calculator — Cylinder Cost per Month",
    "Estimate monthly LPG cost from cylinder size and refill frequency. Kitchen budgeting — subsidy rules vary.",
    ["LPG usage calculator", "cooking gas monthly cost", "cylinder refill estimate"],
  ),
  "home-garbage-utility-fee-calculator": article(
    "home-garbage-utility-fee-calculator",
    "Garbage/utility fee",
    [
      "Estimates municipal solid-waste or bundled utility fees from flat rate, bin size, or property assessment rules.",
      "Recycling credits, commercial vs residential classification, and special bulk pickup fees are locality-specific.",
    ],
    {
      question: "Is waste fee separate from property tax?",
      answer:
        "Sometimes bundled on one bill, sometimes a standalone line. Check your municipality's invoice breakdown.",
    },
    "Garbage Utility Fee Calculator — Municipal Waste Charge",
    "Estimate monthly garbage or waste collection fee. Municipal planning aid — rules vary by city.",
    ["garbage utility fee calculator", "waste collection charge", "municipal utility fee estimate"],
  ),
};
