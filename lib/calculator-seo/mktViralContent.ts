import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-bonus-viral";
const HUB_LABEL = "Business · Marketing · High-intent and viral marketing calculators";
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
        title: "Viral & high-intent tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Revenue lost without SEO", "Teaching metric from inputs"],
          ["Instagram account worth", "Teaching metric from inputs"],
          ["YouTube earnings", "Teaching metric from inputs"],
          ["Startup growth projection", "Teaching metric from inputs"],
          ["Ad budget vs revenue", "Teaching metric from inputs"],
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

export const MKT_VIRAL_ARTICLES: Record<string, RichArticle> = {
  "mkt-revenue-lost-without-seo-calculator": article(
    "mkt-revenue-lost-without-seo-calculator",
    "Revenue lost without SEO",
    [
      "Revenue lost without SEO teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Revenue lost without SEO calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Revenue lost without SEO Calculator — Marketing Teaching Estimate",
    "Estimate revenue lost without seo from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["revenue lost without seo calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-instagram-account-worth-calculator": article(
    "mkt-instagram-account-worth-calculator",
    "Instagram account worth",
    [
      "Instagram account worth teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Instagram account worth calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Instagram account worth Calculator — Marketing Teaching Estimate",
    "Estimate instagram account worth from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["instagram account worth calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-youtube-channel-earnings-calculator": article(
    "mkt-youtube-channel-earnings-calculator",
    "YouTube earnings",
    [
      "YouTube earnings teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the YouTube earnings calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "YouTube earnings Calculator — Marketing Teaching Estimate",
    "Estimate youtube earnings from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["youtube earnings calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-startup-growth-projection-calculator": article(
    "mkt-startup-growth-projection-calculator",
    "Startup growth projection",
    [
      "Startup growth projection teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Startup growth projection calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Startup growth projection Calculator — Marketing Teaching Estimate",
    "Estimate startup growth projection from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["startup growth projection calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-ad-budget-vs-revenue-simulator": article(
    "mkt-ad-budget-vs-revenue-simulator",
    "Ad budget vs revenue",
    [
      "Ad budget vs revenue teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Ad budget vs revenue calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Ad budget vs revenue Calculator — Marketing Teaching Estimate",
    "Estimate ad budget vs revenue from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["ad budget vs revenue calculator", "marketing metric", "campaign calculator"],
  ),
};
