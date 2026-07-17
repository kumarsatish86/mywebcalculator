import type { RichArticle } from "./types";

const HUB_HREF = "/finance/banking-credit/business-corporate-banking-calculators";
const HUB_LABEL = "Finance · Business & Corporate Banking";
const SHELL =
  "Runs in your browser. Business banking estimates—not financial or tax advice. Confirm facility terms, covenants, and fees with your bank.";

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
        title: "Corporate facilities",
        columnHeaders: ["Facility", "Typical use"],
        rows: [
          ["Working capital loan", "Inventory / receivables cycle"],
          ["Credit line", "Revolving short-term draw"],
          ["Invoice financing", "Advance against receivables"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : chartKind === "loanBalanceDemo"
          ? {
              kind: "loanBalanceDemo",
              title: "Cash and loan trajectory",
              caption: "Share URL preserves your inputs.",
            }
          : {
              kind: "sparkTrendDemo",
              title: "Business cash trend",
              caption: "Share URL preserves your inputs.",
              sparkValues: [0.22, 0.38, 0.52, 0.68, 0.82, 0.96],
            },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BUSINESS_CORPORATE_BANKING_ARTICLES: Record<string, RichArticle> = {
  "working-capital-loan-calculator": article(
    "working-capital-loan-calculator",
    "Working capital loan EMI",
    [
      "Standard reducing-balance EMI for a working capital term loan.",
      "Use for quick sizing before negotiating OD vs term loan structures.",
    ],
    {
      question: "Is WC loan interest tax-deductible?",
      answer: "Often yes for business use—confirm with your accountant; this tool only computes EMI.",
    },
    "Working Capital Loan Calculator",
    "Calculate EMI and total interest for a working capital term loan.",
    ["working capital loan calculator", "WC loan EMI", "business term loan"],
    "loanBalanceDemo",
  ),
  "cash-flow-calculator": article(
    "cash-flow-calculator",
    "Cash flow snapshot",
    [
      "Net cash flow = inflows − outflows; closing cash = opening + net.",
      "Surplus/deficit label helps spot monthly liquidity gaps.",
    ],
    {
      question: "Does this include GST timing?",
      answer: "No—enter net cash inflows/outflows you expect in the period.",
    },
    "Cash Flow Calculator",
    "Calculate net cash flow and closing balance from inflows, outflows, and opening cash.",
    ["cash flow calculator", "business cash flow", "net cash flow"],
    "sparkTrendDemo",
  ),
  "business-credit-line-calculator": article(
    "business-credit-line-calculator",
    "Business credit line",
    [
      "Shows available limit, utilization %, and simple interest on drawn amount for N days.",
      "Revolving lines may have commitment fees not modeled here.",
    ],
    {
      question: "Is interest charged on full limit?",
      answer: "Typically only on drawn amount—enter the balance actually utilized.",
    },
    "Business Credit Line Calculator",
    "Estimate utilization, available limit, and interest on a business credit line.",
    ["business credit line calculator", "CC/OD interest", "credit utilization"],
    "none",
  ),
  "invoice-financing-calculator": article(
    "invoice-financing-calculator",
    "Invoice financing",
    [
      "Advance = invoice × advance %; fee charged on advance; net received = advance − fee.",
      "Effective annualized cost extrapolates fee over days until customer payment.",
    ],
    {
      question: "Is recourse factoring included?",
      answer: "This is a simple advance model—recourse, insurance, and collection fees are excluded.",
    },
    "Invoice Financing Calculator",
    "Estimate advance amount, fees, net received, and effective cost for invoice financing.",
    ["invoice financing calculator", "invoice discounting", "factoring advance"],
    "loanBalanceDemo",
  ),
};
