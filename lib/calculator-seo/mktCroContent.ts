import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-conversion-optimization";
const HUB_LABEL = "Business · Marketing · Conversion rate optimization calculators";
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
        title: "CRO tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Conversion rate", "Teaching metric from inputs"],
          ["Funnel conversion", "Teaching metric from inputs"],
          ["Landing page conversion", "Teaching metric from inputs"],
          ["Funnel drop-off", "Teaching metric from inputs"],
          ["A/B significance", "Teaching metric from inputs"],
          ["Click-to-conversion", "Teaching metric from inputs"],
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

export const MKT_CRO_ARTICLES: Record<string, RichArticle> = {
  "mkt-conversion-rate-calculator": article(
    "mkt-conversion-rate-calculator",
    "Conversion rate",
    [
      "Conversion rate teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Conversion rate calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Conversion rate Calculator — Marketing Teaching Estimate",
    "Estimate conversion rate from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["conversion rate calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-funnel-conversion-calculator": article(
    "mkt-funnel-conversion-calculator",
    "Funnel conversion",
    [
      "Funnel conversion teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Funnel conversion calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Funnel conversion Calculator — Marketing Teaching Estimate",
    "Estimate funnel conversion from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["funnel conversion calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-landing-page-conversion-calculator": article(
    "mkt-landing-page-conversion-calculator",
    "Landing page conversion",
    [
      "Landing page conversion teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Landing page conversion calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Landing page conversion Calculator — Marketing Teaching Estimate",
    "Estimate landing page conversion from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["landing page conversion calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-sales-funnel-drop-off-calculator": article(
    "mkt-sales-funnel-drop-off-calculator",
    "Funnel drop-off",
    [
      "Funnel drop-off teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Funnel drop-off calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Funnel drop-off Calculator — Marketing Teaching Estimate",
    "Estimate funnel drop-off from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["funnel drop-off calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-ab-test-significance-calculator": article(
    "mkt-ab-test-significance-calculator",
    "A/B significance",
    [
      "A/B significance teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the A/B significance calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "A/B significance Calculator — Marketing Teaching Estimate",
    "Estimate a/b significance from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["a/b significance calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-click-to-conversion-rate-calculator": article(
    "mkt-click-to-conversion-rate-calculator",
    "Click-to-conversion",
    [
      "Click-to-conversion teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Click-to-conversion calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Click-to-conversion Calculator — Marketing Teaching Estimate",
    "Estimate click-to-conversion from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["click-to-conversion calculator", "marketing metric", "campaign calculator"],
  ),
};
