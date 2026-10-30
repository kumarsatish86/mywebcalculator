import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-cost-expense";
const HUB_LABEL = "Business · Business finance · Cost and expense calculators";
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
    tables: [{ title: "Cost and expense tools", columnHeaders: ["Tool", "Core idea"], rows: [["Break-even","Fixed ÷ contribution"],["COGS","Beg + purchases − end"],["Unit cost","Total ÷ units"]] }],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves your inputs. Teaching estimate only — not financial advice." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIZFIN_COST_ARTICLES: Record<string, RichArticle> = {
  "bizfin-cost-price-calculator": article(
    "bizfin-cost-price-calculator",
    "Cost Price Calculator",
    [
      "Cost Price Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Cost Price Calculator — Business Finance Teaching Tool",
    "Estimate cost price calculator with standard teaching formulas. Not financial advice.",
    ["cost price calculator","business finance calculator","bizfin cost price calculator"],
  ),
  "bizfin-selling-price-calculator": article(
    "bizfin-selling-price-calculator",
    "Selling Price Calculator",
    [
      "Selling Price Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Selling Price Calculator — Business Finance Teaching Tool",
    "Estimate selling price calculator with standard teaching formulas. Not financial advice.",
    ["selling price calculator","business finance calculator","bizfin selling price calculator"],
  ),
  "bizfin-break-even-calculator": article(
    "bizfin-break-even-calculator",
    "Break-even Calculator",
    [
      "Break-even Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Break-even Calculator — Business Finance Teaching Tool",
    "Estimate break even calculator with standard teaching formulas. Not financial advice.",
    ["break even calculator","business finance calculator","bizfin break even calculator"],
  ),
  "bizfin-fixed-cost-calculator": article(
    "bizfin-fixed-cost-calculator",
    "Fixed Cost Calculator",
    [
      "Fixed Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Fixed Cost Calculator — Business Finance Teaching Tool",
    "Estimate fixed cost calculator with standard teaching formulas. Not financial advice.",
    ["fixed cost calculator","business finance calculator","bizfin fixed cost calculator"],
  ),
  "bizfin-variable-cost-calculator": article(
    "bizfin-variable-cost-calculator",
    "Variable Cost Calculator",
    [
      "Variable Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Variable Cost Calculator — Business Finance Teaching Tool",
    "Estimate variable cost calculator with standard teaching formulas. Not financial advice.",
    ["variable cost calculator","business finance calculator","bizfin variable cost calculator"],
  ),
  "bizfin-total-cost-calculator": article(
    "bizfin-total-cost-calculator",
    "Total Cost Calculator",
    [
      "Total Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Total Cost Calculator — Business Finance Teaching Tool",
    "Estimate total cost calculator with standard teaching formulas. Not financial advice.",
    ["total cost calculator","business finance calculator","bizfin total cost calculator"],
  ),
  "bizfin-unit-cost-calculator": article(
    "bizfin-unit-cost-calculator",
    "Unit Cost Calculator",
    [
      "Unit Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Unit Cost Calculator — Business Finance Teaching Tool",
    "Estimate unit cost calculator with standard teaching formulas. Not financial advice.",
    ["unit cost calculator","business finance calculator","bizfin unit cost calculator"],
  ),
  "bizfin-overhead-cost-calculator": article(
    "bizfin-overhead-cost-calculator",
    "Overhead Cost Calculator",
    [
      "Overhead Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Overhead Cost Calculator — Business Finance Teaching Tool",
    "Estimate overhead cost calculator with standard teaching formulas. Not financial advice.",
    ["overhead cost calculator","business finance calculator","bizfin overhead cost calculator"],
  ),
  "bizfin-cogs-calculator": article(
    "bizfin-cogs-calculator",
    "COGS Calculator",
    [
      "COGS Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "COGS Calculator — Business Finance Teaching Tool",
    "Estimate cogs calculator with standard teaching formulas. Not financial advice.",
    ["cogs calculator","business finance calculator","bizfin cogs calculator"],
  ),
  "bizfin-production-cost-calculator": article(
    "bizfin-production-cost-calculator",
    "Production Cost Calculator",
    [
      "Production Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Production Cost Calculator — Business Finance Teaching Tool",
    "Estimate production cost calculator with standard teaching formulas. Not financial advice.",
    ["production cost calculator","business finance calculator","bizfin production cost calculator"],
  )
};
