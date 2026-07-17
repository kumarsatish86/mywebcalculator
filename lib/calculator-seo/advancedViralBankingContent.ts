import type { RichArticle } from "./types";

const HUB_HREF = "/finance/banking-credit/advanced-viral-calculators";
const HUB_LABEL = "Finance · Advanced Viral Banking";
const SHELL =
  "Runs in your browser. Personal finance snapshots—not advice. Use alongside a full budget and professional guidance when needed.";

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
        title: "Financial health signals",
        columnHeaders: ["Metric", "Healthy range (rule of thumb)"],
        rows: [
          ["EMI burden", "≤ 30–40% of income"],
          ["Emergency fund", "3–6 months expenses"],
          ["Savings rate", "10%+ of income"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : chartKind === "loanBalanceDemo"
          ? {
              kind: "loanBalanceDemo",
              title: "Debt payoff trajectory",
              caption: "Share URL preserves your inputs.",
            }
          : {
              kind: "sparkTrendDemo",
              title: "Financial wellness trend",
              caption: "Share URL preserves your inputs.",
              sparkValues: [0.25, 0.4, 0.55, 0.68, 0.8, 0.94],
            },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const ADVANCED_VIRAL_BANKING_ARTICLES: Record<string, RichArticle> = {
  "loan-burden-calculator": article(
    "loan-burden-calculator",
    "Loan burden ratio",
    [
      "Burden % = total monthly EMI ÷ monthly income × 100.",
      "Bands: ≤30% comfortable, 30–40% elevated, >40% high burden.",
    ],
    {
      question: "Should I include credit card minimums?",
      answer: "Include all mandatory debt payments for a realistic burden ratio.",
    },
    "Loan Burden Calculator",
    "Calculate EMI burden as a percentage of monthly income with risk bands.",
    ["loan burden calculator", "EMI to income ratio", "debt burden ratio"],
    "none",
  ),
  "interest-saved-by-prepayment-calculator": article(
    "interest-saved-by-prepayment-calculator",
    "Interest saved by prepayment",
    [
      "Models full loan closure after N EMIs: outstanding balance, foreclosure fee, and interest saved vs full term.",
      "Interest saved = full-term interest − interest paid to date − fees.",
    ],
    {
      question: "Are part-payments the same as foreclosure?",
      answer: "This tool assumes full closure. For partial prepayment, use a part-payment impact calculator.",
    },
    "Interest Saved by Prepayment Calculator",
    "Estimate interest saved and closure cost when prepaying or foreclosing a loan early.",
    ["interest saved prepayment", "loan foreclosure calculator", "prepay home loan"],
    "loanBalanceDemo",
  ),
  "emergency-fund-calculator": article(
    "emergency-fund-calculator",
    "Emergency fund target",
    [
      "Target = monthly expenses × months desired; shortfall = target − current savings.",
      "Months covered now = current savings ÷ monthly expenses.",
    ],
    {
      question: "How many months should I save?",
      answer: "3 months minimum for stable income; 6+ for variable income or single earners.",
    },
    "Emergency Fund Calculator",
    "Calculate emergency fund target, shortfall, and months of expenses currently covered.",
    ["emergency fund calculator", "rainy day fund", "how much emergency savings"],
    "sparkTrendDemo",
  ),
  "financial-health-score-calculator": article(
    "financial-health-score-calculator",
    "Financial health score",
    [
      "Composite 0–100 score from emergency months, DTI %, savings rate, and investment rate.",
      "Tips highlight the weakest areas—emergency fund, debt, or savings.",
    ],
    {
      question: "Is this a credit score?",
      answer: "No—it is a simple planning score, not a bureau credit score.",
    },
    "Financial Health Score Calculator",
    "Get a financial health score from emergency fund, DTI, savings, and investment metrics.",
    ["financial health score", "money health calculator", "personal finance score"],
    "none",
  ),
};
