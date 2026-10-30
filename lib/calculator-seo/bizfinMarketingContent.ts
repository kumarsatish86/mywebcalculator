import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-marketing-sales";
const HUB_LABEL = "Business · Business finance · Sales and marketing performance calculators";
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
        title: "Sales & marketing tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [["Conversion / CPL / CPA","Funnel and acquisition unit costs"],["CPM / CPC","Impression and click unit costs"],["Growth","(end − start) ÷ |start|"]],
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

export const BIZFIN_MARKETING_ARTICLES: Record<string, RichArticle> = {
  "bizfin-conversion-rate-calculator": article(
    "bizfin-conversion-rate-calculator",
    "Conversion Rate Calculator",
    [
      "Conversion Rate Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Conversion Rate Calculator — Business Finance Teaching Tool",
    "Estimate conversion rate with standard teaching formulas. Not financial advice.",
    ["conversion rate calculator","business finance calculator","bizfin-conversion-rate-calculator"],
  ),
  "bizfin-cpl-calculator": article(
    "bizfin-cpl-calculator",
    "CPL Calculator",
    [
      "CPL Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "CPL Calculator — Business Finance Teaching Tool",
    "Estimate cpl with standard teaching formulas. Not financial advice.",
    ["cpl calculator","business finance calculator","bizfin-cpl-calculator"],
  ),
  "bizfin-cpa-calculator": article(
    "bizfin-cpa-calculator",
    "CPA Calculator",
    [
      "CPA Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "CPA Calculator — Business Finance Teaching Tool",
    "Estimate cpa with standard teaching formulas. Not financial advice.",
    ["cpa calculator","business finance calculator","bizfin-cpa-calculator"],
  ),
  "bizfin-cpm-calculator": article(
    "bizfin-cpm-calculator",
    "CPM Calculator",
    [
      "CPM Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "CPM Calculator — Business Finance Teaching Tool",
    "Estimate cpm with standard teaching formulas. Not financial advice.",
    ["cpm calculator","business finance calculator","bizfin-cpm-calculator"],
  ),
  "bizfin-cpc-calculator": article(
    "bizfin-cpc-calculator",
    "CPC Calculator",
    [
      "CPC Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "CPC Calculator — Business Finance Teaching Tool",
    "Estimate cpc with standard teaching formulas. Not financial advice.",
    ["cpc calculator","business finance calculator","bizfin-cpc-calculator"],
  ),
  "bizfin-sales-growth-calculator": article(
    "bizfin-sales-growth-calculator",
    "Sales Growth Calculator",
    [
      "Sales Growth Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Sales Growth Calculator — Business Finance Teaching Tool",
    "Estimate sales growth with standard teaching formulas. Not financial advice.",
    ["sales growth calculator","business finance calculator","bizfin-sales-growth-calculator"],
  ),
  "bizfin-revenue-growth-calculator": article(
    "bizfin-revenue-growth-calculator",
    "Revenue Growth Calculator",
    [
      "Revenue Growth Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Revenue Growth Calculator — Business Finance Teaching Tool",
    "Estimate revenue growth with standard teaching formulas. Not financial advice.",
    ["revenue growth calculator","business finance calculator","bizfin-revenue-growth-calculator"],
  ),
};
