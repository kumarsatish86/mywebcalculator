import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-bonus-advanced";
const HUB_LABEL = "Business · Business finance · Advanced and AI-style business calculators";
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
    tables: [
      {
        title: "Advanced tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [["Profit predictor / pricing","Trend and margin heuristics"],["Health score","Margin, liquidity, leverage, growth"],["Dilution / investor return","Post-money ownership and MOIC/IRR"]],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your inputs. Teaching estimate only — not financial advice.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIZFIN_ADVANCED_ARTICLES: Record<string, RichArticle> = {
  "bizfin-ai-business-profit-predictor": article(
    "bizfin-ai-business-profit-predictor",
    "AI Business Profit Predictor",
    [
      "AI Business Profit Predictor for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "AI Business Profit Predictor — Business Finance Teaching Tool",
    "Estimate ai business profit predictor with standard teaching formulas. Not financial advice.",
    ["ai business profit predictor calculator","business finance calculator","bizfin-ai-business-profit-predictor"],
  ),
  "bizfin-ai-pricing-optimizer": article(
    "bizfin-ai-pricing-optimizer",
    "AI Pricing Optimizer",
    [
      "AI Pricing Optimizer for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "AI Pricing Optimizer — Business Finance Teaching Tool",
    "Estimate ai pricing optimizer with standard teaching formulas. Not financial advice.",
    ["ai pricing optimizer calculator","business finance calculator","bizfin-ai-pricing-optimizer"],
  ),
  "bizfin-business-health-score-calculator": article(
    "bizfin-business-health-score-calculator",
    "Business Health Score Calculator",
    [
      "Business Health Score Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Business Health Score Calculator — Business Finance Teaching Tool",
    "Estimate business health score with standard teaching formulas. Not financial advice.",
    ["business health score calculator","business finance calculator","bizfin-business-health-score-calculator"],
  ),
  "bizfin-startup-funding-dilution-calculator": article(
    "bizfin-startup-funding-dilution-calculator",
    "Startup Funding Dilution Calculator",
    [
      "Startup Funding Dilution Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Startup Funding Dilution Calculator — Business Finance Teaching Tool",
    "Estimate startup funding dilution with standard teaching formulas. Not financial advice.",
    ["startup funding dilution calculator","business finance calculator","bizfin-startup-funding-dilution-calculator"],
  ),
  "bizfin-investor-return-calculator": article(
    "bizfin-investor-return-calculator",
    "Investor Return Calculator",
    [
      "Investor Return Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Investor Return Calculator — Business Finance Teaching Tool",
    "Estimate investor return with standard teaching formulas. Not financial advice.",
    ["investor return calculator","business finance calculator","bizfin-investor-return-calculator"],
  ),
};
