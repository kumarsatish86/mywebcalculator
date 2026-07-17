import type { RichArticle } from "./types";

const HUB_HREF = "/finance/banking-credit/mortgage-property-financing";
const HUB_LABEL = "Finance · Mortgage & Property";
const SHELL =
  "Runs in your browser. Mortgage maths are illustrative—not lending advice. Rates, insurance, and stamp duty vary by lender and location.";

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
        title: "Home loan milestones",
        columnHeaders: ["Step", "What to model"],
        rows: [
          ["Affordability", "Max EMI from income ratio"],
          ["Down payment", "Cash needed at purchase"],
          ["Amortization", "Principal vs interest each month"],
          ["Refinance", "Break-even on closing costs"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : chartKind === "loanBalanceDemo"
          ? {
              kind: "loanBalanceDemo",
              title: "Mortgage balance over time",
              caption: "Share URL preserves your inputs.",
            }
          : {
              kind: "sparkTrendDemo",
              title: "Equity build-up trend",
              caption: "Share URL preserves your inputs.",
              sparkValues: [0.1, 0.22, 0.38, 0.55, 0.72, 0.9],
            },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MORTGAGE_PROPERTY_ARTICLES: Record<string, RichArticle> = {
  "mortgage-calculator": article(
    "mortgage-calculator",
    "Mortgage EMI",
    [
      "Loan amount = home price − down payment; EMI from standard reducing-balance formula.",
      "Total paid includes principal and interest over the full term.",
    ],
    {
      question: "Are property taxes included?",
      answer: "No—add taxes, insurance, and maintenance separately for full housing cost.",
    },
    "Mortgage Calculator",
    "Calculate home loan EMI, total interest, and repayment from price, down payment, rate, and term.",
    ["mortgage calculator", "home loan EMI", "housing loan calculator"],
    "loanBalanceDemo",
  ),
  "down-payment-calculator": article(
    "down-payment-calculator",
    "Down payment",
    [
      "Down payment = home price × down payment %; loan amount is the remainder.",
      "Use with affordability to see if cash on hand matches required down payment.",
    ],
    {
      question: "What is the minimum down payment?",
      answer: "Lenders set LTV limits—often 10–20% for homes; confirm with your bank.",
    },
    "Down Payment Calculator",
    "Calculate down payment amount and loan amount from home price and down payment percentage.",
    ["down payment calculator", "home down payment", "LTV calculator"],
    "none",
  ),
  "mortgage-amortization-calculator": article(
    "mortgage-amortization-calculator",
    "Mortgage amortization",
    [
      "Month-by-month split of EMI into interest and principal with remaining balance.",
      "Schedule preview shows first months and final month for long terms.",
    ],
    {
      question: "Why is early interest higher?",
      answer: "Interest is charged on the outstanding balance, which is largest at the start of the loan.",
    },
    "Mortgage Amortization Calculator",
    "View mortgage EMI amortization schedule with principal, interest, and balance by month.",
    ["mortgage amortization calculator", "home loan schedule", "amortization table"],
    "loanBalanceDemo",
  ),
  "refinance-calculator": article(
    "refinance-calculator",
    "Refinance savings",
    [
      "Compares current vs new EMI on the same remaining principal and term.",
      "Break-even months = closing costs ÷ monthly savings when savings are positive.",
    ],
    {
      question: "Should I extend the term when refinancing?",
      answer: "This model keeps the same remaining term—extending lowers EMI but may raise total interest.",
    },
    "Refinance Calculator",
    "Compare EMI savings, interest savings, and break-even months when refinancing a mortgage.",
    ["refinance calculator", "mortgage refinance savings", "break even refinance"],
    "sparkTrendDemo",
  ),
  "home-affordability-calculator": article(
    "home-affordability-calculator",
    "Home affordability",
    [
      "Max EMI = income × housing % cap − existing EMIs; max loan inverted from EMI, rate, and term.",
      "Max home price adds available down payment to max loan.",
    ],
    {
      question: "What housing ratio do banks use?",
      answer: "Many lenders cap housing EMI around 40–50% of net income—enter your bank's guideline.",
    },
    "Home Affordability Calculator",
    "Estimate maximum home price from income, existing EMIs, housing ratio, rate, and down payment.",
    ["home affordability calculator", "how much house can I afford", "max home loan"],
    "sparkTrendDemo",
  ),
};
