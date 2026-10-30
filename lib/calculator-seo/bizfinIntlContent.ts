import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-international";
const HUB_LABEL = "Business · Business finance · International business calculators";
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
        title: "International tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [["FX / duty","Amount × rate; CIF × duty%"],["Export profit","Revenue − cost − duties"],["Inflation / PP","Compound inflation math"]],
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

export const BIZFIN_INTL_ARTICLES: Record<string, RichArticle> = {
  "bizfin-currency-exchange-calculator": article(
    "bizfin-currency-exchange-calculator",
    "Currency Exchange Calculator",
    [
      "Currency Exchange Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Currency Exchange Calculator — Business Finance Teaching Tool",
    "Estimate currency exchange with standard teaching formulas. Not financial advice.",
    ["currency exchange calculator","business finance calculator","bizfin-currency-exchange-calculator"],
  ),
  "bizfin-import-duty-calculator": article(
    "bizfin-import-duty-calculator",
    "Import Duty Calculator",
    [
      "Import Duty Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Import Duty Calculator — Business Finance Teaching Tool",
    "Estimate import duty with standard teaching formulas. Not financial advice.",
    ["import duty calculator","business finance calculator","bizfin-import-duty-calculator"],
  ),
  "bizfin-export-profit-calculator": article(
    "bizfin-export-profit-calculator",
    "Export Profit Calculator",
    [
      "Export Profit Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Export Profit Calculator — Business Finance Teaching Tool",
    "Estimate export profit with standard teaching formulas. Not financial advice.",
    ["export profit calculator","business finance calculator","bizfin-export-profit-calculator"],
  ),
  "bizfin-inflation-calculator": article(
    "bizfin-inflation-calculator",
    "Inflation Calculator",
    [
      "Inflation Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Inflation Calculator — Business Finance Teaching Tool",
    "Estimate inflation with standard teaching formulas. Not financial advice.",
    ["inflation calculator","business finance calculator","bizfin-inflation-calculator"],
  ),
  "bizfin-purchasing-power-calculator": article(
    "bizfin-purchasing-power-calculator",
    "Purchasing Power Calculator",
    [
      "Purchasing Power Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Purchasing Power Calculator — Business Finance Teaching Tool",
    "Estimate purchasing power with standard teaching formulas. Not financial advice.",
    ["purchasing power calculator","business finance calculator","bizfin-purchasing-power-calculator"],
  ),
};
