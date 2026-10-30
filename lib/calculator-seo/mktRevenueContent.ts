import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-revenue-profit";
const HUB_LABEL = "Business · Marketing · Revenue and profit marketing calculators";
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
        title: "Revenue & profit tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["CAC", "Teaching metric from inputs"],
          ["CLV / LTV", "Teaching metric from inputs"],
          ["LTV:CAC ratio", "Teaching metric from inputs"],
          ["Marketing ROI", "Teaching metric from inputs"],
          ["Campaign gross profit", "Teaching metric from inputs"],
          ["Revenue per visitor", "Teaching metric from inputs"],
          ["AOV", "Teaching metric from inputs"],
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

export const MKT_REVENUE_ARTICLES: Record<string, RichArticle> = {
  "mkt-cac-calculator": article(
    "mkt-cac-calculator",
    "CAC",
    [
      "CAC teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the CAC calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "CAC Calculator — Marketing Teaching Estimate",
    "Estimate cac from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cac calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-clv-ltv-calculator": article(
    "mkt-clv-ltv-calculator",
    "CLV / LTV",
    [
      "CLV / LTV teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the CLV / LTV calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "CLV / LTV Calculator — Marketing Teaching Estimate",
    "Estimate clv / ltv from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["clv / ltv calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-ltv-cac-ratio-calculator": article(
    "mkt-ltv-cac-ratio-calculator",
    "LTV:CAC ratio",
    [
      "LTV:CAC ratio teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the LTV:CAC ratio calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "LTV:CAC ratio Calculator — Marketing Teaching Estimate",
    "Estimate ltv:cac ratio from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["ltv:cac ratio calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-marketing-roi-calculator": article(
    "mkt-marketing-roi-calculator",
    "Marketing ROI",
    [
      "Marketing ROI teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Marketing ROI calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Marketing ROI Calculator — Marketing Teaching Estimate",
    "Estimate marketing roi from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["marketing roi calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-gross-profit-from-campaign-calculator": article(
    "mkt-gross-profit-from-campaign-calculator",
    "Campaign gross profit",
    [
      "Campaign gross profit teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Campaign gross profit calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Campaign gross profit Calculator — Marketing Teaching Estimate",
    "Estimate campaign gross profit from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["campaign gross profit calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-revenue-per-visitor-calculator": article(
    "mkt-revenue-per-visitor-calculator",
    "Revenue per visitor",
    [
      "Revenue per visitor teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Revenue per visitor calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Revenue per visitor Calculator — Marketing Teaching Estimate",
    "Estimate revenue per visitor from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["revenue per visitor calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-average-order-value-calculator": article(
    "mkt-average-order-value-calculator",
    "AOV",
    [
      "AOV teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the AOV calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "AOV Calculator — Marketing Teaching Estimate",
    "Estimate aov from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["aov calculator", "marketing metric", "campaign calculator"],
  ),
};
