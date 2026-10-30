import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-email";
const HUB_LABEL = "Business · Marketing · Email marketing calculators";
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
        title: "Email marketing tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Email open rate", "Teaching metric from inputs"],
          ["Email CTR", "Teaching metric from inputs"],
          ["Email conversion rate", "Teaching metric from inputs"],
          ["Email ROI", "Teaching metric from inputs"],
          ["List growth rate", "Teaching metric from inputs"],
          ["Email bounce rate", "Teaching metric from inputs"],
          ["Unsubscribe rate", "Teaching metric from inputs"],
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

export const MKT_EMAIL_ARTICLES: Record<string, RichArticle> = {
  "mkt-email-open-rate-calculator": article(
    "mkt-email-open-rate-calculator",
    "Email open rate",
    [
      "Email open rate teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Email open rate calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Email open rate Calculator — Marketing Teaching Estimate",
    "Estimate email open rate from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["email open rate calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-email-ctr-calculator": article(
    "mkt-email-ctr-calculator",
    "Email CTR",
    [
      "Email CTR teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Email CTR calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Email CTR Calculator — Marketing Teaching Estimate",
    "Estimate email ctr from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["email ctr calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-email-conversion-rate-calculator": article(
    "mkt-email-conversion-rate-calculator",
    "Email conversion rate",
    [
      "Email conversion rate teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Email conversion rate calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Email conversion rate Calculator — Marketing Teaching Estimate",
    "Estimate email conversion rate from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["email conversion rate calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-email-roi-calculator": article(
    "mkt-email-roi-calculator",
    "Email ROI",
    [
      "Email ROI teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Email ROI calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Email ROI Calculator — Marketing Teaching Estimate",
    "Estimate email roi from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["email roi calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-list-growth-rate-calculator": article(
    "mkt-list-growth-rate-calculator",
    "List growth rate",
    [
      "List growth rate teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the List growth rate calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "List growth rate Calculator — Marketing Teaching Estimate",
    "Estimate list growth rate from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["list growth rate calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-email-bounce-rate-calculator": article(
    "mkt-email-bounce-rate-calculator",
    "Email bounce rate",
    [
      "Email bounce rate teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Email bounce rate calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Email bounce rate Calculator — Marketing Teaching Estimate",
    "Estimate email bounce rate from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["email bounce rate calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-unsubscribe-rate-calculator": article(
    "mkt-unsubscribe-rate-calculator",
    "Unsubscribe rate",
    [
      "Unsubscribe rate teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Unsubscribe rate calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Unsubscribe rate Calculator — Marketing Teaching Estimate",
    "Estimate unsubscribe rate from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["unsubscribe rate calculator", "marketing metric", "campaign calculator"],
  ),
};
