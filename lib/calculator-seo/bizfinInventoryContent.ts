import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-inventory-supply-chain";
const HUB_LABEL = "Business · Business finance · Inventory and supply chain calculators";
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
        title: "Inventory tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [["EOQ / order qty","√(2DS/H) and demand splits"],["Safety / ROP","zσ√L and demand×lead + safety"],["Holding / turnover","Carrying cost and COGS ÷ inventory"]],
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

export const BIZFIN_INVENTORY_ARTICLES: Record<string, RichArticle> = {
  "bizfin-inventory-cost-calculator": article(
    "bizfin-inventory-cost-calculator",
    "Inventory Cost Calculator",
    [
      "Inventory Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Inventory Cost Calculator — Business Finance Teaching Tool",
    "Estimate inventory cost with standard teaching formulas. Not financial advice.",
    ["inventory cost calculator","business finance calculator","bizfin-inventory-cost-calculator"],
  ),
  "bizfin-eoq-calculator": article(
    "bizfin-eoq-calculator",
    "EOQ Calculator",
    [
      "EOQ Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "EOQ Calculator — Business Finance Teaching Tool",
    "Estimate eoq with standard teaching formulas. Not financial advice.",
    ["eoq calculator","business finance calculator","bizfin-eoq-calculator"],
  ),
  "bizfin-safety-stock-calculator": article(
    "bizfin-safety-stock-calculator",
    "Safety Stock Calculator",
    [
      "Safety Stock Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Safety Stock Calculator — Business Finance Teaching Tool",
    "Estimate safety stock with standard teaching formulas. Not financial advice.",
    ["safety stock calculator","business finance calculator","bizfin-safety-stock-calculator"],
  ),
  "bizfin-reorder-point-calculator": article(
    "bizfin-reorder-point-calculator",
    "Reorder Point Calculator",
    [
      "Reorder Point Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Reorder Point Calculator — Business Finance Teaching Tool",
    "Estimate reorder point with standard teaching formulas. Not financial advice.",
    ["reorder point calculator","business finance calculator","bizfin-reorder-point-calculator"],
  ),
  "bizfin-inventory-turnover-operations-calculator": article(
    "bizfin-inventory-turnover-operations-calculator",
    "Inventory Turnover Calculator",
    [
      "Inventory Turnover Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Inventory Turnover Calculator — Business Finance Teaching Tool",
    "Estimate inventory turnover with standard teaching formulas. Not financial advice.",
    ["inventory turnover calculator","business finance calculator","bizfin-inventory-turnover-operations-calculator"],
  ),
  "bizfin-holding-cost-calculator": article(
    "bizfin-holding-cost-calculator",
    "Holding Cost Calculator",
    [
      "Holding Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Holding Cost Calculator — Business Finance Teaching Tool",
    "Estimate holding cost with standard teaching formulas. Not financial advice.",
    ["holding cost calculator","business finance calculator","bizfin-holding-cost-calculator"],
  ),
  "bizfin-order-quantity-calculator": article(
    "bizfin-order-quantity-calculator",
    "Order Quantity Calculator",
    [
      "Order Quantity Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Order Quantity Calculator — Business Finance Teaching Tool",
    "Estimate order quantity with standard teaching formulas. Not financial advice.",
    ["order quantity calculator","business finance calculator","bizfin-order-quantity-calculator"],
  ),
};
