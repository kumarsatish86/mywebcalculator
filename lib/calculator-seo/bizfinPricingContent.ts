import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-pricing";
const HUB_LABEL = "Business · Business finance · Pricing strategy calculators";
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
    tables: [{ title: "Pricing tools", columnHeaders: ["Tool", "Core idea"], rows: [["Markup/markdown","% vs cost or list"],["Elasticity","%ΔQ÷%ΔP"],["Value-based","Value × capture %"]] }],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves your inputs. Teaching estimate only — not financial advice." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIZFIN_PRICING_ARTICLES: Record<string, RichArticle> = {
  "bizfin-markup-calculator": article(
    "bizfin-markup-calculator",
    "Markup Calculator",
    [
      "Markup Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Markup Calculator — Business Finance Teaching Tool",
    "Estimate markup calculator with standard teaching formulas. Not financial advice.",
    ["markup calculator","business finance calculator","bizfin markup calculator"],
  ),
  "bizfin-markdown-calculator": article(
    "bizfin-markdown-calculator",
    "Markdown Calculator",
    [
      "Markdown Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Markdown Calculator — Business Finance Teaching Tool",
    "Estimate markdown calculator with standard teaching formulas. Not financial advice.",
    ["markdown calculator","business finance calculator","bizfin markdown calculator"],
  ),
  "bizfin-pricing-strategy-calculator": article(
    "bizfin-pricing-strategy-calculator",
    "Pricing Strategy Calculator",
    [
      "Pricing Strategy Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Pricing Strategy Calculator — Business Finance Teaching Tool",
    "Estimate pricing strategy calculator with standard teaching formulas. Not financial advice.",
    ["pricing strategy calculator","business finance calculator","bizfin pricing strategy calculator"],
  ),
  "bizfin-dynamic-pricing-calculator": article(
    "bizfin-dynamic-pricing-calculator",
    "Dynamic Pricing Calculator",
    [
      "Dynamic Pricing Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Dynamic Pricing Calculator — Business Finance Teaching Tool",
    "Estimate dynamic pricing calculator with standard teaching formulas. Not financial advice.",
    ["dynamic pricing calculator","business finance calculator","bizfin dynamic pricing calculator"],
  ),
  "bizfin-wholesale-price-calculator": article(
    "bizfin-wholesale-price-calculator",
    "Wholesale Price Calculator",
    [
      "Wholesale Price Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Wholesale Price Calculator — Business Finance Teaching Tool",
    "Estimate wholesale price calculator with standard teaching formulas. Not financial advice.",
    ["wholesale price calculator","business finance calculator","bizfin wholesale price calculator"],
  ),
  "bizfin-retail-price-calculator": article(
    "bizfin-retail-price-calculator",
    "Retail Price Calculator",
    [
      "Retail Price Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Retail Price Calculator — Business Finance Teaching Tool",
    "Estimate retail price calculator with standard teaching formulas. Not financial advice.",
    ["retail price calculator","business finance calculator","bizfin retail price calculator"],
  ),
  "bizfin-discount-pricing-calculator": article(
    "bizfin-discount-pricing-calculator",
    "Discount Pricing Calculator",
    [
      "Discount Pricing Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Discount Pricing Calculator — Business Finance Teaching Tool",
    "Estimate discount pricing calculator with standard teaching formulas. Not financial advice.",
    ["discount pricing calculator","business finance calculator","bizfin discount pricing calculator"],
  ),
  "bizfin-price-elasticity-calculator": article(
    "bizfin-price-elasticity-calculator",
    "Price Elasticity Calculator",
    [
      "Price Elasticity Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Price Elasticity Calculator — Business Finance Teaching Tool",
    "Estimate price elasticity calculator with standard teaching formulas. Not financial advice.",
    ["price elasticity calculator","business finance calculator","bizfin price elasticity calculator"],
  ),
  "bizfin-value-based-pricing-calculator": article(
    "bizfin-value-based-pricing-calculator",
    "Value-based Pricing Calculator",
    [
      "Value-based Pricing Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Value-based Pricing Calculator — Business Finance Teaching Tool",
    "Estimate value based pricing calculator with standard teaching formulas. Not financial advice.",
    ["value based pricing calculator","business finance calculator","bizfin value based pricing calculator"],
  )
};
