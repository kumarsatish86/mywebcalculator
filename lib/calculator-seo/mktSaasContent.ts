import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-saas-growth";
const HUB_LABEL = "Business · Marketing · SaaS and growth marketing calculators";
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
        title: "SaaS & growth tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["MRR", "Teaching metric from inputs"],
          ["ARR", "Teaching metric from inputs"],
          ["Churn rate", "Teaching metric from inputs"],
          ["Customer retention", "Teaching metric from inputs"],
          ["SaaS growth rate", "Teaching metric from inputs"],
          ["Payback period", "Teaching metric from inputs"],
          ["Expansion revenue", "Teaching metric from inputs"],
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

export const MKT_SAAS_ARTICLES: Record<string, RichArticle> = {
  "mkt-mrr-calculator": article(
    "mkt-mrr-calculator",
    "MRR",
    [
      "MRR teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the MRR calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "MRR Calculator — Marketing Teaching Estimate",
    "Estimate mrr from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["mrr calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-arr-calculator": article(
    "mkt-arr-calculator",
    "ARR",
    [
      "ARR teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the ARR calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "ARR Calculator — Marketing Teaching Estimate",
    "Estimate arr from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["arr calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-churn-rate-calculator": article(
    "mkt-churn-rate-calculator",
    "Churn rate",
    [
      "Churn rate teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Churn rate calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Churn rate Calculator — Marketing Teaching Estimate",
    "Estimate churn rate from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["churn rate calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-customer-retention-calculator": article(
    "mkt-customer-retention-calculator",
    "Customer retention",
    [
      "Customer retention teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Customer retention calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Customer retention Calculator — Marketing Teaching Estimate",
    "Estimate customer retention from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["customer retention calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-saas-growth-rate-calculator": article(
    "mkt-saas-growth-rate-calculator",
    "SaaS growth rate",
    [
      "SaaS growth rate teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the SaaS growth rate calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "SaaS growth rate Calculator — Marketing Teaching Estimate",
    "Estimate saas growth rate from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["saas growth rate calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-payback-period-calculator": article(
    "mkt-payback-period-calculator",
    "Payback period",
    [
      "Payback period teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Payback period calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Payback period Calculator — Marketing Teaching Estimate",
    "Estimate payback period from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["payback period calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-expansion-revenue-calculator": article(
    "mkt-expansion-revenue-calculator",
    "Expansion revenue",
    [
      "Expansion revenue teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Expansion revenue calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Expansion revenue Calculator — Marketing Teaching Estimate",
    "Estimate expansion revenue from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["expansion revenue calculator", "marketing metric", "campaign calculator"],
  ),
};
