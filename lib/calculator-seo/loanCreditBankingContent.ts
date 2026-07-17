import type { RichArticle } from "./types";

const HUB_HREF = "/finance/banking-credit/loan-credit-calculators";
const HUB_LABEL = "Finance · Loan and Credit";
const SHELL =
  "Runs in your browser. Illustrative loan maths with reducing-balance EMI—not a loan offer. Rates, fees, and eligibility depend on the lender.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  chartKind: "sparkTrendDemo" | "loanBalanceDemo" | "none" = "loanBalanceDemo",
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "finance",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Loan planning checklist",
        columnHeaders: ["Step", "Why it matters"],
        rows: [
          ["Compare total interest", "Lower EMI can still cost more over life"],
          ["Check all-in fees", "Processing and insurance add to true cost"],
          ["Stress-test rates", "Floating loans can rise mid-tenure"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : chartKind === "sparkTrendDemo"
          ? {
              kind: "sparkTrendDemo",
              title: "Principal vs interest over time",
              caption: "Share URL preserves your inputs.",
              sparkValues: [1, 0.92, 0.82, 0.7, 0.55, 0.38, 0.18, 0],
            }
          : {
              kind: "loanBalanceDemo",
              title: "Loan balance declining",
              caption: "Share URL preserves your inputs.",
            },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const LOAN_CREDIT_BANKING_ARTICLES: Record<string, RichArticle> = {
  "loan-interest-calculator": article(
    "loan-interest-calculator",
    "Loan interest and EMI",
    [
      "Standard reducing-balance EMI splits each payment into interest on outstanding principal and principal repayment.",
      "Total interest is the gap between all EMIs paid and the original loan amount.",
    ],
    {
      question: "Flat vs reducing balance?",
      answer: "Most bank personal and home loans use reducing balance. Flat-rate quotes look cheaper on paper—compare total interest instead.",
    },
    "Loan Interest Calculator",
    "Calculate monthly EMI, total interest, and total repayment for a reducing-balance loan.",
    ["loan interest calculator", "EMI calculator", "total loan interest"],
    "loanBalanceDemo",
  ),
  "loan-affordability-calculator": article(
    "loan-affordability-calculator",
    "Loan affordability",
    [
      "Max EMI ≈ income × DTI cap − existing EMIs. Affordable principal is backed out from EMI, rate, and term.",
      "Lenders may use different DTI limits and include living expenses—treat this as a planning starting point.",
    ],
    {
      question: "What DTI should I use?",
      answer: "Many banks target ~40–50% total obligations including the new EMI. Conservative planners use 35–40%.",
    },
    "Loan Affordability Calculator",
    "Estimate maximum EMI and loan amount from income, existing EMIs, and DTI cap.",
    ["loan affordability calculator", "how much loan can I afford", "DTI loan"],
    "sparkTrendDemo",
  ),
  "loan-amortization-calculator-with-full-schedule": article(
    "loan-amortization-calculator-with-full-schedule",
    "Full amortization schedule",
    [
      "Each row shows EMI, interest portion, principal portion, and remaining balance after that month.",
      "Early months are interest-heavy; principal share rises as balance falls.",
    ],
    {
      question: "Why might my bank schedule differ slightly?",
      answer: "Rounding per payment, disbursal date, and leap days can shift pennies. Structure should match closely.",
    },
    "Loan Amortization Calculator with Full Schedule",
    "Generate EMI with month-by-month principal, interest, and balance schedule.",
    ["loan amortization schedule", "EMI breakdown", "amortization calculator"],
    "loanBalanceDemo",
  ),
  "prepayment-foreclosure-calculator": article(
    "prepayment-foreclosure-calculator",
    "Foreclosure after N months",
    [
      "Outstanding at closure month is the balance after that EMI. Add optional foreclosure fee % on outstanding.",
      "Interest saved compares what you would have paid over the full original term vs paid to date.",
    ],
    {
      question: "Is foreclosure always allowed?",
      answer: "Some loans have lock-in periods or minimum notice. Confirm with your lender before relying on a closure quote.",
    },
    "Prepayment Foreclosure Calculator",
    "Estimate outstanding balance and interest saved when foreclosing a loan after N EMIs.",
    ["foreclosure calculator", "loan prepayment", "close loan early"],
    "sparkTrendDemo",
  ),
  "part-payment-impact-calculator": article(
    "part-payment-impact-calculator",
    "Part payment impact",
    [
      "Applies a lump sum after a chosen month, then recalculates EMI for the remaining tenure on the lower balance.",
      "Shows EMI drop and interest saved versus continuing without the part payment.",
    ],
    {
      question: "Reduce EMI or tenure?",
      answer: "Many lenders let you choose. This tool models EMI reduction with the same remaining months—ask your bank for tenure-shortening quotes too.",
    },
    "Part Payment Impact Calculator",
    "See EMI reduction and interest saved from a lump-sum part payment on your loan.",
    ["part payment calculator", "loan prepayment impact", "reduce EMI"],
    "loanBalanceDemo",
  ),
  "reducing-balance-calculator": article(
    "reducing-balance-calculator",
    "Reducing balance EMI",
    [
      "Interest each month is charged only on the outstanding principal—unlike flat-rate loans.",
      "Use the same inputs as the loan interest calculator; this page emphasizes the reducing-balance method.",
    ],
    {
      question: "How is EMI calculated?",
      answer: "EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1) with monthly rate r and n months.",
    },
    "Reducing Balance Calculator",
    "Calculate reducing-balance EMI and total interest for personal or home loans.",
    ["reducing balance calculator", "reducing balance EMI", "daily reducing balance"],
    "loanBalanceDemo",
  ),
  "loan-comparison-calculator-multi-bank": article(
    "loan-comparison-calculator-multi-bank",
    "Multi-bank loan comparison",
    [
      "Compare EMI and total interest for the same principal and tenure at up to three rate quotes.",
      "Cheapest label is based on lowest total interest, not lowest EMI.",
    ],
    {
      question: "Should I ignore processing fees?",
      answer: "For a fuller picture, add fees in the total loan cost calculator. Small rate gaps can flip once fees are included.",
    },
    "Loan Comparison Calculator (Multi-Bank)",
    "Compare EMI and total interest across up to three bank loan rate quotes.",
    ["loan comparison calculator", "compare bank loan rates", "multi bank EMI"],
    "sparkTrendDemo",
  ),
  "floating-vs-fixed-interest-calculator": article(
    "floating-vs-fixed-interest-calculator",
    "Floating vs fixed interest",
    [
      "Fixed: one rate for the full tenure. Floating: starts at one rate, then reprices remaining balance after a set period.",
      "Use when deciding between a fixed home loan and a floating product with an initial discount.",
    ],
    {
      question: "Does floating include future rate paths?",
      answer: "You enter the later rate explicitly—it is a scenario, not a forecast of RBI or MCLR moves.",
    },
    "Floating vs Fixed Interest Calculator",
    "Compare total interest under fixed rate vs floating rate that resets after a period.",
    ["floating vs fixed calculator", "home loan floating rate", "fixed rate comparison"],
    "loanBalanceDemo",
  ),
  "interest-rate-sensitivity-calculator": article(
    "interest-rate-sensitivity-calculator",
    "Rate sensitivity",
    [
      "Shows EMI and total interest if the rate rises or falls by a shock amount (percentage points).",
      "Useful for floating-rate borrowers planning buffer in their budget.",
    ],
    {
      question: "Will my EMI change automatically?",
      answer: "Floating loans usually reset EMI or tenure when benchmark rates move—check your loan agreement.",
    },
    "Interest Rate Sensitivity Calculator",
    "See how EMI and total interest change if loan rates move up or down.",
    ["interest rate sensitivity", "EMI if rates rise", "rate shock calculator"],
    "sparkTrendDemo",
  ),
  "total-loan-cost-calculator": article(
    "total-loan-cost-calculator",
    "Total loan cost",
    [
      "Total cost = all EMI payments + processing fee (% of principal) + other upfront charges.",
      "Reveals true borrowing cost beyond the advertised interest rate.",
    ],
    {
      question: "What other fees should I add?",
      answer: "Include legal, valuation, insurance premium if financed, and GST on fees where applicable.",
    },
    "Total Loan Cost Calculator",
    "Calculate all-in loan cost including EMI repayments, processing fees, and other charges.",
    ["total loan cost calculator", "loan true cost", "processing fee loan"],
    "none",
  ),
};
