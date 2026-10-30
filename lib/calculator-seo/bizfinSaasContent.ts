import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-startup-saas";
const HUB_LABEL = "Business · Business finance · Startup and SaaS calculators";
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
        title: "Startup & SaaS tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [["Burn / runway","Expenses − revenue; cash ÷ burn"],["CAC / LTV","S&M ÷ customers; ARPU×GM÷churn"],["MRR / ARR / churn","Recurring revenue and retention"]],
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

export const BIZFIN_SAAS_ARTICLES: Record<string, RichArticle> = {
  "bizfin-burn-rate-calculator": article(
    "bizfin-burn-rate-calculator",
    "Burn Rate Calculator",
    [
      "Burn Rate Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Burn Rate Calculator — Business Finance Teaching Tool",
    "Estimate burn rate with standard teaching formulas. Not financial advice.",
    ["burn rate calculator","business finance calculator","bizfin-burn-rate-calculator"],
  ),
  "bizfin-runway-calculator": article(
    "bizfin-runway-calculator",
    "Runway Calculator",
    [
      "Runway Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Runway Calculator — Business Finance Teaching Tool",
    "Estimate runway with standard teaching formulas. Not financial advice.",
    ["runway calculator","business finance calculator","bizfin-runway-calculator"],
  ),
  "bizfin-cac-calculator": article(
    "bizfin-cac-calculator",
    "CAC Calculator",
    [
      "CAC Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "CAC Calculator — Business Finance Teaching Tool",
    "Estimate cac with standard teaching formulas. Not financial advice.",
    ["cac calculator","business finance calculator","bizfin-cac-calculator"],
  ),
  "bizfin-ltv-calculator": article(
    "bizfin-ltv-calculator",
    "LTV Calculator",
    [
      "LTV Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "LTV Calculator — Business Finance Teaching Tool",
    "Estimate ltv with standard teaching formulas. Not financial advice.",
    ["ltv calculator","business finance calculator","bizfin-ltv-calculator"],
  ),
  "bizfin-ltv-cac-ratio-calculator": article(
    "bizfin-ltv-cac-ratio-calculator",
    "LTV:CAC Ratio Calculator",
    [
      "LTV:CAC Ratio Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "LTV:CAC Ratio Calculator — Business Finance Teaching Tool",
    "Estimate ltv:cac ratio with standard teaching formulas. Not financial advice.",
    ["ltv:cac ratio calculator","business finance calculator","bizfin-ltv-cac-ratio-calculator"],
  ),
  "bizfin-mrr-calculator": article(
    "bizfin-mrr-calculator",
    "MRR Calculator",
    [
      "MRR Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "MRR Calculator — Business Finance Teaching Tool",
    "Estimate mrr with standard teaching formulas. Not financial advice.",
    ["mrr calculator","business finance calculator","bizfin-mrr-calculator"],
  ),
  "bizfin-arr-calculator": article(
    "bizfin-arr-calculator",
    "ARR Calculator",
    [
      "ARR Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "ARR Calculator — Business Finance Teaching Tool",
    "Estimate arr with standard teaching formulas. Not financial advice.",
    ["arr calculator","business finance calculator","bizfin-arr-calculator"],
  ),
  "bizfin-churn-rate-calculator": article(
    "bizfin-churn-rate-calculator",
    "Churn Rate Calculator",
    [
      "Churn Rate Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Churn Rate Calculator — Business Finance Teaching Tool",
    "Estimate churn rate with standard teaching formulas. Not financial advice.",
    ["churn rate calculator","business finance calculator","bizfin-churn-rate-calculator"],
  ),
  "bizfin-saas-growth-rate-calculator": article(
    "bizfin-saas-growth-rate-calculator",
    "SaaS Growth Rate Calculator",
    [
      "SaaS Growth Rate Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "SaaS Growth Rate Calculator — Business Finance Teaching Tool",
    "Estimate saas growth rate with standard teaching formulas. Not financial advice.",
    ["saas growth rate calculator","business finance calculator","bizfin-saas-growth-rate-calculator"],
  ),
};
