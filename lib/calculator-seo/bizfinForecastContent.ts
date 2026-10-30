import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-planning-forecasting";
const HUB_LABEL = "Business · Business finance · Business planning and forecasting calculators";
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
        title: "Planning & forecast tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [["Revenue / profit forecast","Compound growth projections"],["Budget / scenarios","Variance and expected value"],["Break-even / projection","Units needed and year-N P&L"]],
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

export const BIZFIN_FORECAST_ARTICLES: Record<string, RichArticle> = {
  "bizfin-revenue-forecast-calculator": article(
    "bizfin-revenue-forecast-calculator",
    "Revenue Forecast Calculator",
    [
      "Revenue Forecast Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Revenue Forecast Calculator — Business Finance Teaching Tool",
    "Estimate revenue forecast with standard teaching formulas. Not financial advice.",
    ["revenue forecast calculator","business finance calculator","bizfin-revenue-forecast-calculator"],
  ),
  "bizfin-profit-forecast-calculator": article(
    "bizfin-profit-forecast-calculator",
    "Profit Forecast Calculator",
    [
      "Profit Forecast Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Profit Forecast Calculator — Business Finance Teaching Tool",
    "Estimate profit forecast with standard teaching formulas. Not financial advice.",
    ["profit forecast calculator","business finance calculator","bizfin-profit-forecast-calculator"],
  ),
  "bizfin-budget-calculator": article(
    "bizfin-budget-calculator",
    "Budget Calculator",
    [
      "Budget Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Budget Calculator — Business Finance Teaching Tool",
    "Estimate budget with standard teaching formulas. Not financial advice.",
    ["budget calculator","business finance calculator","bizfin-budget-calculator"],
  ),
  "bizfin-scenario-analysis-calculator": article(
    "bizfin-scenario-analysis-calculator",
    "Scenario Analysis Calculator",
    [
      "Scenario Analysis Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Scenario Analysis Calculator — Business Finance Teaching Tool",
    "Estimate scenario analysis with standard teaching formulas. Not financial advice.",
    ["scenario analysis calculator","business finance calculator","bizfin-scenario-analysis-calculator"],
  ),
  "bizfin-break-even-analysis-tool": article(
    "bizfin-break-even-analysis-tool",
    "Break-even Analysis Tool",
    [
      "Break-even Analysis Tool for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Break-even Analysis Tool — Business Finance Teaching Tool",
    "Estimate break-even analysis with standard teaching formulas. Not financial advice.",
    ["break-even analysis calculator","business finance calculator","bizfin-break-even-analysis-tool"],
  ),
  "bizfin-financial-projection-calculator": article(
    "bizfin-financial-projection-calculator",
    "Financial Projection Calculator",
    [
      "Financial Projection Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Financial Projection Calculator — Business Finance Teaching Tool",
    "Estimate financial projection with standard teaching formulas. Not financial advice.",
    ["financial projection calculator","business finance calculator","bizfin-financial-projection-calculator"],
  ),
};
