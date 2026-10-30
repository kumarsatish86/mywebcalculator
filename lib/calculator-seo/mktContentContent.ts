import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-content";
const HUB_LABEL = "Business · Marketing · Content marketing calculators";
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
        title: "Content marketing tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Content ROI", "Teaching metric from inputs"],
          ["Blog traffic value", "Teaching metric from inputs"],
          ["Cost per piece", "Teaching metric from inputs"],
          ["Production cost", "Teaching metric from inputs"],
          ["Leads from content", "Teaching metric from inputs"],
          ["Content engagement", "Teaching metric from inputs"],
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

export const MKT_CONTENT_ARTICLES: Record<string, RichArticle> = {
  "mkt-content-roi-calculator": article(
    "mkt-content-roi-calculator",
    "Content ROI",
    [
      "Content ROI teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Content ROI calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Content ROI Calculator — Marketing Teaching Estimate",
    "Estimate content roi from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["content roi calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-blog-traffic-value-calculator": article(
    "mkt-blog-traffic-value-calculator",
    "Blog traffic value",
    [
      "Blog traffic value teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Blog traffic value calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Blog traffic value Calculator — Marketing Teaching Estimate",
    "Estimate blog traffic value from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["blog traffic value calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-cost-per-content-piece-calculator": article(
    "mkt-cost-per-content-piece-calculator",
    "Cost per piece",
    [
      "Cost per piece teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Cost per piece calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Cost per piece Calculator — Marketing Teaching Estimate",
    "Estimate cost per piece from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cost per piece calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-content-production-cost-calculator": article(
    "mkt-content-production-cost-calculator",
    "Production cost",
    [
      "Production cost teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Production cost calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Production cost Calculator — Marketing Teaching Estimate",
    "Estimate production cost from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["production cost calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-lead-generation-from-content-calculator": article(
    "mkt-lead-generation-from-content-calculator",
    "Leads from content",
    [
      "Leads from content teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Leads from content calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Leads from content Calculator — Marketing Teaching Estimate",
    "Estimate leads from content from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["leads from content calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-content-engagement-rate-calculator": article(
    "mkt-content-engagement-rate-calculator",
    "Content engagement",
    [
      "Content engagement teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Content engagement calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Content engagement Calculator — Marketing Teaching Estimate",
    "Estimate content engagement from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["content engagement calculator", "marketing metric", "campaign calculator"],
  ),
};
