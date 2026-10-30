import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-financial-ratios";
const HUB_LABEL = "Business · Business finance · Financial ratio calculators";
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
    tables: [{ title: "Financial ratio tools", columnHeaders: ["Tool", "Core idea"], rows: [["ROA/ROE/ROCE","Return ratios"],["Turnovers","Activity ratios"],["Leverage","D/E, coverage"]] }],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves your inputs. Teaching estimate only — not financial advice." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIZFIN_RATIOS_ARTICLES: Record<string, RichArticle> = {
  "bizfin-profitability-ratios-calculator": article(
    "bizfin-profitability-ratios-calculator",
    "Profitability Ratios",
    [
      "Profitability Ratios for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Profitability Ratios — Business Finance Teaching Tool",
    "Estimate profitability ratios with standard teaching formulas. Not financial advice.",
    ["profitability ratios","business finance calculator","bizfin profitability ratios calculator"],
  ),
  "bizfin-roa-calculator": article(
    "bizfin-roa-calculator",
    "ROA Calculator",
    [
      "ROA Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "ROA Calculator — Business Finance Teaching Tool",
    "Estimate roa calculator with standard teaching formulas. Not financial advice.",
    ["roa calculator","business finance calculator","bizfin roa calculator"],
  ),
  "bizfin-roe-calculator": article(
    "bizfin-roe-calculator",
    "ROE Calculator",
    [
      "ROE Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "ROE Calculator — Business Finance Teaching Tool",
    "Estimate roe calculator with standard teaching formulas. Not financial advice.",
    ["roe calculator","business finance calculator","bizfin roe calculator"],
  ),
  "bizfin-roce-calculator": article(
    "bizfin-roce-calculator",
    "ROCE Calculator",
    [
      "ROCE Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "ROCE Calculator — Business Finance Teaching Tool",
    "Estimate roce calculator with standard teaching formulas. Not financial advice.",
    ["roce calculator","business finance calculator","bizfin roce calculator"],
  ),
  "bizfin-inventory-turnover-ratio-calculator": article(
    "bizfin-inventory-turnover-ratio-calculator",
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
    "Estimate inventory turnover calculator with standard teaching formulas. Not financial advice.",
    ["inventory turnover calculator","business finance calculator","bizfin inventory turnover ratio calculator"],
  ),
  "bizfin-asset-turnover-calculator": article(
    "bizfin-asset-turnover-calculator",
    "Asset Turnover Calculator",
    [
      "Asset Turnover Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Asset Turnover Calculator — Business Finance Teaching Tool",
    "Estimate asset turnover calculator with standard teaching formulas. Not financial advice.",
    ["asset turnover calculator","business finance calculator","bizfin asset turnover calculator"],
  ),
  "bizfin-accounts-receivable-turnover-calculator": article(
    "bizfin-accounts-receivable-turnover-calculator",
    "AR Turnover Calculator",
    [
      "AR Turnover Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "AR Turnover Calculator — Business Finance Teaching Tool",
    "Estimate ar turnover calculator with standard teaching formulas. Not financial advice.",
    ["ar turnover calculator","business finance calculator","bizfin accounts receivable turnover calculator"],
  ),
  "bizfin-accounts-payable-turnover-calculator": article(
    "bizfin-accounts-payable-turnover-calculator",
    "AP Turnover Calculator",
    [
      "AP Turnover Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "AP Turnover Calculator — Business Finance Teaching Tool",
    "Estimate ap turnover calculator with standard teaching formulas. Not financial advice.",
    ["ap turnover calculator","business finance calculator","bizfin accounts payable turnover calculator"],
  ),
  "bizfin-debt-to-equity-calculator": article(
    "bizfin-debt-to-equity-calculator",
    "Debt-to-Equity Calculator",
    [
      "Debt-to-Equity Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Debt-to-Equity Calculator — Business Finance Teaching Tool",
    "Estimate debt to equity calculator with standard teaching formulas. Not financial advice.",
    ["debt to equity calculator","business finance calculator","bizfin debt to equity calculator"],
  ),
  "bizfin-debt-ratio-calculator": article(
    "bizfin-debt-ratio-calculator",
    "Debt Ratio Calculator",
    [
      "Debt Ratio Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Debt Ratio Calculator — Business Finance Teaching Tool",
    "Estimate debt ratio calculator with standard teaching formulas. Not financial advice.",
    ["debt ratio calculator","business finance calculator","bizfin debt ratio calculator"],
  ),
  "bizfin-interest-coverage-ratio-calculator": article(
    "bizfin-interest-coverage-ratio-calculator",
    "Interest Coverage Calculator",
    [
      "Interest Coverage Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Interest Coverage Calculator — Business Finance Teaching Tool",
    "Estimate interest coverage calculator with standard teaching formulas. Not financial advice.",
    ["interest coverage calculator","business finance calculator","bizfin interest coverage ratio calculator"],
  )
};
