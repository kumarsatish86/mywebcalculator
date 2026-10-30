import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-profitability-core";
const HUB_LABEL = "Business · Business finance · Profitability calculators";
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
        title: "Profitability tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [["Profit","Revenue − expenses"],["Gross / net","After COGS and full P&L costs"],["Margins","Profit ÷ revenue"],["EBIT / EBITDA","Operating earnings views"]],
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

export const BIZFIN_PROFIT_ARTICLES: Record<string, RichArticle> = {
  "bizfin-profit-calculator": article(
    "bizfin-profit-calculator",
    "Profit Calculator",
    [
      "Profit Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Profit Calculator — Business Finance Teaching Tool",
    "Estimate profit calculator with standard teaching formulas. Not financial advice.",
    ["profit calculator","business finance calculator","bizfin profit calculator"],
  ),
  "bizfin-gross-profit-calculator": article(
    "bizfin-gross-profit-calculator",
    "Gross Profit Calculator",
    [
      "Gross Profit Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Gross Profit Calculator — Business Finance Teaching Tool",
    "Estimate gross profit calculator with standard teaching formulas. Not financial advice.",
    ["gross profit calculator","business finance calculator","bizfin gross profit calculator"],
  ),
  "bizfin-net-profit-calculator": article(
    "bizfin-net-profit-calculator",
    "Net Profit Calculator",
    [
      "Net Profit Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Net Profit Calculator — Business Finance Teaching Tool",
    "Estimate net profit calculator with standard teaching formulas. Not financial advice.",
    ["net profit calculator","business finance calculator","bizfin net profit calculator"],
  ),
  "bizfin-operating-profit-calculator": article(
    "bizfin-operating-profit-calculator",
    "Operating Profit Calculator",
    [
      "Operating Profit Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Operating Profit Calculator — Business Finance Teaching Tool",
    "Estimate operating profit calculator with standard teaching formulas. Not financial advice.",
    ["operating profit calculator","business finance calculator","bizfin operating profit calculator"],
  ),
  "bizfin-profit-margin-calculator": article(
    "bizfin-profit-margin-calculator",
    "Profit Margin Calculator",
    [
      "Profit Margin Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Profit Margin Calculator — Business Finance Teaching Tool",
    "Estimate profit margin calculator with standard teaching formulas. Not financial advice.",
    ["profit margin calculator","business finance calculator","bizfin profit margin calculator"],
  ),
  "bizfin-gross-margin-calculator": article(
    "bizfin-gross-margin-calculator",
    "Gross Margin Calculator",
    [
      "Gross Margin Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Gross Margin Calculator — Business Finance Teaching Tool",
    "Estimate gross margin calculator with standard teaching formulas. Not financial advice.",
    ["gross margin calculator","business finance calculator","bizfin gross margin calculator"],
  ),
  "bizfin-net-margin-calculator": article(
    "bizfin-net-margin-calculator",
    "Net Margin Calculator",
    [
      "Net Margin Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Net Margin Calculator — Business Finance Teaching Tool",
    "Estimate net margin calculator with standard teaching formulas. Not financial advice.",
    ["net margin calculator","business finance calculator","bizfin net margin calculator"],
  ),
  "bizfin-contribution-margin-calculator": article(
    "bizfin-contribution-margin-calculator",
    "Contribution Margin Calculator",
    [
      "Contribution Margin Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Contribution Margin Calculator — Business Finance Teaching Tool",
    "Estimate contribution margin calculator with standard teaching formulas. Not financial advice.",
    ["contribution margin calculator","business finance calculator","bizfin contribution margin calculator"],
  ),
  "bizfin-ebitda-calculator": article(
    "bizfin-ebitda-calculator",
    "EBITDA Calculator",
    [
      "EBITDA Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "EBITDA Calculator — Business Finance Teaching Tool",
    "Estimate ebitda calculator with standard teaching formulas. Not financial advice.",
    ["ebitda calculator","business finance calculator","bizfin ebitda calculator"],
  ),
  "bizfin-ebit-calculator": article(
    "bizfin-ebit-calculator",
    "EBIT Calculator",
    [
      "EBIT Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "EBIT Calculator — Business Finance Teaching Tool",
    "Estimate ebit calculator with standard teaching formulas. Not financial advice.",
    ["ebit calculator","business finance calculator","bizfin ebit calculator"],
  )
};
