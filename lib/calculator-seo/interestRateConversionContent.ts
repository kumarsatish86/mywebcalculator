import type { RichArticle } from "./types";

const HUB_HREF = "/finance/banking-credit/interest-rate-conversion-tools";
const HUB_LABEL = "Finance · Interest Rate Conversion";
const SHELL =
  "Runs in your browser. Rate conversions are illustrative—lenders may use different day-count, fee, and compounding conventions.";

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
        title: "Rate terms at a glance",
        columnHeaders: ["Term", "Meaning"],
        rows: [
          ["APR", "Annual cost including fees (simplified)"],
          ["APY", "Effective yield with compounding"],
          ["Flat rate", "Interest on original principal each period"],
          ["Reducing", "Interest on outstanding balance"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : chartKind === "loanBalanceDemo"
          ? {
              kind: "loanBalanceDemo",
              title: "Interest cost comparison",
              caption: "Share URL preserves your inputs.",
            }
          : {
              kind: "sparkTrendDemo",
              title: "Effective yield trend",
              caption: "Share URL preserves your inputs.",
              sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.92],
            },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const INTEREST_RATE_CONVERSION_ARTICLES: Record<string, RichArticle> = {
  "apr-calculator": article(
    "apr-calculator",
    "APR from fees and interest",
    [
      "Simplified APR = (interest + fees) ÷ principal ÷ years × 100.",
      "Useful for comparing loans with upfront processing charges.",
    ],
    {
      question: "Is this the same as RBI APR disclosure?",
      answer: "Regulatory APR may include additional costs and day-count rules—treat this as a quick estimate.",
    },
    "APR Calculator",
    "Estimate APR from loan principal, interest rate, fees, and term.",
    ["APR calculator", "annual percentage rate", "loan APR with fees"],
    "sparkTrendDemo",
  ),
  "apy-calculator": article(
    "apy-calculator",
    "APY from nominal rate",
    [
      "APY = (1 + r/n)^n − 1 where r is nominal annual rate and n is compounds per year.",
      "Higher compounding frequency raises APY above the nominal rate.",
    ],
    {
      question: "Quarterly vs monthly compounding?",
      answer: "More frequent compounding yields a higher APY for the same nominal rate.",
    },
    "APY Calculator",
    "Convert nominal interest rate to APY given compounding frequency.",
    ["APY calculator", "annual percentage yield", "nominal to APY"],
    "sparkTrendDemo",
  ),
  "nominal-vs-effective-interest-calculator": article(
    "nominal-vs-effective-interest-calculator",
    "Nominal vs effective rate",
    [
      "Shows nominal annual rate alongside effective (APY) rate and the difference in percentage points.",
      "Helps compare deposit products quoted on different bases.",
    ],
    {
      question: "Which rate should I compare for FDs?",
      answer: "Compare effective annual yield when compounding differs between banks.",
    },
    "Nominal vs Effective Interest Calculator",
    "Compare nominal and effective interest rates with compounding frequency.",
    ["nominal vs effective rate", "effective interest calculator", "APY vs nominal"],
    "none",
  ),
  "monthly-annual-interest-converter": article(
    "monthly-annual-interest-converter",
    "Monthly ↔ annual interest",
    [
      "Simple conversion: annual ≈ monthly × 12 or monthly ≈ annual ÷ 12.",
      "Does not account for compounding—use APY calculator for compounded yields.",
    ],
    {
      question: "When is simple conversion wrong?",
      answer: "For compounded products or EMI math, use reducing-balance or APY tools instead.",
    },
    "Monthly Annual Interest Converter",
    "Convert between monthly and annual simple interest rates.",
    ["monthly to annual interest", "annual to monthly rate", "interest rate converter"],
    "none",
  ),
  "reducing-vs-flat-rate-converter": article(
    "reducing-vs-flat-rate-converter",
    "Reducing vs flat rate",
    [
      "Compares EMI and total interest under flat-rate vs reducing-balance methods for the same principal and term.",
      "Flat equivalent reducing APR shows what reducing rate would match the flat EMI quote.",
    ],
    {
      question: "Why is flat rate EMI misleading?",
      answer: "Flat interest is charged on full principal throughout—reducing balance costs less for the same quoted %.",
    },
    "Reducing vs Flat Rate Converter",
    "Compare flat vs reducing balance loan EMI, interest, and equivalent APR.",
    ["flat vs reducing rate", "flat rate converter", "reducing balance comparison"],
    "loanBalanceDemo",
  ),
};
