import type { RichArticle } from "./types";

const HUB_HREF = "/finance/banking-credit/india-specific-banking-calculators";
const HUB_LABEL = "Finance · India-Specific Banking";
const SHELL =
  "Runs in your browser. Indicative India banking maths—not advice. Bank rates, TDS, and RBI rules change—verify with official sources.";

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
        title: "India banking products",
        columnHeaders: ["Product", "Notes"],
        rows: [
          ["FD", "Quarterly compounding common"],
          ["RD", "Monthly deposits, bank-specific rates"],
          ["Credit card", "High revolving APR if unpaid"],
          ["Home loan", "Reducing balance EMI"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : chartKind === "loanBalanceDemo"
          ? {
              kind: "loanBalanceDemo",
              title: "Deposit growth (India)",
              caption: "Share URL preserves your inputs.",
            }
          : {
              kind: "sparkTrendDemo",
              title: "Savings trend (India)",
              caption: "Share URL preserves your inputs.",
              sparkValues: [0.2, 0.34, 0.5, 0.64, 0.78, 0.92],
            },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const INDIA_SPECIFIC_BANKING_ARTICLES: Record<string, RichArticle> = {
  "fd-calculator-india-bank-wise": article(
    "fd-calculator-india-bank-wise",
    "FD calculator (India, bank-wise)",
    [
      "Select an indicative bank rate or enter custom; maturity uses quarterly compounding (4×/year).",
      "Rates shown are planning defaults—not live quotes.",
    ],
    {
      question: "Is senior citizen rate included?",
      answer: "Pick Custom and enter the senior rate your bank offers if applicable.",
    },
    "FD Calculator India Bank-Wise",
    "Estimate fixed deposit maturity by bank rate with quarterly compounding for India.",
    ["FD calculator India", "bank wise FD", "fixed deposit India"],
    "loanBalanceDemo",
  ),
  "rd-calculator-india": article(
    "rd-calculator-india",
    "RD calculator (India)",
    [
      "Recurring deposit with monthly deposits and monthly compounding on running balance.",
      "Matches common Indian bank RD conventions for planning.",
    ],
    {
      question: "Is TDS deducted on RD interest?",
      answer: "Banks may deduct TDS above thresholds—this shows gross maturity.",
    },
    "RD Calculator India",
    "Calculate recurring deposit maturity value for Indian bank RD products.",
    ["RD calculator India", "recurring deposit India", "RD maturity"],
    "sparkTrendDemo",
  ),
  "credit-card-interest-india": article(
    "credit-card-interest-india",
    "Credit card interest (India)",
    [
      "Projects months to payoff and total interest at a fixed monthly payment.",
      "Indian cards often quote 36–48% APR—pay more than minimum to avoid long payoff.",
    ],
    {
      question: "Why does payoff take so long?",
      answer: "High revolving APR and low minimum payments keep most of each payment as interest.",
    },
    "Credit Card Interest Calculator India",
    "Estimate credit card payoff time and total interest at your monthly payment.",
    ["credit card interest India", "credit card payoff", "revolving interest India"],
    "loanBalanceDemo",
  ),
  "loan-emi-calculator-india": article(
    "loan-emi-calculator-india",
    "Loan EMI (India)",
    [
      "Standard reducing-balance EMI for personal, home, or auto loans in India.",
      "Enter principal in INR, annual rate %, and tenure in months.",
    ],
    {
      question: "Does this include processing fee?",
      answer: "No—EMI is on disbursed principal. Add fees separately with a processing-fee calculator.",
    },
    "Loan EMI Calculator India",
    "Calculate loan EMI, total interest, and repayment for Indian reducing-balance loans.",
    ["loan EMI calculator India", "home loan EMI India", "personal loan EMI"],
    "loanBalanceDemo",
  ),
  "bank-interest-comparison-tool": article(
    "bank-interest-comparison-tool",
    "Bank interest comparison",
    [
      "Compare FD maturity across up to three rate quotes for the same principal and tenure.",
      "Highlights the best label by highest maturity value.",
    ],
    {
      question: "Are rates live?",
      answer: "Enter rates from bank websites or apps—this tool does not fetch live data.",
    },
    "Bank Interest Comparison Tool",
    "Compare fixed deposit maturity across multiple bank interest rates in India.",
    ["bank interest comparison", "FD rate compare", "best FD rate India"],
    "sparkTrendDemo",
  ),
};
