import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-tax-compliance";
const HUB_LABEL = "Business · Business finance · Tax and compliance calculators";
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
        title: "Tax & compliance tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [["Corporate / GST / VAT","Rate × base or extract from inclusive"],["Taxable income","Income − deductions"],["Depreciation","Straight-line or declining balance"]],
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

export const BIZFIN_TAX_ARTICLES: Record<string, RichArticle> = {
  "bizfin-corporate-tax-calculator": article(
    "bizfin-corporate-tax-calculator",
    "Corporate Tax Calculator",
    [
      "Corporate Tax Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Corporate Tax Calculator — Business Finance Teaching Tool",
    "Estimate corporate tax with standard teaching formulas. Not financial advice.",
    ["corporate tax calculator","business finance calculator","bizfin-corporate-tax-calculator"],
  ),
  "bizfin-gst-calculator-india": article(
    "bizfin-gst-calculator-india",
    "GST Calculator (India)",
    [
      "GST Calculator (India) for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "GST Calculator (India) — Business Finance Teaching Tool",
    "Estimate gst calculator (india) with standard teaching formulas. Not financial advice.",
    ["gst calculator (india) calculator","business finance calculator","bizfin-gst-calculator-india"],
  ),
  "bizfin-vat-calculator": article(
    "bizfin-vat-calculator",
    "VAT Calculator",
    [
      "VAT Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "VAT Calculator — Business Finance Teaching Tool",
    "Estimate vat with standard teaching formulas. Not financial advice.",
    ["vat calculator","business finance calculator","bizfin-vat-calculator"],
  ),
  "bizfin-sales-tax-calculator": article(
    "bizfin-sales-tax-calculator",
    "Sales Tax Calculator",
    [
      "Sales Tax Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Sales Tax Calculator — Business Finance Teaching Tool",
    "Estimate sales tax with standard teaching formulas. Not financial advice.",
    ["sales tax calculator","business finance calculator","bizfin-sales-tax-calculator"],
  ),
  "bizfin-taxable-income-calculator": article(
    "bizfin-taxable-income-calculator",
    "Taxable Income Calculator",
    [
      "Taxable Income Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Taxable Income Calculator — Business Finance Teaching Tool",
    "Estimate taxable income with standard teaching formulas. Not financial advice.",
    ["taxable income calculator","business finance calculator","bizfin-taxable-income-calculator"],
  ),
  "bizfin-depreciation-calculator": article(
    "bizfin-depreciation-calculator",
    "Depreciation Calculator",
    [
      "Depreciation Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Depreciation Calculator — Business Finance Teaching Tool",
    "Estimate depreciation with standard teaching formulas. Not financial advice.",
    ["depreciation calculator","business finance calculator","bizfin-depreciation-calculator"],
  ),
  "bizfin-straight-line-depreciation-calculator": article(
    "bizfin-straight-line-depreciation-calculator",
    "Straight Line Depreciation Calculator",
    [
      "Straight Line Depreciation Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Straight Line Depreciation Calculator — Business Finance Teaching Tool",
    "Estimate straight line depreciation with standard teaching formulas. Not financial advice.",
    ["straight line depreciation calculator","business finance calculator","bizfin-straight-line-depreciation-calculator"],
  ),
  "bizfin-declining-balance-depreciation-calculator": article(
    "bizfin-declining-balance-depreciation-calculator",
    "Declining Balance Depreciation Calculator",
    [
      "Declining Balance Depreciation Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Declining Balance Depreciation Calculator — Business Finance Teaching Tool",
    "Estimate declining balance depreciation with standard teaching formulas. Not financial advice.",
    ["declining balance depreciation calculator","business finance calculator","bizfin-declining-balance-depreciation-calculator"],
  ),
};
