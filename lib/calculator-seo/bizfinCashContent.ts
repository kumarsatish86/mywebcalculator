import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-cash-flow-liquidity";
const HUB_LABEL = "Business · Business finance · Cash flow and liquidity calculators";
const SHELL =
  "Business finance teaching tools that run in your browser. Not financial, legal, tax, or investment advice. Accounting policies, tax rates, and market multiples vary — verify with qualified professionals.";

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
    category: "business",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [{ title: "Cash and liquidity tools", columnHeaders: ["Tool", "Core idea"], rows: [["Cash flow","In − out"],["FCF","OCF − CapEx"],["Ratios","CA÷CL"]] }],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves your inputs. Teaching estimate only — not financial advice." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIZFIN_CASH_ARTICLES: Record<string, RichArticle> = {
  "bizfin-cash-flow-calculator": article(
    "bizfin-cash-flow-calculator",
    "Cash Flow Calculator",
    [
      "Cash Flow Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Cash Flow Calculator — Business Finance Teaching Tool",
    "Estimate cash flow calculator with standard teaching formulas. Not financial advice.",
    ["cash flow calculator","business finance calculator","bizfin cash flow calculator"],
  ),
  "bizfin-free-cash-flow-calculator": article(
    "bizfin-free-cash-flow-calculator",
    "Free Cash Flow Calculator",
    [
      "Free Cash Flow Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Free Cash Flow Calculator — Business Finance Teaching Tool",
    "Estimate free cash flow calculator with standard teaching formulas. Not financial advice.",
    ["free cash flow calculator","business finance calculator","bizfin free cash flow calculator"],
  ),
  "bizfin-operating-cash-flow-calculator": article(
    "bizfin-operating-cash-flow-calculator",
    "Operating Cash Flow Calculator",
    [
      "Operating Cash Flow Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Operating Cash Flow Calculator — Business Finance Teaching Tool",
    "Estimate operating cash flow calculator with standard teaching formulas. Not financial advice.",
    ["operating cash flow calculator","business finance calculator","bizfin operating cash flow calculator"],
  ),
  "bizfin-working-capital-calculator": article(
    "bizfin-working-capital-calculator",
    "Working Capital Calculator",
    [
      "Working Capital Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Working Capital Calculator — Business Finance Teaching Tool",
    "Estimate working capital calculator with standard teaching formulas. Not financial advice.",
    ["working capital calculator","business finance calculator","bizfin working capital calculator"],
  ),
  "bizfin-cash-conversion-cycle-calculator": article(
    "bizfin-cash-conversion-cycle-calculator",
    "Cash Conversion Cycle Calculator",
    [
      "Cash Conversion Cycle Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Cash Conversion Cycle Calculator — Business Finance Teaching Tool",
    "Estimate cash conversion cycle calculator with standard teaching formulas. Not financial advice.",
    ["cash conversion cycle calculator","business finance calculator","bizfin cash conversion cycle calculator"],
  ),
  "bizfin-liquidity-ratio-calculator": article(
    "bizfin-liquidity-ratio-calculator",
    "Liquidity Ratio Calculator",
    [
      "Liquidity Ratio Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Liquidity Ratio Calculator — Business Finance Teaching Tool",
    "Estimate liquidity ratio calculator with standard teaching formulas. Not financial advice.",
    ["liquidity ratio calculator","business finance calculator","bizfin liquidity ratio calculator"],
  ),
  "bizfin-current-ratio-calculator": article(
    "bizfin-current-ratio-calculator",
    "Current Ratio Calculator",
    [
      "Current Ratio Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Current Ratio Calculator — Business Finance Teaching Tool",
    "Estimate current ratio calculator with standard teaching formulas. Not financial advice.",
    ["current ratio calculator","business finance calculator","bizfin current ratio calculator"],
  ),
  "bizfin-quick-ratio-calculator": article(
    "bizfin-quick-ratio-calculator",
    "Quick Ratio Calculator",
    [
      "Quick Ratio Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Quick Ratio Calculator — Business Finance Teaching Tool",
    "Estimate quick ratio calculator with standard teaching formulas. Not financial advice.",
    ["quick ratio calculator","business finance calculator","bizfin quick ratio calculator"],
  )
};
