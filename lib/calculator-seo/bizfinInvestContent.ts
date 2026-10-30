import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-investment-return";
const HUB_LABEL = "Business · Business finance · Investment and return calculators";
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
        title: "Investment and return tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [["ROI","(Gain−cost)÷cost"],["IRR/NPV","Discrete cash flows"],["Payback","Investment÷CF"],["Valuation","Multiples / EV"]],
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

export const BIZFIN_INVEST_ARTICLES: Record<string, RichArticle> = {
  "bizfin-roi-calculator": article(
    "bizfin-roi-calculator",
    "ROI Calculator",
    [
      "ROI Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "ROI Calculator — Business Finance Teaching Tool",
    "Estimate roi calculator with standard teaching formulas. Not financial advice.",
    ["roi calculator","business finance calculator","bizfin roi calculator"],
  ),
  "bizfin-annualized-roi-calculator": article(
    "bizfin-annualized-roi-calculator",
    "Annualized ROI Calculator",
    [
      "Annualized ROI Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Annualized ROI Calculator — Business Finance Teaching Tool",
    "Estimate annualized roi calculator with standard teaching formulas. Not financial advice.",
    ["annualized roi calculator","business finance calculator","bizfin annualized roi calculator"],
  ),
  "bizfin-irr-calculator": article(
    "bizfin-irr-calculator",
    "IRR Calculator",
    [
      "IRR Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "IRR Calculator — Business Finance Teaching Tool",
    "Estimate irr calculator with standard teaching formulas. Not financial advice.",
    ["irr calculator","business finance calculator","bizfin irr calculator"],
  ),
  "bizfin-npv-calculator": article(
    "bizfin-npv-calculator",
    "NPV Calculator",
    [
      "NPV Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "NPV Calculator — Business Finance Teaching Tool",
    "Estimate npv calculator with standard teaching formulas. Not financial advice.",
    ["npv calculator","business finance calculator","bizfin npv calculator"],
  ),
  "bizfin-payback-period-calculator": article(
    "bizfin-payback-period-calculator",
    "Payback Period Calculator",
    [
      "Payback Period Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Payback Period Calculator — Business Finance Teaching Tool",
    "Estimate payback period calculator with standard teaching formulas. Not financial advice.",
    ["payback period calculator","business finance calculator","bizfin payback period calculator"],
  ),
  "bizfin-discounted-payback-period-calculator": article(
    "bizfin-discounted-payback-period-calculator",
    "Discounted Payback Period Calculator",
    [
      "Discounted Payback Period Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Discounted Payback Period Calculator — Business Finance Teaching Tool",
    "Estimate discounted payback period calculator with standard teaching formulas. Not financial advice.",
    ["discounted payback period calculator","business finance calculator","bizfin discounted payback period calculator"],
  ),
  "bizfin-capital-gain-calculator": article(
    "bizfin-capital-gain-calculator",
    "Capital Gain Calculator",
    [
      "Capital Gain Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Capital Gain Calculator — Business Finance Teaching Tool",
    "Estimate capital gain calculator with standard teaching formulas. Not financial advice.",
    ["capital gain calculator","business finance calculator","bizfin capital gain calculator"],
  ),
  "bizfin-business-valuation-calculator": article(
    "bizfin-business-valuation-calculator",
    "Business Valuation Calculator",
    [
      "Business Valuation Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Business Valuation Calculator — Business Finance Teaching Tool",
    "Estimate business valuation calculator with standard teaching formulas. Not financial advice.",
    ["business valuation calculator","business finance calculator","bizfin business valuation calculator"],
  ),
  "bizfin-equity-value-calculator": article(
    "bizfin-equity-value-calculator",
    "Equity Value Calculator",
    [
      "Equity Value Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Equity Value Calculator — Business Finance Teaching Tool",
    "Estimate equity value calculator with standard teaching formulas. Not financial advice.",
    ["equity value calculator","business finance calculator","bizfin equity value calculator"],
  ),
  "bizfin-enterprise-value-calculator": article(
    "bizfin-enterprise-value-calculator",
    "Enterprise Value Calculator",
    [
      "Enterprise Value Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Enterprise Value Calculator — Business Finance Teaching Tool",
    "Estimate enterprise value calculator with standard teaching formulas. Not financial advice.",
    ["enterprise value calculator","business finance calculator","bizfin enterprise value calculator"],
  )
};
