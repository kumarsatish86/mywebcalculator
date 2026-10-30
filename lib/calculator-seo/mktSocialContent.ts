import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-social-media";
const HUB_LABEL = "Business · Marketing · Social media marketing calculators";
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
        title: "Social media tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Engagement rate", "Teaching metric from inputs"],
          ["Instagram engagement", "Teaching metric from inputs"],
          ["YouTube engagement", "Teaching metric from inputs"],
          ["TikTok engagement", "Teaching metric from inputs"],
          ["Follower growth", "Teaching metric from inputs"],
          ["Social ROI", "Teaching metric from inputs"],
          ["Cost per engagement", "Teaching metric from inputs"],
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

export const MKT_SOCIAL_ARTICLES: Record<string, RichArticle> = {
  "mkt-engagement-rate-calculator": article(
    "mkt-engagement-rate-calculator",
    "Engagement rate",
    [
      "Engagement rate teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Engagement rate calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Engagement rate Calculator — Marketing Teaching Estimate",
    "Estimate engagement rate from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["engagement rate calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-instagram-engagement-rate-calculator": article(
    "mkt-instagram-engagement-rate-calculator",
    "Instagram engagement",
    [
      "Instagram engagement teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Instagram engagement calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Instagram engagement Calculator — Marketing Teaching Estimate",
    "Estimate instagram engagement from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["instagram engagement calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-youtube-engagement-calculator": article(
    "mkt-youtube-engagement-calculator",
    "YouTube engagement",
    [
      "YouTube engagement teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the YouTube engagement calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "YouTube engagement Calculator — Marketing Teaching Estimate",
    "Estimate youtube engagement from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["youtube engagement calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-tiktok-engagement-calculator": article(
    "mkt-tiktok-engagement-calculator",
    "TikTok engagement",
    [
      "TikTok engagement teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the TikTok engagement calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "TikTok engagement Calculator — Marketing Teaching Estimate",
    "Estimate tiktok engagement from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["tiktok engagement calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-follower-growth-rate-calculator": article(
    "mkt-follower-growth-rate-calculator",
    "Follower growth",
    [
      "Follower growth teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Follower growth calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Follower growth Calculator — Marketing Teaching Estimate",
    "Estimate follower growth from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["follower growth calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-social-media-roi-calculator": article(
    "mkt-social-media-roi-calculator",
    "Social ROI",
    [
      "Social ROI teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Social ROI calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Social ROI Calculator — Marketing Teaching Estimate",
    "Estimate social roi from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["social roi calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-cost-per-engagement-calculator": article(
    "mkt-cost-per-engagement-calculator",
    "Cost per engagement",
    [
      "Cost per engagement teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Cost per engagement calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Cost per engagement Calculator — Marketing Teaching Estimate",
    "Estimate cost per engagement from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cost per engagement calculator", "marketing metric", "campaign calculator"],
  ),
};
