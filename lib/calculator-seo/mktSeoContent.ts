import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/mkt-seo";
const HUB_LABEL = "Business · Marketing · SEO calculators";
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
        title: "SEO tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Keyword ROI", "Teaching metric from inputs"],
          ["Organic CTR", "Teaching metric from inputs"],
          ["SEO traffic value", "Teaching metric from inputs"],
          ["Keyword difficulty", "Teaching metric from inputs"],
          ["Ranking impact", "Teaching metric from inputs"],
          ["Backlink value", "Teaching metric from inputs"],
          ["SEO revenue", "Teaching metric from inputs"],
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

export const MKT_SEO_ARTICLES: Record<string, RichArticle> = {
  "mkt-keyword-roi-calculator": article(
    "mkt-keyword-roi-calculator",
    "Keyword ROI",
    [
      "Keyword ROI teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Keyword ROI calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Keyword ROI Calculator — Marketing Teaching Estimate",
    "Estimate keyword roi from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["keyword roi calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-organic-ctr-calculator": article(
    "mkt-organic-ctr-calculator",
    "Organic CTR",
    [
      "Organic CTR teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Organic CTR calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Organic CTR Calculator — Marketing Teaching Estimate",
    "Estimate organic ctr from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["organic ctr calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-seo-traffic-value-calculator": article(
    "mkt-seo-traffic-value-calculator",
    "SEO traffic value",
    [
      "SEO traffic value teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the SEO traffic value calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "SEO traffic value Calculator — Marketing Teaching Estimate",
    "Estimate seo traffic value from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["seo traffic value calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-keyword-difficulty-estimator": article(
    "mkt-keyword-difficulty-estimator",
    "Keyword difficulty",
    [
      "Keyword difficulty teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Keyword difficulty calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Keyword difficulty Calculator — Marketing Teaching Estimate",
    "Estimate keyword difficulty from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["keyword difficulty calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-ranking-improvement-impact-calculator": article(
    "mkt-ranking-improvement-impact-calculator",
    "Ranking impact",
    [
      "Ranking impact teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Ranking impact calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Ranking impact Calculator — Marketing Teaching Estimate",
    "Estimate ranking impact from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["ranking impact calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-backlink-value-calculator": article(
    "mkt-backlink-value-calculator",
    "Backlink value",
    [
      "Backlink value teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the Backlink value calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "Backlink value Calculator — Marketing Teaching Estimate",
    "Estimate backlink value from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["backlink value calculator", "marketing metric", "campaign calculator"],
  ),
  "mkt-seo-revenue-calculator": article(
    "mkt-seo-revenue-calculator",
    "SEO revenue",
    [
      "SEO revenue teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.",
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: "What does the SEO revenue calculator estimate?",
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    "SEO revenue Calculator — Marketing Teaching Estimate",
    "Estimate seo revenue from campaign inputs. Business marketing aid — platforms and costs vary.",
    ["seo revenue calculator", "marketing metric", "campaign calculator"],
  ),
};
