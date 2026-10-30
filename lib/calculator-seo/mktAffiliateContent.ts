import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-affiliate-influencer";
const HUB_LABEL = "Business · Marketing · Affiliate and influencer marketing calculators";
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
        title: "Affiliate & influencer tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Affiliate commission", "Teaching metric from inputs"],
          ["Influencer ROI", "Teaching metric from inputs"],
          ["Cost per post", "Teaching metric from inputs"],
          ["Influencer engagement", "Teaching metric from inputs"],
          ["Affiliate earnings", "Teaching metric from inputs"],
          ["Revenue share", "Teaching metric from inputs"],
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

export const MKT_AFFILIATE_ARTICLES: Record<string, RichArticle> = {
  "mkt-affiliate-commission-calculator": article(
    "mkt-affiliate-commission-calculator",
    "Affiliate commission",
    [
      "Affiliate commission teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Affiliate commission calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Affiliate commission Calculator — Marketing Teaching Estimate",
    "Estimate affiliate commission from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["affiliate commission calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-influencer-roi-calculator": article(
    "mkt-influencer-roi-calculator",
    "Influencer ROI",
    [
      "Influencer ROI teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Influencer ROI calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Influencer ROI Calculator — Marketing Teaching Estimate",
    "Estimate influencer roi from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["influencer roi calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-cost-per-influencer-post-calculator": article(
    "mkt-cost-per-influencer-post-calculator",
    "Cost per post",
    [
      "Cost per post teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Cost per post calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Cost per post Calculator — Marketing Teaching Estimate",
    "Estimate cost per post from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["cost per post calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-influencer-engagement-rate-calculator": article(
    "mkt-influencer-engagement-rate-calculator",
    "Influencer engagement",
    [
      "Influencer engagement teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Influencer engagement calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Influencer engagement Calculator — Marketing Teaching Estimate",
    "Estimate influencer engagement from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["influencer engagement calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-affiliate-earnings-calculator": article(
    "mkt-affiliate-earnings-calculator",
    "Affiliate earnings",
    [
      "Affiliate earnings teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Affiliate earnings calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Affiliate earnings Calculator — Marketing Teaching Estimate",
    "Estimate affiliate earnings from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["affiliate earnings calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-revenue-share-calculator": article(
    "mkt-revenue-share-calculator",
    "Revenue share",
    [
      "Revenue share teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Revenue share calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Revenue share Calculator — Marketing Teaching Estimate",
    "Estimate revenue share from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["revenue share calculator", "marketing metric", "campaign calculator"],
  ),
};
