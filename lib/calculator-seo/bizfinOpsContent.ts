import type { RichArticle } from "./types";

const HUB_HREF = "/business/business-finance/bizfin-manufacturing-operations";
const HUB_LABEL = "Business · Business finance · Manufacturing and operations calculators";
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
        title: "Operations tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [["Capacity / throughput","Machines × hours × rate"],["Efficiency / utilization","Output ÷ capacity; used ÷ available"],["Labor / downtime cost","Workers × hours × wage"]],
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

export const BIZFIN_OPS_ARTICLES: Record<string, RichArticle> = {
  "bizfin-production-capacity-calculator": article(
    "bizfin-production-capacity-calculator",
    "Production Capacity Calculator",
    [
      "Production Capacity Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Production Capacity Calculator — Business Finance Teaching Tool",
    "Estimate production capacity with standard teaching formulas. Not financial advice.",
    ["production capacity calculator","business finance calculator","bizfin-production-capacity-calculator"],
  ),
  "bizfin-machine-efficiency-calculator": article(
    "bizfin-machine-efficiency-calculator",
    "Machine Efficiency Calculator",
    [
      "Machine Efficiency Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Machine Efficiency Calculator — Business Finance Teaching Tool",
    "Estimate machine efficiency with standard teaching formulas. Not financial advice.",
    ["machine efficiency calculator","business finance calculator","bizfin-machine-efficiency-calculator"],
  ),
  "bizfin-labor-cost-calculator": article(
    "bizfin-labor-cost-calculator",
    "Labor Cost Calculator",
    [
      "Labor Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Labor Cost Calculator — Business Finance Teaching Tool",
    "Estimate labor cost with standard teaching formulas. Not financial advice.",
    ["labor cost calculator","business finance calculator","bizfin-labor-cost-calculator"],
  ),
  "bizfin-utilization-rate-calculator": article(
    "bizfin-utilization-rate-calculator",
    "Utilization Rate Calculator",
    [
      "Utilization Rate Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Utilization Rate Calculator — Business Finance Teaching Tool",
    "Estimate utilization rate with standard teaching formulas. Not financial advice.",
    ["utilization rate calculator","business finance calculator","bizfin-utilization-rate-calculator"],
  ),
  "bizfin-downtime-cost-calculator": article(
    "bizfin-downtime-cost-calculator",
    "Downtime Cost Calculator",
    [
      "Downtime Cost Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Downtime Cost Calculator — Business Finance Teaching Tool",
    "Estimate downtime cost with standard teaching formulas. Not financial advice.",
    ["downtime cost calculator","business finance calculator","bizfin-downtime-cost-calculator"],
  ),
  "bizfin-throughput-calculator": article(
    "bizfin-throughput-calculator",
    "Throughput Calculator",
    [
      "Throughput Calculator for business-finance teaching estimates in the browser.",
      "Results are illustrative classroom math — not audited statements, tax filings, or investment advice.",
    ],
    {
      question: "Is this financial advice?",
      answer: "No. These are teaching estimates only. Confirm figures with your accountant, banker, or advisor before decisions.",
    },
    "Throughput Calculator — Business Finance Teaching Tool",
    "Estimate throughput with standard teaching formulas. Not financial advice.",
    ["throughput calculator","business finance calculator","bizfin-throughput-calculator"],
  ),
};
