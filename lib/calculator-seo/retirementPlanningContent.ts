import type { RichArticle } from "./types";

const HUB_HREF = "/finance/investment-wealth/retirement-financial-planning";
const HUB_LABEL = "Finance · Retirement and Financial Planning";
const SHELL =
  "Runs in your browser. Illustrative retirement math with editable rates—not personalized advice. Longevity and markets are uncertain; consult a qualified planner for high-stakes decisions.";

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
    category: "finance",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Retirement planning anchors",
        columnHeaders: ["Concept", "Typical planning range"],
        rows: [
          ["Safe withdrawal rate", "3–4%"],
          ["Long-term equity return (nominal)", "8–12%"],
          ["Inflation", "4–6%"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Save → grow → withdraw",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.2, 0.4, 0.65, 0.85, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const RETIREMENT_PLANNING_ARTICLES: Record<string, RichArticle> = {
  "retirement-calculator": article(
    "retirement-calculator",
    "Retirement corpus projection",
    [
      "Grows current savings plus monthly contributions until retirement age at an assumed return.",
      "Years to retirement = retirement age − current age.",
    ],
    {
      question: "Should I use real or nominal returns?",
      answer: "This model uses nominal returns. Pair with the inflation calculator to translate expenses into future rupees.",
    },
    "Retirement Calculator — Corpus Projection",
    "Project retirement corpus from savings, monthly contributions, ages, and expected return.",
    ["retirement calculator", "retirement corpus projection", "retire planning calculator"],
  ),
  "early-retirement-fire-calculator": article(
    "early-retirement-fire-calculator",
    "FIRE number and timeline",
    [
      "FIRE number = annual expenses ÷ withdrawal rate (e.g. 4%).",
      "Simulates monthly investing until corpus reaches that target.",
    ],
    {
      question: "Is 4% always safe?",
      answer: "The classic 4% rule is a planning heuristic from US market history—not a guarantee. Stress-test at 3–3.5% for longer retirements.",
    },
    "Early Retirement (FIRE) Calculator",
    "Calculate your FIRE number and years to financial independence.",
    ["FIRE calculator", "early retirement calculator", "financial independence calculator"],
  ),
  "pension-calculator": article(
    "pension-calculator",
    "Pension from corpus",
    [
      "Monthly pension ≈ corpus × annual payout rate ÷ 12.",
      "Useful for annuity-style or drawdown estimates—not a quote from an insurer.",
    ],
    {
      question: "What payout rate should I use?",
      answer: "Common planning rates are 3–5% depending on age, inflation protection, and whether principal must be preserved.",
    },
    "Pension Calculator",
    "Estimate monthly pension income from a retirement corpus and payout rate.",
    ["pension calculator", "retirement pension estimate", "annuity payout calculator"],
  ),
  "retirement-corpus-calculator": article(
    "retirement-corpus-calculator",
    "Required corpus",
    [
      "Required corpus = (monthly expenses × 12) ÷ withdrawal rate.",
      "Example: ₹50,000/month at 4% needs ₹1.5 crore.",
    ],
    {
      question: "Should expenses be at retirement prices?",
      answer: "Yes—inflate today’s budget first using the inflation impact calculator, then compute corpus.",
    },
    "Retirement Corpus Calculator",
    "Find the nest egg needed to support target monthly expenses at retirement.",
    ["retirement corpus calculator", "how much do I need to retire", "nest egg calculator"],
  ),
  "retirement-withdrawal-calculator": article(
    "retirement-withdrawal-calculator",
    "Withdrawal sustainability",
    [
      "Each month the portfolio earns a return, then a fixed withdrawal is taken.",
      "Shows ending corpus or the month money runs out.",
    ],
    {
      question: "What if I want inflation-adjusted withdrawals?",
      answer: "Raise the monthly withdrawal each year outside this tool, or start with today’s spending already inflated.",
    },
    "Retirement Withdrawal Calculator",
    "Simulate monthly retirement withdrawals and see if the corpus lasts.",
    ["retirement withdrawal calculator", "safe withdrawal simulation", "drawdown calculator"],
  ),
  "inflation-impact-on-retirement-calculator": article(
    "inflation-impact-on-retirement-calculator",
    "Inflation and retirement needs",
    [
      "Future expenses = today’s expenses × (1 + inflation)^years.",
      "Compares required corpus to your planned corpus to show surplus or shortfall.",
    ],
    {
      question: "Why does inflation dominate long plans?",
      answer: "Even 5% inflation roughly doubles costs in ~14 years—understating future expenses is a common planning error.",
    },
    "Inflation Impact on Retirement Calculator",
    "See how inflation raises future retirement expenses and corpus requirements.",
    ["inflation retirement calculator", "retirement inflation impact", "future expense calculator"],
  ),
  "life-expectancy-calculator-financial-context": article(
    "life-expectancy-calculator-financial-context",
    "Financial longevity horizon",
    [
      "Years in retirement = expected lifespan − retirement age.",
      "Inflates expenses to retirement and computes corpus needed for the remaining drawdown years (via withdrawal rate).",
    ],
    {
      question: "Is this a medical life expectancy estimate?",
      answer: "No—you enter an assumed lifespan for money planning (e.g. plan to 90–95). It is not actuarial advice.",
    },
    "Life Expectancy Calculator (Financial Context)",
    "Estimate years to fund in retirement and the corpus needed through your planning lifespan.",
    ["retirement life expectancy calculator", "longevity corpus planning", "years in retirement"],
  ),
};
