import type { RichArticle } from "./types";

const HUB_HREF = "/finance/banking-credit/investment-linked-banking-tools";
const HUB_LABEL = "Finance · Investment-Linked Banking";
const SHELL =
  "Runs in your browser. Illustrative comparisons—not investment advice. Past returns and bank rates do not guarantee future outcomes.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  chartKind: "sparkTrendDemo" | "loanBalanceDemo" | "none" = "sparkTrendDemo",
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "finance",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Bank vs market products",
        columnHeaders: ["Product", "Risk profile"],
        rows: [
          ["FD / RD", "Low — bank deposit"],
          ["Savings", "Low — liquidity focus"],
          ["Mutual funds", "Market-linked — varies by fund"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : chartKind === "loanBalanceDemo"
          ? {
              kind: "loanBalanceDemo",
              title: "Growth comparison",
              caption: "Share URL preserves your inputs.",
            }
          : {
              kind: "sparkTrendDemo",
              title: "Wealth accumulation trend",
              caption: "Share URL preserves your inputs.",
              sparkValues: [0.18, 0.32, 0.48, 0.62, 0.78, 0.95],
            },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const INVESTMENT_LINKED_BANKING_ARTICLES: Record<string, RichArticle> = {
  "fd-vs-rd-calculator": article(
    "fd-vs-rd-calculator",
    "FD vs RD comparison",
    [
      "Compares lump-sum FD maturity with an RD of the same monthly amount over the same tenure.",
      "FD wins when you have full principal upfront; RD suits monthly savers without a lump sum.",
    ],
    {
      question: "Are tax and TDS included?",
      answer: "No—gross maturity values only. Add tax impact with the tax-on-interest calculator.",
    },
    "FD vs RD Calculator",
    "Compare fixed deposit vs recurring deposit maturity for the same amount and rate.",
    ["FD vs RD calculator", "FD or RD", "fixed deposit vs recurring deposit"],
    "loanBalanceDemo",
  ),
  "fd-vs-mutual-fund-calculator": article(
    "fd-vs-mutual-fund-calculator",
    "FD vs mutual fund",
    [
      "FD uses compound growth at the stated bank rate; mutual fund uses a constant annual return assumption.",
      "Market funds carry volatility—use conservative return assumptions for planning.",
    ],
    {
      question: "Should I always pick the higher maturity?",
      answer: "Consider liquidity, risk tolerance, and lock-in. Higher projected return usually means higher risk.",
    },
    "FD vs Mutual Fund Calculator",
    "Compare fixed deposit maturity against a mutual fund return assumption.",
    ["FD vs mutual fund", "FD or SIP", "bank FD vs investment"],
    "sparkTrendDemo",
  ),
  "savings-vs-investment-calculator": article(
    "savings-vs-investment-calculator",
    "Savings vs investment",
    [
      "Projects future value of equal monthly contributions at savings rate vs investment return.",
      "Uses monthly compounding for both scenarios.",
    ],
    {
      question: "Is the investment return guaranteed?",
      answer: "No—it is a planning assumption. Actual fund returns fluctuate year to year.",
    },
    "Savings vs Investment Calculator",
    "Compare future value of monthly savings at bank rate vs investment return.",
    ["savings vs investment calculator", "save or invest", "monthly savings comparison"],
    "sparkTrendDemo",
  ),
  "inflation-impact-on-savings-calculator": article(
    "inflation-impact-on-savings-calculator",
    "Inflation impact on savings",
    [
      "Shows nominal future value vs inflation-adjusted purchasing power.",
      "Real rate uses the standard Fisher approximation from nominal return and inflation.",
    ],
    {
      question: "Why does purchasing power fall?",
      answer: "Inflation erodes what each rupee can buy—even when nominal balance grows.",
    },
    "Inflation Impact on Savings Calculator",
    "See how inflation erodes the real value of savings at a given nominal rate.",
    ["inflation impact savings", "real value calculator", "inflation adjusted savings"],
    "loanBalanceDemo",
  ),
  "real-interest-rate-calculator": article(
    "real-interest-rate-calculator",
    "Real interest rate",
    [
      "Real rate ≈ ((1 + nominal) ÷ (1 + inflation)) − 1, expressed as an annual %.",
      "Positive real rate means savings grow faster than prices.",
    ],
    {
      question: "What if inflation exceeds nominal rate?",
      answer: "Real rate turns negative—you lose purchasing power despite earning interest.",
    },
    "Real Interest Rate Calculator",
    "Calculate inflation-adjusted real interest rate from nominal rate and inflation.",
    ["real interest rate calculator", "Fisher equation", "inflation adjusted rate"],
    "none",
  ),
  "tax-on-interest-calculator": article(
    "tax-on-interest-calculator",
    "Tax on interest income",
    [
      "Applies a flat tax rate to gross interest income for a quick after-tax view.",
      "Does not model slab-wise income tax or TDS thresholds.",
    ],
    {
      question: "Is TDS the same as final tax?",
      answer: "TDS is withheld at source; final liability depends on your total income and slab.",
    },
    "Tax on Interest Calculator",
    "Estimate tax on interest income and after-tax interest at a given tax rate.",
    ["tax on interest calculator", "interest income tax", "after tax interest"],
    "none",
  ),
};
