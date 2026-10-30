import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-lead-generation";
const HUB_LABEL = "Business · Marketing · Lead generation calculators";
const SHELL =
  "Business marketing estimation tools that run in your browser. Not financial, legal, or tax advice. Ad platforms, attribution models, and fees vary — verify figures in your analytics and billing consoles.";

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
        title: "Lead generation tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Lead conversion rate", "Teaching metric from inputs"],
          ["Cost per lead", "Teaching metric from inputs"],
          ["Lead value", "Teaching metric from inputs"],
          ["SQL", "Teaching metric from inputs"],
          ["MQL", "Teaching metric from inputs"],
          ["Lead-to-customer", "Teaching metric from inputs"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your marketing inputs. Planning estimate only — platforms, attribution, and costs vary.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MKT_LEADS_ARTICLES: Record<string, RichArticle> = {
  "mkt-lead-conversion-rate-calculator": article(
    "mkt-lead-conversion-rate-calculator",
    "Lead conversion rate",
    [
      "Lead conversion rate teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Lead conversion rate calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Lead conversion rate Calculator — Marketing Teaching Estimate",
    "Estimate lead conversion rate from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["lead conversion rate calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-cost-per-lead-calculator": article(
    "mkt-cost-per-lead-calculator",
    "Cost per lead",
    [
      "Cost per lead teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Cost per lead calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Cost per lead Calculator — Marketing Teaching Estimate",
    "Estimate cost per lead from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cost per lead calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-lead-value-calculator": article(
    "mkt-lead-value-calculator",
    "Lead value",
    [
      "Lead value teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Lead value calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Lead value Calculator — Marketing Teaching Estimate",
    "Estimate lead value from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["lead value calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-sql-calculator": article(
    "mkt-sql-calculator",
    "SQL",
    [
      "SQL teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the SQL calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "SQL Calculator — Marketing Teaching Estimate",
    "Estimate sql from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["sql calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-mql-calculator": article(
    "mkt-mql-calculator",
    "MQL",
    [
      "MQL teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the MQL calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "MQL Calculator — Marketing Teaching Estimate",
    "Estimate mql from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["mql calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-lead-to-customer-rate-calculator": article(
    "mkt-lead-to-customer-rate-calculator",
    "Lead-to-customer",
    [
      "Lead-to-customer teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Lead-to-customer calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Lead-to-customer Calculator — Marketing Teaching Estimate",
    "Estimate lead-to-customer from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["lead-to-customer calculator", "marketing metric", "campaign calculator"],
  ),
};
