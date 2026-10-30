import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-payroll-hr-cost";
const HUB_LABEL = "Business · Business finance · Payroll and HR cost calculators";
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
        title: "Payroll & HR cost tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [["Payroll / CTC","Headcount × pay + burden"],["OT / breakup","Hours × rate × mult; CTC split"],["Attrition cost","Replacements × hire cost + lost productivity"]],
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

export const BIZFIN_PAYROLL_ARTICLES: Record<string, RichArticle> = {
  "bizfin-payroll-calculator": article(
    "bizfin-payroll-calculator",
    "Payroll Calculator",
    [
      "Payroll Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Payroll Calculator — Business Finance Teaching Tool",
    "Estimate payroll with standard teaching formulas. Not financial advice.",
    ["payroll calculator","business finance calculator","bizfin-payroll-calculator"],
  ),
  "bizfin-employee-cost-calculator": article(
    "bizfin-employee-cost-calculator",
    "Employee Cost Calculator",
    [
      "Employee Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Employee Cost Calculator — Business Finance Teaching Tool",
    "Estimate employee cost with standard teaching formulas. Not financial advice.",
    ["employee cost calculator","business finance calculator","bizfin-employee-cost-calculator"],
  ),
  "bizfin-ctc-calculator": article(
    "bizfin-ctc-calculator",
    "CTC Calculator",
    [
      "CTC Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "CTC Calculator — Business Finance Teaching Tool",
    "Estimate ctc with standard teaching formulas. Not financial advice.",
    ["ctc calculator","business finance calculator","bizfin-ctc-calculator"],
  ),
  "bizfin-overtime-pay-calculator": article(
    "bizfin-overtime-pay-calculator",
    "Overtime Pay Calculator",
    [
      "Overtime Pay Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Overtime Pay Calculator — Business Finance Teaching Tool",
    "Estimate overtime pay with standard teaching formulas. Not financial advice.",
    ["overtime pay calculator","business finance calculator","bizfin-overtime-pay-calculator"],
  ),
  "bizfin-salary-breakup-calculator": article(
    "bizfin-salary-breakup-calculator",
    "Salary Breakup Calculator",
    [
      "Salary Breakup Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Salary Breakup Calculator — Business Finance Teaching Tool",
    "Estimate salary breakup with standard teaching formulas. Not financial advice.",
    ["salary breakup calculator","business finance calculator","bizfin-salary-breakup-calculator"],
  ),
  "bizfin-attrition-cost-calculator": article(
    "bizfin-attrition-cost-calculator",
    "Attrition Cost Calculator",
    [
      "Attrition Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Attrition Cost Calculator — Business Finance Teaching Tool",
    "Estimate attrition cost with standard teaching formulas. Not financial advice.",
    ["attrition cost calculator","business finance calculator","bizfin-attrition-cost-calculator"],
  ),
};
